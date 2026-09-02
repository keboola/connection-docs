---
title: Where to Go Next
slug: 'getting-started/next-steps'
description: You have a running pipeline — here is what to learn next depending on what you want to do, and how to drive Keboola from an AI assistant, an IDE, or your terminal.
---

You had a question: how close to your coast does an octopus live, and how deep down do they
really go. It is answered, and it stays answered — the pipeline rebuilds the sheet every morning
whether or not anyone thinks to ask again, and the map answers anyone who opens it. That is the
whole shape of working in Keboola; everything else is a variation on it.
Step 7, the last, of the [Getting Started](/getting-started/) arc.

<!-- Explanation-type page: a routing page, no steps of its own. Beta labels for the Kai button removed per Jordan 2026-08-21 (UI pill retires 2026-09-15); the kai/ section still carries Public Beta wording — schedule the same removal there. Agent surfaces per /kai/, /ai/mcp-server/, /cli/. -->

## What you built

| Step | What it does | Where it lives |
|---|---|---|
| HTTP configuration | brings raw data into the project | **Components** |
| SQL transformation | joins the raw tables into one table | **Transformations** |
| Google Sheets destination | delivers the result outside Keboola | **Components** |
| Flow | runs all of it, in order, on a schedule | **Flows** |
| Data app | the map anyone can open, with the "how close to me?" field | **Apps** |

Every job that ran is in **Jobs**, and every table it touched is in **Storage**.

## Next time: one prompt

You built this arc one step at a time so every result stayed checkable. Now that you have seen
the pieces, you no longer need five prompts — in a fresh project, the whole thing is one
request:

```text
Load the four CSVs from https://help.keboola.com/getting-started/ — occurrences.csv,
species.csv, depth_zones.csv and basins.csv — into Storage. Join them into one octopus_atlas
table with display names, depth zones and ocean basins. Deliver it to a Google Sheet, wire
loading, joining and delivering into a flow that runs daily, and build me a map app of all the
sightings with a nearest-sighting search by coordinates.
```

Kai will still ask you to approve what it creates, and the Google authorization stays yours —
but that is the entire difference between one sentence and this guide. Swap the file URLs for
your own data and the same sentence builds *your* pipeline instead.
<!-- VERIFY(owner): this consolidated prompt is the per-step prompts joined; it has not yet been
run end-to-end as one request. Run it in a scratch context during the re-walk and calibrate the
wording (approval count, whether Kai orders the phases correctly) before GA. Direction blessed by
Jordan on the 08-21 call ("technically all of this could be one prompt"). -->

## Pick your next thing

**"My real data is not a CSV file on a public URL."** Browse the
[data source connectors](/components/extractors/) — databases, APIs, cloud storage, ad
platforms, CRMs. They configure the same way the HTTP connector did, and drop into a flow the
same way. Two worked examples are in this guide already:
[Google Sheets](/getting-started/load/googlesheets/) and
[a database](/getting-started/load/database/).

**"My transformation needs to be more than one query."** [Transformations](/transformations/)
covers SQL, Python, R and dbt, code blocks and phases, shared code, and
[variables](/transformations/variables/). To develop against a copy of your data
interactively, use a [workspace](/getting-started/transform/workspace/).

**"I need to send data somewhere specific."** The
[data destination connectors](/components/writers/) cover databases, BI tools, and
storage — the Google Sheets one you used is the simplest of the family.

**"I do not want to break production while I experiment."**
[Development branches](/getting-started/branches/) let you change configurations, run them,
and review a diff before merging anything into production.

**"I want to explore data rather than build a pipeline."** Do
[ad-hoc analysis](/getting-started/ad-hoc/) in a Python or R workspace, or query Storage
directly from a [SQL workspace](/workspace/).

**"Other people need this data."** Publish it to the [Data Catalog](/catalog/) so other
projects in your organization can link it read-only instead of copying it.

**"It needs to be reliable."** Set up [notifications](/management/notifications/), read
[Jobs](/management/jobs/) when something fails, and follow the
[best practices cheat sheet](/overview/onboarding/cheat-sheet/) for naming and structure
before the project grows.

**"The connector I need does not exist."** Build it. The
[Component Quick Start](/extend/component/tutorial/) walks writing and packaging one, and
joining or creating a vendor comes with access to a development Keboola project to test it
in. Making it available to everyone else is a separate, approval-gated step:
[publishing](/extend/publish/).

**"I am rolling this out to a team."** Start with the
[platform onboarding](/overview/onboarding/) guides: a usage blueprint, project
architecture, a business data model, and governance.

## Drive Keboola with an agent

Everything you just did by clicking can be done by an AI assistant instead — the platform
exposes the same operations three ways, and which one you pick depends on where you work.

- **[Kai](/kai/)** — the assistant built into the project, and the one you have been using
  through this guide's **Do it with Kai** tabs. It already knows your configurations, table
  schemas, and job logs, so it is the fastest way to ask "why did this fail?" or "write me the
  transformation that joins these tables." No setup.
  [Use cases](/kai/use-cases/) covers what it does beyond the arc — dashboards, project
  documentation, table descriptions, cohort analysis.
- **[MCP server](/ai/mcp-server/)** — connect Keboola to an AI assistant or IDE that
  speaks the Model Context Protocol (Claude, Cursor, and others). Use this when you want
  your coding agent to read and change the project while you work on code.
- **[kbagent CLI](/cli/)** — Keboola from the terminal: projects, configurations, jobs,
  storage, and flows, scriptable, and usable by a coding agent that has a shell. In beta, so
  commands and output formats may still change. Start with
  [the CLI quickstart](/cli/getting-started/).

If you are documenting or automating your own work on top of Keboola, the
[API reference](https://developers.keboola.com/overview/api/) is the layer underneath all three.

## When you get stuck

- [Support](/management/support/) — the support form inside your project reaches us with
  the project context attached.
- [keboolastatus.com](https://keboolastatus.com/) — platform status, worth subscribing to.
- [changelog.keboola.com](https://changelog.keboola.com/) — what shipped recently.

**Back to:** [Getting Started →](/getting-started/)
