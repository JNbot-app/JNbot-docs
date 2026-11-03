---
sidebar_position: 4
---

# Actions

Script actions are a type of script that runs in the same process as the script. The difference between a script and a script action is that you can pass arguments through script actions and return a value. This means you can only run a script action when a script is running. Tip: you can see if a script action is running by expanding the running script in active scripts (on the dashboard).

### Usages
- Reduce code duplication in plugins
- Allows you to create your own type of component
- Bot manager
- Triggers


### Example
```js
// Run a js action (script)
const bot = await join({username:"Zola"},{login:true})
const returnedValue = await script.runAction("myAction", bot, "Hi everyone")
console.log("Value: " + returnedValue) // returns "Value: Hello"
```

The following code is the script action that is called in the example above. A script action must contain a main function with optionally a variable amount of arguments. The script action closes when the main function has finished executing, so you don't have to call script.stop().
```js
// Run a js action (action)
async function main(bot, settings, args) {
  const [message] = args
  await bot.chat(message)
  return "Hello"
}
```


## APIs

### Trigger
Action gets called when the trigger gets triggered. The first argument is always the bot instance and the second is the action's resolved plugin settings. Optional positional trigger data is supplied as the third `args` array.


### Bot manager
Action gets called when pressing 'run action' in the bot manager. First argument is always the bot instance; the second contains the action's resolved plugin settings. Use plugin options for user-configurable input.

Some option IDs also tell JNbot's standard action runner how to select alts and prepare the connection. See [Built-in action option IDs](./action-options.md) for the supported IDs and their behavior.

### Types
You can also create actions using components (see more in component docs). The following types are available:

- js calls js action
- js calls component actions
- component calls js actions
- component calls component actions

```js
script.runAction("myComponentAction",bot,"argument1","2","3","4") // $arg1 = "argument1" $arg2 = "2" $arg3 = "3" $arg4 = "4"
script.runAction("myComponentAction",bot,{gamemode:"sbd", username:"Zola"},"ZOLAAAA") // $gamemode = "sbd" $username = "Zola" $arg3 = "ZOLAAAA"
```

component calling js or component coming soon...
