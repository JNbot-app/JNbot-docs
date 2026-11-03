---
sidebar_position: 4
title: Cooldowns
description: Track plugin cooldowns and choose what happens when one is ready
---

# Cooldowns

Cooldowns track how long you need to wait before an in-game activity is ready again. Plugins create them automatically, for example after claiming a reward with a waiting period.

## View and manage cooldowns

1. Open **Dashboard** and scroll to the **Kits** section.
2. Find the **Cooldowns** card. It shows each countdown, its ready time, and whether it is ready to claim.
3. Open the menu at the end of a cooldown row to edit it, reset its countdown, or delete it.

![The Cooldowns card showing ready timers, a running countdown, and Auto-run enabled on one cooldown](/img/guides/cooldowns.png)

When editing, you can change the name, wait time, and ready date. Use **Reset countdown** to start the wait again from now.

## Run a plugin when a cooldown is ready

Select the lightning button on a cooldown to turn **Auto-run** on or off. When it is on, JNbot starts the plugin that created that cooldown when the countdown finishes. JNbot then starts the countdown again, so it can run again after the next wait.

Use this only when you want that plugin to run without manually starting it each time. Select the lightning button again to turn it off.
