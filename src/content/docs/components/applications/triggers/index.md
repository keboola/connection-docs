---
title: Trigger Applications
description: 'What trigger applications do and which ones are documented: dbt Cloud, Deepnote, Exasol, flows in other projects, and Power BI and Tableau refreshes.'
slug: 'components/applications/triggers'
redirect_from:
    - /applications/triggers/

---

Triggers are applications that generate an action in a specified service. 
For example, triggering the creation of a report in a 3rd party system, or starting a computation engine for a 3rd party database.

<!-- Explanation-type page. Source: this page as it was before the 2026-11-19 rework, plus the ledes of its child pages. Facts not re-checked against the components. -->

## What a trigger does

A trigger calls another service and tells it to start something: run a job, refresh a dataset, start a cluster, or run a flow in another Keboola project. Some triggers only send the call. Others can also wait for the result.

A trigger is an [application](/components/applications/), so you create and run its configuration like that of any other component; see [Create a configuration](/components/configurations/#create-a-configuration). To start the other service as soon as your data is ready, add the trigger to a [flow](/flows/) after the tasks that prepare the data.

## This section

The following applications support triggering: 

- [Exasol Cluster Starter](/components/applications/triggers/exasol-cluster-starter/): start or stop an Exasol Cloud cluster.
- [Orchestration Trigger](/components/applications/triggers/orchestration-trigger-queue-v2/): trigger Keboola Conditional Flows and Legacy Flows across projects.
- [dbt Cloud Job Trigger](/components/applications/triggers/dbt-cloud-job-trigger/): trigger a dbt Cloud job and, if you want, wait for the run and store its result and artifacts.
- [Deepnote Notebook Execution Trigger](/components/applications/triggers/deepnote-notebook-execution-trigger/): trigger the execution of a notebook in Deepnote. It does not monitor the run.
- [Power BI Refresh](/components/applications/triggers/powerbi-refresh/): trigger dataset refreshes in a Power BI workspace, one workspace per configuration.
- [Tableau Extract Refresh Trigger](/components/applications/triggers/tableau-extract-refresh/): trigger full or incremental extract refresh tasks for Tableau data sources and workbooks, and wait for them or not.

More trigger applications are listed in the [Keboola Developer Portal](https://components.keboola.com/components).
