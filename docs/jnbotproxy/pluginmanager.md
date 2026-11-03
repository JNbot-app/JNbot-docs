---
sidebar_position: 4
title: Plugins
description: Add your own /jnbot commands and packet handlers to every session
---

# Plugins

A proxy plugin bundles packet handlers and `/jnbot` chat commands. Each session has its own `pluginManager` and its own copy of every plugin.

## Write a plugin

Extend `ProxyPlugin`. Register handlers in `start()` and remove them in `stop()`.

```js
const { ProxyPlugin } = require("JNbot")

class Coords extends ProxyPlugin {
  constructor(session) {
    super(session, {
      name: "coords",
      description: "Remembers where the driver is",
      commands: [
        {
          name: "where",
          description: "Show the last known position",
          handler: (args, sender) => this.where(sender),
        },
      ],
    })
    this.position = null
  }

  start() {
    this.pipeline.on("position", this.onMove)
  }

  stop() {
    this.pipeline.off("position", this.onMove)
  }

  onMove = (packet) => {
    if (packet.sourceParticipantId === this.connection.driver?.id) this.position = packet.data
  }

  where(sender) {
    if (!this.position) return sender.tell("§7No position yet")
    const { x, y, z } = this.position
    sender.tell(`§e${Math.floor(x)} ${Math.floor(y)} ${Math.floor(z)}`)
  }
}
```

Inside a plugin:

| Member | What it is |
| --- | --- |
| `this.connection` | The session. |
| `this.pipeline` | The session's packet pipeline. See [Packet interception](./packetmanager.md). |
| `this.tell(message)` | Chat message to the driver. |
| `this.meta` | The name, description and commands you passed. |

## Enable it

Enable a plugin per session. To have it in every session, enable it when a session starts:

```js
proxy.on("session", (action, session) => {
  if (action === "created") session.pluginManager.enablePlugin(Coords)
})
```

Players now get `/jnbot where`. It also shows up in the `/jnbot` command list.

## Commands

A command has a `name`, a `description`, an optional `args` list (only used for the help text) and a `handler(args, sender)`. `args` are the words typed after the command. `sender` is the participant that typed it, so reply with `sender.tell(...)`.

Use `§` colour codes in messages. A command that throws shows the error to the sender.

Set `hidden: true` on a command to leave it out of the help list.

## Manage plugins

```js
const manager = session.pluginManager

manager.getPlugin("coords")      // the running plugin, or undefined
manager.disablePlugin("coords")  // calls stop() and removes its commands
manager.plugins                  // Map of name to plugin
```

`enablePlugin` starts the plugin right away and returns it. It throws when a plugin with that name already runs in the session.

Every session starts with two built-in plugins: `core` (`status`, `sessions` and `join`) and `debug` (see [Debug recordings](./recorder.md)). When a session ends, it stops all of its plugins.
