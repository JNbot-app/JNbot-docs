---
sidebar_position: 5
title: Storage and backups
description: Choose where JNbot keeps your data and how to back it up
---

# Storage and backups

Open **Settings** and choose **Storage** to manage where JNbot keeps your profiles, accounts, and plugins, or to make a backup.

In the web version, the host server manages the active storage location.

These options do different jobs:

- **Device Storage** keeps your active data on this computer.
- **Dropbox Sync** keeps your active data in Dropbox and syncs it across devices connected to the same Dropbox account.
- **JNbot Cloud** saves an encrypted backup that you can restore later.
- **Offline File Backup** exports a backup file to your computer.

## Use Dropbox across devices

Dropbox Sync is useful when you use JNbot on more than one computer or use mobile verison and want the same profiles, accounts, and plugins on each one.

1. In **Settings** → **Storage**, select **Connect** under Dropbox Sync.
2. Sign in to Dropbox in the browser that opens.
3. Copy the authorization code from Dropbox, return to JNbot, and select **Finish sign-in**.
4. Select **Use Dropbox**, then confirm the switch.

JNbot saves changes to Dropbox as you work. The Storage page shows when it is saving and when it last synced. You can select **Save now** to sync immediately.

Device Storage and Dropbox are separate. Switching between them does not merge their data. JNbot restarts to complete the switch, so save your work first. Any running bots and scripts stop during the restart.

## Back up to JNbot Cloud

JNbot Cloud is for keeping a backup you can restore if you need it. It does not sync your active data between devices.

1. In **Settings** → **Storage**, select **Back up to Cloud**.
2. Copy the generated Share Key and save it somewhere safe.
3. Confirm that you saved the key, then select **Save to Cloud**.

JNbot encrypts the backup before it uploads. Keep both the User ID shown in Storage and the Share Key. You need them to restore the backup. If you lose the Share Key, JNbot cannot recover that backup.

To restore, select **Restore from Cloud**, enter the User ID and Share Key, and confirm the warning. Restoring replaces your current settings, accounts, stats, and plugins with the saved backup.

## Save a backup file

Use **Export to file** under **Offline File Backup** to save a backup on your computer. To use one, select **Import from file**. Importing replaces your current settings, accounts, stats, and plugins.

## Which option should I use?

Use **Dropbox Sync** if you want to use the same active data on multiple devices. Use **JNbot Cloud** for an encrypted backup you can restore later. Use **Offline File Backup** if you want to keep a backup file yourself. Device Storage keeps data on the current computer.
