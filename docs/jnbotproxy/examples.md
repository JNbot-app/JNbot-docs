---
sidebar_position: 10
title: Examples
description: Complete JNbot Proxy scripts
---

# Examples

Each example is a complete JavaScript plugin. They start their own proxy on port `25566`, next to the built-in proxy of the app. Connect Minecraft to `127.0.0.1:25566`.

## Play a bot's account

Start a bot through your proxy, then log in with Minecraft as the same name to take over. When you disconnect, the bot plays again.

```js
const { Bot, ProxyServer } = require("JNbot")

const proxy = new ProxyServer({ proxyPort: 25566 })

// A client with the name of a running session joins it and takes control.
proxy.onAdmission(({ username }) => {
  const session = [...proxy.sessions.values()].find((s) => s.account === username)
  if (session) return { type: "join", sessionId: session.id }
})

proxy.on("participant", (action, participant, session) => {
  if (action === "attached" && participant.role === "syncing") session.switchTo(participant)
})

await proxy.ready
await Bot.join({ username: "Alex", minecraftProxy: { port: 25566 } })
```

`minecraftProxy` makes the bot connect to your proxy instead of the server. The proxy then logs in to the server as `Alex`.

## Watch a bot without taking over

Clients that log in as `watch_<account>` join that account's session as spectators. The bot keeps playing.

```js
const { ProxyServer } = require("JNbot")

const proxy = new ProxyServer({ proxyPort: 25566 })

proxy.onAdmission(({ username }) => {
  if (!username.startsWith("watch_")) return
  const account = username.slice("watch_".length)
  const session = [...proxy.sessions.values()].find((s) => s.account === account)
  if (!session) return { type: "reject", reason: `Nobody plays ${account}` }
  return { type: "join", sessionId: session.id }
})

proxy.on("participant", async (action, participant, session) => {
  if (action !== "attached" || !participant.username.startsWith("watch_")) return
  const result = await session.sync(participant)
  if (!result.ok) participant.end(result.message)
})
```

The spectator sees the bot's world and gets "Spectating · Alex is playing" in its action bar.

## Give control back after being idle

When the player has not moved for 5 minutes, the bot takes over again.

```js
const { ProxyServer } = require("JNbot")

const proxy = new ProxyServer({ proxyPort: 25566 })
const IDLE_MS = 5 * 60 * 1000
const lastMove = new Map()

proxy.onPacket(["position", "position_look", "look"], (packet) => {
  lastMove.set(packet.sourceParticipantId, Date.now())
})

setInterval(() => {
  for (const session of proxy.sessions.values()) {
    const driver = session.driver
    if (!driver || driver.kind === "bot") continue
    if (!lastMove.has(driver.id)) lastMove.set(driver.id, Date.now())
    if (Date.now() - lastMove.get(driver.id) < IDLE_MS) continue

    const bot = [...session.participants.values()].find((p) => p.kind === "bot")
    if (!bot) continue
    driver.tell("§eYou were idle, the bot plays again.")
    session.switchTo(bot)
  }
}, 10_000)
```

## Let the bot chat while you play

The bot keeps answering chat while you play the account. Your own chat still works.

```js
const { Bot, PacketGroups, ProxyServer } = require("JNbot")

const proxy = new ProxyServer({ proxyPort: 25566 })

const alex = await Bot.join({ username: "Alex", minecraftProxy: { port: 25566 } })
alex.on("chat", (username, message) => {
  if (message === "!ping") alex.chat("pong")
})

// While someone else plays, the bot may still send chat.
const revokes = new Map()
proxy.on("driver", ({ session, driver }) => {
  revokes.get(session.id)?.()
  revokes.delete(session.id)
  const bot = [...session.participants.values()].find((p) => p.kind === "bot")
  if (bot && driver && driver !== bot) revokes.set(session.id, session.grant(bot, PacketGroups.chat))
})
```

## Add a command to jump between accounts

`/jnbot next` moves the player to the next session on the proxy. It needs Minecraft 1.20.2 or newer.

```js
const { ProxyPlugin, ProxyServer } = require("JNbot")

class NextAccount extends ProxyPlugin {
  constructor(session) {
    super(session, {
      name: "next-account",
      description: "Jump to the next account",
      commands: [{ name: "next", description: "Play the next account", handler: (args, sender) => this.next(sender) }],
    })
  }

  async next(sender) {
    const sessions = [...this.connection.server.sessions.values()]
    const target = sessions[(sessions.indexOf(this.connection) + 1) % sessions.length]
    if (target === this.connection) return sender.tell("§cThere is no other account")

    sender.tell(`§7Switching to §f${target.account}`)
    const result = await this.connection.server.move(sender, target)
    if (!result.ok) sender.tell(`§c${result.message}`)
  }
}

const proxy = new ProxyServer({ proxyPort: 25566 })
proxy.on("session", (action, session) => {
  if (action === "created") session.pluginManager.enablePlugin(NextAccount)
})
```

## Block a command

Stop `/pay` from reaching the server, for every player on the proxy.

```js
const { ProxyServer } = require("JNbot")

const proxy = new ProxyServer({ proxyPort: 25566 })

proxy.onPacket(["chat_command", "chat_command_signed"], (packet) => {
  if (!packet.data.command.startsWith("pay ")) return
  packet.drop()
  proxy.tell(packet.sourceParticipantId, "§c/pay is blocked on this proxy")
})
```

On 1.18 and older, commands arrive as `chat` packets with a `message` that starts with `/`.

## Log reconnects

```js
const { ProxyServer } = require("JNbot")

const proxy = new ProxyServer({
  proxyPort: 25566,
  reconnect: { attempts: 10, delayMs: 10_000 },
})

proxy.on("reconnect", (session, state) => {
  if (state) console.log(`${session.account}: attempt ${state.attempt}/${state.attempts} (${state.reason})`)
  else console.log(`${session.account} is back online`)
})
```
