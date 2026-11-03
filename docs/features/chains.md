---
sidebar_position: 5
title: Script chains
description: Run a sequence of script actions for selected alts
---

# Script chains

A chain runs several script actions in order for each alt you select. It saves you from starting the same actions one at a time.

## Create and run a chain

1. Open **Dashboard** and scroll to **Script chaining**.
2. Select **New chain**.
3. Enter a chain name and choose a **Game mode**.
4. Open **Alt selection** to set an alt range, include tags, skip specific alts, or require a rank or gkit. Select **Create chain**.
5. Select **Add action**, then choose an action from the menu. Repeat for each step.
6. Arrange the steps from top to bottom with the arrows. Use the trash button to remove a step and set a delay in milliseconds if it needs a pause before running.
7. Select **Run**. Every step must have an action selected.

![Script chaining with a three-step Gkit and kit collection chain](/img/guides/script-chaining.png)

JNbot runs every action in order for one eligible alt, then moves to the next. Select **Stop** to stop the chain while it is running.

To change the name, game mode, or alt filters later, select **Settings** and then **Save settings**.

The action menu contains actions provided by installed plugins and the active server profile. If the action you need is missing, check that its plugin is installed and available for the active profile.
