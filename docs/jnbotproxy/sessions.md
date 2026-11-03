---
sidebar_position: 2
title: Sessions and switching
description: Switch control between bots and clients, move between accounts, reconnect and share control
---

# Sessions and switching

A session is one connection to the real server. It is logged in as `session.account` and has any number of participants: bots and Minecraft clients.

Every participant receives what the server sends. Only the **driver** sends packets to the server. The others spectate, so their world stays up to date and any of them can take over at any time.

```js
const session = proxy.getSession(id)

session.account      // "Alex"
session.version      // "1.21.11"
session.driver       // the participant that plays, or undefined
session.participants // Map of participant id to participant
```

## Participants

```js
const steve = proxy.getParticipant("Steve")

steve.username
steve.kind      // "bot", "client" (JNbot client) or "vanilla"
steve.role      // "driver", "spectator" or "syncing"
steve.session   // the session it is in
steve.tell("Hi Steve")
steve.end("Bye")
```

## Switching control

`switchTo` gives a participant control. The old driver becomes a spectator and a bot stops moving on its own.

```js
const result = await session.switchTo("Steve")
if (!result.ok) console.log(`Could not switch: ${result.message}`)
```

A participant that just joined has no world yet. `switchTo` first loads the world into it from a bot in the session that has already loaded it, then hands over control. Without such a bot the switch fails after `limits.transferTimeoutMs`. Check this beforehand:

```js
const { supported, reasons } = session.switchingCapability
if (!supported) console.log(reasons.join(". "))
```

Only one switch runs per session at a time. A second one fails with the code `switch_busy`.

### Spectate without taking control

`sync` loads the world into a joining participant and leaves it spectating.

```js
await session.sync("Steve")
```

### When the driver leaves

`session.handback` decides who plays next:

| Value | Who plays next |
| --- | --- |
| `"previous"` (default) | The last driver that is still connected. Take over a bot, disconnect, and the bot plays again. |
| `"none"` | Nobody. The proxy keeps the connection alive until someone takes over. |
| A function | Return the participant that should play, or `undefined` for nobody. |

```js
session.handback = (session, leaving) =>
  [...session.participants.values()].find((p) => p.kind === "bot")
```

## Moving to another session

`proxy.move` moves a connected client into another session without disconnecting it. The client sees a short loading screen and then plays the other account.

```js
const alex = [...proxy.sessions.values()].find((s) => s.account === "Alex")
await proxy.move("Steve", alex)                    // and take control
await proxy.move("Steve", alex, { drive: false })  // only watch
```

This is what `/jnbot join <account>` and the **Sessions** screen of the JNbot client use.

A move needs:

- Minecraft 1.20.2 or newer on the moving client.
- The same version as the target session.
- A bot in the target session that has loaded the world.

When the moving client was the last participant of its old session, that session ends and its server connection closes.

## Reconnecting

When the server connection drops, the session keeps every participant connected on a loading screen and logs back in. Kick messages are held back while it tries. Once it is back in, the server's new world reaches every participant and play continues.

```js
session.reconnect = { attempts: 10, delayMs: 3000 }  // per session
session.reconnect = false                            // disconnect everyone instead

session.on("reconnect", (state) => {
  if (state) console.log(`Attempt ${state.attempt}/${state.attempts}: ${state.reason}`)
  else console.log("Back online")
})
```

`session.reconnecting` holds the same state while it is busy. After the last failed attempt everyone is disconnected with the server's kick message.

Reconnecting only starts after the session has been in game once, and only for Minecraft 1.20.2 or newer. Set the default for all sessions with the `reconnect` option of [`ProxyServer`](./proxy-server.md#configuration).

## Sharing control

Normally only the driver's packets reach the server. `grant` lets another participant send some packets too. A common use is a spectating bot that keeps doing one job while you play.

```js
const { PacketGroups } = require("JNbot")

const bot = proxy.getParticipant("Alex")
const revoke = session.grant(bot, PacketGroups.chat)

// later
revoke()
```

With `{ exclusive: true }` the driver's packets of those names are dropped while the grant holds, so only the bot sends them:

```js
session.grant(bot, PacketGroups.inventory, { exclusive: true })
```

`PacketGroups` has lists of client packet names for each purpose:

| Group | Packets |
| --- | --- |
| `movement` | `position`, `position_look`, `look`, `flying`, `vehicle_move`, `steer_vehicle`, `entity_action` |
| `inventory` | `window_click`, `close_window`, `held_item_slot`, `set_creative_slot`, `craft_recipe_request` |
| `interaction` | `block_dig`, `block_place`, `use_item`, `use_entity`, `arm_animation`, `update_sign` |
| `chat` | `chat`, `chat_message`, `chat_command`, `chat_command_signed`, `tab_complete` |

You can also pass your own packet names. Grants end when the participant leaves the session.

:::caution
The server sees one player. If the driver and a bot both move or both click in the inventory, the server gets conflicting packets and may correct or kick the player. Grant only what the driver does not do at the same time, or use `exclusive`.
:::

## Status line

`participant.status` is a line kept on the participant's screen. Vanilla clients show it in the action bar. The JNbot client shows it at the top of the screen.

The session sets it to "Spectating · Steve is playing" for spectators and to a reconnect message while reconnecting. You can set your own:

```js
steve.status = "Farming wheat"
steve.status = undefined  // hide it
```

The session overwrites it on the next switch or reconnect.

## Sending packets yourself

`session.write` sends a packet that did not come from anyone. Packet handlers do not run for it.

```js
// To the server, as if the driver sent it: swing the main hand.
session.write("c2s", "arm_animation", { hand: 0 })

// Run a command on the server (1.19 and newer).
session.write("c2s", "chat_command", { command: "spawn" })

// To one participant, or to everyone when you leave out the id: select hotbar slot 1.
session.write("s2c", "held_item_slot", { slot: 0 }, steve.id)
```

Packet names and fields depend on the Minecraft version. The examples above are for 1.21. `session.writeRaw(direction, bytes, participantId)` sends raw packet bytes instead. Read [Packet interception](./packetmanager.md) for the details.

## Session events

```js
session.on("participant", (action, participant, reason) => {})  // "attached" or "detached"
session.on("driver", ({ driver, previous }) => {})
session.on("reconnect", (state) => {})
session.on("close", (session, reason) => {})
```
