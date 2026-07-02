---
title: Python/JS Apps
slug: 'data-apps/python-js'
description: The powerful, flexible way to build Keboola apps — any Python or JavaScript framework, full control over the interface, and a server-side backend that can even expose an API for agents.
---



Python/JS apps are the **full-control** way to build on Keboola. Where Streamlit gives you a quick, ready-made Python environment, Python/JS apps let you **bring your own code** — any Python web framework (Flask, FastAPI, Dash), a JavaScript frontend (React, Vue, plain JS), or both together. You build the experience; Keboola handles the hosting, access control, and data connectivity.

## Why choose Python/JS

- **Any framework, any UI.** Full control over look, layout, and interactivity — not limited to a widget set. Build a polished, customer-facing product, not just an internal tool.
- **Full-stack.** A JavaScript/React frontend with a server-side backend (for example, an Express or FastAPI API) in one app.
- **Server-side data access.** Your Storage token stays on the server; the browser never sees it. Query Keboola Storage (via the Query Service / Storage API) from your backend and shape exactly the data your UI needs.
- **Expose an API — or an MCP server.** Because there's a real backend, the app can expose an API (or an MCP server) so another agent or service can call it, not just human visitors.
- **Your Git workflow.** Develop in your own editor and Git account and sync the app to your project — production-grade, versioned development.

<!-- VERIFY(Adam Vyborny): the typical scaffold is React + Vite + Express (frontend in src/App.tsx, API routes in server/index.ts); KBC_TOKEN is reserved/auto-injected and must stay server-side. Confirm the scaffold, the API/MCP exposure story, and the "never expose KBC_TOKEN to the browser" guidance before publishing. Source: internal Devin answer grounded in keboola/ui SKILL.md. -->

## Python/JS or Streamlit?

- Reach for **Python/JS** when you want a rich or customer-facing app, a custom frontend, a backend/API, or full control. See below to start building.
- Reach for **[Streamlit](/data-apps/streamlit/)** when you want the fastest path for a simple internal data tool in pure Python.

For the bigger picture of how apps fit into Keboola, see [What are Keboola apps](/data-apps/what-are-apps/).

## How a Python/JS app runs

Keboola clones your repository, installs dependencies, starts your app using the process configuration you provide, and serves it behind a secure URL through an internal web server. You don't manage servers, ports, or Docker — only your code and a small configuration folder.

<!-- VERIFY(Adam Vyborny / Michal Jerabek): confirm the runtime/hosting model to state publicly (Operator is live today; E2B is pending sign-off — do not assert E2B as the hosting mechanism). -->

## Build a Python/JS app

You can build one three ways:

- **[Build with Kai](/data-apps/build-with-kai/)** — describe it and let Kai generate the app. The fastest path. (Building Python/JS with Kai requires the Kai-in-E2B backend on your project; without it, Kai builds Streamlit. <!-- VERIFY(Adam Vyborny): confirm the exact prerequisite/enablement. -->)
- **[Build in the UI](/data-apps/build-in-the-ui/)** — create the app from the interface and point it at a Git repository that contains your code and configuration.
- **[Build locally](/data-apps/build-locally/)** — develop with your own tools and Git account, then sync to your project. The home of full-control development.

## Reference

Environment variables, the app scaffold, backend versions, and limits live in the [Apps reference](/data-apps/reference/).
