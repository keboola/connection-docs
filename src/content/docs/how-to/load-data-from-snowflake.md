---
title: How do I load data from Snowflake?
slug: 'how-to/load-data-from-snowflake'
description: Load tables from a Snowflake database into Keboola Storage using the Snowflake data source connector, including the Snowflake permissions to grant and how to set up incremental loads.
keywords:
  - load data from Snowflake
  - Snowflake extractor
  - Snowflake data source connector
  - import Snowflake tables
  - Snowflake incremental fetching
task: Load data from Snowflake into Keboola
audience: New and existing Keboola users
last_verified: 2026-06-16
related:
  - /components/extractors/database/
  - /components/extractors/database/sqldb/
  - /tutorial/load/database/
---

You want to bring tables from a Snowflake database into Keboola so you can transform, combine, and use that data. In Keboola this is done with the **Snowflake data source connector** (a query-based database connector). This page takes you from nothing to data landing in Keboola Storage.

**Time:** ~15 minutes · **You will need:** a Keboola project and a Snowflake account with rights to grant access.

## Before you start

Make sure you have:

- A Keboola project you can sign in to, with rights to create configurations.
- Snowflake connection details: **account identifier** (host), **warehouse**, **database**, and **schema** you want to read from.
- Permission in Snowflake to run `GRANT` statements (or a colleague who can). You will create a dedicated read-only user for Keboola in Step 1.

If your Snowflake instance is not reachable from the public internet, you will also need to set up an [SSH tunnel](/components/extractors/database/#connecting-to-database). That is covered separately; the steps below assume a directly reachable host.

## Step 1 — Create a read-only Snowflake user for Keboola

Always give Keboola its own user with read-only access, rather than reusing a personal login. Run the following in Snowflake, replacing the `MY_*` placeholders with your warehouse, database, and schema names and choosing a password:

```sql
CREATE ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT USAGE ON WAREHOUSE MY_WAREHOUSE TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT USAGE ON DATABASE MY_DATA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT USAGE ON SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT SELECT ON ALL TABLES IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT SELECT ON ALL VIEWS IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
CREATE USER KEBOOLA_SNOWFLAKE_EXTRACTOR PASSWORD = 'MY_PASSWORD' DEFAULT_ROLE = KEBOOLA_SNOWFLAKE_EXTRACTOR MUST_CHANGE_PASSWORD = FALSE TYPE = LEGACY_SERVICE;
GRANT ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR TO USER KEBOOLA_SNOWFLAKE_EXTRACTOR;
```

This grants access to the tables and views that exist **now**. Tables created later will not be readable until you re-run the two `GRANT SELECT ON ALL ... ` statements (or grant the role broader future privileges).

## Step 2 — Add the Snowflake connector in Keboola

1. In your Keboola project, open **Components** and choose **Add Component** (Components → Data Source Connectors).
2. Search for **Snowflake** and select the Snowflake data source connector.
3. Choose **Add Configuration**, give it a name that describes the source (for example, `Snowflake — Sales DB`), and confirm.

You now have an empty configuration, ready for credentials.

## Step 3 — Connect to your Snowflake database

1. In the new configuration, click **Set Up Credentials First**.
2. Enter the connection details for the `KEBOOLA_SNOWFLAKE_EXTRACTOR` user from Step 1: host/account, warehouse, database, schema, username, and password.
3. Click **Test Credentials**, then **Save**.

If the test fails, see [Troubleshooting](#troubleshooting) below before continuing.

## Step 4 — Choose the tables to load

After the credentials are saved, the connector automatically lists every table and view the user can read.

1. Select the tables you want to bring into Keboola.
2. Click **Create**.

Each selected table becomes a row in the configuration. You can:

- Add another table later with **New Table**.
- Open any table to edit what it loads, or disable it so it is skipped when the whole configuration runs.
- Change the connection later via the **Database Credentials** link.

## Step 5 — Run it and confirm the data landed

1. Click **Run** on the configuration.
2. When the job finishes successfully, open **Storage** and find the bucket created for this connector.
3. Confirm your tables are there with the expected row counts.

You have now loaded data from Snowflake into Keboola.

## Load only new rows next time (incremental fetching)

By default each run reloads the full table. For large tables that only grow or get updated, switch on **incremental fetching** so each run reads only changed rows:

1. Open the table in the configuration.
2. Set the **ordering column** — either an always-increasing ID or a last-modified timestamp.
3. Save and run.

Keboola records the highest value it has seen in the configuration state and, on the next run, fetches only rows beyond that value. Incremental fetching suits tables where rows are added (and optionally updated) but not hard-deleted; it cannot detect `DELETE` statements. If you need to capture deletes or every change, review the [Change Data Capture options](/components/extractors/database/#change-data-capture-cdc).

## Schedule it to run automatically

To keep Keboola in sync, add this connector to a [Flow](/flows/) and set a schedule (for example, hourly or nightly). The connector runs in scheduled intervals (micro-batching) rather than streaming changes in real time.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| **Test Credentials** fails to connect | Wrong account/host, or host not reachable | Re-check the account identifier; if the database is private, set up an [SSH tunnel](/components/extractors/database/#connecting-to-database). |
| Connects, but no tables are listed | The role lacks `USAGE`/`SELECT` on the schema | Re-run the `GRANT` statements from Step 1 for the correct database and schema. |
| A new table is missing from the list | Grants only covered tables that existed at grant time | Re-run the two `GRANT SELECT ON ALL ...` statements, then refresh. |
| "insufficient privileges" during a run | Warehouse usage not granted | Confirm `GRANT USAGE ON WAREHOUSE ... TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR`. |

## Related

- [Database data source connectors](/components/extractors/database/) — overview, SSH tunnel, and CDC options.
- [SQL database connectors — configuration reference](/components/extractors/database/sqldb/) — advanced mode and server-specific notes.
- [Tutorial: Loading data from a database](/tutorial/load/database/) — guided walkthrough.
