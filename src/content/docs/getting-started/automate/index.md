---
title: 'Automate It with a Flow'
slug: 'getting-started/automate'
description: 'Wire your connectors and transformation into a single flow, run its tasks in parallel where possible, give it a schedule, and get notified when it fails.'
redirect_from:
  - /tutorial/automate/
---

You have four configurations that each do one thing when you click Run. A **flow** turns them
into one pipeline that runs in the right order, at the right time, without you.
Step 5 of the [Getting Started](/getting-started/) arc.

<!-- Tutorial-type page (step 5 of 6). Written against Conditional Flows (the current flow
type; demo project 264 reports conditional_flows: true via the MCP project info). Terminology
sourced from /flows/. WARNING: every screenshot on this page is still the legacy-flow capture
inherited from /tutorial/automate/ — they show the drag-and-drop builder, a "Continue on
Failure" toggle that Conditional Flows do not have, and a two-task first phase instead of
four. All 15 must be re-shot; captions are written for the intended new shots, not the current
images. -->

## What you need

Everything from the previous steps, in one project:

- the `[TUTORIAL] Sample data` HTTP configuration from
  [Load Your Data](/getting-started/load/),
- the `Denormalize opportunities` transformation from
  [Transform Your Data](/getting-started/transform/),
- the Google Sheets destination from
  [Send Your Data Somewhere](/getting-started/write/).

## Phases and tasks

A flow is a list of **phases**. Each phase holds one or more **tasks** — a component
configuration to run, a notification to send, a variable to set.

- **Tasks inside one phase run in parallel.**
- **Phases run one after another**, and the flow only moves on when a phase is finished.

That is the whole model, and it makes the ordering obvious: things that can happen at the same
time go in one phase; things that depend on each other go in separate phases. Your pipeline is
three phases — extract, transform, deliver — because the transformation needs the four tables
before it can join them, and the sheet needs the joined table before it can deliver it.

Each phase here holds a single task, so nothing runs in parallel yet. Parallelism shows up the
moment you have a second source: two connectors both go in phase 1 and run at the same time.
Inside your HTTP configuration the four tables are already fetched by one job — row-based
components like this one can be [parallelized internally](/flows/#execute-tasks-in-parallel).

Flows can also branch on what happened: retry a task, take a different path on failure, end
early. That is [conditions](/flows/#conditions), and you need none of it yet.

## Build the flow

1. Go to **Flows** — labelled **Conditional Flows** where both kinds exist — and click
   **Create Flow**. Name it `[TUTORIAL] Opportunity pipeline`, add a description, and you land
   in the **Builder**.

   ![Screenshot - Create a flow](/getting-started/automate/automate1.png)

2. Use the plus icon (**+**) to add your first task and pick **Component**. Select the
   `[TUTORIAL] Sample data` HTTP configuration.

   ![Screenshot - Add the first component task](/getting-started/automate/automate2.png)

3. Add a **new phase** and put the `Denormalize opportunities` transformation in it. Being in a
   later phase is what guarantees the tables have landed before the SQL runs.

   ![Screenshot - The transformation in its own phase](/getting-started/automate/automate4.png)

4. Add a third phase holding the Google Sheets destination configuration.

   ![Screenshot - The destination phase](/getting-started/automate/automate5.png)

   <!-- VERIFY(owner): name the exact builder affordance for "add a task into this phase" vs
   "start a new phase" once walked live — the legacy captures predate the conditional-flow
   builder. -->

You now have three phases: the load, then the transformation, then the delivery.

![Screenshot - The finished flow](/getting-started/automate/automate10.png)

:::note[If you took the connector side trips]
If you also added the Google Sheets or database connector, put them in the first phase
alongside the HTTP configuration — that is where the parallelism above becomes real. Then open
the transformation's **input mapping** and point it at the tables those connectors produce,
since they land in their own buckets. A flow that runs the right components against the wrong
input mapping succeeds and produces nothing useful.

![Screenshot - Edit the input mapping](/getting-started/automate/automate12.png)
:::

## Run it

Click **Run Flow** to run it once by hand before scheduling it. Every task creates its own
job, so **Jobs** tells you exactly which step failed if one does, and the flow's run detail
shows the phases completing in order.

## Set a schedule

Click **Set Schedule** and choose when the flow runs — a predefined interval or your own.
Daily at 6:15 UTC is a reasonable choice for this pipeline.

![Screenshot - Set a schedule](/getting-started/automate/automate13.png)

If you share a stack with other projects, scheduling slightly off the hour avoids the busiest
moments. A flow can also be triggered when a table changes instead of on a clock — see
[Schedule and Automate](/flows/#schedule-and-automate).

## Get told when it breaks

An automated pipeline that fails silently is worse than a manual one. Open the flow's
**Notifications** tab, click **Edit Notifications**, and enter the email addresses (or a
webhook URL) that should hear about failures.

![Screenshot - Set up notifications](/getting-started/automate/automate15.png)

You can be told when the flow **finishes with an error**, when it finishes with a **warning**,
and when it takes significantly longer than its own average. Error notifications on every
scheduled production flow are the one setting nobody should skip — see
[Notifications](/management/notifications/).

There is a second, finer mechanism: a **Notification** task placed inside the flow, driven by
a [condition](/flows/#conditions) such as *if any task in the flow ended with an error*. That
is what you reach for when a single flow needs different alerts for different failures; the
Notifications tab is enough here.

## Check it worked

- The flow's run history shows one successful run with all three phases green.
- **Jobs** lists more entries than you might expect: a job per task (the load, the
  transformation, the delivery), a **Conditional Flows phase** job per phase, and the
  **Conditional Flows** job for the run itself. That is normal.
- The schedule is shown on the flow, with the next run time.

## If it goes wrong

- **The transformation fails inside the flow but works on its own.** Its phase is running
  before the load finishes — check that the connector sits in an *earlier* phase, not the same
  one.
- **Everything succeeds but the sheet is unchanged.** The destination ran before the
  transformation wrote its output, or its phase is missing entirely. Read the run detail top
  to bottom.
- **The scheduled run never happens.** The schedule was saved but the flow is disabled, or the
  project is out of runtime credits — Free Plan projects get up to 60 minutes a month, and
  while flow jobs themselves consume none, the component jobs they start do.
- **Jobs queue instead of running.** Too many parallel tasks in one phase; Storage jobs are
  typically capped at 10 in parallel. Split the phase.

:::tip[Or ask Kai]
Kai can build the flow for you and explain what it did:

> Create a flow that runs my `[TUTORIAL] Sample data` HTTP configuration, then the
> `Denormalize opportunities` transformation, then the Google Sheets destination.

Set the schedule and the notifications yourself afterwards — those are quick, and it is worth
seeing where they live.
:::

**Next:** [Where to go next →](/getting-started/next-steps/)
