---
title: LangSmith Traces
slug: 'components/extractors/other/langsmith-traces'
description: Extract the run history and feedback of your LangSmith projects into two incremental Storage tables.
---


[LangSmith](https://www.langchain.com/langsmith) is LangChain's observability platform for LLM applications. The LangSmith Traces data source connector reads the run history and feedback of your LangSmith projects and writes them to two incremental tables in Storage.

<!-- Reference-type page. Source: the component registry copy of `keboola.ex-langsmith-traces` (/v2/storage longDescription, configurationDescription and config schema), verified 2026-10-12. -->

:::caution[Experimental]
This connector is experimental. Its configuration and output may still change. Send feedback using the feedback button in your project.
:::

## Prerequisites

- A LangSmith user API key. The connector stores it encrypted.
- For organizations on the EU instance, the EU API URL `https://eu.api.smith.langchain.com`.

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **LangSmith Traces** data source connector. The connector has no rows; one configuration is one extraction.

### Credentials

| Field | Description |
|---|---|
| LangSmith API key | Your user API key. |
| LangSmith API URL | Optional. Leave empty for the default US instance (`https://api.smith.langchain.com`), or enter `https://eu.api.smith.langchain.com` for the EU instance. |

Click **Test connection**.

### Scope

| Field | Description |
|---|---|
| Projects | Leave empty to sync every project the API key can see, or click **Reload projects** and pick specific ones. |
| Fetch from | Start of the interval: an ISO 8601 timestamp such as `2024-01-01T00:00:00Z`, or a relative phrase such as `7 days ago` (default). |
| Fetch to | End of the interval. Default `Now`. |

### Advanced parameters

| Field | Description |
|---|---|
| Max retries | Retry attempts when the LangSmith API throttles requests. Default 5. |
| Feedback batch size | Number of runs processed together when fetching feedback. Default 200; lower it if you hit memory limits. |

## Output

Two tables, loaded incrementally: one with the runs and one with their feedback, including evaluator scores and corrections.

<!-- VERIFY(Jiří Soukup): names and primary keys of the two output tables. The registry copy says only "two incremental tables"; the repo README predates the current schema and does not list them. -->
