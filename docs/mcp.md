---
sidebar_position: 5
title: AI access (MCP)
---

# AI access with MCP

JNbot's MCP server lets compatible AI clients work with your bots. Depending on
the access you grant, a client can view bot and world information, control bots,
run approved code, and manage plugins.

## Enable AI access

1. Open **Advanced → MCP**.
2. Choose a connection mode:
   - **This device** for AI clients running on the same computer.
   - **Remote** for AI clients connecting from another device or service.
3. Turn on **AI access**.

JNbot must remain open and AI access must stay enabled while a client is using
the connection.

## Connect an AI client

1. Select **Connect client**.
2. Give the client a clear name and choose which server profiles it may use.
3. Select **Create access key**.
4. Copy the access key immediately. It is shown only once.
5. Add the displayed endpoint and access key to your AI client's MCP settings.
   For a client on the same computer, you can use the provided local
   configuration instead.

The exact field names differ between AI clients. Look for an option to add a
custom MCP server.

## Choose what a client may do

Open **Clients**, then select **Access** next to a connected client. You can
limit it to selected server profiles and set permissions for:

- Viewing bot status, chat, inventory, nearby entities, and run history
- Controlling bots, including movement, chat, interactions, and inventory
- Running code on an active bot
- Installing, configuring, starting, and stopping plugins

Bot control, code, and plugin access can be **Blocked**, **Ask first**, or
**Allowed**. Viewing data can be **Blocked** or **Allowed**.

## Create and update plugins

A connected assistant can create JavaScript or TypeScript plugins and actions,
add editable settings, and update an existing plugin. Give it plugin access
under **Clients → Access**.

For example:

> Create an action that sends a configurable chat message on the connected
> bot. Add a Message setting and save the action in JNbot.

When approval is required, open **Approvals** to review the proposed code and
settings changes. After saving, the plugin appears under **Plugins**, where
you can edit its settings or run it. To update one, tell the assistant which
existing plugin to change.

Enter passwords and API keys yourself in plugin settings. The assistant cannot
read or change sensitive setting values.

For assistants using MCP tools, read `get_plugin` with `mode: "authoring"`
before writing a plugin. Use `get_jnbot_reference` for API details, save with
`save_plugin`, and check `get_operation` until the save finishes. Starting a
plugin is a separate `run_plugin` request.

See [Plugin development](./plugins/overview.md) for scripts and actions, or
[Local AI](./plugins/code-based/local-ai.md) to use AI inside a plugin.

## Review requests and activity

Requests that need confirmation appear under **Approvals**. Review the client,
requested action, target, and details before approving or denying it. Each
request with **Ask first** access needs approval before it runs.

Use **Activity** to see current operations and recent requests. You can also
test a client's connection, replace its access key, or remove the client from
the **Clients** tab.

:::warning
Treat access keys like passwords. If a key may have been shared, replace it or
remove the client. Turn off AI access to disconnect all clients immediately.
:::
