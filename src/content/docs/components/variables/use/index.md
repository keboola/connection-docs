---
title: Use variables
slug: 'components/variables/use'
sidebar:
  label: Use Variables
description: 'Parametrize a configuration with a variable, set static and dynamic variables in a flow, read them in a condition, and override a value on one flow task.'
---

This page has the steps for both kinds of [variables](/components/variables/) in the UI: a placeholder in a configuration, and a variable in a flow. What the two kinds are and how a flow fills a configuration variable is explained on [Variables](/components/variables/). The API calls are on [Variables Through the API](/components/variables/api/).

<!-- How-to-type page. Source: the Variables page as it was before the 2026-11-19 split. Text and screenshots carried over; facts not re-checked against the product. -->

The flow sections below walk through how to set up and use variables from the UI. The JSON shape generated behind the scenes, for template authors and API users, is in [Flow variable tasks](/components/variables/api/#flow-variable-tasks).

## Parametrize a configuration with a variable

**Goal:** replace a fixed value in a configuration with a variable that has a default and can be overridden for one run.

1. Consider the following transformation:

   ```sql
   CREATE OR REPLACE TABLE "result" AS
   	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
   ```

2. To parametrize the multiplier value (42), you can change it to a variable `{{ multiplier }}`:

   ```sql
   CREATE OR REPLACE TABLE "result" AS
   	SELECT "first", "second" * {{ multiplier }} AS "larger_second" FROM "source";
   ```

3. In the configuration's **Variables** section, click **New Variable**, enter the name (`multiplier`) and its default value:

   ![Screenshot - Variables Configuration](/components/variables/variables-setting.png)

4. When you run the transformation, click **Run Component**. The dialog's **Variables** section lets you override the default value for this run:

   ![Screenshot - Running Transformation](/components/variables/variables-run.png)

   <!-- VERIFY(Nikita): both screenshots are from about 2021; confirm the New Variable form and the Run Component dialog still look like them. -->

**Result:** the transformation runs with the default value, or with the override you entered for that run.

When a variable is referenced in the code but not defined, or its value is missing,
you'll get an error:

    Missing values for placeholders: "multiplier"

or

    No value provided for variable "multiplier".

## Set a variable in a flow

**Goal:** store a value in a flow so that later tasks and conditions can read it.

1. In a phase, click the **+** icon and choose **Set Variable**. The Set Variable panel opens on the right.
2. Enter a **Variable Name** — this is the identifier other tasks will use to reference the value.
3. Choose a **Variable Type** — either [Static Value](#static-value) or [Dynamic Value](#dynamic-value).

**Result:** the phase has a **Set Variable** task, and tasks in later phases can reference the variable by its name.

### Static value

A **Static Value** is a fixed text or number you enter directly. Useful for thresholds, IDs, or labels that don't change between runs.

![Set Variable panel with Static Value selected](/flows/conditional-flows-variables-static-set.png)

### Dynamic value

A **Dynamic Value** is computed at run time from a task result, an earlier phase, or a built-in function (see [Date & time function](/components/variables/api/#date--time-function)). When you pick this type, the value picker lets you browse the outputs of tasks that ran earlier in the flow. You can pick any field from the job's result tree — for example `result.output.tables`, `result.artifacts`, `result.images`, `result.configVersion`, `result.errorMessage`, and many more.

![Set Variable panel in Conditional Flow](/flows/conditional-flows-variables-set.png)

If a task produces **multiple output tables**, the picker also offers aggregations across all of them: **Sum**, **Minimum**, **Maximum**, and **Average** of a numeric field. For example, `Sum of importedRowsCount` returns the total number of rows imported by an HTTP data source across every output table.

![Dynamic Value picker showing task result tree with aggregations](/flows/conditional-flows-variables-picker.png)

## Use a variable in a condition

**Goal:** send a flow down one path or another, depending on a variable or a task result.

Once a variable has been set in an earlier phase, any later **Condition** can compare its value against a constant, against another variable, or against a task result.

1. In the IF row, click the value picker and choose a variable, a task result, or a phase result from an earlier phase.
2. Choose an operator (Greater than, Equals, Contains, …).
3. Provide a comparison value — a constant, or another value picked from the tree.
4. Set the THEN and ELSE actions: **Continue To** an existing phase, or end the flow.

<!-- VERIFY(Nikita): the steps start in an IF row that already exists. Add how to add a Condition to the flow, where the comparison value is typed in step 3, and how to save the flow. -->

![IF/THEN/ELSE condition referencing a task result](/flows/conditional-flows-variables-condition.png)

**Result:** when the flow runs, it continues to the phase you set for THEN or ELSE, or ends. Only the first matching IF condition is executed; subsequent IFs in the same Conditions block are skipped.

See also the [Conditions](/flows/#conditions) section for the full list of operators and condition types.

## Override a variable on one flow task

**Goal:** set the value of a configuration variable for one specific task of a flow.

To set a value on one specific task instead, use its **Task Parameters**:

1. Select the task in the
   flow's Builder to open its settings, and click **Set advanced parameters**. The editor opens pre-filled with the task's `type`, `mode`, `componentId` and
   `configId`.

   ![The Task Parameters editor, pre-filled with the task's type, mode, componentId, and configId](/flows/task-parameters-modal.png)

2. Add `variableValuesData`
   to the task payload. The `variableValuesData` shape is the
   same one [running a job](/components/variables/api/tutorial/#step-4-run-a-job) takes, but the surrounding fields are
   the task's own (`componentId` / `configId`), not the job API's `component` / `config`:

   ```json
   {
     "componentId": "keboola.snowflake-transformation",
     "configId": "0123abc",
     "mode": "run",
     "variableValuesData": {
       "values": [
         {
           "name": "multiplier",
           "value": "1000"
         }
       ]
     }
   }
   ```

3. Click **Set**.

**Result:** the task runs with the value you set. This path does not
depend on the variable also being declared as a flow variable. The other way, a flow variable with the same name as the configuration variable, is explained in [Driving a configuration variable from a flow](/components/variables/#driving-a-configuration-variable-from-a-flow).

---

**Next:** [Variables Through the API →](/components/variables/api/)
