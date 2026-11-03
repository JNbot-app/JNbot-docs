---
sidebar_position: 2
---

# API Reference

This page documents the client handle returned by
`script.getMcClient(clientId)`.

Argument types are shown directly in each method signature. A property ending in `?` is optional.

## Connected clients

### `script.getMcClients()`

Returns the connected Minecraft clients.

### `script.getMcClient(clientId: string)`

Returns the client handle for one connected client id.

### `mc.chat(message: string)`

Sends a chat message or command.

### `mc.setMovement(state: { forward?: boolean; back?: boolean; left?: boolean; right?: boolean; jump?: boolean; sneak?: boolean; sprint?: boolean })`

Sets any provided movement keys. Omitted keys keep their current state.

```js
await mc.setMovement({ forward: true, sprint: true });
await mc.setMovement({ forward: false, sprint: false });
```

Supported fields are `forward`, `back`, `left`, `right`, `jump`, `sneak`, and
`sprint`.

Starting manual movement cancels active navigation and entity automation.

### `mc.setKey({ key: 'forward' | 'back' | 'left' | 'right' | 'jump' | 'sneak' | 'sprint' | 'attack' | 'use', pressed: boolean })`

Sets one key. It also supports `attack` and `use` in addition to the movement
keys.

### `mc.look({ yaw: number, pitch: number, mode?: 'absolute' | 'delta' })`

Looks using absolute angles or angle changes. `mode` is `absolute` by default
and can also be `delta`.

### `mc.lookAt({ x: number, y: number, z: number })`

Looks at a world position.

### `mc.smoothLook({ yaw: number, pitch: number, mode?: 'absolute' | 'delta', durationMs?: number, easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut', taskId?: string })`

Rotates smoothly to an absolute angle or by a relative angle. The easing can
be `linear`, `easeIn`, `easeOut`, or `easeInOut`.

### `mc.smoothLookAt({ x: number, y: number, z: number, durationMs?: number, easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut', taskId?: string })`

Rotates smoothly toward a world position.

### `mc.stopSmoothLook(taskId?: string)` and `mc.smoothLookStatus()`

Stops or inspects the current smooth rotation.

### `mc.click(button?: 'left' | 'right')`

Clicks the current target. The button is `left` by default and can also be
`right`.

## Player information

### `mc.getCurrentPosition()`

Returns `x`, `y`, `z`, `yaw`, `pitch`, and the current dimension. Coordinates
and angles are numbers. The dimension is a string.

### `mc.getHealth()`

Returns numeric health, maximum health, food, saturation, air, and armor
values when they are available.

### `mc.getExperience()`

Returns the numeric experience level, total experience, and progress.

### `mc.getHeldItems()`

Returns the selected hotbar slot and the main-hand and off-hand item stacks.

### `mc.getStatusEffects()`

Returns the active effects. Each effect includes a string id, numeric
amplifier and duration, and visibility flags.

### `mc.getPlayerState()`

Returns boolean player state such as on-ground, flying, sprinting, sneaking,
swimming, using an item, sleeping, burning, and riding.

### `mc.swingArm({ hand?: 'main' | 'off' })`

Swings the main or off hand.

### `mc.dropItem({ entireStack?: boolean })`

Drops one selected item or the entire selected stack.

### `mc.dig({ x: number, y: number, z: number, face?: 'up' | 'down' | 'north' | 'south' | 'east' | 'west' })`

Starts breaking a block.

### `mc.stopDig()`

Stops the current block-breaking action.

### `mc.placeBlock({ x: number, y: number, z: number, face?: 'up' | 'down' | 'north' | 'south' | 'east' | 'west', hand?: 'main' | 'off' })`

Uses the held item against a block face.

### `mc.activateBlock({ x: number, y: number, z: number, face?: 'up' | 'down' | 'north' | 'south' | 'east' | 'west', hand?: 'main' | 'off' })`

Interacts with a block at a known position.

### `mc.useOnLooked({ maxDistance?: number })`

Interacts with the block currently in front of the player.

### `mc.useItem({ hand?: 'main' | 'off' })`

Starts using the item in the main or off hand.

### `mc.releaseUseItem()`

Stops using the current item.

### `mc.swapHands()`

Swaps the main and off-hand items.

### `mc.equip({ itemId?: string, slot?: number, destination: 'hand' | 'off-hand' | 'head' | 'chest' | 'legs' | 'feet' | 'hotbar' })`

Equips an item found by id or inventory slot.

