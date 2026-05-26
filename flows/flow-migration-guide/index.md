---
title: Flow Migration Guide
permalink: /flows/flow-migration-guide/
---

* TOC
{:toc}

This guide walks you through migrating an existing [Flow](/flows/) to the new [Conditional Flow](/flows/conditional-flows/) engine. The migration is **non-destructive**: your original Flow is preserved — kept for reference and automatically disabled — while a new Conditional Flow is created alongside it. You can review the converted version safely before relying on it in production.

{% include tip.html content="The original Flow is preserved throughout the entire migration. You can revisit the Migration Preview as many times as you need before running the actual migration." %}

## Prerequisites

- At least one existing [Flow](/flows/) you want to migrate.
- Familiarity with [Conditional Flows](/flows/conditional-flows/) -- the migrated Flow will run on that engine, and the conditional-flow concepts (phases, conditions, variables, retries) will be visible in the result.

## Step 1: Open Migration Preview

Navigate to **Flows** in the top menu and open the detail of the Flow you want to migrate. A blue banner appears on the Flow detail reading **"This Flow can be migrated to a Conditional Flow"**, together with a green **Migration Preview** button.

{: .image-popup}
![Flow detail with the Migration Preview button](/flows/flow-migration-guide/migration-preview-button.png)

Click **Migration Preview** to open a non-destructive preview of how the Flow would look once it has been converted to a Conditional Flow.

If you do not see the **Migration Preview** button on the Flow detail, contact [Keboola Support](/management/support/) and ask them to enable the migration for your project.

## Step 2: Review the Conditional Flow preview

The preview opens a side-by-side view: the **Current Flow** on the left and the **Conditional Flow** that will be created on the right. Two information panels summarize the migration:

- The **THIS WILL** panel describes the three guarantees of the migration:
  - Create a new Conditional Flow with the migrated configuration.
  - Copy schedules, triggers, and notifications to the new Conditional Flow.
  - Disable this legacy Flow (kept for reference).
- The **STRUCTURAL CHANGES** panel lists the concrete transformations applied to the Flow configuration -- for example, *"Converted phase/task identifiers to strings"* and *"Rewrote phases[].dependsOn into next transitions"*.

{: .image-popup}
![Migration Preview screen with side-by-side comparison and structural changes panel](/flows/flow-migration-guide/migration-preview.png)

Use this view to:

- Verify that all phases and tasks from the original Flow are represented in the Conditional Flow.
- Read through the structural changes so you understand how legacy concepts (such as the **Continue on Failure** toggle) have been translated into Conditional Flow primitives.

The preview is read-only. No changes are made to your project until you explicitly start the migration.

## Step 3: Run the migration

When you are ready, click **Migrate Now** in the top-right corner of the Migration Preview to start the migration. Keboola triggers a job that creates a new Conditional Flow from your existing Flow configuration, copies schedules, triggers, and notifications to it, and disables the legacy Flow.

While the job is running, the Flow detail shows a blue **"Migration in progress"** banner.

{: .image-popup}
![Flow detail showing Migration in progress banner](/flows/flow-migration-guide/migration-in-progress.png)

Once the migration finishes, the Flow detail shows a green **"This Flow has been migrated to a Conditional Flow"** banner with an **Open Conditional Flow** link to the newly created Conditional Flow.

{: .image-popup}
![Flow detail showing successful migration banner with Open Conditional Flow link](/flows/flow-migration-guide/migration-complete.png)

## After the migration

The migration job has already done the cleanup that previously required manual steps:

- A new Conditional Flow has been created with the migrated configuration.
- Schedules, triggers, and notifications have been copied to the new Conditional Flow automatically -- you do **not** need to set them up manually.
- The legacy Flow has been disabled automatically. It is kept in your project as a read-only reference.

Recommended next steps:

1. Open the new Conditional Flow via the **Open Conditional Flow** link in the success banner.
2. Run the new Conditional Flow manually and confirm it produces the expected result.
3. Once you are confident in the new Conditional Flow over one or more production runs, you can delete the disabled legacy Flow if you no longer need it as a reference.

{% include tip.html content="If something does not look right in the migrated Conditional Flow, you can disable or delete it and re-enable the legacy Flow to continue using it while you investigate. Schedules, triggers, and notifications are **copied** (not moved) to the new Conditional Flow during migration, so make sure the new Conditional Flow is disabled before re-enabling the legacy one — otherwise both would react to the same schedules and triggers. The Migration Preview can also be opened again at any time against the current state of the source Flow." %}
