---
title: Get a Project
slug: 'getting-started/project'
description: Create a Keboola project on the Free Plan, understand what a project and a stack are, and find your way around the project screen before you load any data.
---

Everything you do in Keboola happens inside a **project**. This page gets you into one.
Step 1 of the [Getting Started](/getting-started/) arc.

<!-- Tutorial-type page (step 1 of 6). The project-screen tour below was verified live in
project 264 on 2026-08-04: the nav reads Dashboard / Flows / Storage / Apps / Components /
Workspaces / Transformations / Data Catalog / Jobs, and Kai appears as
"Kai Agent" with a Beta pill. Free Plan limits are sourced from /management/payg-project/. The
sign-up wizard is deliberately NOT walked — creating accounts is out of scope for automated
verification — so those three lines rest on the Pay As You Go page. -->

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
   right now. It is enough for everything in this guide: 250 GB of Storage and up to 60
   minutes of job runtime a month (the free allowance tracks your previous month's usage).

   <!-- VERIFY(owner): /management/payg-project/ says the monthly allowance is "limited to the
   actual usage from the previous month" but never states what a project gets in its first month.
   Worth stating on that page. --> See [Pay As You Go](/management/payg-project/)
   for the full list of limits — including that the Free Plan does not let you choose a stack
   and gives you one project.
2. **Join an existing project** — ask an admin of your company's Keboola organization to
   invite you. They do it from **Users & Settings** in the project, with **Invite User**.
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
- **Transformations** — the code that reshapes your data: SQL, Python and R, plus dbt on
  paid plans.
- **Storage** — every table and file in the project, organized into buckets. Its tabs cover
  **Tables & Buckets**, **Files**, **Data Streams**, **Storage Jobs** and **Events**.
- **Flows** — the automation layer: what runs, in what order, on what schedule. Projects that
  have both kinds show this as **Conditional Flows**.
- **Jobs** — the log of everything that has run, successfully or not.

<!-- VERIFY(owner): "Kai cannot create a project" is an inference, not a documented limit — it
follows from Kai being project-scoped (kai/best-practices.md: "Kai only sees your current
project"), but no Kai page states it outright. Confirm there is no project-creation tool, and
consider stating the boundary on kai/index.md. -->

:::tip[Ask Kai to orient you]
This is the one step of the arc Kai cannot do for you — it lives *inside* a project, so there has
to be a project first. From here on, every step has a **Do it with Kai** block that replaces the
clicking.

Look for **Kai Agent**, marked *Beta*, in the top bar. It has to be enabled first and it is not on
every stack, so see [Get started with Kai](/kai/getting-started/) if you cannot find it. On a
project you inherit rather than create, the first question is usually
([Data Exploration](/kai/use-cases/#data-exploration)):

```text
I'm new to this project. Give me an overview of the data structure and what each bucket contains.
```
:::

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

**Next:** [Load your data →](/getting-started/load/)
