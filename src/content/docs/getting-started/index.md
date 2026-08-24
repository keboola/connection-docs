---
title: 'Getting Started with Keboola'
slug: 'getting-started'
description: "Build your first working data pipeline in Keboola: load 10,000 octopus sightings, join them with SQL, deliver a spreadsheet, run it on a schedule, and ship a map app."
redirect_from:
  - /tutorial/
---

Somebody claims that an octopus has been recorded near almost every coastline on Earth. You have
the data to check — a century of ocean records — but it is spread across four files, none of
which answers alone. That is the situation this guide starts from, and swap octopuses for orders
or sensors and it is the ordinary one.

<!-- Tutorial-hub page: the arc index. Links every step and the optional deep-dives; carries no steps of its own. -->

The question the arc answers:

> **How close to your coast does an octopus live — and how deep down do they really go?**

You have 10,000 recorded octopus sightings from 1900 to 2026 — 201 species, each point with
coordinates and, for almost half of them, a depth. The sightings file alone can plot dots. What
it cannot tell you is *who* and *where* in any human sense: it names species by a numeric ID and
says nothing about oceans or depth zones, so the moment the question becomes "which octopus,
which ocean, how deep", the file stops answering. Three small lookup tables — species names,
depth zones, ocean basins — hold the missing halves, and joining them is the whole trick.

In under an hour you will have a table that answers all of it, delivered to a spreadsheet,
rebuilt every morning without you, and an interactive map where you type your own coordinates
and get the nearest recorded octopus — a working, scheduled pipeline with an app on top, not an
exercise. Most steps are one Kai prompt: copy it, watch it build, check the result; every step
also has the click-through version. Everything happens in the browser; nothing needs installing.

## What you will build

| Phase | What happens | Keboola calls it |
|---|---|---|
| Load | four CSV files, fetched from a URL, become four tables | a **data source connector** |
| Transform | SQL joins them into one wide table | a **transformation** |
| Deliver | that table appears in a Google Sheet | a **data destination connector** |
| Automate | all of it runs daily, in order, and emails you if it breaks | a **flow** |
| Answer | a map of every sighting, with a "how close to me?" field | a **data app** |

The joined table is the one someone would actually read: every sighting with its species by
name, the ocean basin it sits in, and the depth zone it came from — down to a dumbo octopus
recorded 4,838 meters below the surface. It is not a demo — this is the mechanism a production
project uses, just smaller.

## Before you start

- **A project.** [Step 1](/getting-started/project/) gets you one. The Free Plan covers this
  guide's work — the whole arc uses roughly six minutes of job runtime — as long as your project
  has runtime minutes available.
- **Basic SQL.** One `SELECT` with a couple of `JOIN`s. If you have never written SQL, the
  queries are given in full and you can paste them — in both Snowflake and BigQuery form,
  since which one you need depends on your project.
- **A Google account**, for the delivery step. If you would rather not connect one, skip step 4
  and build step 5's flow with two phases instead of three — loading and transforming on a
  schedule is a real pipeline, just one that keeps its result inside Keboola.

Nothing needs installing. Everything below happens in the browser.

:::note[New to the platform entirely?]
If you would rather understand the pieces before touching them, read the
[platform overview](/overview/) first — what the components are, how Storage is organized,
what a stack is. This guide explains each piece as it comes up, so you can also just start.
:::

## Two ways to do most steps

The building steps — load, transform, deliver, automate, and the app — can be done by asking
**Kai**, Keboola's built-in assistant, or by clicking through the UI yourself. Each of those
pages puts both paths side by side: steps 2 through 6 open with a **Do it with Kai** tab, and a
**Do it yourself** tab next to it.

Two things stay yours either way: creating the project in step 1, since Kai works *inside* a
project, and the Google authorization in step 4 — that consent screen is in your own account. On
step 4 the shared steps sit above the tabs, and the Kai tab picks up after them.

