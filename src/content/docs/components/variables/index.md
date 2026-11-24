---
title: Variables
lastUpdated: 2026-11-19
slug: 'components/variables'
description: 'The two kinds of variables in Keboola, configuration variables and flow variables: what each is for, and how a flow sets the value of a configuration variable.'
redirect_from:
    - /transformations/variables/
---

Keboola has two kinds of variables. They are separate mechanisms that meet in one place — when a
flow runs a component — and this page covers both, plus the bridge between them.
For the steps in the UI, see [Use variables](/components/variables/use/).
To define, override, or read variables programmatically, see [Variables Through the API](/components/variables/api/).

<!-- Explanation-type page. Source: the Variables page as it was before the 2026-11-19 split. Text carried over; facts not re-checked against the product. -->

| Kind | Lives in | Use it to |
|---|---|---|
| [Configuration variables](#configuration-variables) | a component configuration (`keboola.variables`) | parametrize a transformation, data source, or writer so one configuration serves many cases |
| [Flow variables](#flow-variables) | a flow, as a **Set Variable** task | carry a value between phases, drive a condition, or feed a later task |

You do not need a flow to use configuration variables — a single transformation with a default
value works on its own. Start there if that is all you need.

For sharing *code* rather than values between transformations, see
[Shared Code](/transformations/shared-code/).

## Configuration variables

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

For a worked example with a transformation, see
[Parametrize a configuration with a variable](/components/variables/use/#parametrize-a-configuration-with-a-variable).

## Flow variables

Variables in flows let you store and reuse values - like dates, task results, or custom inputs - throughout your flow. You can use them to make decisions, control flow logic, or pass dynamic values between tasks.

A flow variable holds either a static value, which you enter directly, or a dynamic value, which is computed at run time from a task result, an earlier phase, or a built-in function. To set one and read it in a condition, see [Set a variable in a flow](/components/variables/use/#set-a-variable-in-a-flow).

## Driving a configuration variable from a flow

A flow can set the value of a configuration variable in two ways. They are independent, and they
can be combined in one flow.

### Flow variables merged by name

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

### Task parameters on a single task

The second way sets a value on one specific task, in its **Task Parameters**. It does not depend on a flow variable with the same name. The steps and the payload are in [Override a variable on one flow task](/components/variables/use/#override-a-variable-on-one-flow-task).

### Where the value comes from

A value for the same variable can arrive from several places:

- the default value stored in the variable configuration;
- a flow variable with a matching name, subject to `variableOverrides`;
- `variableValuesId` or `variableValuesData` in a task's **Task Parameters**;
- `variableValuesId` or `variableValuesData` supplied when the job is run.

Two rules are worth remembering: a flow variable only ever *replaces* a value for a name the
configuration already declares, and values supplied at run time take precedence over the stored
default. See [Variables Evaluation Sequence](/components/variables/api/#variables-evaluation-sequence)
for the API-level view and the diagram of how these properties refer to each other.

---

**Next:** [Use variables →](/components/variables/use/)
