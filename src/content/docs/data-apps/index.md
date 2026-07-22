---
title: Apps
slug: 'data-apps'
description: 'Build and run Python/JS apps on your governed data in Keboola — what apps are, how to build them with Kai or locally, how to run and share them, and real examples.'
redirect_from:
  - /components/data-apps/
  - /data-apps/examples/
---



Apps let you build interactive applications — dashboards, tools, internal apps — directly on top of your data in Keboola. The app runs in your project's governed space, so it can only reach the data you already have access to. No separate hosting, no shadow IT.

## What a Keboola app is

A Keboola app is a **Python/JS application hosted by your project**. It runs next to your data and gets its own URL you can share. Apps sleep when idle and wake on the first visit, so they cost nothing while nobody is looking. There's no infrastructure to manage and nothing is copied to an outside service — the app reads Storage through the project's own permissions.

You can put an app in front of anyone: your team (behind [authentication](/data-apps/authentication/)), a client, or the public. And an app isn't limited to human visitors — it can expose an API or an MCP server so other agents and services can call it.

For the full explanation — how apps fit into the platform and how they're isolated — see [What are Keboola apps](/data-apps/what-are-apps/).

## What people build

Dashboards and reports, internal tools, data narratives, configurators, and agent-facing services — see [what you can build](/data-apps/what-are-apps/#what-you-can-build) for the full picture. Dashboards are just the start: **[Beyond dashboards](#beyond-dashboards)** below shows the range.

## Two ways to build

- **[Build with Kai](/data-apps/getting-started/)** — describe the app in plain language and Kai reads your data, builds a live draft you preview and refine, and publishes when you're ready. No coding needed — the walkthrough takes about 10 minutes. The same **Create App** screen also offers [manual creation](/data-apps/getting-started/#create-an-app-manually) if you'd rather configure the app yourself.
- **[Build locally](/data-apps/build-locally/)** — develop with your own tools and Git account, use the [AI Kit](/ai/ai-kit/) coding-assistant plugins, and sync the app to your project. For developers who want full control — that page covers how Python/JS development works day to day.

## Run and share

Every app has its own settings page in **Apps**: who can open it ([Authentication](/data-apps/authentication/) — public, password, or your company SSO), its URL and how to [publish and share](/data-apps/publish-and-share/) it, and operational settings like backend size and auto-sleep ([Reference](/data-apps/reference/)). Deploying and redeploying is one click; logs are right on the app's detail.

## Beyond dashboards

Apps go far beyond dashboards — live data narratives, internal tools, configurators, even games. These three were built with Kai during Keboola's internal app competition; each turns real data into something interactive and genuinely useful, built the same way you'd build an everyday internal tool: describe what you want to Kai, on top of your Storage data.

*The links below open real, running apps that sleep when idle — the first load may take a few seconds to wake.*

<!-- VERIFY(Jordan / Miro): these three are Jordan's picks for public showcase. Confirm they can stay linked publicly in external docs (they run on internal projects and may sleep). -->

### Seasonal — when and where to travel

Pick a month and dial in what you care about — warmth, dryness, cool nights, long daylight, calm winds, sunshine — and **Seasonal** scores **1,192 destinations worldwide** to find where the weather actually fits you, and when. Play the whole year as an animation, compare destinations side by side, and jump straight to Google Flights. It turns a dry weather dataset into a real consumer product, not a report.

- **Live app:** <https://seasonal-74013643.hub.europe-west3.gcp.keboola.com/>
- **Data:** 10-year climate normals from Meteostat weather-station records and NASA POWER satellite reanalysis, merged by an automated Keboola pipeline.
- Built by Maxmilian Ottomansky.

![Seasonal — a world map that finds your perfect-weather destinations by month](/data-apps/examples-seasonal.png)

### Global Flight Shockwave Simulator — if a hub stops

Pick a major airport hub — Heathrow, Atlanta, Dubai, Paris CDG, or Chicago O'Hare — and watch a **72-hour animated simulation** of how shutting it down cascades through the global flight network, with an optional voiceover narrating the fallout. It shows an app can be an immersive, cinematic simulation — not just charts.

- **Live app:** <https://flight-shockwave-1304626299.hub.keboola.com/>
- Built by Michaela Zajacova.

![Global Flight Shockwave Simulator — pick a hub and watch a 72-hour flight-network shutdown ripple out](/data-apps/examples-flight-shockwave.png)

### Color Season Analyzer — understanding your palette

An editorial, **scrollytelling** guide to personal color analysis — from Itten's Bauhaus color studies to today's four-season framework, with swatch sets and curated palettes per season. A soft, designed, consumer-grade experience built on the very same platform as your team's dashboards.

- **Live app:** <https://color-season-analyzer-43672911.hub.us-east4.gcp.keboola.com/>
- Built by Andrea Nováková.

![Color Season Analyzer — an editorial "Understanding your palette" scrollytelling app](/data-apps/examples-color-season.png)

## A note on frameworks

Keboola apps run on **Python/JS** — that's what Kai builds and the forward path for new apps. [Streamlit](/data-apps/streamlit/) remains supported for existing apps; its docs live in their own section.

<!-- TODO(human-review, Miro): confirm the exact "default vs supported" wording for Python/JS vs Streamlit. Do not state Streamlit is retired. -->

---

**Next:** [What are Keboola apps →](/data-apps/what-are-apps/)
