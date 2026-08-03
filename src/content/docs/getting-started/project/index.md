---
title: Get a Project
slug: 'getting-started/project'
description: Create a Keboola project on the Free Plan, understand what a project and a stack are, and find your way around the project screen before you load any data.
---

Everything you do in Keboola happens inside a **project**. This page gets you into one.

## What you need

Nothing except an email address. If your company already uses Keboola, ask a colleague
to invite you instead of creating your own project — you probably want to work in theirs.

## What a project is

A project is a self-contained workspace: its own data storage, its own configurations,
its own users, and its own billing. Nothing leaks between projects unless you deliberately
share it through the [Data Catalog](/catalog/).

Most of what you see in this guide — buckets, connectors, transformations, flows — lives
inside one project. Larger organizations run several of them; see
[Multi-Project Architecture](/overview/onboarding/architecture-guide/) when you get there.

## Get a project

You have three ways in, in order of how quickly they get you started:

1. **Free Plan** — [sign up and create a free project](https://connection.us-east4.gcp.keboola.com/wizard)
   right now. It is enough for everything in this guide: 250 GB of Storage and 60 minutes
   of job runtime per month. See [Pay As You Go](/management/payg-project/) for the full
   list of limits.
2. **Join an existing project** — ask an admin of your company's Keboola organization to
   invite you. They add you under **Users** in the project settings.
3. **Talk to us** — for a trial of a full project with a chosen stack and no Free Plan
   limits, [contact Keboola](https://www.keboola.com/contact).

## Pick a stack

A **stack** is a full, independent instance of Keboola in one cloud provider and one
region — for example `connection.eu-central-1.keboola.com` (AWS Frankfurt). Projects
never span stacks, and an account on one stack does not exist on another, so the URL you
sign in at is part of your project's identity.

Free Plan projects are created on a fixed stack; paid projects choose one. The list of
available stacks is in the [platform overview](/overview/#stacks).

## Find your way around

After signing in you land on the project dashboard. Five places matter for this guide:

- **Components** — every data source connector, data destination connector, and
  application you can add to the project. This is where you configure how data gets in and out.
- **Transformations** — the SQL, Python, R and dbt code that reshapes your data.
- **Storage** — every table and file in the project, organized into buckets.
- **Flows** — the automation layer: what runs, in what order, on what schedule.
- **Jobs** — the log of everything that has run, successfully or not.

## Check it worked

You are ready for the next step when you can open **Storage** and see the project's bucket
list — empty is fine, that is what you are about to change.

## If it goes wrong

- **The sign-up email never arrives.** Check spam, then try again — a half-finished
  registration does not block a retry with the same address.
- **You sign in and see no project.** You are signed into the wrong stack, or your invite
  is still pending. Confirm the exact URL with whoever invited you.
- **Your company uses SSO.** Sign in through your organization's link rather than creating
  a new account; a fresh Free Plan project will not have access to your team's data.

:::tip[Or ask Kai]
Once you are in a project, Keboola's built-in assistant can orient you. Open **Kai** from
the project navigation and ask:

> What is in this project? Summarize the buckets, configurations and flows it contains.
:::

**Next →** [Load Your Data](/getting-started/load/)
