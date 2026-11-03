---
sidebar_position: 1
---

# JNbot Client

JNbot Client lets a JNbot JavaScript plugin observe and control a connected
Minecraft client. It provides typed methods for common actions and typed events
for reacting to changes.

## Features

- Read position, velocity, health, experience, status effects, held items, and
  player state.
- Control movement, looking, item use, attacking, block interaction, equipment,
  sleeping, and respawning.
- Rotate smoothly toward angles, positions, and entities.
- Search blocks and entities using names, ids, distance, and other filters.
- Navigate by walking or flying to coordinates, entities, or blocks.
- Mine individual blocks and connected veins with local automation tasks.
- Follow an entity or attack it until it dies with cancellable automation tasks.
- Search, count, move, swap, and transfer inventory items.
- Read open container slots and properties.
- Watch a block region and react only when blocks change.
- Display toasts, world markers, sounds, and plugin-defined control screens.
- Subscribe to chat, inventory, player, world, entity, task, and navigation events.

## Get a client

```js
const clients = await script.getMcClients();

if (clients.length === 0) {
  script.notification({
    type: 'warning',
    title: 'No Minecraft client',
    message: 'Connect a Minecraft client before running this plugin.',
  });
  return;
}

const mc = script.getMcClient(clients[0].clientId);
```

Each connected client has its own handle. A plugin can control multiple clients
by calling `script.getMcClient()` for each client id.

## A small automation example

```js
const [{ clientId }] = await script.getMcClients();
const mc = script.getMcClient(clientId);

const ore = await mc.findBlock({
  matching: ['minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore'],
  maxDistance: 48,
});

if (!ore) {
  await mc.toast({ title: 'No diamond ore found', kind: 'warn' });
  return;
}

const task = await mc.veinMine({
  ...ore.position,
  matching: ['minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore'],
  maxBlocks: 32,
  movement: 'auto',
});

if (!task.ok) {
  await mc.toast({ title: 'Could not mine the ore', body: task.reason, kind: 'error' });
  return;
}

await mc.waitFor(
  () => mc.miningStatus(),
  (status) => !status.active,
  { timeoutMs: 60_000, intervalMs: 250 },
);
```

## Efficient scripts

Prefer events and targeted queries over frequent large scans.

- Subscribe only to events the plugin needs.
- Use `watchBlocks()` instead of repeatedly scanning the same region.
- Use `findInventoryItems()` or `countInventoryItem()` instead of repeatedly
  requesting the entire inventory.
- Use mining tasks instead of sending repeated dig, look, and movement calls.
- Use an interval of at least 250 ms for normal `waitFor()` checks.

Next: see the [API reference](api.md), [events](events.md), and
[examples](examples.md).
