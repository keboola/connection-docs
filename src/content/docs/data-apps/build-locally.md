---
title: Build an app locally
slug: 'data-apps/build-locally'
description: Develop a Keboola app with your own tools and Git account, then sync it to your project.
---



Build an app in your own environment when you want full control over the code, your editor, and your Git workflow. Keboola still hosts and runs the app. This is the full-control path for [Python/JS apps](/data-apps/python-js/).

## Before you start

- A Keboola project.
- Your local development tools.
- Optionally, your own Git account if you want to manage the repository yourself.

## App structure

A Keboola app is a standard web app. The typical scaffold is:

- `src/App.tsx` — the frontend (React).
- `server/index.ts` — server-side API routes (Express).

All data-fetching logic — SQL queries and anything that uses your Storage token — belongs in the server-side routes.

```ts
// server/index.ts — example route (illustrative)
app.get("/api/rows", async (req, res) => {
  // Use the Keboola Storage client here, server-side only.
  // Never expose your Storage token to the browser.
});
```

:::caution
`KBC_TOKEN` is injected automatically and must stay server-side. Don't add it as a secret yourself, and never send it to the browser.
:::

<!-- VERIFY(Adam Vyborny): scaffold (React + Vite + Express), file paths, and the KBC_TOKEN guidance. Source: internal Devin answer grounded in keboola/ui SKILL.md. The current public page tells users to add #KBC_TOKEN as a secret — that is wrong (reserved, auto-injected, silently shadowed) and must be corrected here. -->

## Develop with an AI coding tool

You can build the app with an AI coding assistant (for example, Claude). Keboola provides a skill file that teaches the assistant the correct app structure and APIs.

<!-- TODO(human-review, Adam Vyborny): link the current ai-kit SKILL.md / the DataAppsAISkill resource and describe how to use it. -->

## Sync to your project

Develop locally, then sync the app to your Keboola project to run it.

<!-- TODO(human-review, Adam Vyborny / Roman Bracinik): document the actual local → project sync flow and the provisioned-Git / own-Git options. -->

## Access your data

Apps read Keboola data through Input Mapping, the Storage API, or Storage Access (real-time SQL via the Query Service). See [Reference → Data access](/data-apps/reference/#data-access) for environment variables, code patterns, and Storage Access setup.

## Next steps

- [Authentication](/data-apps/authentication/)
- [Reference](/data-apps/reference/) — environment variables and settings.
