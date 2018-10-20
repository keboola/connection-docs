---
title: Orchestrator
permalink: /orchestrator/
---

Bringing systems for data loading, manipulation and writing together is what makes
[Keboola Connection](/overview/) so powerful and easy to use. With [extractors](/extractors/), you can fetch
data from data sources into [Storage](/storage/). With [transformations](/manipulation/transformations/) and
[applications](/manipulation/applications/), you can modify the data. With [writers](/writers/), you can
send it to destination systems.

The Orchestrator component has two important features:

- Organizing the configured components into logical **building blocks** or full **data pipelines**.
- Scheduling **automated** and **repeated** execution of those blocks or pipelines.

The former feature of the Orchestrator allows you to define **dependencies** between different configured
components. For example, it allows you to specify that a transformation must be run after an extraction
which provides the source data for it. You can also specify that two extractions may run in parallel
because they are independent of each other. This way it is possible to organize **large and complex projects** 
and ensure you always work with the latest data available.

The latter feature of the Orchestrator allows you to fully automate the entire data pipeline. That
guaranties that the destination systems (e.g. Tableau Business Analytics) always contain the latest
available data, without any user intervention. Every change to your entry data
will **automatically propagate up** to your dashboard or visualisation project.

See the corresponding part of our [tutorial](/tutorial/automate/) to quickly set up an example Orchestration.
