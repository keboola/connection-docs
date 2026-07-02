---
title: What are Keboola apps
slug: 'data-apps/what-are-apps'
description: Understand what Keboola apps are, how they run on your governed data, and when to use JavaScript/Python versus Streamlit.
---



A Keboola app is an interactive application that runs inside your Keboola project, on top of your data. Use one to give people a way to *see* and *act on* data, not just move it.

## How apps fit into Keboola

Keboola has always handled the data pipeline — extracting, transforming, and loading your data. Apps add the layer on top: the interface your team or customers actually use. Because the app runs inside your project, it reaches your data through the same access controls you already manage.

This is the part that sets Keboola apps apart from general app builders: the app is governed by default. It can only touch data the project can touch, and you control who can open it.

## What you can build

- **Dashboards** — track metrics, replace a BI seat for an internal view.
- **Internal tools** — forms, approvals, and workflows that read and write back to your data.
- **Data narratives** — scrollable, explained stories built from your data.
- **Anything interactive** — configurators, simulators, and more.

## JavaScript/Python vs Streamlit

Most apps run on JavaScript and Python, which give you full control over the interface. Streamlit is a Python-only framework that is quicker for simple data tools but more limited in look and interactivity.

- Build something rich or customer-facing → JavaScript/Python.
- Build a quick internal data tool → Streamlit can be enough.

When you build with Kai, you don't have to choose up front — Kai selects the framework that fits your request. For details on each, see [Python/JS apps](/data-apps/python-js/) (the full-control option) and [Streamlit apps](/data-apps/streamlit/) (the quick Python option).

<!-- TODO(human-review, Miro): verify the framework framing and whether Streamlit selection is automatic or requires a project setting (Kai-in-E2B flag). -->

## How an app is hosted

Keboola provisions and runs the app for you — there's no server for you to set up.

<!-- TODO(human-review, Michal Jerabek / Pavel Synek): confirm the hosting model to state publicly. Live today = Operator (Keboola's Kubernetes). E2B is the proposed backend for Kai-generated JS apps and is NOT yet signed off. Do not document E2B as the hosting mechanism until confirmed. -->

## Where Kai fits

Kai can build, edit, and run apps for you. Throughout these docs, "build with Kai" is the recommended path for most users — it removes the low-level setup you'd otherwise do by hand. Developers who want full control can still build locally; see [Build locally](/data-apps/build-locally/).