Destinations are `hand`, `off-hand`, `head`, `chest`, `legs`, `feet`, and
`hotbar`.

```js
await mc.equip({
  itemId: 'minecraft:diamond_helmet',
  destination: 'head',
});
```

### `mc.sleep()` and `mc.wake()`

Sleeps using the bed in front of the player or leaves the current bed.

### `mc.respawn()`

Requests a respawn after death.

## Inventory and containers

### `mc.getInventory()`

Returns all non-empty player inventory slots. Explicit inventory queries include
item damage, stack limits, glint state, and a bounded component description.

### `mc.findInventoryItems({ matching: string, limit?: number })`

Finds inventory items by item id, short id, or display name.

```js
const result = await mc.findInventoryItems({
  matching: 'diamond',
  limit: 20,
});

console.log(result.totalCount, result.items);
```

### `mc.countInventoryItem(matching: string)`

Returns the total item count across matching inventory stacks.

### `mc.getCurrentWindow()`

Returns the open container, its slots, cursor item, selected hotbar slot, type,
and available properties. Returns `null` when no handled container is open.

Properties can include values such as cooking, fuel, brewing, selection, or
cost information when the current container provides them.

### `mc.clickSlot({ slot: number, button?: number, actionType?: string, syncId?: number })`

Performs a slot action in the current container.

### `mc.moveInventorySlot({ from: number, to: number })`

Moves a stack between two visible slot indexes. If the destination is occupied,
the stacks are swapped and any remaining cursor item is returned to the source.

### `mc.swapInventorySlots({ from: number, to: number })`

Swaps two visible slot indexes.

### `mc.quickMoveInventorySlot(slot: number)`

Quick-moves one slot between the player inventory and open container.

### `mc.transferInventory({ from: 'player' | 'container', matching?: string, limit?: number })`

Quick-moves matching stacks between the player and the open container.

```js
await mc.transferInventory({
  from: 'player',
  matching: 'minecraft:cobblestone',
  limit: 16,
});
```

Use `matching: '*'` or omit `matching` to transfer any item.

### `mc.setHotbarSlot(slot: number)`

Selects hotbar slot 0 to 8.

### `mc.closeWindow()`

Closes the current container.

## Entities

### `mc.getEntityById({ id: number })`

Returns detailed information about one entity, including position, health,
equipment, state flags, and distance when available.

### `mc.findEntities(filter?: { type?: string; name?: string; radius?: number; limit?: number; hostile?: boolean })`

Finds nearby entities and sorts them by distance.

### `mc.nearestEntity(filter?: { type?: string; name?: string; radius?: number; hostile?: boolean })`

Returns the nearest entity that matches the optional filter, or `null`.

### `mc.lookAtEntity(id: number)`

Looks at an entity by its numeric entity id.

### `mc.attackEntity({ id: number })`

Attacks an entity once.

### `mc.useEntity({ id: number, hand?: 'main' | 'off' })`

Interacts with an entity using the selected hand.

## Entity automation tasks

Entity automation returns a task id. Starting another entity task replaces the
current one.

### `mc.followEntity({ id: number, distance?: number, sprint?: boolean, taskId?: string })`

Follows an entity and updates the route as the entity moves.

### `mc.attackEntityUntilDead({ id: number, distance?: number, sprint?: boolean, taskId?: string })`

Approaches and attacks an entity until it dies or the task fails.

### `mc.stopTask(taskId?: string)`

Stops the current entity task. Supplying a task id prevents accidentally
stopping a different task.

### `mc.taskStatus()`

Returns whether an entity task is active and, when available, its string task
id, task type, and numeric entity id.

## World and blocks

### `mc.getBlockAt({ x: number, y: number, z: number })`

Returns the block at a position.

### `mc.blockAtCursor(options?: { maxDistance?: number })`

Returns the block currently targeted by the crosshair.

### `mc.raycast(options?: { maxDistance?: number })`

Finds the first block along the player's view direction.

### `mc.findBlock({ matching: string | string[], maxDistance?: number, useExtraInfo?: boolean })`

Returns the nearest matching block or `null`.

### `mc.findBlocks({ matching: string | string[], maxDistance?: number, count?: number, useExtraInfo?: boolean })`

Returns multiple matching blocks sorted by distance.

`matching` accepts an item id, short id, or array of ids.

### `mc.scanBox({ from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }, matching?: string | string[], count?: number })`

Scans a rectangular region and returns a bounded result.

### `mc.getColumn({ x: number, z: number })`

Returns heightmap information and the top block for a column.

