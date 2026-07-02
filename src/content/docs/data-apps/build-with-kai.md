---
title: Build an app with Kai
slug: 'data-apps/build-with-kai'
description: Describe the app you want in plain language and let Kai build, preview, and deploy it in your Keboola project.
---



Kai builds a working app from a plain-language description — no coding and no Git account needed. This is the fastest way to go from idea to a running app.

## Before you start

- A Keboola project with the data you want to use.
- Kai available in your project. <!-- TODO(human-review, Adam Vyborny): state the exact prerequisite. Building Python/JS apps requires the Kai-in-E2B backend enabled on the project; without it, Kai falls back to Streamlit. Give the real enablement step or link. -->

## Build the app

1. Open Kai in your project.
2. Describe what you want — the data to use, what the app should show, and how people will interact with it. Be specific about the source tables.
3. Let Kai build a first version. It appears in a live preview next to the chat.
4. Refine by chatting — ask for changes and watch the preview update.

:::tip
The clearer your first prompt, the better the first version. Name the tables, the audience, and the main action you want users to take.
:::

<!-- TODO(human-review, Adam Vyborny): verify the build/preview loop wording (split-screen preview, hot reload) and the exact UI labels. -->

## Move from draft to production

A draft is your working version with live preview. When you're happy with it, promote it to a production version that you can share.

<!-- TODO(human-review, Adam Vyborny / Pepa Martinec): document the draft → production flow precisely. This was called out internally as confusing; describe the actual steps and what changes (URL, hosting state). -->

## How Kai handles data access

Kai uses your data through the project's access controls. Read-only access is used by default, so the app can't change your data unless you ask for write-back.

<!-- TODO(human-review, Adam Vyborny): confirm "read-only by default" claim and how write-back is enabled. -->

## Use the app from another agent

Each app can expose an API (or an MCP server) so an external agent can call it. The data-fetching logic lives server-side, and your Storage token is never exposed to the browser.

<!-- VERIFY(Adam Vyborny): scaffold is React + Vite + Express — frontend in src/App.tsx, API routes in server/index.ts; never expose KBC_TOKEN to the browser (it's a reserved, auto-injected variable). Source: internal Devin answer grounded in keboola/ui SKILL.md. Confirm before publishing. -->

## Next steps

- [Authentication](/data-apps/authentication/) — control who can open the app.
- [Publish and share](/data-apps/publish-and-share/) — share it with your team.
- Prefer to code it yourself? See [Build locally](/data-apps/build-locally/).
