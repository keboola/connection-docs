---
title: Continue on Failure in Conditional Flows
slug: 'flows/flow-migration-guide/continue-on-failure'
description: >-
  Conditional Flows have no Continue on Failure toggle, so the Legacy Flow
  "continue on failure + warning notification" behavior is not migrated
  automatically. Learn how to reproduce it using conditions.
---

When you migrate a [Legacy Flow](/flows/flows-legacy/) to a [Conditional Flow](/flows/) using the [Migration Guide](/flows/flow-migration-guide/), the **Continue on Failure** behavior does not carry over automatically. This page explains why and shows how to reproduce it with conditions.

:::caution[Known issue]
Conditional Flows have no **Continue on Failure** toggle. In Legacy Flows, enabling **Continue on Failure** on a task made the task finish with a **warning** status instead of failing the whole Flow, and could send a warning notification. Because Conditional Flows have no **Continue on Failure** toggle, this behavior is not migrated automatically — you have to rebuild it manually using [conditions](/flows/#conditions).
:::

## Workaround: reproduce continue-on-failure with conditions

In Conditional Flows, you recreate this behavior with a condition that branches on a task's job status. The example below starts from a first phase named **Extract Data** that contains two tasks: a GitHub extractor (**My GitHub**) and a Google Sheets extractor (**Vouchers and Global Bars**).

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
Any task that does **not** have a condition on the *failed* status — such as the Google Sheets extractor in this example — still fails the whole Flow if it finishes with an error. Add a failed-status condition to every task that should be allowed to continue on failure.
:::
