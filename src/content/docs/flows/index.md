---
title: Conditional Flows
slug: 'flows'
description: Build automated pipelines with Conditional Flows — phases and parallel tasks, IF/THEN conditions, variables, retries, delays, notifications, schedules, and run history.
redirect_from:
    - /flows/conditional-flows/
---

Flows allow you to build automated data pipelines with conditional logic, branching, retries, and robust error handling. You can define flows that react to the outcome of previous steps, dynamically control their next action, or even skip tasks entirely.

*Looking for [Legacy Flows](/flows/flows-legacy/)? To migrate an existing Legacy Flow to a new Conditional Flow, see the [Migration Guide](/flows/flow-migration-guide/).*



## Access Flows

Navigate to **Conditional Flows > Create Flow**. You'll land directly in the **Builder** tab, where you can start creating your first flow; the other tabs — **All Runs**, **Schedules**, **Notifications**, and **Versions** — cover monitoring and automation and are explained later in this documentation.

Use the plus icon (+) on the canvas to add a task to a phase. The **Add Task** menu offers three task types: **Component**, **Notification**, and **Variable**. Conditions are not tasks — they control which phase runs next and are configured on the transitions between phases. <!-- TODO(human-review): confirm how conditions are added in the Builder (on the phase transition?) — the Add Task menu does not include them. -->

## Build the Flow

### Phases and Tasks

- **Phases** group multiple tasks (components, variables, notifications).
- **Tasks within a phase** run in parallel.
- **After all tasks in a phase complete**, based on conditions it is determined which phase will be executed next.
- You can define **multiple condition rules** - only the first matched condition is executed.
- **How to end a flow:** You can stop a flow at any point using the End Flow option in the ELSE path of a conditional condition. This is especially useful when none of your IF conditions are met and you want to avoid continuing to another phase. <!-- TODO(human-review): confirm the "End Flow in the ELSE path" mechanism and its exact UI label. -->

:::caution
If too many tasks are scheduled in a single phase, you may exceed the available [Storage job](/storage/jobs/) slots, causing delays in your flow's execution. Limiting the number of concurrent component jobs to 10 is recommended. The Keboola Support team can help you adjust parallel limits. <!-- TODO(human-review): confirm the 10-parallel Storage-job guidance and default cap. -->
:::

### Execute Tasks in Parallel
You can group multiple tasks within one phase. These tasks then run independently in parallel, speeding up the execution.
Phases execute sequentially, while tasks within a single phase run in parallel. If you have multiple data source connectors, you can include them all in a single phase, allowing them to run simultaneously.

The same applies to data destination connectors. Also, transformations independent of the connectors can be grouped within the same phase. Note that this does not reduce costs, as each job consumes credits independently.

