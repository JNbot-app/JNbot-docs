---
sidebar_position: 5
title: Debug recordings
description: Capture the packets of a proxy session to inspect them
---

# Debug recordings

A debug recording saves every packet of a session in both directions, so you can see exactly what the server and the clients sent. Open recordings on the **JNbot Proxy** page under **Recordings**.

Debug recordings are for inspecting traffic. They cannot be replayed.

## Start and stop

From the app, press the bug icon on a session. In game, type `/jnbot debug`. Run it again to stop.

From a plugin, use the session's `debug` plugin:

```js
const { RECORDINGS_PATH } = require("JNbot")

const debug = session.pluginManager.getPlugin("debug")

debug.startDebug({ fileName: `${RECORDINGS_PATH}/login-issue` })
// ...
debug.stopDebug()
```

| Option | What it does |
| --- | --- |
| `fileName` | Path of the recording without extension. Keep it in `RECORDINGS_PATH` to see it in the app. Default: `debug-<date>_<time>` in `RECORDINGS_PATH`. |
| `full` | Keep large packets complete. By default packets above 8 KB, such as chunks, are saved as their size only. |

`debug.active` tells whether a recording runs and `debug.fileId` is its id.

## Limits and files

A recording stops on its own when it reaches `limits.debugDiskBytes` (256 MB by default) and tells the driver in chat.

Each recording is a `.json` file with its details and a `.log` file with one packet per line. Packets the proxy could not decode are saved as raw bytes.
