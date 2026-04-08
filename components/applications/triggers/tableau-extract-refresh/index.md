---
title: Tableau Extract Refresh Trigger
permalink: /components/applications/triggers/tableau-extract-refresh/
---

* TOC
{:toc}

The Tableau Extract Refresh Trigger application triggers extract refresh tasks on [Tableau](https://www.tableau.com/) data sources and workbooks directly from a Keboola flow. It supports both full and incremental refresh types, and can either wait for all triggered tasks to complete (poll mode) or fire and finish immediately.

## Prerequisites

- Tableau Personal Access Token (PAT) — required since February 2022
- The token owner must be the data source owner or a Site Admin in Tableau
- All data sources and workbooks must be published to Tableau Online/Server with the required extract refresh tasks already configured

## Authorization

The component authenticates using a **Personal Access Token (PAT)**. Follow the [Tableau documentation](https://help.tableau.com/current/pro/desktop/en-us/useracct.htm#create-and-revoke-personal-access-tokens) to create one.

## Create New Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **Tableau Extract Refresh Trigger** application and fill in the parameters below.

{: .image-popup}
![Tableau Extract Refresh Trigger - Configuration](/components/applications/triggers/tableau-extract-refresh/tableau-config.png)

### Authentication

- **PAT Token Name** — Tableau user's Personal Access Token name.
- **PAT Token Secret** — Tableau user's Personal Access Token secret.
- **Tableau server API endpoint URL** — The domain of your Tableau server, e.g., `https://dub01.online.tableau.com`.
- **Tableau Site ID** — The Site ID from the URL, e.g., `SITE_ID` in `https://dub01.online.tableau.com/#/site/SITE_ID/home`. Required for Tableau Online.

### Poll Mode

If set to **Yes**, the component waits for all triggered refresh tasks to finish before completing. If set to **No**, it triggers all jobs and finishes immediately after.

### Continue on Error

If enabled, the component continues refreshing remaining data sources or workbooks even if one of them fails.

### Tableau Datasources and Workbooks

{: .image-popup}
![Tableau Extract Refresh Trigger - Datasources and Workbooks](/components/applications/triggers/tableau-extract-refresh/tableau-datasources.png)

**Tableau datasources** — list of published data sources with extract refresh tasks to trigger.

**Tableau workbooks** — list of workbooks whose embedded data sources will be refreshed.

For each datasource or workbook, fill in:

| Parameter | Description |
|---|---|
| **Name** | Name as displayed in the Tableau UI. Must be unique — if multiple matches exist, the job fails and lists all candidates with their tags. |
| **Tag** | Optional. Use to disambiguate when multiple sources share the same name. Acts as an additional filter; omitting it returns all matches regardless of tags. |
| **LUID** | Optional. The unique server identifier (e.g., `ecf7d5e0-c493-4e03-8d55-106f9f46af3b`). If specified, `tag` is ignored. Recommended for production configurations. |
| **Refresh type** | (Datasources only) Either `RefreshExtractTask` (full) or `IncrementExtractTask` (incremental). The specified task type must already exist in Tableau. |

**Finding the LUID:** On first run, the LUID for each matched datasource or workbook is printed in the job log. Copy it into the configuration to ensure stable, unique identification in future runs.

## Sample Configuration

```json
{
  "parameters": {
    "token_name": "my-pat-token",
    "#token_secret": "XXXXX",
    "site_id": "testsite",
    "endpoint": "https://dub01.online.tableau.com",
    "poll_mode": true,
    "datasources": [
      {
        "name": "FullTestExtract",
        "type": "RefreshExtractTask",
        "luid": "ecf7d5e0-c493-4e03-8d55-106f9f46af3b"
      },
      {
        "name": "IncrementalTestExtract",
        "type": "IncrementExtractTask",
        "luid": "ecf7d5e0-a345-4e03-8d55-106f9f46af1g"
      }
    ],
    "workbooks": [
      {
        "name": "Sales Dashboard",
        "luid": "ab12-3456-7890-abcd-ef1234567890"
      }
    ]
  }
}
```

## Notes

- Each datasource must have the required extract refresh task configured in Tableau (e.g., Full refresh or Incremental refresh) — otherwise the trigger will fail.
- If multiple tasks of the same type exist on a datasource, only one will be triggered.
- Data source names are not guaranteed to be unique. Always set the LUID after the first run to avoid ambiguity.