You can also set up parallelization **within a component** (configuration), directly in the component's UI for
[row-based components](/components/#configuration-rows) like database source connectors using the same credentials to run multiple tables concurrently.

[Storage jobs](/storage/jobs/) have a parallel limit. They are typically capped at 10 parallel jobs but the Keboola Support team can help you adjust this.

### Control Task Execution

![Task Parameters](/flows/task-parameters.png)

- If you need to temporarily skip something, disable the task. The task will then be excluded from the flow.

- Failure handling is expressed through [conditions](#conditions) instead of a "Continue on Failure" toggle — you can branch on task or phase status (e.g., `if status == 'error' then ...`) to send notifications, run fallback logic, or end the flow. See also [Retry](#retry) for automatic retries of failed tasks.

- To modify the parameters sent to the underlying [API call](https://developers.keboola.com/integrate/jobs/#run-a-job), you can set **Task Parameters**.
Select the task and click **Set advanced parameters**. When finished, click **Set**.

***Example of the advanced parameter:** changing a variable in transformation:*

```json
{
  "componentId": "keboola.snowflake-transformation",
  "configId": "0123abc",
  "mode": "run",
  "variableValuesData": {
    "values": [
      {
        "name": "variables_name",
        "value": 12345
      }
    ]
  }
}
```

## Conditions

### 1. Conditional Logic (IF statements)

Control the flow of execution based on conditions like:

- **Task or phase status** - such as success, failure, or warning. This is commonly used for handling errors, creating fallback branches, or sending alerts.
- **Variable values** (e.g. thresholds, results from previous tasks).
- **Date and time logic** (e.g. run only on Mondays, last day of the month).
- **Number of Output Tables** - control the flow based on how many output tables a task produces.
- **Duration of Task** - condition to trigger actions depending on how long a task runs. This is useful for detecting anomalies (e.g., unusually short or long runtimes).

<!-- TODO(human-review): confirm this condition-type list (status / variable values / date-time / output-table count / task duration) against the current condition builder. -->

Evaluation proceeds from top to bottom, and once a condition is true, the remaining conditions are ignored - even if others would also evaluate to be true.

:::caution
Only the first matching condition is executed.
:::

**Example:** If you define 5 conditions and both the 3rd and 5th conditions are valid, only the 3rd will be used.

### 2. Logical AND / OR between conditions

You can use logical operators (AND) and (OR) to combine multiple statements within a single condition statement.

- Use **(AND)** when all statements must be true for the expression to pass.
- Use **(OR)** when any one statement being true is enough.

![](/flows/conditional-flows-condition.png)

## Variables

Variables let you store and reuse values — like dates, task results, or custom inputs — throughout your flow. Add one in a phase with the **+** icon → **Variable**; a variable holds either a **Static Value** (fixed text or number) or a **Dynamic Value** computed at run time from a task result, a phase, or a built-in function. Later conditions can then compare the variable's value, and component jobs receive flow variables that match their own variable names.

For the full guide — static and dynamic values, JMESPath aggregations, the `COUNT` and `DATE` functions, and how variables reach component jobs — see [Flow Variables](/flows/variables/).

## Retry

You can retry failed tasks automatically and optionally choose to retry based on specific failure messages.

By default, the system retries up to 3 times with a 10-second delay between attempts. Both the number of attempts and the delay can be customized to fit your workflow. <!-- TODO(human-review): confirm the retry defaults (3 attempts, 10-second delay). -->

To access the retry settings, click on task to open the configuration.

**Example:** If you set 3 retries with 10 seconds delay between attempts, it means the task will run 4x total.

![](/flows/conditional-flows-task.png)

![](/flows/conditional-flows-retry.png)

**Problem:** Pipeline fails due to API timeout.  
**Solution:** Configure retry logic for that task.

## Delay between tasks

Introduce a delay (in seconds) before executing a task - useful for waiting for external systems or data availability.

To access the delay settings, click on task to open the configuration.

![](/flows/conditional-flows-delay.png)

## Notifications

Send alerts directly from the flow and conditions using email(s) or webhook(s). Use the plus icon (+) and select Notification.

You can also create the notification inside of condition as a New Phase, name it and once the condition is all set, use the Use the plus icon (+) and select Notification.

![](/flows/conditional-flows-notification-1.png)

![](/flows/conditional-flows-notification-2.png)

## Schedule and Automate

Open the **Schedules** tab in your flow and click **Create Schedule**. A schedule starts the flow either at a **date and time** (predefined intervals or your own cron-style setting) or via a **table trigger**. You can create **multiple schedules** for one flow — they function independently, and the flow runs whenever any of them fires.

**Scheduling:** Commonly, flows are set to run at specific times. To avoid busy periods in a shared environment, consider scheduling slightly off-peak for smoother execution.

**Triggers:** Set flows to automatically start when certain Storage tables are updated (ideal for managing dependencies across projects). Your projects will stay synchronized and run efficiently.

![Set Schedule](/flows/set-schedule.png)

*Note on Triggers: If table updates happen during the cool-down period, the trigger is suppressed, but the tables are marked as ready. Therefore, if all configured tables are updated during the cool-down period, the flow is not scheduled at that time — but once the cool-down expires and any table is updated (causing the trigger to be evaluated), the system recognizes that all tables are already up to date and runs the flow immediately.* <!-- TODO(human-review): confirm the trigger cool-down semantics described here. -->

## Check Run History

Once your flow is running, you can track its progress and debug issues using the **All Runs** tab.

In this tab, you will find a complete list of all past executions of your flow. Click into any run to see:

- Which phases were executed
- Which tasks ran successfully, failed, or were skipped
- Which conditional branch was taken after each phase (this is especially helpful when debugging conditional logic)
- The values of variables (if used in the flow)
- Number of retries and its status.

You can use this overview to validate whether your conditions behaved as expected - e.g. if the flow correctly skipped a phase on the weekend or retried a failing task.

![](/flows/conditional-flows-all-runs.png)


