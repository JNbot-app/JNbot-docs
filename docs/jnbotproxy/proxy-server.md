---
sidebar_position: 1
title: Proxy server
description: Create a JNbot proxy, react to its events and decide who joins which session
---

# Proxy server

`ProxyServer` listens for Minecraft clients and bots and creates the [sessions](./sessions.md) they play in.

```js
const { ProxyServer } = require("JNbot")

const proxy = new ProxyServer({
  proxyPort: 25566,
  host: "play.example.net",
  port: 25565,
})

await proxy.ready
console.log(`Listening on port ${proxy.config.proxyPort}`)
```

## Configuration

| Option | Default | What it does |
| --- | --- | --- |
| `proxyPort` | `25565` (`25577` when the server itself runs on `localhost:25565`) | Port that clients and bots connect to. |
| `host`, `port` | The active server profile | The real server. |
| `onlineMode` | `false` | Require Microsoft login for clients that connect to the proxy. |
| `reconnect` | `{ attempts: 5, delayMs: 5000 }` | Log back in when the server connection drops. Use `false` to disconnect everyone instead. See [Reconnecting](./sessions.md#reconnecting). |
| `limits.transferTimeoutMs` | `30000` | How long a switch or move may take. |
| `limits.admissionWaitMs` | `15000` | How long admission handlers may take for one client. |
| `limits.maxPendingAdmissions` | `100` | Clients that may wait for admission at the same time. |
| `limits.debugDiskBytes` | 256 MB | Size limit of one debug recording. |
| `fallbackVersion` | `"1.20.4"` | Version shown in the server list when a client's version is unknown. Real connections always use the client's own version. |

The proxy logs in to the real server as the account of the session. For accounts saved in JNbot it reuses their Microsoft login. Other names log in offline.

## Who joins which session

When a client connects, the proxy asks your admission handlers what to do with it. The first handler that returns a decision wins. Without a decision the client gets a new session for its own account.

```js
proxy.onAdmission(({ username }) => {
  if (username === "Steve") return { type: "reject", reason: "Not today" }

  // Join the session that already plays this account.
  const session = [...proxy.sessions.values()].find((s) => s.account === username)
  if (session) return { type: "join", sessionId: session.id }
})
```

| Decision | What happens |
| --- | --- |
| `{ type: "new-session" }` | Starts a new session. Optional `account`, `host` and `port` choose where it logs in. |
| `{ type: "join", sessionId }` | Adds the client to a running session as a joining participant. It plays nothing until you call `switchTo` or `sync`. |
| `{ type: "reject", reason }` | Disconnects the client with `reason`. |

Handlers may be `async`. The request has `username`, `protocol` and a `signal` that aborts when the client leaves.

## Switching and moving

The two high level calls:

```js
// Give "Steve" control of the session he is in.
await proxy.switch("Steve")

// Move "Steve" into the session of another account and give him control.
const target = [...proxy.sessions.values()].find((s) => s.account === "Alex")
const result = await proxy.move("Steve", target)
if (!result.ok) console.log(result.message)
```

Both accept a participant or a username or participant id. Both return `{ ok: true }` or `{ ok: false, code, message }`. They never throw. `move` also takes `{ drive: false }` to join the other session as a spectator. Read [Sessions and switching](./sessions.md) for what happens during a switch.

## Finding sessions and participants

```js
proxy.sessions                  // Map of session id to session
proxy.getSession(id)
proxy.getParticipants()         // everyone, in every session
proxy.getParticipant("Steve")   // by username or participant id

proxy.tell("Steve", "Hello")    // chat message to one participant
proxy.broadcast("Restarting soon")
proxy.kick("Steve", "Maintenance")
proxy.stop()                    // ends every session and closes the port
```

`proxy.getInfo()` returns a plain object with every session and participant. The JNbot app uses it for the proxy page.

## Events

```js
proxy.on("session", (action, session, reason) => {
  // action is "created" or "ended"
})

proxy.on("participant", (action, participant, session, reason) => {
  // action is "attached" or "detached"
})

proxy.on("driver", ({ session, driver, previous }) => {
  // driver is undefined when the driver left and nobody took over
})

proxy.on("reconnect", (session, state) => {
  // state is { attempt, attempts, reason } while reconnecting, undefined once back
})

proxy.on("packetError", (error) => {
  // a packet that could not be decoded or re-encoded, it was still forwarded
})

proxy.on("change", () => {
  // something getInfo() reports changed, fired at most once per tick
})
```

To run a packet handler in every session, current and future, use `proxy.onPacket`. See [Packet interception](./packetmanager.md).
