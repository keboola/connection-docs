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

<!-- Tutorial-type page (step 5 of 6). Walked live in project 264 on 2026-08-04: built and ran
[TUTORIAL] Opportunity pipeline (flow 01kz5yndzrc4zvkwch85qg4x28), created a schedule and read the
Notifications tab. Corrections found: phases are labelled "Phase 1/2/..." not "Step 1"; the + between
phases adds a PHASE, not a task; the Builder needs an explicit Save before Run flow is enabled;
scheduling is Schedules tab > Create Schedule > Set Up Schedule, NOT "Set Schedule" as /flows/ still
says; the Notifications tab edits in place with Success/Errors/Processing cards and has no "Edit
Notifications" button and no Warnings card, contrary to /management/notifications/. The third phase
(Google Sheets destination) is not yet in the screenshots — it needs an OAuth authorization the
owner has to create. -->

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

1. Open **Flows** in the navigation. In projects that have both kinds the section is titled
   **Conditional Flows**, which is what these screenshots show. Click **Create Flow**. Name it `[TUTORIAL] Opportunity pipeline`, add a description, and click
   **Create Flow** again in the dialog.

   ![Screenshot - Create a flow](/getting-started/automate/01-create-flow.png)

2. You land in the **Builder** on an empty canvas, with an **Add Task** menu already open:
   **Component**, **Notification**, **Variable** and **Build with Kai**. Choose **Component**.

   ![Screenshot - The Add Task menu](/getting-started/automate/02-add-task.png)

3. **Select Component** opens. It lists what the project has, with a configuration count each —
   pick **HTTP**, then the `[TUTORIAL] Sample data` configuration. It drops onto the canvas as a
   task inside a box labelled **Phase 1**.

   ![Screenshot - Select the component](/getting-started/automate/03-select-component.png)

4. Click the **+** below Phase 1. That is the control that starts a **new phase** — the plus
   between phases adds a phase, not a task to the one above it. Add the
   `Denormalize opportunities` transformation there. Being in a later phase is what guarantees
   the tables have landed before the SQL runs.

   ![Screenshot - A second phase](/getting-started/automate/04-second-phase.png)

5. Repeat for a third phase holding the Google Sheets destination configuration.

6. Click **Save**. The Builder keeps your changes as a draft until you do — **Save** and
   **Reset** only appear while there are unsaved changes, and **Run flow** stays disabled until
   you save.

You now have three phases: the load, then the transformation, then the delivery.

![Screenshot - The saved flow](/getting-started/automate/05-flow-saved.png)

*The capture above shows the first two phases; the delivery phase sits below them, off the bottom
of the frame.*

:::note[Clicking a task opens its settings]
Worth knowing early: selecting a task gives you **Edit Configuration**, **Run rows** (for
row-based components like your HTTP connector, so a flow can run a subset of rows), **Retry
After Failure**, **Delay Before Start** — and **Continue on Failure**, which reads *Handled via
Conditions*, because in Conditional Flows that behaviour comes from
[conditions](/flows/#conditions) rather than a toggle.
:::

:::note[If you took the connector side trips]
If you also added the Google Sheets or database connector, put them in the first phase
alongside the HTTP configuration — that is where the parallelism above becomes real. Then open
the transformation's **input mapping** and point it at the tables those connectors produce,
since they land in their own buckets. A flow that runs the right components against the wrong
input mapping succeeds and produces nothing useful.
:::

## Run it

Click **Run flow** and confirm with **Run**. A *Conditional Flows job has been scheduled*
notification appears with a **Show job** link, and while the run is in progress the header offers
**Terminate flow**.

Every task creates its own job, so **Jobs** tells you exactly which step failed if one does, and
the flow's own **All Runs** tab shows each run with its phases.

## Set a schedule

Open the flow's **Schedules** tab and click **Create Schedule**. Choose **Once a day** — that
matches the daily pipeline this guide set out to build. The other predefined intervals are **Every
15 minutes**, **Every hour**, **Once a week** and **End of month**, or set your own under **Set Your
Own** (every day/week/month, at an hour and minute you pick). Then click **Set Up Schedule**.

![Screenshot - Create a schedule](/getting-started/automate/06-create-schedule.png)

The schedule appears in the tab with a toggle, so you can pause it without deleting it, and the
tab shows a count. A flow can hold **several** schedules: they work independently, and the flow
runs whenever any of them fires. The schedule I set showed as `At 08:45, every day (UTC)`, so
check the timezone the list displays before relying on it.

![Screenshot - The schedule](/getting-started/automate/07-schedule-set.png)

If you share a stack with other projects, scheduling slightly off the hour avoids the busiest
moments. A schedule can also be driven by a table changing rather than a clock — see
[Schedule and Automate](/flows/#schedule-and-automate).

## Get told when it breaks

An automated pipeline that fails silently is worse than a manual one. Open the flow's
**Notifications** tab — there is nothing to click into, you edit it in place. Three cards:

| Card | Fires when |
|---|---|
| **Success** | the flow finishes successfully |
| **Errors** | the flow finishes with an error |
| **Processing** | the job runs longer than usual, by a percentage you set |

Each takes **Email** addresses (pick colleagues or type any address) or a **Webhook** URL. Fill
in **Errors** at minimum — on a scheduled production flow that is the one setting nobody should
skip.

![Screenshot - Notifications](/getting-started/automate/08-notifications.png)

There is a second, finer mechanism: a **Notification** task placed inside the flow, driven by a
[condition](/flows/#conditions) such as *if any task in the flow ended with an error*. That is
what you reach for when one flow needs different alerts for different failures; these three cards
are enough here.

## Check it worked

The flow's **All Runs** tab is the place to look: a duration chart over time, then a table of
runs with who or what started them — your name for a manual run, *scheduled run* for the
schedule — plus duration and status. Expand a run to see its phases.

![Screenshot - All runs](/getting-started/automate/09-all-runs.png)

- One run with status **Success**. End to end this pipeline takes around three minutes, most of
  it the four HTTP fetches.
- **Jobs** lists more entries than you might expect: a job per task, a **Conditional Flows
  phase** job per phase, and the **Conditional Flows** job for the run itself. That is normal.
- The **Schedules** tab shows a count, and the schedule can be toggled off without deleting it.

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

The Builder has Kai built in for exactly this: **Build with Kai** sits in the **Add Task** menu on
an empty canvas, and **Modify with Kai** is in the flow's header once it has tasks. Set the
schedule and the notifications yourself afterwards — those are quick, and it is worth seeing where
they live.
:::

**Next:** [Where to go next →](/getting-started/next-steps/)
