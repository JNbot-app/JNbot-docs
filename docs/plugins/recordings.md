---
sidebar_position: 2
title: Record and replay a task
---

# Record and replay a task

A recording saves actions from a connected Minecraft client so you can play them back later. You do not need to write code. Recordings work best for a short, repeatable task such as opening a menu and making the same selections.

## Create a recording

1. Open **Plugins** from the left menu.
2. Select **Create**.
3. Give the recording a name. Add a description if you want a reminder of what it does.
4. Open **Language** and choose **Recording**. This tells JNbot to make a recording instead of a code plugin.

   ![The New Plugin dialog filled with the example name Replay a starter route and Recording selected](/img/guides/recording-create.png)

5. Select **Create**. The recording editor opens.
6. Select **Record**, choose the connected Minecraft client, then select **Start recording**.
7. Do the task in Minecraft. Press **F9** to pause or continue. Press **F8** when you are done.

JNbot saves the actions in the recording. Recording again replaces the actions from the previous run, so make a copy first if you want to keep the old version.

:::tip
Keep the task short while you are learning. Start recording just before the first action you want to save, and stop as soon as the task is complete.
:::

## Check the recording

Open the recording from **Plugins**. The editor shows each recorded action in order. Select an action to open its details. From there, you can disable it, change its replay time, or adjust its settings. Use the trash button to remove an action. JNbot saves edits automatically.

![The recording editor with a window click action selected and its timing and settings shown in the details panel](/img/guides/recording-action-details.png)

## Replay a recording

1. Connect the Minecraft client or bot that should perform the task.
2. Open the recording from **Plugins** and select **Replay**.
3. Choose the connected client or bot.
4. Choose where the task should happen:
   - **Relative to replay start** uses the target's current position. Pick this when you want to repeat the task in different places.
   - **Recorded world coordinates** uses the original location. Pick this when the task depends on that exact spot.
5. Select **Start replay**.

Use the controls at the bottom of the app to pause, continue, or stop the replay. JNbot shows a report when it finishes, including actions it could not complete.

## If a replay does not work

If JNbot says no bot or Minecraft client is connected, connect one before you replay the recording. Check that it is on the right server and can reach the menu, block, or item used by the recording. If the task starts in the wrong place, record it again or switch to **Relative to replay start**.
