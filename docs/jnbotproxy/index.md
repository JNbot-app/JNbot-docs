---
sidebar_position: 0
title: Get started
description: Play your bots' accounts and switch between bots and clients with JNbot Proxy
---

# JNbot Proxy

JNbot Proxy sits between Minecraft and a server. Bots and Minecraft clients connect to the proxy, and the proxy keeps one connection to the real server per account.

This lets you:

- Take over a bot's account in your own Minecraft client without the server noticing a reconnect.
- Hand control back to the bot when you are done.
- Jump from one account to another while staying connected.
- Stay connected when the server kicks you or goes down for a moment. The proxy logs back in for you.
- Read, change, drop or add packets from a plugin.

The proxy reads the Minecraft version from each client that connects. Every client in a session must use the same version as that session. JNbot does not translate between versions.

## How it works

A **session** is one connection to the server, logged in as one account. Every bot or client attached to a session is a **participant**.

Each participant has a role:

| Role | What it means |
| --- | --- |
| Playing (`driver`) | Its packets go to the server. A session has one driver at a time. |
| Spectating (`spectator`) | It sees everything the server sends, but its own movement and actions are not sent. A bot that you took over waits here. |
| Joining (`syncing`) | It just connected and is loading the world from the session. |

Because every participant keeps receiving the server's packets, a spectating bot always knows the current world. That is what makes it possible to switch control back and forth without reconnecting.

## Use the proxy from the app

1. Open the **JNbot Proxy** page and press **Start Proxy**.
2. Start your bots as usual. While the proxy runs, bots connect through it automatically.
3. Each bot shows up under **Connected Players** as its own session.

Every session has these buttons:

| Button | What it does |
| --- | --- |
| **Play** | Opens Minecraft as that account and takes over from the bot. |
| **Take over** | The next client that connects to the proxy within 60 seconds takes over this session. Use it when you start Minecraft yourself. |
| **Give control** | Shown next to a spectating participant. Gives control back to it, for example back to the bot. |
| **Kick** | Disconnects that participant. |
| Bug icon | Starts or stops a [debug recording](./recorder.md) of the session's packets. |

Taking over needs a bot (or a JNbot client) in the session that has loaded the world. **Play** and **Take over** are greyed out until there is one, and the tooltip says why.

:::tip
Connect to `127.0.0.1` with the port shown on the proxy page. A client that logs in with the same name as a running session joins that session and takes control.
:::

## In game

### Commands

Type these in chat while connected through the proxy:

| Command | What it does |
| --- | --- |
| `/jnbot` | Lists every command. |
| `/jnbot status` | Shows the server, version, who is playing and your own role. |
| `/jnbot sessions` | Lists all sessions on the proxy. |
| `/jnbot join <account>` | Moves you into the session of another account. |
| `/jnbot debug` | Starts or stops a debug recording. |

The server never sees these commands.

### Switching accounts in the JNbot client

With the JNbot client, open the pause menu and press **Sessions**. Click an account to move into its session. You stay connected and only see a short loading screen.

Moving between sessions needs Minecraft 1.20.2 or newer, the same version as the session you move to, and a bot in that session. If you were the last participant in your old session, that session closes.

### Spectating

When a bot or another client plays your session, you spectate. The proxy keeps a line on screen that says who is playing. Vanilla clients show it in the action bar. The JNbot client shows it as a small bar at the top of the screen.

### When the connection drops

If the server kicks you or the connection breaks, the proxy keeps everyone connected on a loading screen and logs back in. It tries 5 times, 5 seconds apart. When it gets back in, play continues. If every attempt fails, everyone is disconnected with the server's real kick message.

This needs Minecraft 1.20.2 or newer. Older clients are disconnected right away.

## Use the proxy from a plugin

Start your own proxy with `ProxyServer`:

```js
const { ProxyServer } = require("JNbot")

const proxy = new ProxyServer({
  proxyPort: 25566,
  host: "play.example.net",
  port: 25565,
})

proxy.on("session", (action, session) => {
  console.log(`${session.account} ${action}`)
})
```

Read on:

- [Proxy server](./proxy-server.md): configuration, events and deciding who joins which session.
- [Sessions and switching](./sessions.md): switching, moving, spectating, reconnecting and sharing control.
- [Packet interception](./packetmanager.md): read and change packets.
- [Plugins](./pluginmanager.md): add your own `/jnbot` commands.
- [Debug recordings](./recorder.md): capture packets to inspect them.
- [Examples](./examples.md): complete scripts.
