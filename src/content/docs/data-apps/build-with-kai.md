---
title: Build an app with Kai
slug: 'data-apps/build-with-kai'
description: Describe the app you want in plain language and let Kai build, preview, and deploy it in your Keboola project.
---



Kai builds a working app from a plain-language description — no coding and no Git account needed. From one chat it reads your data, plans the app, shows you the configuration to approve, and deploys it to a live URL. This is the fastest way to go from idea to a running app.

This page is the full guide to building with Kai — how the loop works, how to prompt and refine, and how Kai touches your data. If you'd rather just follow one build end to end with screenshots, start with the quick [Getting started](/data-apps/getting-started/) walkthrough and come back here for the detail.

## Before you start

- A Keboola project with the data you want to use — Kai reads it directly, so whatever is already in **Storage** works.
- Kai available in your project. <!-- TODO(human-review, Adam Vyborny): state the exact prerequisite. Building Python/JS apps requires the Kai-in-E2B backend enabled on the project; without it, Kai falls back to Streamlit. Give the real enablement step or link. -->

:::tip
Build in a **development branch** so your experiments stay isolated from production until you're ready.
:::

## How building with Kai works

From a single prompt, Kai runs the whole loop — explore, plan, confirm, deploy:

1. **Start a build.** Open Kai in your project, or go to **Apps → + Create App**, which leads with a Kai prompt.
2. **Describe what you want** in plain language — name the source tables, what the app should show, and the main thing people should be able to do.
3. **Kai explores your Storage and proposes a plan.** On its own it lists buckets and reads table details, tells you what it found, and describes the app it will build — before creating anything.
4. **Review and approve.** Kai shows the exact configuration — name, description, packages, and authentication type — and asks you to **Approve** (or Decline) before it makes any change to your project.
5. **Kai deploys the app** and gives you the live URL. Keep chatting to refine it.

![Kai's chat exploring the project's Storage — listing buckets, reading table details — then proposing a dashboard plan](/data-apps/getting-started-kai-build.png)

<!-- VERIFY(Adam Vyborny): steps 1–5 reflect an observed Kai-built Streamlit run (explore → plan → Approve card → deploy). Confirm the exact UI labels and whether a live split-screen preview / hot-reload loop applies to the Python/JS (E2B) path. -->

### Writing a good prompt

The clearer your first prompt, the closer Kai's first version lands. Name three things: **the data**, **the audience**, and **the main action** you want people to take. For example:

> Build a simple dashboard from my Storage data: a title, three key metrics as big number tiles, and one bar chart. Keep it clean and easy to read.

The more specific you are — which tables, which charts, who it's for — the less you'll need to refine afterward.

### Refining your app

Kai's first version is a starting point, not the final word. Keep chatting to change it — ask for a different chart, another metric, a new filter, a cleaner layout — and Kai updates the app. Refine in as many rounds as you need before you share it.

### What Kai does on its own — and what it asks first

Kai explores your Storage without asking, so it can find the right tables and understand your data. But it never changes your project silently: before it creates or modifies an app it shows you the exact configuration and waits for your **Approve**. You stay in control of every change that touches the project.

![Kai's confirmation step: the generated app configuration — name, packages, and authentication type — with Approve, Decline, and Always allow buttons](/data-apps/getting-started-approve.png)

## Move from draft to production

A draft is your working version with live preview. When you're happy with it, promote it to a production version that you can share.

<!-- TODO(human-review, Adam Vyborny / Pepa Martinec): document the draft → production flow precisely. This was called out internally as confusing; describe the actual steps and what changes (URL, hosting state). -->

## How Kai handles data access

Kai uses your data through the project's access controls — the app can only reach data the project can reach. Read-only access is used by default, so the app can't change your data unless you ask for write-back.

<!-- TODO(human-review, Adam Vyborny): confirm "read-only by default" claim and how write-back is enabled. -->

## Expose the app to other agents

An app you build with Kai can expose an API — or an MCP server — so another agent or service can call it, not just human visitors. The data-fetching logic stays server-side and your Storage token is never exposed to the browser. This is a Python/JS-app capability; for the scaffold and how to wire it up, see [Python/JS apps](/data-apps/python-js/).

## Next steps

- [Authentication](/data-apps/authentication/) — control who can open the app.
- [Publish and share](/data-apps/publish-and-share/) — share it with your team.
- [Beyond dashboards](/data-apps/examples/) — see the range of what people build with Kai.
- Prefer to code it yourself? See [Build locally](/data-apps/build-locally/).
