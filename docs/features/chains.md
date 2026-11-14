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

## Setup code

For advanced use, a chain can run a bit of JavaScript for every alt before its steps. Open the chain's **⋯** menu and select **Edit setup code** (on mobile, tap **Setup code**). The code editor opens with commented-out examples that use your chain's steps; remove the `//` in front of a line to use it. It can, for example, make sure Kit Collector keeps its kits, or run Auto Salvage whenever Kit Collector's inventory is full and then let Kit Collector carry on. It does not change the plugins themselves. See the [chain API](../plugins/code-based/script.md#chains).

The setup code can also have options of its own: select the gear button in the code editor to add them, the same way as a plugin's options. You then set them in the chain's settings, so you can change how the chain works without editing its code.

When you install a shared chain with setup code, the code is shown before you install it.
