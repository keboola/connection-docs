---
title: Kai Pricing and Limits
slug: 'kai/pricing'
description: How Kai consumes PPU credits, where to track project spend, and how Organization Admins set project and per-user limits.
---


:::note[Kai becomes generally available on 15 September 2026]
Kai was free during beta, with a limit of 150 messages. From 15 September 2026 it
consumes PPU credits from your project power, and the message counter is replaced by
the limits described below.

Nothing changes in your contract, and no new line appears on your invoice. If you have
questions about what this means for your project's consumption, contact your Customer
Success Manager.
:::

Kai consumes **[PPU credits](/management/project/limits/#project-power--time-credits)**
(project power units), the same credits that run your
transformations, extractors, and data apps. Your contract rate applies to Kai exactly
as it applies to a transformation hour.

Organization Admins can [set up limits for your team](#setting-limits) to cap how much Kai can spend.

## How Kai is billed

Kai is billed for the work it does. Every time Kai finishes a reply, the PPU charge is
derived from what that reply actually cost to produce — the language model tokens it
consumed and the infrastructure it ran on.

A short question costs less than a full data app build, in the same way that a
five-minute query costs less than an hour of warehouse time.

You are not charged for opening the chat panel, for typing, or for a reply Kai
cannot finish.

### What one PPU buys

Typical costs for common pieces of work. Each figure covers the whole conversation —
every reply it took to get to the result — measured across Kai usage in mid-2026:

| Piece of work | Typical cost (PPU) | Per 1 PPU |
|---------------|--------------------|-----------|
| Build or modify a data app | 4.3 | 0.2 |
| Diagnose a failed job or pipeline | 1.4 | 0.7 |
| Answer an analytical question about your data | 1.2 | 0.8 |
| Debug and fix a broken transformation | 1.2 | 0.9 |
| Set up or check a data source | 1.0 | 1 |
| Trace data lineage | 0.9 | 1 |
| Get help understanding the platform | 0.8 | 1 |
| Write and run a SQL query | 0.4 | 3 |
| Explore project and storage structure | 0.4 | 3 |
| Create a SQL transformation | 0.3 | 3 |

The median conversation across all Kai traffic costs about **1.1 PPU**, and simple work —
writing a query, exploring a project, creating a transformation — runs three to four
conversations per PPU.

These are medians, not a price list. A longer or more involved run of the same piece of work
costs more, so treat the figures as indicative and expect your own numbers to vary.

## Tracking Kai project spend

### Kai Project Consumption

Kai spend appears in the
[Project Consumption dashboard](/management/telemetry/telemetry-dashboards/#project-consumption)
as its own **usage category**, next to your extractors, transformations, and data apps.
That is where you see what Kai actually costs, and how it trends over time. The dashboard
is available to everyone with access to the project.

### User Usage in Chat

At 80% of their limit, an indicator appears in the user's chat panel. A user
sees their own usage as a percentage of their own limit. They do not see PPU figures,
and they do not see other users' usage.

When a limit is reached, Kai stops and reports which limit applied, the user's own or
the project budget.

## Setting limits

Kai spend limits live in **Settings → Kai Agent → Kai spend limits** in the main
Keboola navigation.

[Organization Admins](/management/organization/#organization-admins) set up limits for
all users in the project, and can raise either limit at any time. Other users can open this
page and see which limits apply, but the fields are read-only for them.

![Kai spend limits in project settings](/kai/kai-spend-limits.png)

### Hierarchy of limits

The project budget is the outer boundary. Every user's limit sits inside it.

- **Project budget** — the most the whole project can spend in a month, shared across
  all users.
- **Per-user limit** — the most any one user can spend, and it can never exceed the
  project budget.

Kai stops for a user who hits their per-user limit. Kai stops for everyone once the
project budget runs out, even for users below their own limit. Kai tells you which limit
you reached.

:::note[Limits do not have to add up]
Ten users with a 10 PPU limit each under a 40 PPU project budget is a valid setup: the
budget is what the project can spend in total, not a sum of the individual limits.

Keboola only rejects a limit that can never be reached, such as a 20 PPU per-user limit
under a 10 PPU project budget.
:::

### Setting the project budget

To set the project budget:

1. Go to **Settings → Kai Agent** in the main Keboola navigation.
2. Open **Kai spend limits**.
3. Enter a value in **Monthly project budget**.

Usage counts from the start of each calendar month, and the budget resets with it.

### Setting per-user limits

The **default per-user limit** applies to everyone who does not have their own, and you
change it by entering a new value in that field.

In the user table, adjust individual limits for heavy users rather than lifting the
default for everyone, or set a limit to **0** to remove that user's access to Kai. Use
the reset button next to a limit to put that user back on the default.

![Per-user limits in the user table](/kai/kai-per-user-limit.png)
