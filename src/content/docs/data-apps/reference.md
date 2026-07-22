---
title: Apps reference
slug: 'data-apps/reference'
description: Per-app settings, environment variables, data access, backend versions, and limits for Keboola apps.
redirect_from:
  - /components/data-apps/terminal-log-tab/
  - /data-apps/storage-access/
---



Technical reference for building and running Keboola apps — the settings, variables, and runtime behavior you'll reach for while developing.

**On this page:** [Environment variables](#environment-variables) · [Data access](#data-access) · [Backend versions](#backend-versions) · [App actions](#app-actions) · [Sleep and resume](#sleep-and-resume) · [Limits](#limits)

## Per-app settings

Each app has its own configuration.

| Setting | What it does |
|---|---|
| Authentication | Who can open the app — None, Basic, OIDC, GitHub, GitLab, or JumpCloud. See [Authentication](/data-apps/authentication/). |
| Code Source | Where the app's code comes from — inline **Code** or a **Git Repository**. |
| Backend version | The runtime image (Python version and, for Streamlit, the Streamlit version). See [Backend versions](#backend-versions). |
| Backend size | The compute allocated to the app (for example XSmall, Small); chosen on deploy. |
| Auto-sleep | The inactivity timeout before the app suspends. See [Sleep and resume](#sleep-and-resume). |
| URL | The address where the app is served. |
| Versioning | Draft vs production versions of the app, on the **Versions** tab. |

<!-- Rows reflect the app config observed live (Overview + App Info + deploy wizard). Confirm the full Advanced Settings list before treating as exhaustive. -->

## Environment variables

Sensitive values — API keys, tokens, passwords — should be stored as **secrets** in the app configuration, never written into your code. The platform also injects several variables automatically: `BRANCH_ID` (always set), `KBC_TOKEN` and `DATA_LOADER_API_URL` (with Data Loader), and `WORKSPACE_ID` / `QUERY_SERVICE_URL` / `KBC_WORKSPACE_MANIFEST_PATH` (with Storage Access). See the [runtime README](https://github.com/keboola/data-app-python-js/blob/main/README.md#environment-variables) for the full list.

| Variable | Notes |
|---|---|
| `KBC_TOKEN` | Storage token, **injected automatically**. Reserved — do not set it yourself, and keep it server-side. |
| `KBC_URL` | Storage API URL for the current stack, **injected automatically**. Pair it with `KBC_TOKEN` when creating the Storage client. |
| `KBC_WORKSPACE_MANIFEST_PATH` | Path to the workspace manifest JSON file (contains `workspaceId`). Recommended source for the workspace ID. Set with Storage Access. |
| `WORKSPACE_ID` | ID of the provisioned workspace. Also in the manifest — prefer the manifest in new code. Set with Storage Access. |
| `BRANCH_ID` | Storage API branch ID of the project. |
| `QUERY_SERVICE_URL` | URL of the Query Service API (stack-specific). Set with Storage Access. |

<!-- VERIFY(Adam Vyborny): confirm the full env-var list. Correct the existing error: KBC_TOKEN is reserved/auto-injected, not a secret the user adds; "the value is uppercased" should read "the variable name", not the value. -->

### Secrets

Add secrets as key-value pairs in the app configuration. The `#` prefix marks a value as a secret (encrypted at rest). Keboola makes secrets available as environment variables when your app starts: the `#` prefix is stripped and the **variable name** is uppercased. For example, `#my-custom-var` becomes `MY_CUSTOM_VAR` — the `#` is removed, dashes become underscores, and the name is uppercased. The value itself is passed through unchanged.

## Backend versions

When deploying an app, you select a **backend version** — the runtime image — in the deploy wizard. For **Python/JS** apps it looks like this:

```
1.6.1 - Python 3.11 + JavaScript (Node 20, Bun 1.3)
```

- **Backend version** (`1.6.1`): the release of the base image that runs your app.
- **Python / Node / Bun versions**: the interpreters available to your code.

Python/JS apps bring their own dependencies from the repository — `requirements.txt` for Python, `package.json` for Node — installed on deploy. There is no pre-installed package list to depend on.

<!-- Python/JS wizard format observed live (us-east4 + europe-west3, 2026-07-10): "1.6.1 - Python 3.11 + JavaScript (Node 20, Bun 1.3) (default)"; XSmall = 8 GB RAM, 1 CPU core, 1TB SSD shared. -->

Building a **Streamlit** app? Its backend versions, supported Python variants, and the pre-installed package list live in the [Streamlit section](/data-apps/streamlit/#backend-versions).

## Data access

Apps read and write Keboola data three ways: a one-time load via **Input Mapping**, on-demand reads via the **Storage API**, and real-time SQL via **Storage Access**.

### Input Mapping

If you configure **Input Mapping**, Keboola loads selected tables into the container before your app starts. Read them as CSV files:

```python
import pandas as pd

# File path pattern: /data/in/tables/<table-name>.csv
df = pd.read_csv("/data/in/tables/my_table.csv")
```

Input Mapping data is loaded once at startup. To get fresh data, redeploy the app or use the Storage API at runtime.

### Storage API at runtime

To fetch up-to-date data without redeploying, use the Keboola Storage API. Exporting a table is an asynchronous job, so use the official client rather than calling the endpoint by hand — it handles the export job, download, and paging for you:

```python
import os
import pandas as pd
from kbcstorage.client import Client

client = Client(os.environ["KBC_URL"], os.environ["KBC_TOKEN"])  # KBC_TOKEN is injected automatically

client.tables.export_to_file(table_id="in.c-main.my_table", path_name=".")
df = pd.read_csv("my_table")
```

For the full API, see the [Keboola Storage Python Client documentation](https://developers.keboola.com/integrate/storage/python-client/).

### Storage Access

Storage Access lets your app read from and write back to Keboola Storage tables in real time, over SQL through the Query Service.

:::note
Storage Access works on both **Snowflake** and **BigQuery** backends. The SQL examples below use Snowflake identifier quoting (`"bucket"."table"`); on BigQuery, identifier quoting and table naming differ — see [BigQuery backend](#bigquery-backend).
:::

**Enable it:** in **Project Settings > Features**, activate **Storage Access**. Then, in the app's **Advanced Settings > Storage Access**, click **+ Add Writable Table** and select the buckets/tables the app may read and write (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`). All selected tables must exist before you deploy. Managing configs via the Storage API? The same selection is expressed under `storage.output.tables` with `"unload_strategy": "direct-grant"` per table.

**Read data** with the [keboola-query-service](https://pypi.org/project/keboola-query-service/) client (also on npm as [@keboola/query-service](https://www.npmjs.com/package/@keboola/query-service)):

```python
import json
import os
from keboola_query_service import Client

branch_id = os.environ["BRANCH_ID"]
query_service_url = os.environ["QUERY_SERVICE_URL"]
with open(os.environ["KBC_WORKSPACE_MANIFEST_PATH"]) as f:
    workspace_id = json.load(f)["workspaceId"]

client = Client(base_url=query_service_url, token=os.environ["KBC_TOKEN"])

results = client.execute_query(
    branch_id=branch_id,
    workspace_id=workspace_id,
    statements=['SELECT * FROM "in.c-main"."customers" LIMIT 1000'],
)
```

**Write data** with standard SQL (`INSERT` / `UPDATE` / `DELETE` / `TRUNCATE`) via `execute_query`. The Query Service refreshes table metadata automatically after writes.

:::caution
The Query Service accepts raw SQL and does not support parameterized queries. Validate and sanitize every untrusted value before interpolating it into a statement (coerce types, use allowlists for string values). `TRUNCATE` cannot be undone.
:::

**How it works:** enabling Storage Access provisions an ephemeral **workspace** (a database user with the granted permissions). A fresh workspace is created each time the app starts, wakes from sleep, or is redeployed, and is deleted when the app is deleted — so permission changes take effect on the next start.

#### BigQuery backend

Setup, workspace lifecycle, environment variables, and the Query Service client are identical on BigQuery — only the SQL dialect differs. The Query Service passes SQL through to the backend unchanged (it does **not** translate dialects), so apply two rules to every query:

- **Quote identifiers with backticks**, as `dataset.table` (two parts). Do not prepend the Keboola stage (`in`/`out`) as a third segment — BigQuery resolves a three-part name as `project.dataset.table` and fails with an error like `The project <stage> has not enabled BigQuery`.
- **Use the mangled dataset name.** BigQuery dataset names cannot contain `.` or `-`, so every `.` and `-` in the bucket ID becomes `_` (`in.c-main` → `in_c_main`). Only the bucket (dataset) name is mangled — the table name keeps its original form.

```sql
-- ✅ Correct — dataset.table (two parts); either quoting style works
SELECT * FROM `in_c_main`.`customers` LIMIT 1000
SELECT * FROM `in_c_main.customers`  LIMIT 1000

-- ❌ Wrong — the Keboola stage `in` becomes a third (project) segment
SELECT * FROM `in`.`c-main`.`customers` LIMIT 1000
```

:::tip[Find the exact names in Storage]
Open the table in **Storage** and check its **Overview** tab — it shows the **Dataset Name** and **Table Name** to use in queries. To discover names dynamically at runtime, query `INFORMATION_SCHEMA.SCHEMATA`.
:::

**Input Mapping vs Storage Access:**

| Aspect | Input Mapping | Direct Storage Access |
| --- | --- | --- |
| **Data freshness** | Snapshot at deploy time | Real-time, always current |
| **Data loading** | CSV files at `/data/in/tables/` | Query on demand via API |
| **Write capability** | None (read-only) | INSERT, UPDATE, DELETE, TRUNCATE |
| **Dataset size** | Limited by container memory | Virtually unlimited (pagination) |
| **Configuration** | Select tables in UI | Select tables + enable toggle |
| **Use case** | Static dashboards, reports | Interactive apps, data entry |

## Terminal log

The Terminal Log tab provides an **almost real-time** view of the application's terminal logs (with a slight delay of a few seconds), helping with monitoring and troubleshooting.

![Screenshot - Hello World App](/data-apps/terminal-log.png)

- **Near real-time log display** — terminal output as it is generated, with a short delay.
- **Full log download** — download the complete log from the app's start with **Download Logs**.
- **Log availability** — logs are accessible only while the app is running, and are deleted when it stops or pauses.

## App actions

Manage a deployed app from its actions menu.

![Actions menu](/data-apps/manage-redeploy.png)

- **Deploy App** — starts the app. Once the deployment job finishes, open the app's public URL with **Open App**.
- **Open App** — opens a new window with your app.
- **Redeploy** — apply changes made in the app configuration (they take effect only after a redeploy).
- **Suspend App** — stops the app. The container stops and the URL is no longer available, but the configuration is kept.
- **Delete App** — stops the deployment and deletes its configuration.

## Sleep and resume

The Suspend/Resume feature saves resources by putting your app to sleep after a period of inactivity.

- **Activity monitoring** — the app watches for HTTP requests and active WebSocket connections. If none occur for the configured period, it suspends. An inactive browser tab can still cause background activity; Chrome's Memory Saver can help prevent this.
- **Automatic resumption** — the next request wakes the app. The first request after waking may take slightly longer.
- **Cost efficiency** — you're billed only for the time the app was active or waiting to suspend.

If you open the URL of a sleeping app, it triggers wakeup and shows a **waking up** page.

![Waking up](/data-apps/proxy-wakeup.png)

If something goes wrong, a **wakeup error** page appears; click **Show More** for details.

![Wakeup error](/data-apps/proxy-error-wakeing-up.png)

When you **Deploy** or **Redeploy**, a wizard prompts for the backend size and the auto-sleep timeout (five minutes to 24 hours; default five minutes).

![Deploy timeout and backend size](/data-apps/deploy-timeout-backedsize.png)

## Debugging app deployment

If the app deployment job fails, you can see the logs from its container in the event log of the deployment job. For example, there may be a conflict with the specified packages:

![Job error log](/data-apps/job-error-log.png)

## Limits

<!-- TODO(human-review, owner): confirm any hard limits vs configurable backend sizes (Jordan's note: limits should not lead a reference page — keep them at the bottom). -->

Storage Access has the following limitations:

- **Column-level permissions not supported** — granting access to a table grants read/write on all its columns.
- **Permission changes require app restart** — adding or removing tables takes effect on the next app start (deploy, redeploy, or wake from sleep).

---

**Next:** [Streamlit apps →](/data-apps/streamlit/)
