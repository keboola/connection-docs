---
title: 'Getting Started with Keboola'
slug: 'getting-started'
description: "Build your first working data pipeline in Keboola: load data, join it with SQL, send the result to a spreadsheet, and put the whole thing on a schedule."
redirect_from:
  - /tutorial/
---

Keboola is a platform for moving data around and doing something useful to it on the way:
pull it out of the systems that hold it, reshape it, put the result where people need it, and
keep doing that on a schedule without anyone watching. This guide walks you through that
whole loop once, on sample data, in under an hour.

<!-- Tutorial-hub page: the arc index. Links every step and the optional deep-dives; carries no steps of its own. -->

By the end you will have a pipeline that is genuinely running. Not a demo — the same
mechanism a production project uses, just smaller.

## What you will build

| Phase | What happens | Keboola calls it |
|---|---|---|
| Load | four CSV files, fetched from a URL, become four tables | a **data source connector** |
| Transform | SQL joins them into one wide table | a **transformation** |
| Deliver | that table appears in a Google Sheet | a **data destination connector** |
| Automate | all of it runs daily, in order, and emails you if it breaks | a **flow** |

The data is a small sales pipeline: opportunities, the accounts they belong to, the users who
own them, and each user's seniority. The join produces the table someone would actually want
to look at — every opportunity with its account, its owner, and how likely it is to close.

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
project, and authorizing a Google account in step 4, since that is a consent screen in your own
Google account.

The clicking is written out in full and stays the primary path, because the later steps assume
you have seen where a configuration, a mapping and a phase live. Do it by hand once, then let Kai
do it after that.

Kai is in **Public Beta**. The button is visible to every user on a supported stack, but the
feature has to be switched on — an organization admin can do it from the chat screen or in
**Settings → Features**, or you can ask Keboola Support. There is also a monthly message
allowance, which matters on the Free Plan. See [Get started with Kai](/kai/getting-started/) for
both, and [use cases](/kai/use-cases/) for what else it does.

## The steps

1. **[Get a Project](/getting-started/project/)** — create or join one, learn what a project
   and a stack are, find your way around.
2. **[Load Your Data](/getting-started/load/)** — pull the four sample files into Storage with
   a connector, and understand buckets, tables and stages.
3. **[Transform Your Data](/getting-started/transform/)** — write the SQL that joins them,
   and see how input and output mapping keep your source data safe.
4. **[Send Your Data Somewhere](/getting-started/write/)** — push the result to a Google
   Sheet with a data destination connector.
5. **[Automate It with a Flow](/getting-started/automate/)** — run the whole thing in order,
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
