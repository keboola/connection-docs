---
title: Conditional Flows
permalink: /flows/conditional-flows/
---

Conditional Flows extend Keboola's existing [Flow](/flows/) capabilities with conditional logic, branching, and more robust error handling. You can now define Flows that react to the outcome of previous steps, dynamically control their next action, or even skip tasks entirely.

{% include public-beta-warning.html %}

* TOC
{:toc}

## Access Conditional Flows

Navigate to **Flows > Conditional Flows > Create Flow**. After this step, you'll land directly in the Builder where you can start creating your first Conditional Flow. Use the plus icon (+) to add different types of actions such as components, conditions, variables, notifications, and more - all of which are explained in detail later in this documentation.

## Build the Flow

Conditional Flows are built on top of the Flows functionality, therefore please refer to [Flows](/flows/).

## Conditions

### 1. Conditional Logic (IF statements)

Control the flow of execution based on conditions like:

- **Task or phase status** - such as success, failure, or warning. This is commonly used for handling errors, creating fallback branches, or sending alerts.
- **Variable values** (e.g. thresholds, results from previous tasks).
- **Date and time logic** (e.g. run only on Mondays, last day of the month).
- **Number of Output Tables** - control the flow based on how many output tables a task produces.
- **Duration of Task** - condition to trigger actions depending on how long a task runs. This is useful for detecting anomalies (e.g., unusually short or long runtimes).

Evaluation proceeds from top to bottom, and once a condition is true, the remaining conditions are ignored - even if others would also evaluate to be true.

{% include warning.html content="Only the first matching condition is executed." %}

**Example:** If you define 5 conditions and both the 3rd and 5th conditions are valid, only the 3rd will be used.

### 2. Logical AND / OR between conditions

You can use logical operators (AND) and (OR) to combine multiple statements within a single condition statement.

- Use **(AND)** when all statements must be true for the expression to pass.
- Use **(OR)** when any one statement being true is enough.

{: .image-popup}
![](/flows/conditional-flows/condition.png)

## How Conditional Flows Work

- **Phases** group multiple tasks (components, variables, notifications).
- **Tasks within a phase** run in parallel.
- **After all tasks complete**, based on conditions it is determined which phase will be executed next.
- You can define **multiple condition rules** - only the first matched condition is executed.
- **How to end a flow:** You can stop a flow at any point using the End Flow option in the ELSE path of a conditional condition. This is especially useful when none of your IF conditions are met and you want to avoid continuing to another phase.

## Variables

Variables in Conditional Flows let you store and reuse values - like dates, task results, or custom inputs - throughout your flow. You can use them to make decisions, control flow logic, or pass dynamic values between tasks.

**Example Static variables:**

```json
{
  "type": "variable",
  "name": "max_duration",
  "value": 3600
}
```

**Example Dynamic variables:** Using a source to compute the value dynamically.

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

## Retry

You can retry failed tasks automatically and optionally choose to retry based on specific failure messages.

By default, the system retries up to 3 times with a 10-second delay between attempts. Both the number of attempts and the delay can be customized to fit your workflow.

To access the retry settings, click on task to open the configuration.

**Example:** If you set 3 retries with 10 seconds delay between attempts, it means the task will run 4x total.

{: .image-popup}
![](/flows/conditional-flows/task.png)

{: .image-popup}
![](/flows/conditional-flows/retry.png)

**Problem:** Pipeline fails due to API timeout.  
**Solution:** Configure retry logic for that task.

## Delay between tasks

Introduce a delay (in seconds) before executing a task - useful for waiting for external systems or data availability.

To access the delay settings, click on task to open the configuration.

{: .image-popup}
![](/flows/conditional-flows/delay.png)

## Notifications

Send alerts directly from the flow and conditions using email(s) or webhook(s). Use the plus icon (+) and select Notification.

You can also create the notification inside of condition as a New Phase, name it and once the condition is all set, use the Use the plus icon (+) and select Notification.

{: .image-popup}
![](/flows/conditional-flows/notification-1.png)

{: .image-popup}
![](/flows/conditional-flows/notification-2.png)


## Check Run History

Once your Conditional Flow is running, you can track its progress and debug issues using the **All Runs** tab.

In this tab, you will find a complete list of all past executions of your flow. Click into any run to see:

- Which phases were executed
- Which tasks ran successfully, failed, or were skipped
- Which conditional branch was taken after each phase (this is especially helpful when debugging conditional logic)
- The values of variables (if used in the flow)
- Number of retries and its status.

You can use this overview to validate whether your conditions behaved as expected - e.g. if the flow correctly skipped a phase on the weekend or retried a failing task.

{: .image-popup}
![](/flows/conditional-flows/all-runs.png)

## Limitations

Flows and Conditional Flows are not interchangeable. You cannot convert one to the other. A migration tool is being planned to help with this in the future.

There are differences between Flows and Conditional Flows at the moment, see the table below for more information:

| Feature / Behavior | Conditional Flows                                           | Flows | Notes                                                                                                                |
|-------------------|-------------------------------------------------------------|-------|----------------------------------------------------------------------------------------------------------------------|
| Run Selected Tasks / Re-run Failed Tasks | 🚧 Not yet supported                               | ✅ Supported | Planned for GA. Workaround: duplicate the phase and skip conditionally. Set Retry.                                   |
| Trigger Components (cross-project) | 🚧 Not yet supported                                         | ✅ Supported | Planned for Conditional Flows. In Conditional Flows, you can't trigger another flow in Project B from Project A yet. |
| CLI Support | 🚧 Not yet supported                                          | ✅ Supported | Conditional Flows are not yet available via Keboola CLI.                                                             |
| Templates Support | 🚧 Not yet supported                                          | ✅ Supported | Not available yet in Conditional Flows.                                                                              |
| "Continue on Failure" toggle | 🔁 Replaced by Conditions | ✅ Simple UI toggle | In Conditional Flows, failure handling is expressed through conditions, offering more flexibility. (e.g., if status == 'error' then...)                  |

## Migration

We're planning an automatic migration from Flows to Conditional Flows to ensure a smooth transition without requiring manual intervention from users. This migration will preserve the logic, scheduling, and component configurations of existing flows while upgrading them to support conditional branching, retries, and other advanced features. In most cases, the migrated flows will look and behave the same - but with added flexibility under the hood.

## How to disable Conditional Flows

Go to **Project Settings -> Features -> Conditional Flows** - use toggle to disable the feature.
