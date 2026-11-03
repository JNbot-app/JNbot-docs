---
sidebar_position: 3
title: Packet interception
description: Read, change, drop and add packets that pass through the proxy
---

# Packet interception

Every packet that passes through the proxy can be read and changed by a handler. A handler gets a `PacketContext` and may change its data, drop it or add packets after it.

```js
proxy.onPacket("chat_command", (packet) => {
  console.log(`${packet.sourceParticipantId} ran /${packet.data.command}`)
})
```

## Where to register a handler

| Call | Sees |
| --- | --- |
| `proxy.onPacket(names, handler)` | The packets of every session, now and in the future. |
| `session.onPacket(names, handler)` | Every packet of one session: what the server sends, and what each participant sends. Returns a function that removes the handler. |
| `participant.pipeline.on(names, handler)` | Only what this participant sends, and its own copy of what the server sends. A change here affects nobody else. |

A server packet runs through the session handlers first and then through each participant's handlers. So a change in a session handler reaches everyone, and a change in a participant handler reaches only that participant.

`names` is a packet name, a list of names, or `ANY_PACKET` (`"*"`) for all packets.

```js
const { ANY_PACKET } = require("JNbot")

// Hide particles from Steve only.
proxy.getParticipant("Steve").pipeline.on("world_particles", (packet) => packet.drop())
```

:::caution Keep it cheap
The proxy only decodes packets that someone listens to. A handler on `ANY_PACKET` makes the proxy decode every packet, which costs a lot of CPU with many chunks or entities. Listen to the names you need.
:::

## The packet

| Property | What it is |
| --- | --- |
| `name` | Packet name for this Minecraft version, for example `"chat_command"`. |
| `direction` | `"c2s"` from a client to the server, `"s2c"` from the server to a client. |
| `state` | Protocol phase: `"play"` or `"configuration"`. |
| `data` | The decoded fields, or `null` when the packet could not be decoded. |
| `unparsed` | `true` when the packet could not be decoded. |
| `raw` | The packet bytes, including the packet id. |
| `sessionId` | The session it belongs to. |
| `sourceParticipantId` | For `c2s`: the participant that sent it. |
| `targetParticipantId` | For `s2c` in a participant handler: the participant that will receive it. |

Packets from participants that are not driving also run through the handlers, even though the proxy does not send them to the server.

## Change a packet

Assign a new `data` object, or change a field and call `markModified()`:

```js
proxy.onPacket("chat_command", (packet) => {
  if (packet.data.command === "spawn") {
    packet.data.command = "hub"
    packet.markModified()
  }
})
```

Untouched packets are forwarded as their original bytes. Only a changed packet is encoded again.

## Drop or add packets

`drop()` stops the packet. `inject(name, data)` sends an extra packet in the same direction right after it.

```js
proxy.onPacket("chat_command", (packet) => {
  if (packet.data.command.startsWith("pay ")) {
    packet.drop()
    proxy.tell(packet.sourceParticipantId, "Payments are disabled through the proxy.")
  }
})
```

## Handlers must be synchronous

A handler runs while the packet waits. An `async` handler or a returned promise counts as an error. When a handler throws, every change made to that packet is undone and the packet is forwarded as it was. The proxy reports it in the `packetError` event.

Do slow work outside the handler:

```js
proxy.onPacket("chat_command", (packet) => {
  const command = packet.data.command
  setImmediate(() => saveToDatabase(command))
})
```

## Watch without changing

`observe` registers a read only handler. It is cheaper because the proxy does not keep a copy to undo changes. It returns a function that removes it.

```js
const stop = session.pipeline.observe("map_chunk", (packet) => {
  console.log(`Chunk ${packet.data.x}, ${packet.data.z}`)
})
```

Other pipeline methods: `on`, `once` (runs one time), `off(names, handler)` and `hasListeners(name)`.

## Packets that could not be decoded

When the proxy cannot decode a packet, `unparsed` is `true` and `data` is `null`. You can still read `raw`, drop it, replace its bytes with `replaceRaw(bytes)` or add raw bytes after it with `injectRaw(bytes)`.

Raw bytes are the packet body with the packet id, without compression. They only fit the Minecraft version they came from.

## Packet names and versions

Packet names and fields come from [minecraft-data](https://github.com/PrismarineJS/minecraft-data) for the client's version, and they change between versions. Chat is a good example: up to 1.18 clients send `chat`, newer clients send `chat_message` and `chat_command`. Handle every name your players may use.
