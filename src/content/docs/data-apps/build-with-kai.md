---
title: Build an app with Kai
slug: 'data-apps/build-with-kai'
description: Describe the app you want in plain language and let Kai build, preview, and deploy it — or create and configure the app manually on the same Create App screen.
redirect_from:
  - /data-apps/build-in-the-ui/
---



Kai builds a working app from a plain-language description — no coding and no Git account needed. From one chat it reads your data, plans the app, shows you the configuration to approve, and deploys it to a live URL. This is the fastest way to go from idea to a running app.

This page is the full guide to building in the platform — the Kai loop, how to prompt and refine, how Kai touches your data, and the [manual creation path](#create-an-app-manually) that lives on the same **Create App** screen. If you'd rather just follow one build end to end with screenshots, start with the quick [Getting started](/data-apps/getting-started/) walkthrough and come back here for the detail.

## Before you start

- A Keboola project with the data you want to use — Kai reads it directly, so whatever is already in **Storage** works.
- Kai available in your project. <!-- TODO(human-review, Adam Vyborny): state the exact prerequisite. Building Python/JS apps requires the new Kai backend enabled on the project. Give the real enablement step or link. -->

:::tip
Build in a **development branch** so your experiments stay isolated from production until you're ready.
:::

## How building with Kai works

From a single prompt, Kai runs the whole loop — explore, plan, confirm, deploy:

1. **Start a build.** Open Kai in your project, or go to **Apps → + Create App**, which leads with a Kai prompt.
2. **Describe what you want** in plain language — name the source tables, what the app should show, and the main thing people should be able to do.
3. **Kai explores your Storage and proposes a plan.** On its own it lists buckets and reads table details, tells you what it found, and describes the app it will build — before creating anything.
4. **Review and approve.** Kai shows the exact configuration — name, description, packages, and authentication type — and asks you to **Approve** (or Decline) before it makes any change to your project. (If you've set tools to **Always allow** in [Kai's Tool Permissions](/kai/settings/#tool-permissions), pre-approved steps run without asking.)
5. **Kai deploys the app** and gives you the live URL. Keep chatting to refine it.

![Kai's chat exploring the project's Storage — listing buckets, reading table details — then proposing a dashboard plan](/data-apps/getting-started-kai-build.png)

<!-- VERIFY(Adam Vyborny): confirm the exact UI labels for the Python/JS (new backend) build loop, incl. whether a live split-screen preview / hot-reload applies. Screenshots being re-shot on the new backend. -->

### Writing a good prompt

The clearer your first prompt, the closer Kai's first version lands. Name three things: **the data**, **the audience**, and **the main action** you want people to take. For example:

> Build a simple dashboard from my Storage data: a title, three key metrics as big number tiles, and one bar chart. Keep it clean and easy to read.

The more specific you are — which tables, which charts, who it's for — the less you'll need to refine afterward.

### Refining your app

Kai's first version is a starting point, not the final word. Keep chatting to change it — ask for a different chart, another metric, a new filter, a cleaner layout — and Kai updates the app. Refine in as many rounds as you need before you share it.

### What Kai does on its own — and what it asks first

Kai explores your Storage without asking, so it can find the right tables and understand your data. But it never changes your project silently: before it creates or modifies an app it shows you the exact configuration and waits for your **Approve** — unless you've pre-approved that tool with **Always allow**. You stay in control of every change that touches the project.

![Kai's confirmation step: the generated app configuration — name, packages, and authentication type — with Approve, Decline, and Always allow buttons](/data-apps/getting-started-approve.png)

## Create an app manually

Prefer to set the app up yourself, without the chat? Manual creation lives on the same **Create App** screen, under **or create manually** — pick a stack and Keboola sets the app up for you to configure.

![The Create App screen: the Kai prompt at the top and, under "or create manually", the stack choice cards](/data-apps/build-in-ui-create.png)

1. In your Keboola project, open **Apps** and click **+ Create App**.
2. Under **or create manually**, choose a stack — **Python / JS** (custom apps, production UIs; connect a Git repository) or **Streamlit** (existing Streamlit apps; basic Python).
3. Name the app and click **Create App**. It opens on its own configuration page, marked **Not Deployed**.
4. Set the **Code Source** — paste inline **Code** or connect a **Git Repository** — and pick the **Authentication** method.
5. Configure the rest of the app's settings — backend size, auto-sleep, and more; see [Reference](/data-apps/reference/) for the full list.

![The app's configuration page: the Overview tab with Authentication and Code Source (Git Repository or Code), plus the App Info panel showing backend version, size, auto-sleep, and App ID](/data-apps/build-in-ui-config.png)

6. Click **Deploy App**. A short wizard asks for the **backend size** and an **inactivity timeout**, then deploys the app. (The same wizard runs on **Redeploy**.)

![The deploy/redeploy wizard: backend size and inactivity timeout](/data-apps/deploy-timeout-backedsize.png)

7. When the status turns **Active**, click **Open App** to open it at its public URL. Use **Redeploy** to apply any later config change; see [App actions](/data-apps/reference/#app-actions).

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
- [Beyond dashboards](/data-apps/#beyond-dashboards) — see the range of what people build with Kai.
- Prefer to code it yourself? See [Build locally](/data-apps/build-locally/).
