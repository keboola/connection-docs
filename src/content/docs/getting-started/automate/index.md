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

<!-- Tutorial-type page (step 5 of 6). Written against Conditional Flows (the current flow type; demo project 264 reports conditional_flows: true). Terminology sourced from /flows/. Screenshots pending live verification. -->

## What you need

Everything from the previous steps, in one project:

- the four CSV Import configurations from [Load Your Data](/getting-started/load/) — or the
  [Google Sheets](/getting-started/load/googlesheets/) and
  [database](/getting-started/load/database/) connectors, if you took those side trips,
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
three phases — extract, transform, deliver — because the transformation needs all four tables
before it can join them, and the sheet needs the joined table before it can deliver it.

Flows can also branch on what happened: retry a task, take a different path on failure, end
early. That is [conditions](/flows/#conditions), and you need none of it yet.

## Build the flow

1. Go to **Conditional Flows** and click **Create Flow**. Name it
   `[TUTORIAL] Opportunity pipeline`, add a description, and you land in the **Builder**.

   ![Screenshot - Create a flow](/getting-started/automate/automate1.png)

2. Use the plus icon (**+**) to add your first task and pick **Component**. Select the
   `[TUTORIAL] Opportunity` CSV Import configuration.

   ![Screenshot - Add the first component task](/getting-started/automate/automate2.png)

3. Add the other three CSV Import configurations **to the same phase** — they read four
   independent files, so there is no reason to wait for one before starting the next.

   ![Screenshot - Four tasks in one phase](/getting-started/automate/automate3.png)

4. Add a **new phase** and put the `Denormalize opportunities` transformation in it. Being in
   a later phase is what guarantees all four tables have landed before the SQL runs.

   ![Screenshot - The transformation in its own phase](/getting-started/automate/automate4.png)

5. Add a third phase holding the Google Sheets destination configuration.

   ![Screenshot - The destination phase](/getting-started/automate/automate5.png)

You now have three phases: four parallel loads, then the transformation, then the delivery.

![Screenshot - The finished flow](/getting-started/automate/automate10.png)

:::note[If you took the connector side trips]
If your data now comes from the Google Sheets and database connectors instead of CSV Import,
put both connectors in the first phase — and open the transformation's **input mapping** to
point at the tables those connectors produce, because their table names differ from
`in.c-csv-import.*`. A flow that runs the right components against the wrong input mapping
succeeds and produces nothing useful.

![Screenshot - Edit the input mapping](/getting-started/automate/automate12.png)
:::

## Run it

Run the flow once by hand before scheduling it. Every task creates its own job, so **Jobs**
tells you exactly which step failed if one does, and the flow's run detail shows the phases
completing in order.

## Set a schedule

Click **Set Schedule** and choose when the flow runs — a predefined interval or your own.
Daily at 6:15 UTC is a reasonable choice for this pipeline.

![Screenshot - Set a schedule](/getting-started/automate/automate13.png)

If you share a stack with other projects, scheduling slightly off the hour avoids the busiest
moments. A flow can also be triggered when a table changes instead of on a clock — see
[Schedule and Automate](/flows/#schedule-and-automate).

## Get told when it breaks

An automated pipeline that fails silently is worse than a manual one. Add a **Notification**
task with the plus icon (**+**) and enter the email addresses that should hear about
failures — or point it at a webhook.

![Screenshot - Set up notifications](/getting-started/automate/automate15.png)

For anything more selective than "tell me when it breaks", conditions let you branch on
status: *if any task in the flow ended with an error, send a notification*. See
[Notifications](/flows/#notifications).

## Check it worked

- The flow's run history shows one successful run with all three phases green.
- **Jobs** lists six jobs from that run: four loads, one transformation, one delivery.
- The schedule is shown on the flow, with the next run time.

## If it goes wrong

- **The transformation fails inside the flow but works on its own.** Its phase is running
  before the loads finish — check that the connectors sit in an *earlier* phase, not the same
  one.
- **Everything succeeds but the sheet is unchanged.** The destination ran before the
  transformation wrote its output, or its phase is missing entirely. Read the run detail top
  to bottom.
- **The scheduled run never happens.** The schedule was saved but the flow is disabled, or the
  project is out of runtime credits — Free Plan projects get 60 minutes a month, and while
  flow jobs themselves consume none, the component jobs they start do.
- **Jobs queue instead of running.** Too many parallel tasks in one phase; Storage jobs are
  typically capped at 10 in parallel. Split the phase.

:::tip[Or ask Kai]
Kai can build the flow for you and explain what it did:

> Create a flow that runs my four CSV Import configurations in parallel, then the
> `Denormalize opportunities` transformation, then the Google Sheets destination. Schedule it
> daily at 6:15 UTC.
:::

**Next:** [Where to go next →](/getting-started/next-steps/)
