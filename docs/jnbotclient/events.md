---
sidebar_position: 3
---

# Events

Use `mc.on(eventName, handler)` to subscribe. It resolves with an unsubscribe
function.

```js
const off = await mc.on('chat', ({ message }) => {
  console.log(message);
});

// Later
await off();
```

Subscribe only to events your plugin needs. Event monitoring is inactive when
there are no subscribers.

## Event names

| Event | Description |
| --- | --- |
| `move` | Position and rotation changed |
| `chat` | A chat, game, or action bar message arrived |
| `windowOpen` | A handled container opened |
| `windowClose` | A handled container closed |
| `updateSlot` | Visible container slots or the cursor item changed |
| `forceMove` | The player moved an unusually large distance at once |
| `healthChanged` | Health, maximum health, or food changed |
| `death` | The player died |
| `respawn` | The player respawned |
| `kicked` | The player disconnected |
| `pathArrived` | Navigation reached its target |
| `pathFailed` | Navigation stopped before reaching its target |
| `entitySpawned` | Entities entered the nearby tracked area |
| `entityDied` | Nearby entities died |
| `entityDespawned` | Entities disappeared without a detected death |
| `playerStateChanged` | Fire, item-use, swimming, gliding, or air state changed |
| `heldItemChanged` | The main hand, off hand, or selected hotbar item changed |
| `effectsChanged` | Active status effects changed |
| `dimensionChanged` | The player changed dimension |
| `blockChanged` | Blocks changed inside a watched region |
| `uiAction` | The user interacted with a plugin control screen |
| `taskCompleted` | An entity automation task completed |
| `taskFailed` | An entity automation task failed |

## Payloads

### `move`

Movement events are throttled and sent only after a position or rotation
change.

```ts
{
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  dimension?: string;
  ts: number;
}
```

### `chat`

```ts
{
  message: string;
  kind: 'chat' | 'game' | 'actionbar';
  ts: number;
}
```

### `windowOpen`

```ts
{
  syncId: number;
  screenClass?: string;
  title?: string;
  ts: number;
}
```

### `windowClose`

```ts
{
  syncId: number;
  ts: number;
}
```

### `updateSlot`

Only changed slots are included.

```ts
{
  syncId: number;
  changedSlots: {
    slot: number;
    stack: ItemStack;
  }[];
  cursorStack: ItemStack | null;
  ts: number;
}
```

### `forceMove`

```ts
{
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  dist: number;
  ts: number;
}
```

### `healthChanged`

Health events are sent only after a change and are limited to one event every
250 ms.

```ts
{
  health: number;
  maxHealth: number;
  food: number;
  ts: number;
}
```

### `death` and `respawn`

```ts
{
  ts: number;
}
```

### `kicked`

```ts
{
  reason: string;
  ts: number;
}
```

### `pathArrived`

```ts
{
  durationMs: number;
  nodes: number;
  taskId?: string;
  ts: number;
}
```

### `pathFailed`

Common reasons include `no_path`, `out_of_range`, `goal_unreachable`, `stuck`,
`cancelled`, `input_override`, and `disconnected`.

```ts
{
  reason: string;
  taskId?: string;
  ts: number;
}
```

### `entitySpawned`

Nearby entity checks run at most once per second.

```ts
{
  entities: {
    id: number;
    type: string;
    name: string;
    x: number;
    y: number;
    z: number;
    isAlive: boolean;
    hostile: boolean;
    distance?: number;
  }[];
  ts: number;
}
```

### `entityDied`

```ts
{
  ids: number[];
  ts: number;
}
```

### `entityDespawned`

This includes entities that left the nearby tracked area, unloaded, or
otherwise disappeared without a detected death.

```ts
{
  ids: number[];
  ts: number;
}
```

### `playerStateChanged`

```ts
{
  onFire: boolean;
  usingItem: boolean;
  swimming: boolean;
  gliding: boolean;
  air: number;
  ts: number;
}
```

### `heldItemChanged`

```ts
{
  mainHand: ItemStack;
  offHand: ItemStack;
  selectedHotbarSlot?: number;
  ts: number;
}
```

### `effectsChanged`

```ts
{
  effects: {
    id: string;
    amplifier: number;
    duration: number;
  }[];
  ts: number;
}
```

### `dimensionChanged`

```ts
{
  from: string;
  to: string;
  ts: number;
}
```

### `blockChanged`

Each event contains at most 128 changed blocks.

```ts
{
  watchId: string;
  changes: BlockInfo[];
  ts: number;
}
```

### `uiAction`

The action is `change` for toggles, `click` for buttons, and `close` when the
screen closes.

```ts
{
  uiId: string;
  elementId: string;
  action: 'click' | 'change' | 'close';
  value: boolean;
  ts: number;
}
```

### `taskCompleted`

```ts
{
  taskId: string;
  type: string;
  mined?: number;
  skipped?: number;
  ts: number;
}
```

### `taskFailed`

```ts
{
  taskId: string;
  type: string;
  reason?: string;
  mined?: number;
  skipped?: number;
  ts: number;
}
```
