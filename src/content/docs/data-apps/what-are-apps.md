---
title: What are Keboola apps
slug: 'data-apps/what-are-apps'
description: Understand what Keboola apps are — Python/JS applications that run inside your project on governed data — and how they're hosted.
---



A Keboola app is an interactive application that runs inside your Keboola project, on top of your data. Use one to give people a way to *see* and *act on* data, not just move it.

## How apps fit into Keboola

Keboola has always handled the data pipeline — extracting, transforming, and loading your data. Apps add the layer on top: the interface your team or customers actually use. Because the app runs inside your project, it reaches your data through the same access controls you already manage.

This is the part that sets Keboola apps apart from general app builders: the app is governed by default. There's no separate database connection to configure, expose, or leak, and no dataset copied to an outside service — the app reads through the project's own access, server-side. It can only touch data the project can touch, and you control who can open it.

## What you can build

- **Dashboards** — track metrics, replace a BI seat for an internal view.
- **Internal tools** — forms, approvals, and workflows that read and write back to your data.
- **Data narratives** — scrollable, explained stories built from your data.
- **Anything interactive** — configurators, simulators, and more.

![A deployed Keboola app — a Website Analytics Dashboard with metric tiles and a sessions-by-device chart — running on the project's governed data](/data-apps/getting-started-live-app.png)

## The stack: Python/JS

Keboola apps run on **Python/JS** — any Python or JavaScript framework, giving you full control over the interface. That's what Kai builds, and the path for all new apps. How development actually works — code, configuration, data access, deployment — is covered in [Python/JS apps](/data-apps/python-js/).

Have an existing **Streamlit** app? Streamlit remains supported; its documentation lives in the [Streamlit apps](/data-apps/streamlit/) section.

<!-- TODO(human-review, Miro): verify the framework framing — Python/JS as the sole forward path for new apps. Do not state Streamlit is retired. -->

## How an app is hosted

Keboola provisions and runs the app for you — there's no server for you to set up.

<!-- TODO(human-review, Michal Jerabek / Pavel Synek): confirm the hosting model to state publicly. Live today = Operator (Keboola's Kubernetes). E2B is the proposed backend for Kai-generated JS apps and is NOT yet signed off. Do not document E2B as the hosting mechanism until confirmed. -->

## Where Kai fits

Kai can build, edit, and run apps for you. Throughout these docs, "build with Kai" is the recommended path for most users — it removes the low-level setup you'd otherwise do by hand. Developers who want full control can still build locally; see [Build locally](/data-apps/build-locally/).
