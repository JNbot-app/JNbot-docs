---
sidebar_position: 5
title: Built-in action option IDs
description: Use JNbot's built-in option IDs to select alts and control action runs
---

# Built-in action option IDs

Plugin options normally provide values for your code. When a user starts an action with JNbot's standard **Run action** flow, JNbot also checks a few exact option IDs to select alts, apply filters, and set up the bot connection.

Add the option to the plugin's `config` schema with the matching `id`. IDs are case-sensitive. The action still receives the resolved values in its `settings` argument.

```js
config: [
  {
    name: "Alt selection",
    options: [
      { id: "gamemode", label: "Gamemode", type: "gamemodeSelect" },
      { id: "altRange", label: "Alt range", type: "altRange" },
      {
        id: "ignoreAlts",
        label: "Skip alts",
        type: "altsSelect",
        defaultValue: [],
      },
      {
        id: "withTags",
        label: "Only these tags",
        type: "tagsSelect",
        defaultValue: [],
      },
      {
        id: "withRanks",
        label: "Only alts with a rank",
        type: "switch",
        defaultValue: false,
      },
    ],
  },
]
```

## Alt selection and filters

These IDs are passed to the standard alt filter. Add only the options your action needs.

| Option ID | Suggested option type | Behavior |
| --- | --- | --- |
| `alts` | `altsSelect` | Runs only the selected alt names. When populated, this explicit selection takes precedence over the other standard filters. |
| `altRange` | `altRange` | Runs alts from the selected start alt through the selected end alt, including both. |
| `ignoreAlts` | `altsSelect` | Skips the selected alt names. |
| `withTags` | `tagsSelect` | Includes alts in the selected tags. The order of the tags also sets the processing order. If an alt appears in more than one selected tag, it runs once. |
| `withoutTags` | `tagsSelect` | Skips alts in the selected tags. |
| `gamemode` | `gamemodeSelect` | Supplies the gamemode used by `withRanks` and `withGkits`. By itself, it does not filter alts or choose the bot's join gamemode. |
| `withRanks` | `switch` or `multiSelect` | With `true`, includes only alts that have a rank in `gamemode`. A string array includes only alts whose rank matches one of those values. |
| `withGkits` | `switch` or `multiSelect` | With `true`, includes only alts that have a gkit in `gamemode`. A string array includes only alts that have one of those gkits. |

`withRanks` and `withGkits` need a `gamemode` value to filter. With `switch`, they check whether an alt has any rank or gkit for that mode. With `multiSelect`, they check for one of the selected rank or gkit names.

The standard filter starts with all alts, or with the alts in `withTags` if tags were selected. It then applies `altRange`, rank and gkit filters, `withoutTags`, and `ignoreAlts`. An explicit `alts` selection returns immediately, so the other filters are skipped.

Leave `alts` unset when the user has not selected specific accounts. An empty array is still an explicit selection and matches no alts.

## Other IDs used by the standard runner

`defaultActionRunner` also reads these fields before it calls the action:

| Option ID | Suggested option type | Behavior |
| --- | --- | --- |
| `account` | `altSelect` | Selects one account to run with. The built-in recording option uses `activeBotSelect` for its target bot or client. The runner treats the selected value as an explicit alt selection. |
| `alt` | `altSelect` | Starts the run with the named alt only. Select a saved alt so JNbot can find its account details. |
| `chunkLoadLimit` | `switch` or `input` with `inputType: "number"` | Sets the chunk view distance used while connecting. `true` means `1`. A positive number sets that value directly. `false` or a non-positive value leaves the default in place. |

## When these IDs apply

These behaviors apply when JNbot uses its standard action runner, such as when a user selects **Run action** in the app. The runner selects and connects each alt, then calls the action with that bot and the resolved `settings`.

If your code calls an action with a bot that is already connected, JNbot does not run this selection and connection loop for that call. In that case, select or filter alts in the code that starts the action.
