---
title: 'Getting Started with Keboola'
slug: 'getting-started'
description: "Build your first working data pipeline in Keboola: load data, join it with SQL, send the result to a spreadsheet, and put the whole thing on a schedule."
redirect_from:
  - /tutorial/
---

Somebody asks a question about the business, and the answer is spread across four exports, none of
which holds the whole picture. That is the situation this guide starts from, and it is the
ordinary one.

<!-- Tutorial-hub page: the arc index. Links every step and the optional deep-dives; carries no steps of its own. -->

The question here is one any sales team asks:

> **Where is the money in this pipeline, and how much of what is still open is unlikely to land?**

You have a quarter of deals, the accounts they belong to, and the reps who own them — 639
opportunities created in Q1 2015, across 275 accounts and 28 people. The deals file alone tells
you how much is at stake and how likely each deal is to close. What it cannot tell you is *whose*
and *where*: it identifies owners and accounts by ID, so the moment the question becomes "which
reps, which regions", the export stops answering.

In under an hour you will have a table that answers all of it, delivered to a spreadsheet, rebuilt
every morning without you. Everything happens in the browser; nothing needs installing.

## What you will build

| Phase | What happens | Keboola calls it |
|---|---|---|
| Load | four CSV files, fetched from a URL, become four tables | a **data source connector** |
| Transform | SQL joins them into one wide table | a **transformation** |
| Deliver | that table appears in a Google Sheet | a **data destination connector** |
| Automate | all of it runs daily, in order, and emails you if it breaks | a **flow** |

The joined table is the one someone would actually read: every deal with its account and region,
the rep who owns it by name and market, and a plain-language verdict on how likely it is to close.
It is not a demo — this is the mechanism a production project uses, just smaller.

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

The building steps — load, transform, deliver, automate — can be done by clicking through the UI
or by asking **Kai**, Keboola's built-in assistant, to do them. Each of those pages carries a
**Do it with Kai** block with a copy-pasteable prompt, right next to the manual steps it replaces.

Two things stay yours either way: creating the project in step 1, since Kai works *inside* a
project, and the Google screens in step 4 — the authorization consent, and choosing a file in
Drive. On those pages the Kai block picks up after you are done.

The clicking is written out in full and stays the primary path, because the later steps assume
you have seen where a configuration, a mapping and a phase live. Do it by hand once, then let Kai
do it after that. Each block also ends with what to check, and what to do when Kai's version does
not match — assume you will need that at least once.

Building is only half of what Kai is for. Step 5 closes by pointing it at the table you just built
and asking it the question at the top of this page — the other reason to keep the panel open, and
the last thing you do in the arc.

Kai asks before it changes anything: project-modifying actions raise an approval dialog in the
chat, so expect to confirm rather than watch it run unattended.

Kai is in **Public Beta**. The button is visible to every user on a supported stack, but the
feature has to be switched on — an organization admin can do it from the chat screen or in
**Settings → Features**, or you can ask Keboola Support. There is also a monthly message
allowance, which matters on the Free Plan. See [Get started with Kai](/kai/getting-started/) for
both, and [use cases](/kai/use-cases/) for what else it does.

## The steps

1. **[Get a Project](/getting-started/project/)** — create or join one, learn what a project
   and a stack are, find your way around.
2. **[Get Your Data In](/getting-started/load/)** — pull the four sample files into Storage with
   a connector, and understand buckets, tables and stages.
3. **[Join It into an Answer](/getting-started/transform/)** — write the SQL that turns IDs into
   names and buckets every deal, and see how input and output mapping keep your source data safe.
4. **[Deliver the Answer](/getting-started/write/)** — push the result to a Google
   Sheet with a data destination connector.
5. **[Run It on a Schedule](/getting-started/automate/)** — run the whole thing in order,
   on a schedule, with notifications.
6. **[Where to Go Next](/getting-started/next-steps/)** — what to learn next based on what
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
