---
title: 'Build It in One Prompt'
slug: 'getting-started/one-prompt'
description: 'Hand Kai the whole pipeline in one sentence: load four CSVs, join them, schedule the flow, and get a map app — then check what it built.'
---

You have a project and a question. This page hands both to Kai in a single prompt and lets it
build the entire pipeline — the loading, the SQL, the daily schedule, and a map app — while you
watch. Step 2 of the [Getting Started](/getting-started/) arc.

<!-- Tutorial page, NEW in the one-prompt rework. The prompt below and every number on this page
come from a live run in demo project 264 on 2026-09-02: 14 minutes wall clock, 11 approvals,
oneprompt_atlas at 10,000 rows with display_name / depth_zone / basin, flow "[ONEPROMPT] Octopus
pipeline" scheduled 06:00 UTC, app "[ONEPROMPT] Octopus map" rendering in the draft preview.
Transcript kept in the PR. -->

## What you need

- A project — [Get a Project](/getting-started/project/) gets you one.
- Nothing else. No installs, no credentials, no files to download.

## The prompt

Open **Kai Agent** in the top bar and paste this:

```text
Load the four CSVs from https://help.keboola.com/getting-started/ — occurrences.csv,
species.csv, depth_zones.csv and basins.csv — into Storage as a single HTTP data source
configuration called "Octopus sightings". Then join them into one table called
octopus_atlas that has, for every sighting, its species display name, its ocean basin and its
depth zone. Wire the loading and the joining into a flow called "Octopus pipeline"
that runs every day at 6am UTC. Finally build me a data app called "Octopus map" — a
world map of every sighting coloured by depth zone, with a field where I type my own latitude
and longitude and it tells me the nearest recorded sighting.
```

That is one sentence per thing you want, in the order you want it. Nothing in it names a
component, a bucket, or a SQL dialect — Kai picks those.

## What happens next

Kai works for **ten to fifteen minutes** and asks you to **approve** each change it makes to the
project. In our run it asked eleven times. The dialog offers **Approve**, **Decline** and
**Always allow**; approving one at a time is the point the first time round, because each dialog
shows you the exact configuration it is about to write.

It moves through the request in order:

1. **Reads the files first.** Before configuring anything it fetches the CSVs and looks at their
   headers, so the columns it joins on are the real ones.
2. **Builds the data source.** One HTTP configuration with four rows — one per file — and a
   `skip-lines` processor, because the files carry a header row.
3. **Writes the SQL.** A Snowflake transformation joining the sightings to all three lookup
   tables, with the output table declared in its output mapping.
4. **Assembles the flow.** Loading in the first phase, joining in the second, so the tables have
   landed before the SQL runs — plus the schedule you asked for.
5. **Writes an actual app.** Not a template: it edits `package.json`, writes the frontend,
   installs the dependencies, type-checks the code, commits it to the app's git branch, waits for
   the container, and only then shows you the live preview.

:::tip[Watch the plan, not the keystrokes]
Kai states what it is about to do before it does it. If a step looks wrong — the wrong table, the
wrong schedule — **Decline** and say what you wanted instead. It is a conversation, not a batch
job.
:::

## What it cannot do for you

One thing in this guide is yours alone: **authorizing Google**. If you also want the table
delivered to a spreadsheet, Kai can create and configure the
[Google Sheets destination](/components/writers/storage/google-sheets/), but the consent screen
lives in your own Google account, so you sign in yourself and hand the conversation back. That is
why the prompt above stops at the app — see
[Deliver the Answer](/getting-started/write/) for the spreadsheet step.

## Check it worked

Kai finishes with a summary of what it made. Verify it yourself — the next page,
[What Kai Built](/getting-started/what-kai-built/), walks every artifact and the numbers each one
should show.

The short version: `octopus_atlas` should hold **10,000 rows** — the same count as the raw
sightings table, which is the quickest proof that the joins matched every row without duplicating
any.

**Next:** [What Kai built →](/getting-started/what-kai-built/)