### `mc.getBiome({ x: number, y: number, z: number })`

Returns biome information.

### `mc.getLight({ x: number, y: number, z: number })`

Returns block, sky, and total light levels.

### `mc.getWorldInfo()`

Returns the dimension, time, weather, difficulty, and ambient darkness.

### `mc.getSignText({ x: number, y: number, z: number })`

Returns the front and back sign lines or `null`.

### `mc.getNearbyEntities(options?: { radius?: number; limit?: number; includePlayers?: boolean; type?: string })`

Returns nearby entity information. For new plugins, `findEntities()` usually
provides more useful filtering.

### `mc.getOnlinePlayers()`

Returns visible online player information.

## Block watches

Block watches are useful when a plugin needs to react to changes without
repeatedly scanning the same area.

### `mc.watchBlocks({ id?: string, from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }, intervalMs?: number })`

Creates a watch for a rectangular region. The region can contain at most 4,096
blocks. The interval is at least 100 ms. Subscribe to `blockChanged` before
creating the watch.

```js
await mc.on('blockChanged', ({ watchId, changes }) => {
  if (watchId !== 'farm') return;
  console.log('Farm blocks changed:', changes);
});

await mc.watchBlocks({
  id: 'farm',
  from: { x: 100, y: 60, z: 100 },
  to: { x: 115, y: 67, z: 115 },
  intervalMs: 500,
});
```

Each event contains at most 128 changed blocks.

### `mc.unwatchBlocks(id: string)`

Removes one watch.

### `mc.clearBlockWatches()`

Removes every block watch for the client.

## Navigation

Navigation uses the world currently available to the Minecraft client. Routes
avoid common hazards such as lava, fire, cactus, magma blocks, campfires, and
powder snow.

Every navigation method accepts `movement: 'auto' | 'walk' | 'fly'`. The
default is `auto`, which selects flight navigation while the player is actively
flying and walking navigation otherwise.

### `mc.goto({ x: number, y: number, z: number, maxNodes?: number, maxRange?: number, sprint?: boolean, arriveRadius?: number, movement?: 'auto' | 'walk' | 'fly', taskId?: string })`

Starts navigation to a world position.

### `mc.gotoEntity({ id: number, maxNodes?: number, maxRange?: number, sprint?: boolean, arriveRadius?: number, movement?: 'auto' | 'walk' | 'fly', taskId?: string })`

Starts navigation to an entity's current position.

### `mc.gotoBlock({ matching: string | string[], maxDistance?: number, maxNodes?: number, maxRange?: number, sprint?: boolean, arriveRadius?: number, movement?: 'auto' | 'walk' | 'fly', taskId?: string })`

Finds the nearest matching block and navigates to it.

### `mc.flee({ x: number, z: number, distance?: number, sprint?: boolean, movement?: 'auto' | 'walk' | 'fly', taskId?: string })`

Moves away from a horizontal position.

Navigation results include `ok`, `reason`, `searchMs`, `visited`, `pathLength`,
`etaMs`, `start`, `end`, and `taskId` when available.

### `mc.stopPath(taskId?: string)`

Stops navigation. Supplying the task id protects newer navigation from an old
cancel request.

### `mc.pathStatus()`

Returns `active: boolean`, numeric `index` and `pathLength`, an optional string
`taskId`, and `movement: 'walk' | 'fly'`.

Flight navigation advances along route segments instead of trying to reacquire
every passed block. It also brakes using the player's current velocity at turns
and destinations, then clears remaining flight momentum when the route stops.

## Mining automation

Mining tasks can select the fastest usable hotbar tool and approach a target by
walking or flying. They run locally until complete, stopped, or failed.

### `mc.mineBlock({ x: number, y: number, z: number, reach?: number, maxRange?: number, autoTool?: boolean, sprint?: boolean, movement?: 'auto' | 'walk' | 'fly', blockTimeoutMs?: number, taskId?: string })`

Mines one block at a known coordinate.

### `mc.mineNearest({ matching: string | string[], maxBlocks?: number, maxDistance?: number, reach?: number, maxRange?: number, autoTool?: boolean, sprint?: boolean, movement?: 'auto' | 'walk' | 'fly', blockTimeoutMs?: number, taskId?: string })`

Finds nearby matching blocks, sorts them by distance, and mines up to
`maxBlocks`. `matching` accepts one block id string or an array of block id
strings.

