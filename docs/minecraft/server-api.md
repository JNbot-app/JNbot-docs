---
sidebar_position: 2
---

# Managed Minecraft server API

Code plugins can inspect and control managed Fabric servers through the
`script` object. This API is separate from the [JNbot Client API](../jnbotclient/overview.md):
the client API controls a player's connected Minecraft client, while this API
controls the managed server itself.

## Find a server

`script.getMcServers()` returns the managed servers available to the plugin.
LAN servers and servers joined through a Minecraft client are excluded. Use a
returned `id` with `script.getMcServer()`:

```js
const servers = await script.getMcServers();
const summary = servers.find((server) => server.state === "online");

if (summary) {
  const server = script.getMcServer(summary.id);
  console.log((await server.getStatus()).players);
}
```

`getMcServer()` returns synchronously. The methods on the server handle return
promises.

## Server handle methods

| Method | Description |
| --- | --- |
| `getStatus()` | Return the current API status, including state, player count, and uptime when available. |
| `executeCommand(command)` | Run a server command and return `{ result, output }`. |
| `broadcast(message)` | Broadcast a message to connected players. |
| `getPlayers()` | Return all online players. |
| `getPlayer(nameOrUuid)` | Return one player, or `null` when not found. |
| `sendMessage(nameOrUuid, message)` | Send a private message to a player. |
| `kickPlayer(nameOrUuid, reason?)` | Kick a player, optionally with a reason. |
| `getWorlds()` | Return the available worlds/dimensions. |
| `getWorldInfo(dimension?)` | Return information about a world. |
| `apiList()` | Return the server API methods and events. |
| `apiVersion()` | Return the server API and Minecraft version. |
| `apiCapabilities()` | Return supported methods and events. |
| `request(method, params?)` | Call a server API method without a convenience wrapper. |
| `on(event, handler)` | Subscribe to a server event and resolve to an unsubscribe function. |

Example:

```js
const [summary] = await script.getMcServers();
if (!summary) {
  throw new Error("No managed server is available");
}

const server = script.getMcServer(summary.id);
const status = await server.getStatus();
console.log(`${status.name}: ${status.players} players`);

const command = await server.executeCommand("list");
console.log(command.output.join("\n"));
await server.broadcast("A plugin is checking the server");
```

## Types

### `McServerHandleSummary`

The list returned by `getMcServers()` contains compact handles:

```ts
interface McServerHandleSummary {
  id: string;
  name: string;
  version: string;
  state:
    | "installing"
    | "stopped"
    | "starting"
    | "online"
    | "stopping"
    | "offline"
    | "error";
  apiState: "unsupported" | "offline" | "connecting" | "online" | "error";
}
```

`state` describes the managed server lifecycle. `apiState` describes whether
the server's JNbot API is available.

### Status and player data

`getStatus()` returns the handle summary plus API details:

```ts
interface McServerApiStatus extends McServerHandleSummary {
  apiVersion?: string;
  players: number;
  uptimeMs?: number;
}

interface McServerPlayer {
  uuid: string;
  name: string;
  displayName?: string;
  gameMode?: string;
  dimension?: string;
  position?: { x: number; y: number; z: number };
  latency?: number;
}
```

`executeCommand()` resolves with a numeric command `result` and an array of
output lines. Player lookup methods accept either a player name or UUID.

## Events

Subscribe with `await server.on(...)`. The returned function removes the
listener:

```js
const server = script.getMcServer(serverId);
const off = await server.on("chat", ({ player, message, ts }) => {
  console.log(`[${ts}] ${player.name}: ${message}`);
});

// Later:
off();
```

Available events:

| Event | Payload |
| --- | --- |
| `stateChanged` | `{ previous, state }` |
| `started` | `{ ts }` |
| `stopping` | `{ ts }` |
| `playerJoin` | `{ player, ts }` |
| `playerLeave` | `{ player, reason?, ts }` |
| `chat` | `{ player, message, ts }` |

## Server API metadata

Use the metadata methods to discover capabilities before calling optional
operations:

```js
const server = script.getMcServer(serverId);
const [version, capabilities] = await Promise.all([
  server.apiVersion(),
  server.apiCapabilities(),
]);

console.log(version.minecraft, capabilities.methods);
```


