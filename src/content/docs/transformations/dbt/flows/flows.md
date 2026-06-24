---
title: Using dbt in flows
slug: 'transformations/dbt/flows'
description: Add dbt components to a Keboola flow to orchestrate them in a data pipeline, with scheduling and notifications, just like any other component.
keywords:
  - dbt in flows
  - orchestrate dbt Keboola
  - schedule dbt transformation
  - dbt pipeline
type: how-to
---

All dbt-related components behave like any other component in Keboola, so you orchestrate them with [flows](/flows/).

To run dbt as part of a pipeline:

1. Open or create a [flow](/flows/).
2. Add the dbt component as a task, alongside your other extractors, transformations, and writers, in the order you want them to run.
3. Set a **schedule** on the flow so it runs automatically.
4. Configure **notifications** to be alerted on success, warning, or error.

Because dbt components are ordinary flow tasks, everything a flow offers — ordering, scheduling, and notifications — applies to them. See [Flows](/flows/) for the full configuration.
