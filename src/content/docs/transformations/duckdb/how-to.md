---
title: How do I run a DuckDB transformation?
slug: 'transformations/duckdb/how-to'
description: Create, configure, and run a DuckDB SQL transformation in Keboola from start to finish — create the configuration, map input, write the SQL, map output, run it, and confirm the result landed in Storage.
keywords:
  - run a DuckDB transformation
  - create DuckDB transformation
  - DuckDB SQL transformation Keboola
  - DuckDB transformation example
type: how-to
---

You have a table in Keboola Storage and you want to transform it with DuckDB SQL and write the result back to Storage. This page takes you from nothing to a successful run using a small worked example. For all settings and syntax rules, see the [reference](/transformations/duckdb/reference/); for when to choose DuckDB, see the [explanation](/transformations/duckdb/explanation/).

:::caution[Beta]
DuckDB Transformation is currently in **BETA**. Breaking changes may occur.
:::

**Time:** ~10 minutes · **You will need:** a Keboola project where you can create configurations, and one table in [Storage](/storage/tables/) to read from.

## Before you start

Get a table into Storage to use as the input. If you do not have one handy, upload the [sample CSV file](/transformations/source.csv) as a new table — the example SQL below expects a `sample` table with `order_date` and `order_amount` columns. <!-- TODO(human-review): confirm the sample file's columns match. -->

## Step 1 — Create the transformation

1. Open **Components → Transformations** and click **New Transformation**.
2. Select **DuckDB Transformation**. <!-- TODO(human-review): confirm type label. -->
3. Name it, optionally add a description and folder, and click **Create Transformation**.

## Step 2 — Add the input mapping

1. In **Input Mapping**, add your Storage table.
2. Set its **Destination** (staging table name) to `sample`.
3. Save the mapping.

## Step 3 — Write the SQL script

In the code editor, paste:

```sql
CREATE TABLE "output" AS
SELECT "order_date", SUM("order_amount") AS "sum_orders_amount"
FROM "sample"
GROUP BY "order_date";
```

End every statement with a semicolon (`;`). Quote identifiers that need exact case (`"sample"`). You can split longer scripts into [blocks](/transformations/#writing-scripts), which DuckDB runs with automatic dependency analysis (see [block-based orchestration](/transformations/duckdb/reference/#block-based-orchestration)).

> If `SUM()` fails with a type error, your input is loading as `VARCHAR`. Either cast explicitly, or enable **Infer input table data types** — see [Step: typed inputs](#optional-work-with-typed-inputs).

## Step 4 — Add the output mapping

1. In **Output Mapping**, set **Source** to `output` (the table the script creates).
2. Set **Destination** to a new Storage table, for example `out.c-main.orders`.
3. Save the mapping.

## Step 5 — Run it and confirm the result

1. Click **Run** on the transformation.
2. Wait for the [job](/management/jobs/) to finish with a success status.
3. Open **Storage**, find your destination table, and confirm it has one row per `order_date` with the summed amount.

## Optional: work with typed inputs

By default, input columns load as `VARCHAR`, so numeric and date functions need explicit casts. To use real types directly, enable **Infer input table data types** in the configuration settings — DuckDB then detects types like `INTEGER`, `FLOAT`, and `DATE`. See [Infer input table data types](/transformations/duckdb/reference/#infer-input-table-data-types).

## Make it faster (backend size)

If the job is slow or runs out of memory, raise the **Backend size** (XSmall → Small → Medium → Large). The sizes and their memory are listed in the [reference](/transformations/duckdb/reference/#backend-sizes). For datasets over 10 GB, also see [memory management](/transformations/duckdb/reference/#memory-management-for-large-datasets).

## Check before you run (sync actions)

You can validate without a full run using [sync actions](/transformations/duckdb/reference/#sync-actions) — for example **Syntax check** to catch SQL errors, or **Expected input tables** to confirm the inputs your script references.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Syntax error between statements | Missing semicolon | End every statement with `;` ([reference](/transformations/duckdb/reference/#semicolons-between-statements)). |
| `SUM()`/aggregation fails on a column | Input loaded as `VARCHAR` | Cast explicitly, or enable **Infer input table data types**. |
| `table not found` for a mixed-case name | Unquoted name folded to lowercase | Quote the identifier (`"MyTable"`); see [case sensitivity](/transformations/duckdb/reference/#identifier-case-sensitivity). |
| Run succeeds but nothing in Storage | Missing/incorrect output mapping | Add an output mapping whose **Source** matches the table the script created (`output`). |

## Related

- [DuckDB transformation reference](/transformations/duckdb/reference/) — settings, backends, SQL extensions.
- [When should I use DuckDB?](/transformations/duckdb/explanation/) — DuckDB vs. Snowflake.
- [Snowflake to DuckDB migration guide](/transformations/duckdb/snowflake-migration/).
