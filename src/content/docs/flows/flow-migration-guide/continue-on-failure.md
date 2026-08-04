---
title: Continue on Failure in Conditional Flows
slug: 'flows/flow-migration-guide/continue-on-failure'
description: >-
  Conditional Flows have no per-task Continue on Failure toggle. The Legacy Flow
  behavior is migrated into a Continue on Failure condition on the phase; learn
  what the migration produces and how to build or extend it yourself.
---

In [Legacy Flows](/flows/flows-legacy/), enabling **Continue on Failure** on a task made the task finish with a **warning** status instead of failing the whole Flow. [Conditional Flows](/flows/) have no per-task toggle - the same rule is expressed with a [condition](/flows/#conditions) on the phase.

## What the migration produces

When you migrate a Legacy Flow using the [Migration Guide](/flows/flow-migration-guide/), tasks with **Continue on Failure** enabled are translated into a **Continue on Failure** condition on their phase: all tasks of the phase must succeed, except those that had the toggle on. You don't have to rebuild anything manually.

You can review and change the result in the Builder - the condition uses the [Continue on Failure](/flows/#4-continue-on-failure) subject, and the tasks allowed to fail are listed in the **All tasks of the phase must succeed, except** selector.

:::caution
Flows migrated **before** this behavior was introduced carry an older condition shape: an *All Tasks in Phase* statement combined with per-task *failed* statements using **OR**. That shape passes as soon as one of the tolerated tasks fails, even when a task that had to succeed failed as well. Such flows are not rewritten automatically - if you rely on the behavior, replace the condition with the **Continue on Failure** subject.
:::

## Build it yourself

You can add the same condition to any phase, whether it came from a migration or not:

1. Add a condition to the phase.
2. As the subject, pick the phase and then **Continue on Failure**.
3. In the **All tasks of the phase must succeed, except** selector, pick the tasks that are allowed to fail.

Every other task in the phase must succeed for the branch to be taken. Leave the selector empty to require that the whole phase succeeds.

## Notify when a task fails

If you also want to be notified, branch on the failing task's status and route the Flow through a phase with a **Notification** task. The example below starts from a first phase named **Extract Data** that contains two tasks: a GitHub extractor (**My GitHub**) and a Google Sheets extractor (**Vouchers and Global Bars**).

1. Start with the **Extract Data** phase containing the GitHub and Google Sheets extractor tasks.

   ![The Extract Data phase with the My GitHub and Vouchers and Global Bars extractor tasks](/flows/flow-migration-guide/continue-on-failure-1.png)

2. Add a condition to the GitHub extractor so that, when it finishes with an error, the Flow sends a notification and then continues. Set the condition to **IF** **My GitHub** *Job Status* **Is** **Failed**, **THEN** **Continue To** the **Existing Phase** **Notification**; in the **ELSE** branch, **Continue To** the **Existing Phase** **Phase 2**.

   ![Condition editor: IF My GitHub Job Status Is Failed, THEN Continue To the Notification phase, ELSE Continue To Phase 2](/flows/flow-migration-guide/continue-on-failure-2.png)

3. Add a **Notification** task to the **Notification** phase and configure it — for example, a name, a message, and an email destination.

   ![Notification task configured with a name, message, and email destination](/flows/flow-migration-guide/continue-on-failure-3.png)

4. Add the task where the Flow continues to **Phase 2**. In this example it is a Snowflake transformation named **Set variable**.

   ![The Flow branches into the Notification phase and Phase 2, which contains the Set variable Snowflake transformation](/flows/flow-migration-guide/continue-on-failure-4.png)

5. Connect the output of the **Notification** phase so it also continues to **Phase 2**. Click the plus icon (**+**) under the **Notification** phase and, under **Manage Path**, choose **Connect Path**. Then select **Phase 2** from the drop-down.

   ![The plus menu under the Notification phase with Connect Path selected under Manage Path](/flows/flow-migration-guide/continue-on-failure-5.png)

6. The resulting Flow branches on the GitHub extractor failure into the **Notification** phase and rejoins **Phase 2**.

   ![The resulting Flow: the Notification branch rejoins Phase 2](/flows/flow-migration-guide/continue-on-failure-6.png)

:::caution
A per-task branch like this only covers the task it is attached to. Any other task of the phase - such as the Google Sheets extractor in this example - still fails the whole Flow if it finishes with an error. Use the **Continue on Failure** subject to allow several tasks to fail at once.
:::