### `mc.veinMine({ x: number, y: number, z: number, matching?: string | string[], diagonal?: boolean, maxBlocks?: number, maxDistance?: number, reach?: number, maxRange?: number, autoTool?: boolean, sprint?: boolean, movement?: 'auto' | 'walk' | 'fly', blockTimeoutMs?: number, taskId?: string })`

Mines connected matching blocks starting at the coordinate. If `matching` is
omitted, the starting block determines the type. Set `diagonal: true` to include
edge-connected and corner-connected blocks.

### `mc.stopMining(taskId?: string)`

Stops the current mining task. Supplying the task id prevents an older cancel
request from stopping a newer task.

### `mc.miningStatus()`

Returns `active: boolean` and, when available, a string `taskId`, a type of
`'block' | 'nearest' | 'vein'`, a string phase, numeric mined, skipped, and
queued counts, and the current `{ x: number, y: number, z: number }` block.

## Automation helpers

### `mc.runSequence(steps: { method: string; params?: object }[])`

Runs up to 64 API calls in order and returns their results. This reduces
round trips when later steps do not depend on earlier results.

### `mc.waitFor(probe: async function, predicate: function, options?: { timeoutMs?: number; intervalMs?: number })`

Repeatedly runs an asynchronous query until its result matches a predicate.

```js
await mc.waitFor(
  () => mc.countInventoryItem('minecraft:diamond'),
  (count) => count >= 64,
  { timeoutMs: 120_000, intervalMs: 500 },
);
```

Options are `timeoutMs` and `intervalMs`. The default timeout is 10 seconds and
the default interval is 250 ms.

## Plugin control screens

### `mc.openUi({ id: string, title: string, elements: ({ type: 'label', id?: string, label: string } | { type: 'toggle', id: string, label: string, value?: boolean } | { type: 'button', id: string, label: string })[] })`

Opens a native Minecraft control screen defined by the plugin. Supported
elements are labels, toggles, and buttons.

```js
await mc.on('uiAction', async ({ uiId, elementId, action, value }) => {
  if (uiId !== 'farm-controls') return;

  if (elementId === 'autoHarvest' && action === 'change') {
    console.log('Auto harvest:', value);
  }

  if (elementId === 'stop' && action === 'click') {
    await mc.stopTask();
    await mc.stopPath();
  }
});

await mc.openUi({
  id: 'farm-controls',
  title: 'Farm controls',
  elements: [
    { type: 'label', label: 'Automation' },
    { type: 'toggle', id: 'autoHarvest', label: 'Auto harvest', value: false },
    { type: 'button', id: 'stop', label: 'Stop all movement' },
  ],
});
```

Subscribe to `uiAction` before opening the screen. Toggle values are managed by
the plugin, so persist them in plugin state when they must survive reopening.

### `mc.closeUi(id?: string)`

Closes the current plugin control screen. Supplying an id only closes the screen
when its id matches.

## Notifications and markers

### `mc.toast({ title: string, body?: string, kind?: 'info' | 'ok' | 'warn' | 'error', durationMs?: number })`

Shows a notification. `kind` can be `info`, `ok`, `warn`, or `error`.

### `mc.clearToasts()`

Clears all current notifications.

### `mc.marker({ id?: string, x: number, y: number, z: number, label?: string, color?: string, ttlMs?: number })`

Adds a world marker and returns its id.

### `mc.removeMarker({ id: string })`

Removes one marker.

### `mc.clearMarkers()`

Removes all markers.

### `mc.beep({ sound?: string, volume?: number, pitch?: number })`

Plays a local Minecraft sound.

### `mc.flashWindow()`

Requests the user's attention for the Minecraft window. Use it sparingly.

## Minecraft window

### `mc.getWindowInfo()`

Returns the window dimensions, scaled dimensions, framebuffer size, fullscreen
state, scale factor, and frames per second when available.

### `mc.setWindowTitle({ title: string })`

Changes the Minecraft window title.

### `mc.setFullscreen(options?: { fullscreen?: boolean })`

Sets or toggles fullscreen mode.

## Version and capabilities

### `mc.apiList()`

Returns the supported public method names and their count.

### `mc.apiVersion()`

Returns the API protocol version, client version, and Minecraft version.

### `mc.apiCapabilities()`

Returns supported methods, supported events, feature flags, and public limits.
Use it when a plugin can run against multiple client versions.

### `mc.request(method: string, params?: object)`

Calls a supported API method by name. Prefer the named methods above when one
is available because their arguments are easier to discover and validate.

### `mc.on(event: string, handler: function)`

Subscribes to a client event and resolves with an unsubscribe function. See
the [events reference](events.md) for event names and payload fields.
