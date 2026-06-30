---
title: Keboola JDBC Driver
slug: 'workspace/jdbc-driver'
description: Connect DBeaver, DataGrip, Tableau, or any JDBC client to your Keboola project and query your data with standard SQL.
---



The Keboola JDBC driver lets standard SQL clients query data in your Keboola project. It connects through the Query Service API, so any JDBC-compatible tool — [DBeaver](/workspace/jdbc-driver/dbeaver/), [DataGrip](/workspace/jdbc-driver/datagrip/), or [Tableau](/workspace/jdbc-driver/tableau/) — can read your tables and platform metadata with plain SQL.

The driver auto-discovers your branches and workspaces, exposes virtual `_keboola.*` tables for platform metadata, adds a `KEBOOLA HELP` command, and supports full Snowflake metadata via `SHOW` commands.

:::note
This page is about reading data **out of** Keboola from external SQL/BI clients. If you instead want to **push** data into the Tableau ecosystem from Keboola, see the [Tableau data destination connector](/components/writers/bi-tools/tableau/).
:::

## Installation guides

Pick your client and follow the step-by-step guide:

- [DBeaver](/workspace/jdbc-driver/dbeaver/)
- [DataGrip](/workspace/jdbc-driver/datagrip/) (and other JetBrains IDEs)
- [Tableau Desktop](/workspace/jdbc-driver/tableau/)

## Download the driver

Download the latest `keboola-jdbc-driver-X.Y.Z.jar` from the [GitHub Releases page](https://github.com/keboola/jdbc-driver/releases/latest). Save it somewhere stable on your machine — e.g. `~/keboola/keboola-jdbc-driver.jar`.

## Prerequisites: Storage API token

The driver requires a Keboola [Storage API token](/management/project/tokens). See [API Tokens](/management/project/tokens#working-with-tokens) for how to create one.

The token has specific requirements for use with the driver:

- It **must not** be a bucket-scoped token — the driver needs to list branches and workspaces during connection setup, and a bucket-scoped token cannot see them.
- It needs **read access** to the buckets you want to query (selecting **all buckets** is the simplest option).
- Access to components is **not** required for SQL access.
- The token must come from the **same project** as the workspace you want to query.

A workspace must also already exist in the project — the driver auto-selects the newest one. Create one in the Keboola UI under [Workspaces](/workspace/).

:::tip
If you get connection errors, first verify your token works by visiting `https://connection.keboola.com/v2/storage/tokens/verify` with the header `X-StorageApi-Token: <your-token>`.
:::

## Querying your data

Once connected, you can run standard SQL against your project's Snowflake tables. The driver also exposes Keboola-specific helpers:

- **`KEBOOLA HELP`** lists every Keboola-specific command.
- **Virtual `_keboola.*` tables** expose platform metadata. There are five of them: `_keboola.components`, `_keboola.events`, `_keboola.jobs`, `_keboola.tables`, and `_keboola.buckets`.

A quick smoke test that confirms the driver is wired up correctly:

```sql
KEBOOLA HELP;

SELECT * FROM _keboola.buckets LIMIT 10;
```

## Connection properties

The driver accepts the following connection properties (how you set them depends on the client — see each guide):

| Property | Required | Description |
|---|---|---|
| `token` | yes | Your Keboola Storage API token |
| `branch` | no | Specific branch ID. Auto-detected (default branch) if omitted |
| `workspace` | no | Specific workspace ID. Newest workspace is auto-selected if omitted |

The JDBC URL takes the form `jdbc:keboola://<host>`, where `<host>` is your Keboola stack — e.g. `jdbc:keboola://connection.keboola.com` or `jdbc:keboola://connection.eu-central-1.keboola.com`.

## Need Help?

For further help, reach out via [Keboola Support](/management/support/).
