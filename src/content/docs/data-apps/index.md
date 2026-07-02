---
title: Apps
slug: 'data-apps'
description: Build and run apps on top of your governed data in Keboola — with Kai, in the UI, or locally — without leaving the platform.
redirect_from:
  - /components/data-apps/
---



Apps let you build interactive applications — dashboards, tools, internal apps — directly on top of your data in Keboola. The app runs in your project's governed space, so it can only reach the data you already have access to. No separate hosting, no shadow IT.

## Why build apps in Keboola

Apps run inside your project's governed space — next to your data, behind your existing access controls, with no infrastructure to manage and nothing copied to an outside service. Build them your way: with Kai, in the UI, or locally. Read more in [What are Keboola apps](/data-apps/what-are-apps/).

## Start here

New to apps? Follow [Getting started](/data-apps/getting-started/) to build and publish your first app in about 10 minutes.

## Choose how to build

- **[Build with Kai](/data-apps/build-with-kai/)** — describe the app in plain language and let Kai build it. The fastest path, no coding needed.
- **[Build in the UI](/data-apps/build-in-the-ui/)** — create and configure an app from the Keboola interface.
- **[Build locally](/data-apps/build-locally/)** — develop with your own tools, use your own Git account, and sync the app to your project. For developers who want full control.

## Run and share

- [Authentication](/data-apps/authentication/) — control who can open your app.
- [Publish and share](/data-apps/publish-and-share/) — make an app available to others.
- [Reference](/data-apps/reference/) — settings, environment variables, and backend versions.

## What people build

Apps go well beyond dashboards: live data narratives, internal tools, configurators, even games. See [what people build](/data-apps/examples/) for real examples.

<!-- TODO(human-review, Miro): confirm which competition apps can be shown publicly, then link/screenshot them on the examples page. -->

## A note on frameworks

Keboola apps usually run on JavaScript and Python, with [Streamlit](/data-apps/streamlit/) still supported for specific cases — and when you build with Kai, it picks the framework for you. See [JavaScript/Python vs Streamlit](/data-apps/what-are-apps/#javascriptpython-vs-streamlit) for when to use which.

<!-- TODO(human-review, Miro): confirm the exact "default vs supported" wording. Python/JS is the forward path; Streamlit availability depends on the "Kai in E2B" feature flag per project. Do not state Streamlit is retired. -->
