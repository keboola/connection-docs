---
title: What are Keboola apps
slug: 'data-apps/what-are-apps'
description: Understand what Keboola apps are — Python/JS applications that run inside your project on governed data — and how they're hosted.
---

A Keboola app is an interactive application that runs inside your Keboola project, on top of your data. Use one to give people a way to *see* and *act on* data, not just move it.

## How apps fit into Keboola

Keboola has always handled the data pipeline — extracting, transforming, and loading your data. Apps add the layer on top: the interface your team or customers actually use. Because the app runs inside your project, it reaches your data through the same access controls you already manage.

This is the part that sets Keboola apps apart from general app builders: the app is governed by default. There's no separate database connection to configure, expose, or leak, and no dataset copied to an outside service — the app reads through the project's own access, server-side. It can only touch data the project can touch, and you control who can open it.

Keboola provisions and runs the app for you — there's no server to set up.

## What you can build

- **Dashboards** — track metrics, replace a BI seat for an internal view.
- **Internal tools** — forms, approvals, and workflows that read and write back to your data.
- **Data narratives** — scrollable, explained stories built from your data.
- **Anything interactive** — configurators, simulators, and more.
- **Agent-facing services** — an app can expose an API or an MCP server so other agents and services call it, not just human visitors (a Python/JS capability).

![A Keboola Python/JS app — a Shopify Store Monitor dashboard with KPI tiles, revenue and orders charts, and product/vendor tables — running on the project's governed data](/data-apps/app-dashboard.png)

## The stack: Python/JS

Keboola apps run on **Python/JS** — any Python web framework (Flask, FastAPI, Dash), a JavaScript frontend (React, Vue, plain JS), or both together. That's what Kai builds, and the path for all new apps. What that buys you:

- **Any framework, any UI.** Full control over look, layout, and interactivity — a polished, customer-facing product, not just an internal tool.
- **Full-stack.** A JavaScript/React frontend with a server-side backend (for example, an Express or FastAPI API) in one app.
- **Server-side data access.** Your Storage token stays on the server; the browser never sees it.
- **An API — or an MCP server.** Because there's a real backend, the app can serve other agents and services, not just human visitors.
- **Your Git workflow.** Develop in your own editor and Git account — production-grade, versioned development.

How development actually works — code, configuration, data access, deployment — is covered in [Build locally](/data-apps/build-locally/).

Have an existing **Streamlit** app? Streamlit remains supported; its documentation lives in the [Streamlit apps](/data-apps/streamlit/) section.

## Two ways to run an app

If the Kai builder and the live preview are missing from your app, its code lives in a repository you host. Those two features need a repository Keboola manages for the app. Everything else works the same either way, and here is what each path gives you. (A Streamlit app is the exception to all of this: it can run from inline code with no repository at all. See [Streamlit apps](/data-apps/streamlit/).)

**A Keboola-managed repository.** Keboola creates a private Git repository for the app on your stack, at `git.<stack>.keboola.com/keboola/app-<id>.git`. Kai commits to it, which is what makes the live preview, the drafts you refine before publishing, and **Modify with Kai** possible. You never touch Git yourself. This is the recommended path for most people, and the one [Build your first app with Kai](/data-apps/getting-started/) walks through. Kai isn't the only way in: `kbagent data-app create --use-managed-git-repo` provisions the same repository empty, `kbagent data-app git-credentials-create` gives you a token to push to it, and the code can come from you or from [an AI agent](/data-apps/build-with-an-agent/).

**Your own repository.** Point the app at a repository you host, on GitHub, GitLab, or any Git server, and Keboola clones it on every deploy. You develop wherever you like, with your own editor and review process, and with coding assistants such as Claude Code (see [Build an app with an AI agent](/data-apps/build-with-an-agent/)). The Kai builder and its live preview aren't part of this path; you push a change and click **Redeploy App**. Your repository has to follow a small layout contract so Keboola knows how to start it; the app-building skill's [reference](https://github.com/keboola/ai-kit/blob/main/plugins/dataapp-developer/skills/dataapp-development/references/python-js-apps.md) spells it out, and [Build locally](/data-apps/build-locally/) covers developing and syncing your own repository; deploying and running it from a terminal with `kbagent data-app` is on [Operate and update an app](/data-apps/operate/).

Which kind of repository an app uses is decided when the app is created. Everything after the code is the same on both paths: the same runtime, the same [authentication](/data-apps/authentication/) options, the same App URL, deploy, redeploy, sleep, and logs.

| | A Keboola-managed repository | Your own repository |
|---|---|---|
| Who writes the code | Kai, or you pushing to the managed repo | You, or your coding assistant |
| Kai builder, live preview, drafts | Yes | No |
| Changing the app | Tell Kai, preview the draft, publish | Push, then **Redeploy App** |
| Layout rules for the repo | Scaffolded for you when Kai builds the app; yours to meet if you push to it yourself | The `keboola-config/` contract is yours to meet |
| Best for | Dashboards, internal tools, getting something in front of people fast | Existing code, teams with a review process, custom stacks |

---

**Next:** [Build your first app with Kai →](/data-apps/getting-started/)
