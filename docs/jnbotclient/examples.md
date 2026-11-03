---
sidebar_position: 4
---

# Examples

Each example assumes at least one Minecraft client is connected.

## Get the first connected client

```js
const clients = await script.getMcClients();
if (clients.length === 0) throw new Error('No Minecraft client connected');

const mc = script.getMcClient(clients[0].clientId);
```

## Reply to chat

```js
const [{ clientId }] = await script.getMcClients();
const mc = script.getMcClient(clientId);

await mc.on('chat', async ({ message, kind }) => {
  if (kind !== 'chat') return;
  if (!message.toLowerCase().includes('hello')) return;
  await mc.chat('Hello!');
});
```

## Move for two seconds

```js
const [{ clientId }] = await script.getMcClients();
const mc = script.getMcClient(clientId);

await mc.setMovement({ forward: true, sprint: true });
await new Promise((resolve) => setTimeout(resolve, 2_000));
await mc.setMovement({ forward: false, sprint: false });
```

Use a `try` and `finally` block when a plugin might fail while holding a key.

```js
try {
  await mc.setMovement({ forward: true });
  await doWork();
} finally {
  await mc.setMovement({ forward: false });
}
```

## Rotate smoothly

```js
const rotation = await mc.smoothLook({
  yaw: 180,
  pitch: -15,
  durationMs: 1_200,
  easing: 'easeInOut',
});

await mc.waitFor(
  () => mc.smoothLookStatus(),
  (status) => !status.active,
  { timeoutMs: 5_000, intervalMs: 100 },
);

console.log('Rotation finished:', rotation.taskId);
```

## Find and approach a block

```js
const [{ clientId }] = await script.getMcClients();
const mc = script.getMcClient(clientId);

const result = await mc.gotoBlock({
  matching: ['minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore'],
  maxDistance: 48,
  arriveRadius: 2,
  sprint: true,
});

if (!result.ok) {
  console.warn('Could not reach diamond ore:', result.reason);
  return;
}

await mc.waitFor(
  () => mc.pathStatus(),
  (status) => !status.active,
  { timeoutMs: 60_000, intervalMs: 250 },
);
```

## Navigate while flying

```js
const result = await mc.goto({
  x: 250,
  y: 120,
  z: -80,
  movement: 'fly',
  arriveRadius: 1.5,
});

if (!result.ok) console.warn(result.reason);
```

Use `movement: 'auto'` when the same plugin should work for both walking and
flying players.

## Mine a vein

```js
const ore = await mc.findBlock({
  matching: ['minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore'],
  maxDistance: 32,
});

if (ore) {
  await mc.veinMine({
    ...ore.position,
    matching: ['minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore'],
    maxBlocks: 32,
    autoTool: true,
    movement: 'auto',
  });
}
```

## Follow the nearest player

```js
const [{ clientId }] = await script.getMcClients();
const mc = script.getMcClient(clientId);

const player = await mc.nearestEntity({
  type: 'minecraft:player',
  radius: 64,
});

if (!player) {
  console.log('No player found');
  return;
}

const task = await mc.followEntity({
  id: player.id,
  distance: 3,
  sprint: true,
});

console.log('Following with task:', task.taskId);

// Stop later without affecting a newer task.
await mc.stopTask(task.taskId);
```

## Attack the nearest hostile entity

```js
const target = await mc.nearestEntity({
  hostile: true,
  radius: 32,
});

if (target) {
  const task = await mc.attackEntityUntilDead({
    id: target.id,
    distance: 3,
    sprint: true,
  });

  await mc.waitFor(
    () => mc.taskStatus(),
    (status) => !status.active,
    { timeoutMs: 60_000, intervalMs: 250 },
  );

  console.log('Attack task finished:', task.taskId);
}
```

## Count and equip an item

```js
const diamonds = await mc.countInventoryItem('minecraft:diamond');
console.log(`The player has ${diamonds} diamonds`);

const helmets = await mc.findInventoryItems({
  matching: 'diamond_helmet',
  limit: 1,
});

if (helmets.items.length > 0) {
  await mc.equip({
    slot: helmets.items[0].slot,
    destination: 'head',
  });
}
```

## Deposit matching items into a container

```js
const window = await mc.getCurrentWindow();
if (!window) {
  console.warn('Open a container first');
  return;
}

const result = await mc.transferInventory({
  from: 'player',
  matching: 'minecraft:cobblestone',
  limit: 64,
});

console.log(`Moved ${result.affected} stacks`);
```

## React to block changes

```js
const off = await mc.on('blockChanged', ({ watchId, changes }) => {
  if (watchId !== 'crop-area') return;

  for (const block of changes) {
    console.log(`${block.blockId} changed at`, block.position);
  }
});

await mc.watchBlocks({
  id: 'crop-area',
  from: { x: 100, y: 60, z: 100 },
  to: { x: 115, y: 67, z: 115 },
  intervalMs: 500,
});

// Later
await mc.unwatchBlocks('crop-area');
await off();
```

## Create a plugin control screen

```js
let autoFollow = false;

await mc.on('uiAction', async ({ uiId, elementId, action, value }) => {
  if (uiId !== 'player-tools') return;

  if (elementId === 'autoFollow' && action === 'change') {
    autoFollow = value;

    if (!autoFollow) {
      await mc.stopTask();
      return;
    }

    const target = await mc.nearestEntity({
      type: 'minecraft:player',
      radius: 64,
    });

    if (target) {
      await mc.followEntity({ id: target.id, distance: 3 });
    }
  }

  if (elementId === 'stop' && action === 'click') {
    autoFollow = false;
    await mc.stopTask();
    await mc.stopPath();
  }
});

await mc.openUi({
  id: 'player-tools',
  title: 'Player tools',
  elements: [
    { type: 'label', label: 'Automation settings' },
    {
      type: 'toggle',
      id: 'autoFollow',
      label: 'Follow nearest player',
      value: autoFollow,
    },
    {
      type: 'button',
      id: 'stop',
      label: 'Stop movement',
    },
  ],
});
```

## Notify the player when an item count is reached

```js
await mc.waitFor(
  () => mc.countInventoryItem('minecraft:diamond'),
  (count) => count >= 64,
  { timeoutMs: 10 * 60_000, intervalMs: 1_000 },
);

await mc.toast({
  title: 'Diamond goal reached',
  body: 'The inventory contains at least 64 diamonds.',
  kind: 'ok',
});

await mc.beep();
await mc.flashWindow();
```

## Mark found blocks in the world

```js
const result = await mc.findBlocks({
  matching: 'minecraft:ancient_debris',
  maxDistance: 32,
  count: 10,
});

for (const [index, block] of result.blocks.entries()) {
  await mc.marker({
    id: `debris-${index}`,
    ...block.position,
    label: `Ancient debris ${index + 1}`,
    color: '#f97316',
    ttlMs: 60_000,
  });
}
```

## Control multiple clients

```js
const clients = await script.getMcClients();

await Promise.all(
  clients.map(async ({ clientId, username }) => {
    const client = script.getMcClient(clientId);
    await client.toast({
      title: 'Plugin started',
      body: username ?? clientId,
      kind: 'info',
    });
  }),
);
```
