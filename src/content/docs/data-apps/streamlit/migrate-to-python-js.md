---
title: Migrate a Streamlit app to Python/JS
slug: 'data-apps/streamlit/migrate-to-python-js'
description: 'Move an existing Streamlit app to the Python/JS stack with Kai — one click starts a guided migration that rebuilds the UI in React and moves queries server-side, leaving the original untouched until you publish.'
---



New Keboola apps run on [Python/JS](/data-apps/what-are-apps/#the-stack-pythonjs). If you have an existing **Streamlit** app, Kai can migrate it for you — it rebuilds the same dashboard as a Python/JS app (React UI, server-side data access) while leaving your original Streamlit app untouched until you're ready to switch.

<!-- Flow verified live in project 264 (Kai Agent), 2026-07-14: the "Migrate to Python/JS with Kai" button + Kai migration plan + build → draft preview. -->

## Before you start

- An existing Streamlit app in your project.
- **Kai** available in the project.

## Step 1 — Start the migration

Open your Streamlit app and click **Migrate to Python/JS with Kai** in the header. Kai reviews the app (its KPIs, filters, charts, and tables) and proposes a migration plan.

![A Streamlit app's detail page (Backend: Streamlit) with the "Migrate to Python/JS with Kai" button, next to Kai's migration plan and a "Ready to start the migration? — Yes, build it" card](/data-apps/streamlit/migrate-with-kai.png)

The plan is consistent: **create a new Python/JS app** (your Streamlit app stays untouched), rebuild the UI in **React** (metric tiles, charts, styled tables), move the SQL to **server-side API routes**, and add the filters as UI controls. Click **Yes, build it**.

## Step 2 — Kai builds the migrated app

Kai scaffolds the new app, ports each section, and opens the split-screen builder with a **live preview** — the same dashboard, rebuilt on the new stack. It keeps every section from the original (KPI tiles, time-range filter, charts, tables).

![The split-screen builder showing the migrated Python/JS dashboard in preview — KPI tiles, revenue and orders charts, top-products and vendor tables — with a Publish to Production button](/data-apps/streamlit/migrate-result.png)

Refine anything in chat, exactly as with [any Kai build](/data-apps/getting-started/).

## Step 3 — Publish and retire the old app

When the migrated app looks right, click **Publish to Production**. Once you're confident in it over a run or two, you can delete the original Streamlit app from the **Apps** list if you no longer need it.

<!-- TODO(human-review, Adam Vyborny): confirm whether the migration creates a separate new app or a new version of the same app, and the exact retire/delete step for the old Streamlit config. -->

---

**Next:** back to [Streamlit apps](/data-apps/streamlit/) or the [Apps overview](/data-apps/).
