---
title: Variables
slug: 'flows/variables'
description: Parametrize a component configuration with placeholders, define variables inside a flow, and drive one from the other.
redirect_from:
    - /transformations/variables/
---



Keboola has two kinds of variables. They are separate mechanisms that meet in one place — when a
flow runs a component — and this page covers both, plus the bridge between them.

| Kind | Lives in | Use it to |
|---|---|---|
| [Configuration variables](#configuration-variables) | a component configuration (`keboola.variables`) | parametrize a transformation, data source, or writer so one configuration serves many cases |
| [Flow variables](#flow-variables) | a flow, as a **Set Variable** task | carry a value between phases, drive a condition, or feed a later task |

You do not need a flow to use configuration variables — a single transformation with a default
value works on its own. Start there if that is all you need.

To define, override, or read variables programmatically, see [Variables API](/flows/variables/api/).
For sharing *code* rather than values between transformations, see
[Shared Code](/transformations/shared-code/).

## Configuration Variables

Configuration variables let you parametrize a configuration. This is useful when you have similar
configurations which differ in only a limited number of values. You can have, for example, a
transformation that processes all orders from the Meals department. With variables, you can modify
it to work for the Drinks department, too.

Configuration variables are unrelated to the transformation code itself. It means that they do not
manifest themselves as SQL or Python variables. They are evaluated before the configuration runs
and are valid for the entire configuration (all code blocks, shared code, mapping, etc.). Variables
are referenced in the configuration using the
[Moustache Variable syntax](https://scalate.github.io/scalate/documentation/mustache.html#Variables).

All variables referenced in the code must be defined in the variables section. All defined variables
must have assigned values.

### Example

Consider the following transformation:

```sql
CREATE OR REPLACE TABLE "result" AS
	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
```

To parametrize the multiplier value (42), you can change it to a variable `{{ multiplier }}`:

```sql
CREATE OR REPLACE TABLE "result" AS
	SELECT "first", "second" * {{ multiplier }} AS "larger_second" FROM "source";
```

When you define a variable, you have to provide its default value:

![Screenshot - Variables Configuration](/flows/variables/variables-setting.png)

When you run a transformation, you can provide a runtime override of the default value:

![Screenshot - Running Transformation](/flows/variables/variables-run.png)

When a variable is referenced in the code but not defined, or its value is missing,
you'll get an error:

    Missing values for placeholders: "multiplier"

or

    No value provided for variable "multiplier".

## Flow Variables

Variables in flows let you store and reuse values - like dates, task results, or custom inputs - throughout your flow. You can use them to make decisions, control flow logic, or pass dynamic values between tasks. The sections below walk through how to set up and use variables from the UI; each step also shows the JSON shape generated behind the scenes for template authors and API users.

### Adding a Variable

1. In a phase, click the **+** icon and choose **Set Variable**. The Set Variable panel opens on the right.
2. Enter a **Variable Name** — this is the identifier other tasks will use to reference the value.
3. Choose a **Variable Type** — either [Static Value](#static-value) or [Dynamic Value](#dynamic-value).

### Static Value

A **Static Value** is a fixed text or number you enter directly. Useful for thresholds, IDs, or labels that don't change between runs.

![Set Variable panel with Static Value selected](/flows/conditional-flows-variables-static-set.png)

**JSON equivalent** (useful when authoring a flow as a template or via the API):

```json
{
  "type": "variable",
  "name": "max_duration",
  "value": 3600
}
```

### Dynamic Value

A **Dynamic Value** is computed at run time from a task result, an earlier phase, or a built-in function (see [Date & Time function](#date--time-function) below). When you pick this type, the value picker lets you browse the outputs of tasks that ran earlier in the flow. You can pick any field from the job's result tree — for example `result.output.tables`, `result.artifacts`, `result.images`, `result.configVersion`, `result.errorMessage`, and many more.

![Set Variable panel in Conditional Flow](/flows/conditional-flows-variables-set.png)

If a task produces **multiple output tables**, the picker also offers aggregations across all of them: **Sum**, **Minimum**, **Maximum**, and **Average** of a numeric field. For example, `Sum of importedRowsCount` returns the total number of rows imported by an HTTP data source across every output table.

![Dynamic Value picker showing task result tree with aggregations](/flows/conditional-flows-variables-picker.png)

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

### Date & Time function

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

### Using Variables in Conditions

Once a variable has been set in an earlier phase, any later **Condition** can compare its value against a constant, against another variable, or against a task result.

1. In the IF row, click the value picker and choose a variable, a task result, or a phase result from an earlier phase.
2. Choose an operator (Greater than, Equals, Contains, …).
3. Provide a comparison value — a constant, or another value picked from the tree.
4. Set the THEN and ELSE actions: **Continue To** an existing phase, or end the flow.

Only the first matching IF condition is executed; subsequent IFs in the same Conditions block are skipped.

![IF/THEN/ELSE condition referencing a task result](/flows/conditional-flows-variables-condition.png)

See also the [Conditions](/flows/#conditions) section for the full list of operators and condition types.

## Driving a Configuration Variable from a Flow

A flow can set the value of a configuration variable in two ways. They are independent, and they
can be combined in one flow.

### Flow Variables Merged by Name

When a phase runs a component (a job task), the variables you set earlier in the flow are merged
into the component's own variables. A flow variable replaces a configuration variable **only if
both have the same name** — flow variables whose names the configuration does not declare are
silently ignored. This means: to let a flow drive a value inside a component, declare a variable
with the matching name in the component's configuration; the flow will fill it in when the job runs.

For finer control, the `variableOverrides` field on a job task decides which flow variables reach
that task. It is tri-state: omit the field to apply all flow variables, set it to `[]` to apply
none, or list variable names to apply only those. The field is consumed by the flow runner and is
not passed to the job itself.

```json
{
  "type": "job",
  "componentId": "keboola.snowflake-transformation",
  "configId": "0123abc",
  "mode": "run",
  "variableOverrides": ["multiplier"]
}
```

### Task Parameters on a Single Task

To set a value on one specific task instead, use its **Task Parameters**: select the task, click
**Set advanced parameters**, and add `variableValuesData` to the payload. These are the parameters
sent to the underlying [run-job API call](/flows/variables/api/#step-4--run-job), so this path does
not depend on the variable also being declared in the flow.

```json
{
  "componentId": "keboola.snowflake-transformation",
  "configId": "0123abc",
  "mode": "run",
  "variableValuesData": {
    "values": [
      {
        "name": "multiplier",
        "value": 1000
      }
    ]
  }
}
```

### Where the Value Comes From

A value for the same variable can arrive from several places:

- the default value stored in the variable configuration;
- a flow variable with a matching name, subject to `variableOverrides`;
- `variableValuesId` or `variableValuesData` in a task's **Task Parameters**;
- `variableValuesId` or `variableValuesData` supplied when the job is run.

Two rules are worth remembering: a flow variable only ever *replaces* a value for a name the
configuration already declares, and values supplied at run time take precedence over the stored
default. See [Variables Evaluation Sequence](/flows/variables/api/#variables-evaluation-sequence)
for the API-level view and the diagram of how these properties refer to each other.