**Kai is the default path**: copy the prompt, watch it build, check the result. The clicking is
still written out in full for when you want to see the mechanics — where a configuration, a
mapping and a phase live — and it is worth doing by hand at least once. Each Kai block ends with
what to check, and what to do when Kai's version does not match — assume you will need that at
least once.

Building is only half of what Kai is for. Step 5 closes by pointing it at the table you just
built and asking it the question at the top of this page; step 6 then turns that answer into an
app anyone can open — with a field for your own coordinates, which is where the question stops
being rhetorical.

Kai asks before it changes anything: project-modifying actions raise an approval dialog in the
chat, so expect to confirm rather than watch it run unattended. Expect one prompt per object rather
than one per request — asking for step 2's whole configuration in a single sentence still raised
six: the configuration, each of its four rows, and running the job. Questions that only read do not
ask, because read-only tools are allowed by default. If the clicking gets tiring, click
**Always allow** in the dialog, or pre-approve what you trust in
[tool permissions](/kai/settings/#tool-permissions).
<!-- VERIFY(owner): the chat also surfaced a tip for a "plan mode" — "have Kai draft a plan you can
approve before any changes" — which would fit here, but nothing under kai/ documents it. Confirm
the name and document it on kai/, then it can replace the Always-allow advice above. -->

The **Kai Agent** button is visible to every user on a supported stack, but the
feature has to be switched on — an organization admin can do it from the chat screen or in
**Settings → Features**, or you can ask Keboola Support. There is also a monthly message
allowance, which matters on the Free Plan. See [Get started with Kai](/kai/getting-started/) for
both, and [use cases](/kai/use-cases/) for what else it does.

## The steps

1. **[Get a Project](/getting-started/project/)** — create or join one, learn what a project
   and a stack are, find your way around.
2. **[Get Your Data In](/getting-started/load/)** — pull the four sample files into Storage with
   a connector, and understand buckets, tables and stages. One Kai prompt, run included.
3. **[Transform Data](/getting-started/transform/)** — the SQL that turns species IDs into
   names and places every sighting in its ocean and depth zone. One Kai prompt builds and runs it.
4. **[Deliver the Answer](/getting-started/write/)** — push the result to a Google
   Sheet with a data destination connector. You authorize; one Kai prompt does the rest.
5. **[Run It on a Schedule](/getting-started/automate/)** — run the whole thing in order,
   on a schedule, with notifications. Kai wires the flow; the schedule is two clicks.
6. **[Build the App](/getting-started/app/)** — a map of every sighting with a
   "how close to me?" field, described to Kai in one sentence and published with one button.
7. **[Where to Go Next](/getting-started/next-steps/)** — what to learn next based on what
   you actually want to do, including how to drive Keboola from an AI assistant, an IDE, or
   your terminal.

Read them in order. Each step ends with a link to the next, and every page states what it
assumes so you can also land on one directly and catch up.

## Going further

Optional side trips, once the main path makes sense. None of them are needed to finish the
arc:

- **[Load from Google Sheets](/getting-started/load/googlesheets/)** and
  **[Load from a Database](/getting-started/load/database/)** — load from a source that needs
  credentials, rather than the public URL step 2 uses.
- **[Use a Workspace](/getting-started/transform/workspace/)** — develop and test SQL against
  a copy of your data before committing it to a transformation.
- **[Ad-Hoc Data Analysis](/getting-started/ad-hoc/)** — explore arbitrary data in a Python
  or R notebook rather than building a pipeline.
- **[Development Branches](/getting-started/branches/)** — change a running project safely,
  review the diff, then merge.

## If you are planning a rollout, not learning the tool

This guide is for one person building one pipeline. For introducing Keboola to a team —
project architecture, a data model, naming conventions, governance — start with
[Platform Onboarding](/overview/onboarding/) instead.

**Next:** [Get a project →](/getting-started/project/)
