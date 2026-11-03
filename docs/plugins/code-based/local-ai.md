---
sidebar_position: 5
title: Local AI
description: Use local AI tools, structured extraction, embeddings, and custom models in plugins
---

# Local AI

Use `script.ai` in code plugins and actions to choose tools from text, extract
structured data, or create embeddings. Inference runs on your device without an
AI service API key. The model downloads on first use and then works offline.

## Choose and run tools

An agent starts with no tools. Give each tool a name, a clear description, and
an object JSON Schema for its arguments. Add a handler if you want the agent to
execute it.

```js
const { script } = require("jnbot");

async function main() {
  const agent = script.ai.createAgent({
    tools: [{
      name: "set_quantity",
      description: "Set the requested item quantity",
      parameters: {
        type: "object",
        properties: { quantity: { type: "integer", minimum: 1 } },
        required: ["quantity"],
        additionalProperties: false,
      },
      handler: ({ quantity }) => {
        console.log(`Requested quantity: ${quantity}`);
        return { quantity };
      },
    }],
  });

  try {
    const prediction = await agent.predict("Set quantity to 7");
    console.log(prediction.status, prediction.calls);

    const result = await agent.run("Set quantity to 7");
    console.log(result.status, result.results);
    if (result.error) console.error(result.error.message);
  } finally {
    agent.dispose();
  }
}

main();
```

`predict()` returns proposed calls without running handlers. Use it when your
plugin needs to review a request before acting. `run()` executes accepted calls
in order from a single prediction. Handler results are not sent back to the
model. Each request is independent and has no conversation history or completion
loop.

Tool arguments are validated against the schema before execution. Handlers can
return a JSON value or nothing, which becomes `null`. A handler cannot call
`script.ai` again while it is running. Bot and network permissions still apply
to anything the handler does.

### Manage tools

| Method | Effect |
| --- | --- |
| `agent.setTools(tools)` | Replace all tools. |
| `agent.addTool(tool)` | Add a tool or replace one with the same name. |
| `agent.removeTool(name)` | Remove a tool by name. |
| `agent.dispose()` | Cancel pending requests and release the agent. |

Each request uses the tools registered when it starts. Changes apply to the
next request. Registration has no fixed tool count limit, but all supplied tools
must fit within the model context. Keep descriptions specific so the model can
choose the right tool.

### Read results

A prediction includes `calls`, `suppressedCalls`, `modelId`, and
`toolsetRevision`. Its status is `calls` when there are accepted calls,
`no_match` when none match, or `withheld` when calls were suppressed. Never
execute `suppressedCalls`. `confidence` can be `null`. Reasoning is disabled by
default, so `reasoning` is `null` unless you request it with `{ reasoning: true }`.

`run()` returns one of these statuses:

| Status | Meaning |
| --- | --- |
| `completed` | All accepted calls from the prediction ran successfully. |
| `no_match` | No tool matched the request. |
| `withheld` | The model withheld calls. |
| `failed` | Inference, validation, or a handler failed. Check `error`. |
| `cancelled` | The request was cancelled or timed out. |

`steps` is `0` before a prediction completes and `1` afterward. There is no
`maxSteps` option or `step_limit` status. `prediction`, when present, contains
the prediction used by the run.

`results` contains each executed call's name, arguments, and returned `value`
or `error`. Completed actions remain in the results if a later action fails.
They are not rolled back, so check results before retrying a run.

## Extract structured data

`script.ai.extract(text, schema, options?)` returns an object that matches your
schema, or `null` when no record is extracted. Optional fields may be absent.

```js
const { script } = require("jnbot");

async function main() {
  const record = await script.ai.extract("The quantity is 3", {
    type: "object",
    properties: { quantity: { type: "integer", minimum: 1 } },
    required: ["quantity"],
    additionalProperties: false,
  });
  if (record !== null) console.log(record.quantity);
}

main();
```

Download, inference, and invalid-output errors reject the promise. Handle
those separately from a `null` result.

### Supported schemas

Tool parameters and extraction schemas must have `type: "object"` at the root.
Nested fields support `object`, `array`, `string`, `number`, `integer`,
`boolean`, and `null`.

| Applies to | Supported keywords |
| --- | --- |
| All types | `type`, `title`, `description`, `enum` |
| Objects | `properties`, `required`, boolean `additionalProperties` |
| Arrays | `items`, `minItems`, `maxItems`, `uniqueItems` |
| Strings | `minLength`, `maxLength`, `pattern` |
| Numbers and integers | `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf` |

Unsupported keywords, including `$ref`, `oneOf`, and `format`, cause an error.

## Choose a model

Pass `model` to `createAgent()` or to the options of `extract()` and `embed()`.
An agent keeps its selected model for every request.

