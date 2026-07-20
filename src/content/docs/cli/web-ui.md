---
title: kbagent Web UI
slug: 'cli/web-ui'
sidebar:
  label: Web UI
description: 'Run the optional kbagent Web UI — a local browser dashboard for your Keboola projects: browse configurations, monitor jobs, search, and jump into workspaces, served by kbagent serve --ui.'
---



Prefer clicking to typing? [kbagent](/cli/) ships an optional **Web UI** — a local browser dashboard over the same projects and data the CLI manages. It runs on your machine, talks only to your Keboola stacks, and boots already authenticated from your kbagent config.

## Start it

The Web UI needs the server extras. Install (or reinstall) kbagent with them, then serve:

```bash
uv tool install --force --with 'keboola-cli[server]' 'git+https://github.com/keboola/cli'
kbagent serve --ui
```

kbagent prints the local URL (default `http://127.0.0.1:8001/`) — open it in your browser. The browser is authenticated via an HttpOnly cookie — no token in the URL or the page. The server is **localhost-only** by default.

<!-- Verified 2026-07-13: `kbagent serve --ui` (v0.66.0) serves the bundled React SPA against the connected project; screenshots below are project 264 (dummy Shopify data). -->

## Dashboard

The home screen summarizes the active project — connected projects, agent tasks, Doctor issues, recent jobs — with an "ask the local AI" box and suggested next steps. That AI box makes this a local AI dashboard over everything kbagent can see: ask about your projects right there, no browser tab to Keboola needed. The left rail groups everything the CLI can do: **Manage** (projects, branches, doctor), **Browse** (configs, components, storage, jobs, search), **Develop** (SQL workspaces, flows, schedules, data apps), **Insights** (lineage, semantic layer), and **AI / Tools**.

![The kbagent Web UI dashboard for project docs-demo: summary tiles (projects connected, agent tasks, Doctor issues, recent jobs), an ask-the-AI box, scheduled agents, and suggested next steps, with the full left navigation](/cli/webui-dashboard.png)

## Browse configurations

**Configs** lists every component configuration in the project, filterable by name, ID, or component — the same data as `kbagent config list`, in a table you can scan and click into.

![The Configurations screen: a filterable table of component configs in docs-demo with component, config ID, name, and last-modified columns](/cli/webui-configs.png)

## Monitor jobs

**Jobs** shows recent Queue jobs with status badges, auto-refreshing, and filters for success / error / processing / warning — the visual counterpart to `kbagent job list`.

![The Jobs screen: recent jobs in docs-demo with green success badges, component, created time, and duration, plus status filter buttons](/cli/webui-jobs.png)

## When to use it

The Web UI is handy for browsing and monitoring at a glance. For scripting, multi-project operations, GitOps sync, and handing work to an AI agent, use the [command line](/cli/commands/) — the two share the same kbagent config, so you can switch freely.

---

That's the tour. Jump back to the [CLI overview](/cli/) or dive into a [how-to guide](/cli/workflows/).
