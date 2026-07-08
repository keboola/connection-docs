---
title: Migration Guide
description: This guide walks you through migrating an existing Legacy Flow to the new Conditional Flow engine.
slug: 'flows/flow-migration-guide'
---



This guide walks you through migrating an existing [Legacy Flow](/flows/flows-legacy/) to the new [Conditional Flow](/flows/) engine. The migration is **non-destructive**: your original Legacy Flow is preserved — kept for reference and automatically disabled — while a new Conditional Flow is created alongside it. You can review the converted version safely before relying on it in production.

:::tip
The original Legacy Flow is preserved throughout the entire migration. You can revisit the Migration Preview as many times as you need before running the actual migration.
:::

## Prerequisites

- At least one existing [Legacy Flow](/flows/flows-legacy/) you want to migrate.
- Familiarity with [Conditional Flows](/flows/) -- the migrated Legacy Flow will run on that engine, and the Conditional Flow concepts (phases, conditions, variables, retries) will be visible in the result.

## Step 1: Open Migration Preview

Navigate to **Conditional Flows > Legacy Flows** in the top menu and open the detail of the Legacy Flow you want to migrate. A blue banner appears on the Legacy Flow detail reading **"This Legacy Flow can be migrated to a Conditional Flow"**, together with a green **Migration Preview** button.

![Legacy Flow detail with the Migration Preview button](/flows/flow-migration-guide/migration-preview-button.png)

Click **Migration Preview** to open a non-destructive preview of how the Legacy Flow would look once it has been converted to a Conditional Flow.

If you do not see the **Migration Preview** button on the Legacy Flow detail, contact [Keboola Support](/management/support/) and ask them to enable the migration for your project.

## Step 2: Review the Conditional Flow preview

The preview opens a side-by-side view: the **Current Legacy Flow** on the left and the **Conditional Flow** that will be created on the right. Two information panels summarize the migration:

- The **THIS WILL** panel describes the three guarantees of the migration:
  - Create a new Conditional Flow with the migrated configuration.
  - Copy schedules, triggers, and notifications to the new Conditional Flow.
  - Disable this Legacy Flow (kept for reference).
- The **STRUCTURAL CHANGES** panel lists the concrete transformations applied to the Legacy Flow configuration -- for example, *"Converted phase/task identifiers to strings"* and *"Rewrote phases[].dependsOn into next transitions"*.

![Migration Preview screen with side-by-side comparison and structural changes panel](/flows/flow-migration-guide/migration-preview.png)

Use this view to:

- Verify that all phases and tasks from the original Legacy Flow are represented in the Conditional Flow.
- Read through the structural changes so you understand how Legacy Flow concepts (such as the **Continue on Failure** toggle) have been translated into Conditional Flow primitives.

The preview is read-only. No changes are made to your project until you explicitly start the migration.

## Step 3: Run the migration

When you are ready, click **Migrate Now** in the top-right corner of the Migration Preview to start the migration. Keboola triggers a job that creates a new Conditional Flow from your existing Legacy Flow configuration, copies schedules, triggers, and notifications to it, and disables the Legacy Flow.

While the job is running, the Legacy Flow detail shows a blue **"Migration in progress"** banner.

![Legacy Flow detail showing Migration in progress banner](/flows/flow-migration-guide/migration-in-progress.png)

Once the migration finishes, the Legacy Flow detail shows a green **"This Legacy Flow has been migrated to a Conditional Flow"** banner with an **Open Conditional Flow** link to the newly created Conditional Flow.

![Legacy Flow detail showing successful migration banner with Open Conditional Flow link](/flows/flow-migration-guide/migration-complete.png)

## After the migration

The migration job performs the following steps:

- A new Conditional Flow has been created with the migrated configuration.
- Schedules, triggers, and notifications have been copied to the new Conditional Flow automatically -- you do **not** need to set them up manually.
- The Legacy Flow has been disabled automatically. It is kept in your project as a read-only reference.

Recommended next steps:

1. Open the new Conditional Flow via the **Open Conditional Flow** link in the success banner.
2. Run the new Conditional Flow manually and confirm it produces the expected result.
3. Once you are confident in the new Conditional Flow over one or more production runs, you can delete the disabled Legacy Flow if you no longer need it as a reference.

:::tip
If something does not look right in the migrated Conditional Flow, you can disable or delete it and re-enable the Legacy Flow to continue using it while you investigate. Schedules, triggers, and notifications are **copied** (not moved) to the new Conditional Flow during migration, so make sure the new Conditional Flow is disabled before re-enabling the Legacy one — otherwise both would react to the same schedules and triggers. The Migration Preview can also be opened again at any time against the current state of the source Legacy Flow.
:::