| Model | Use | Embeddings |
| --- | --- | --- |
| `"main"` | Default. Choose it for accuracy. | Supported. |
| `"flash"` | Lower memory use and faster inference. | Not supported. |

Both variants support tool calls and structured extraction.

```js
const agent = script.ai.createAgent({ model: "flash", tools });
const record = await script.ai.extract(text, schema, { model: "flash" });
```

### Reasoning and tool filtering

Pass `{ reasoning: true }` to `agent.predict()`, `agent.run()`, or
`script.ai.extract()` to generate reasoning before tool calls. Reasoning uses
part of the `maxNewTokens` budget. For predictions, read it from `reasoning`;
for runs, use `result.prediction?.reasoning`. Extraction still returns only
the extracted object or `null`.

Tool filtering is disabled by default. On main, `toolFilterThreshold` keeps
only tools whose name and description meet a cosine similarity threshold
against the input, before generating calls:

```js
const prediction = await agent.predict(text, {
  reasoning: true,
  toolFilterThreshold: 0.75,
});
```

The threshold must be a finite number between `-1` and `1`. Omit it or pass
`null` to disable filtering. Flash bypasses filtering. If no tools pass the
threshold, the prediction returns `no_match` without generating calls.
`run()` also returns `no_match` in that case.

`script.ai.extract()` accepts the same option and applies it to its internal
extraction tool. If the tool is filtered out, extraction returns `null`.

Calibrate the threshold on your own messages. `0.75` is an example, not a
recommended default. Similarity alone cannot reliably distinguish buying
from selling, negation, or exact prices.

## Create embeddings

`script.ai.embed(text, options?)` returns `{ modelId, values }`. Use the numeric
vector to compare text by meaning, such as matching item descriptions.
Embeddings require the main model. Both embedding methods reject with
`AI_UNSUPPORTED_FEATURE` when the selected model is flash.

```js
const { script } = require("jnbot");

async function main() {
  const { modelId, values } = await script.ai.embed("diamond sword");
  console.log(modelId, values.length);
}

main();
```

Use `agent.embed(text, options?)` to embed with an agent's selected main model,
including its custom model URL. It accepts `signal` and `timeoutMs`, works
without registered tools, and cancels pending requests when you dispose of the
agent.

```js
const agent = script.ai.createAgent({ model: "main" });
try {
  const { modelId, values } = await agent.embed("diamond sword");
  console.log(modelId, values.length);
} finally {
  agent.dispose();
}
```

Store `modelId` with saved vectors. Compare vectors from the same model and
rebuild them when the model ID changes.

## Use a custom model

Pass `modelUrl` to select a custom model compatible with the selected variant:

```js
const modelUrl = "https://example.com/models/my-model-v1.cact";
const agent = script.ai.createAgent({ model: "main", modelUrl, tools });
const record = await script.ai.extract(text, schema, { model: "main", modelUrl });
const embedding = await script.ai.embed(text, { model: "main", modelUrl });
```

Replace the example URL with a direct HTTPS download of a complete `.cact`
model compatible with JNbot's Needle 3 engine and the selected `model` variant.
Omit `modelUrl` or leave it blank to use the configured release model for that
variant. An agent keeps its chosen variant and URL for all its requests.

JNbot downloads the model at first inference and caches it on that device for
its URL. Creating an agent or changing tools does not download it. Publish new
versions at new URLs so users get the updated model. Download or loading
failures report an error without switching to the default model.

AI-created plugins need external network permission to select a custom model,
even if it has already been cached.

## Request options and availability

| Option | Available on | Default |
| --- | --- | --- |
| `signal` | `predict`, `run`, `extract`, `embed` | No cancellation signal. |
| `timeoutMs` | All requests | `120000`, including model download time. |
| `maxNewTokens` | `predict`, `run`, `extract` | `512` per completion. |
| `reasoning` | `predict`, `run`, `extract` | `false`. Generate reasoning before tool calls when `true`. |
| `toolFilterThreshold` | `predict`, `run`, `extract` | Disabled. Main only; flash bypasses filtering. |

`timeoutMs` and `maxNewTokens` must be positive safe integers. Use an `AbortController` to cancel
requests. `predict`, `extract`, and `embed` reject on errors. `run` reports
execution errors in its result, but invalid inputs or a disposed agent can
still throw.

The model works best with English text. Local inference requires a supported
app build for your device. Desktop, Android ARM64, and iOS device and simulator
builds are supported when the native runtime is packaged. Other Android
architectures return `AI_UNSUPPORTED_PLATFORM`.

For an external assistant that controls JNbot or writes plugins, see
[AI access with MCP](../../mcp.md).
