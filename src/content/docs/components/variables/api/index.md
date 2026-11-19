---
title: Variables Through the API
slug: 'components/variables/api'
description: 'Reference for configuration variables in the API: the variable configuration, values and their rules, the delimiter, flow overrides, and the evaluation order.'
redirect_from:
    - /integrate/variables/
    - /transformations/variables/api/
---

**Variables** are placeholders used in [configurations](/storage/api/configurations/). Their value is 
resolved at [job runtime](/extend/jobs/). 

<!-- Reference-type page. Source: this page as it was before the 2026-11-19 rework. Text carried over; facts not re-checked against the API. -->

**Important:** Make sure you're familiar with the [Configuration API](/storage/api/configurations/) and 
the [Job API](/extend/jobs/) before reading on.

See [Tutorial](/components/variables/api/tutorial/) for step-by-step example.

This page covers variables **through the API**. To define and use them in the UI instead,
see [Use variables](/components/variables/use/); for what the two kinds of variables are, see [Variables](/components/variables/).

## Introduction
When using variables, the configuration is treated as a [Moustache template](https://mustache.github.io/mustache.5.html). 
You can enter variables anywhere in the JSON of the configuration body. The configuration body is the contents of 
the `configuration` node when you [retrieve a configuration](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-).
This means that you can't use variables in a name or in a configuration description. 

Variables are entered using the [Moustache syntax](https://mustache.github.io/mustache.5.html), 
i.e., `{{ variableName}}`. To work with variables, three things are needed:

- Main configuration -- the configuration in which variables are replaced (used); this can be a configuration of any component (e.g., a configuration of a transformation, extractor, writer, etc.).
- Variable configuration -- a configuration in which variables are defined; this is a configuration of a special `keboola.variables` component.
- Variable values -- actual values that will be placed in the main configuration.

To enable replacement of variables, the *main configuration* has to reference the *variable configuration*. 
If there is no *variable configuration* referenced, no replacement is made (the *main configuration* is completely
static). Variables can be used in any place of any configuration except legacy transformations (the component with 
the ID `transformation`; it can still be used in a specific transformation -- e.g., `keboola.python-transformation-v2` 
or `keboola.snowflake-transformation`, etc.), and a flow configuration of either type
(`keboola.flow` or the legacy `keboola.orchestrator`). A flow does not carry placeholders of its
own — it *supplies* values to the configurations it runs, which is covered in
[Driving variables from a flow](#driving-variables-from-a-flow).

## Variable configuration
A *variable configuration* is a standard configuration tied to a special dedicated `keboola.variables` component. 
The variable configuration defines names of variables to be replaced in the main configuration. You can create 
the configuration using the 
[Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs). 
This is an example of the contents of such a configuration:

```json
{
    "variables": [
        {
            "name": "firstVariable",
            "type": "string"
        },
        {
            "name": "secondVariable",
            "type": "string"
        }
    ]
}
```

Each variable declares a `type` — a free-form label describing the value's data type (for example, `string` or `int`). It is used by the UI; the resolver substitutes the value into the configuration as text regardless of the declared type.

## Main configuration
When you create a variable configuration, you'll obtain an ID of the configuration - e.g., `807940806`. 
In the *main configuration*, you have to reference the *variable configuration* ID using the `variables_id` node. 
Then you can use the variables in the configuration body:

```json

{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-application-testing.{{firstVariable}}",
                    "destination": "{{firstVariable}}.csv"
                }
            ]
        },
        "output": {
            "tables": [
                {
                    "source": "new-table.csv",
                    "destination": "out.c-transformation-test.cars"
                }
            ]
        }
    },
    "parameters": {
        "script": [
            "print('{{firstVariable}}')"
        ]
    },
    "variables_id": "807940806"
}

```

## Variable values
You can either store the variable values as [configuration rows](/storage/api/configurations/#configuration-rows) of the 
*variable configuration* and provide the row ID of the stored values at run time, or you can provide the variable values directly at run 
time. There are three options how you can provide values to the variables:

- Reference values using `variables_values_id` property in the *main configuration* (default values).
- Reference values using `variableValuesId` property in job parameters.
- Provide values using  `variableValuesData` property in job parameters.

The structure of variable values, regardless of whether it is stored in configuration or provided at runtime, is as follows:

```json
{
    "values": [
        {
            "name": "firstVariable",
            "value": "batman"
        }
    ]
}
```

### Rules for providing values
Following the rules for running a job, you always **have to** provide values for the defined variables. 
Note that it is important which variables are *defined* in the variable configuration, not which
variables you actually use in the main configuration. For example, the main configuration references a variable 
configuration with *firstVar* and *secondVar* variables, but you're using `{{ firstVar}}` and
`{{ thirdVar}}` in the configuration code. Then you have to provide values at least for *firstVar* 
and *secondVar* variables. If you provide values for all *firstVar*, *secondVar*, and *thirdVar*, all of them will 
be replaced. Omitting a value raises an error — a referenced placeholder with no value is reported as
`Missing values for placeholders: "thirdVar"`, and a declared variable with no value as
`No value provided for variable "firstVar".` Neither is silently replaced with an empty string.

The second rule is that the three options of passing values are mutually exclusive. If you provide values using 
`variableValuesId` or `variableValuesData`, it overrides the default values (if provided). You can't use 
`variableValuesId` and `variableValuesData` together in a single call. If you do that, an error will be raised.
If no default values are set and none of the `variableValuesId` or `variableValuesData` is provided, an error 
will be raised.

## Variable delimiter
The default variable delimiter is `{{` and `}}`. If the delimiter interferes with your code, it can
be changed as per the [Moustache docs](https://mustache.github.io/mustache.5.html). For example the 
following piece of code

```json
{
    "code": "SELECT \"COUNTRY\" || '{{ alias}}' || '{{=<< >>=}} {{ as-is}} <<={{}}=>>' AS \"COUNTRY\", \"CARS\" || '{{ size}}' AS \"CARS\" FROM \"my-table\""
}
```

will be interpreted as (assuming the variables `alias=batman` and `size=big` are defined):

```json
{
    "code": "SELECT \"COUNTRY\" || 'batman' || '{{ as-is}}' AS \"COUNTRY\", \"CARS\" || 'big' AS \"CARS\" FROM \"my-table\""
}
```

## Driving variables from a flow
A flow does not contain placeholders of its own. It *supplies* values to the configurations it
runs, and the mechanism differs between the two flow types.

### Conditional flows
In a conditional flow (the `keboola.flow` component), a flow declares its own variables with a **variable task** — `"type": "variable"` with
either a fixed `value` or a computed `source` (see [Flow variable tasks](#flow-variable-tasks)). When a job task runs, those flow variables are
merged into the component's variables, and a flow variable replaces a value **only for a name the
variable configuration already declares**. Names the configuration does not declare are ignored.

The `variableOverrides` field on a job task decides which flow variables reach that task. Omit it
to apply all of them, set it to `[]` to apply none, or list names to apply only those. The field is
read by the flow runner and is not passed to the job.

```json
{
    "id": "run-transformation",
    "name": "Run transformation",
    "phase": "main",
    "task": {
        "type": "job",
        "componentId": "keboola.python-transformation-v2",
        "configId": "807943784",
        "mode": "run",
        "variableOverrides": ["alias"]
    }
}
```

To set a value on one task without declaring a flow variable, put `variableValuesId` or
`variableValuesData` in the task's advanced parameters; the payload is the same as for
[running a job](/components/variables/api/tutorial/#step-4-run-a-job). See
[Override a variable on one flow task](/components/variables/use/#override-a-variable-on-one-flow-task) for the UI path.

### Legacy flows
Legacy flows (the `keboola.orchestrator` component) carry variable values on the task itself, and
accept values for an entire run.

:::caution
This applies to **legacy** flows only. New flows use `keboola.flow`, described above — see the
[Flow Migration Guide](/flows/flow-migration-guide/).
:::

- Variables can be entered in task configuration.
- Variables can be entered when running an orchestration.

Entering variable values in task configurations allows the orchestration to run configurations with
variables; the parameters are identical to [running a job](/components/variables/api/tutorial/#step-4-run-a-job).
When running an orchestration, you can also provide variable values for the whole run, and those
override the ones set on individual tasks.

:::caution[Inherited claim]
The two bullets above come from the pre-2026 orchestrator documentation and are **not** reproducible
from any public schema: the `keboola.orchestrator` task object declares `componentId`, `configId`,
`configData`, `mode`, `configRowIds`, `tag`, and `previousJobId` — no variable fields. Treat the
task-level and run-level overrides as unverified for this component, and prefer the conditional-flow
path above.
:::

A worked example of both, kept from the older documentation, is in
[Legacy example: an orchestration with variables](#legacy-example-an-orchestration-with-variables) at the end of this page.

## Flow variable tasks

A flow sets a variable with a variable task, `"type": "variable"`, which holds either a fixed `value` or a computed `source`.
The UI steps are in [Set a variable in a flow](/components/variables/use/#set-a-variable-in-a-flow); this section shows the
JSON they generate, for template authors and API users.

### Static value

**JSON equivalent** (useful when authoring a flow as a template or via the API). The `value` field is
a string in the flow schema, so quote numbers — an unquoted `3600` fails validation:

```json
{
  "type": "variable",
  "name": "max_duration",
  "value": "3600"
}
```

### Dynamic value

:::caution
**Aggregations are not functions.** The Sum / Minimum / Maximum / Average options are not built-in functions — the `function` enum only accepts `COUNT` and `DATE`. The picker implements each aggregation as a [JMESPath](https://jmespath.org/) expression placed in the task `value` field rather than a `function` block. When authoring a flow via the API or as a template, write the aggregation directly in `value`:

- **Sum** → `sum(job.result.output.tables[].importedRowsCount)`
- **Minimum** → `min(job.result.output.tables[].importedRowsCount)`
- **Maximum** → `max(job.result.output.tables[].importedRowsCount)`
- **Average** → `avg(job.result.output.tables[].importedRowsCount)`
:::

**JSON equivalent** — behind the scenes the aggregation is stored as a `source` definition. For example, `Sum of importedRowsCount` can be expressed as a JMESPath aggregation in the task `value`. Note that the picker tree displays paths rooted at `result.*` (for example `result.output.tables`), while the generated `value` expression is rooted at `job.result.*`:

```json
{
  "type": "variable",
  "name": "total_imported_rows",
  "source": {
    "type": "task",
    "task": "extract-data",
    "value": "sum(job.result.output.tables[].importedRowsCount)"
  }
}
```

`COUNT` and `DATE` are the only functions exposed via the `function` block (see [Date & Time function](#date--time-function) below); they take their inputs as `operands`. `COUNT` counts the items a JMESPath expression returns — for example, the number of output tables a task produced:

```json
{
  "type": "variable",
  "name": "table_count",
  "source": {
    "type": "function",
    "function": "COUNT",
    "operands": [
      {
        "type": "task",
        "task": "extract-data",
        "value": "job.result.output.tables"
      }
    ]
  }
}
```

The `value` field accepts [JMESPath](https://jmespath.org/) expressions, so you can filter and extract specific items from the task result instead of just walking the tree. For example, picking the name of a particular output table by its ID:

```json
{
  "type": "task",
  "task": "97288",
  "value": "job.result.output.tables[?id=='out.c-test.example'][].name | [0]"
}
```

### Date & time function

Returns the date/time formatted according to the specified format string, available formats:
[https://www.php.net/manual/en/datetime.format.php](https://www.php.net/manual/en/datetime.format.php).

This example returns the full textual representation of the current month, such as "July" or "August".

```json
{
 "type": "function",
 "function": "DATE",
 "operands": [
   {
     "type": "const",
     "value": "F"
   }
 ]
}
```

**Example of creating a variable with the current timestamp:**

```json
{
 "id": "set-timestamp",
 "name": "Set Timestamp Variable",
 "phase": "init",
 "task": {
   "type": "variable",
   "name": "current_timestamp",
   "source": {
     "type": "function",
     "function": "DATE",
     "operands": [
       {
         "type": "const",
         "value": "U"
       }
     ]
   }
 }
}
```

## Variables evaluation sequence
There is a number of places where variable values can be provided (either as a reference to an existing row with 
values or as an array of `values`):

- Parameters in the component job itself
- Default values stored in configuration (`variables_values_id` property)
- For legacy flows only: parameters supplied when the orchestration is run, and parameters in an
  orchestration task's `task` setting

In a conditional flow, a matching-name [flow variable](#conditional-flows) is a further source of a
value; it is merged by the flow runner before the job starts.

The following diagram shows the parameters mentioned on this page and to what they refer to:

![Screenshot -- Properties references](/components/variables/api/variables.svg)

In a nutshell, `variableValuesId` always refers to the row of the variable configuration associated with the 
main configuration. The main configuration is referenced in the `config` parameter. From another point of view,
the `config` parameter represents the configuration (either a component or a flow) to be run.
Note that in stored configurations snake_case is used instead of camelCase.

The following rules describe the evaluation sequence:

- Values provided in job parameters override the stored values.
- In a legacy flow, values provided when the orchestration is run override the stored values in
  `task`, and values in `task` override values stored in the component configuration.
- `variableValuesData` and `variableValuesId` can't be used together, so neither of them takes precedence. A reference to stored values can't be mixed with providing the values inline. 
- If no values are provided anywhere, the default values are used. If no default values are present, an error is raised.

## Shared code
Shared code is the sibling feature that substitutes *code* rather than *values*, using the same
Moustache syntax and the `keboola.shared-code` component. Its API — creating a piece with the
create-configuration call and referencing it with `shared_code_id` / `shared_code_row_ids` — is
documented in [Shared Code via the API](/transformations/shared-code/#shared-code-via-the-api).

## Legacy example: an orchestration with variables

:::caution[Legacy]
This section applies to **legacy** flows (the `keboola.orchestrator` component) only, and it carries the
unverified claim described under [Legacy flows](#legacy-flows). It continues
[part 2 of the tutorial](/components/variables/api/tutorial/#part-2-stored-default-values-and-run-time-overrides): the IDs below refer to the
configurations created there.
:::

<!-- VERIFY(Nikita): do keboola.orchestrator tasks and orchestration runs still accept variableValuesId and variableValuesData? The public task schema lists no variable fields. Decide whether this legacy example stays, gets corrected, or goes. -->

### Legacy: create the orchestration
You have to use the 
[Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs)
to create a configuration of the `keboola.orchestrator` component. 
You can use the following data in the configuration:

```json
{
    "phases": [
        {
            "id": 2468,
            "name": "Extractors",
            "dependsOn": []
        }
    ],
    "tasks": [
        {
            "id": 13579,
            "name": "Example",
            "phase": 2468,
            "task": {
                "componentId": "keboola.python-transformation-v2",
                "configId": "807943784",
                "mode": "run",
                "variableValuesId": "807952812"
            },
            "continueOnFailure": false,
            "enabled": true
        }
    ]
}
```

The contents of the `task` property are identical to the body 
of the [run job API call](/components/variables/api/tutorial/#step-4-run-a-job). Here, the value `807943784` refers to the ID 
of the main configuration, and `807952812` refers to the ID of the configuration row with variable values.
You can use the `variableValuesData` field in the same manner.
Creating the above configuration will return a response containing the configuration ID, e.g., `807969959`.
See an [example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#9f2f9da0-59eb-4f33-a206-e5add24725d1).

### Legacy: run the orchestration
When running an orchestration which contains configurations referencing variables, you have to provide their
values. You can either rely on the stored values (either at the component configuration or in the orchestration task) 
or you can provide the values at runtime.

#### Run it with stored values
Use the [Run Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs) 
to run an orchestration. In its simplest form, the request body needs to contain just the ID of the orchestration
(obtained in the previous step):

```json
{
    "component": "keboola.orchestrator",
    "config": "807969959",
    "mode": "run"
}
```

As long as the variable values can be found somewhere, this is sufficient. See [an example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#3ebdc3f5-a940-4f0d-860b-ec311f704a7e).

#### Run it with values in the request
Use the [Run Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs) 
to run an orchestration. Additionally, you can use the `variableValuesId` or `variableValuesData` property 
to override variable values set to individual tasks. The calling convention is the same as shown in the 
[basic job run](/components/variables/api/tutorial/#step-4-run-a-job). The same rules also apply, notably that you can't 
use `variableValuesId` and `variableValuesData` together. 
A sample request body:

```json
{
    "component": "keboola.orchestrator",
    "config": "807969959",
    "mode": "run",
    "variableValuesData": {
        "values": [
            {
                "name": "alias",
                "value": "batman"
            },
            {
                "name": "size",
                "value": "scatman"
            }
        ]
    }
}
```

See [an example](https://documenter.getpostman.com/view/3086797/77h845D?version=latest#f4fcf7af-afbe-4c29-999e-0f4c50aa477b).

---

**Next:** [Variables tutorial →](/components/variables/api/tutorial/)
