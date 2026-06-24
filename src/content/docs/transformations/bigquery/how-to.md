---
title: How do I run a BigQuery transformation?
slug: 'transformations/bigquery/how-to'
description: Create, configure, and run a Google BigQuery SQL transformation in Keboola from start to finish — set input mapping, write the SQL, set output mapping, run it, and confirm the result table landed in Storage.
keywords:
  - run a BigQuery transformation
  - create BigQuery transformation
  - BigQuery SQL transformation Keboola
  - BigQuery transformation example
type: how-to
---

You have a table in Keboola Storage and you want to transform it with BigQuery SQL and write the result back to Storage. This page takes you from nothing to a finished, successful run using a small worked example. For exact limits and syntax rules, see the [reference](/transformations/bigquery/reference/).

**Time:** ~10 minutes · **You will need:** a Keboola project (on a BigQuery backend) where you can create configurations, and one table in [Storage](/storage/tables/) to read from.

## Before you start

Get a table into Storage to use as the input. If you do not have one handy, upload the [sample CSV file](/transformations/source.csv) as a new table (Storage → your bucket → **Create Table**) — the example SQL below expects a `source` table with `first` and `second` columns. <!-- TODO(human-review): confirm the "Create Table" control label and bucket → table path. -->

## Step 1 — Create the transformation

1. Open **Components → Transformations**. <!-- TODO(human-review): confirm top-level nav label. -->
2. Click **New Transformation**.
3. Choose **Google BigQuery Transformation** as the type. <!-- TODO(human-review): confirm the exact type label in the picker. -->
4. Give it a descriptive name and confirm.

## Step 2 — Add the input mapping

1. In **Input Mapping**, click **New Table Input**. <!-- TODO(human-review): confirm control label. -->
2. Set **Source** to your Storage table.
3. Set the **Destination** (staging table name) to `source`.
4. Save the mapping.

## Step 3 — Write the SQL script

In the code editor, paste:

```sql
CREATE OR REPLACE TABLE `result` AS
SELECT `first`, CAST(`second` AS INT64) * 42 AS `larger_second`
FROM `source`;
```

This reads the staged `source` table and creates a `result` table with `first` and `second × 42`. Quote identifiers with backticks (`` `source` ``). You can split longer scripts into [blocks](/transformations/#writing-scripts).

## Step 4 — Add the output mapping

1. In **Output Mapping**, click **New Table Output**. <!-- TODO(human-review): confirm control label. -->
2. Set **Source** (the staging table the script created) to `result`.
3. Set **Destination** to a new Storage table, for example `out.c-main.result`.
4. Save the mapping.

## Step 5 — Run it and confirm the result

1. Click **Run** on the transformation.
2. Wait for the [job](/management/jobs/) to finish with a success status.
3. Open **Storage**, find your destination table (`out.c-main.result`), and check the data sample: it should contain `first` and `larger_second`, with `larger_second` equal to `second × 42`.

If the table is there with the expected values, the transformation works.

## Adjust the query timeout

By default a BigQuery query is capped at BigQuery's own maximum runtime. To raise or lower it for this configuration, set the **Query timeout** parameter — see [limits](/transformations/bigquery/reference/#limits).

## Stop a run on a condition

To abort deliberately (for example, when an integrity check fails) and return a user error, set the `ABORT_TRANSFORMATION` variable in your script. See [aborting execution](/transformations/bigquery/reference/#aborting-execution-abort_transformation).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Not found: Table source` (or similar) | Input mapping destination doesn't match the script | Make sure the input **Destination** is exactly `source` and the script references `` `source` ``. |
| Run succeeds but nothing appears in Storage | No output mapping, or wrong **Source** staging name | Add an output mapping whose **Source** matches the table your script created (`result`). |
| Query exceeds the time limit | Long-running query past the BigQuery maximum | Optimize the query, or raise the **Query timeout** parameter ([reference](/transformations/bigquery/reference/#limits)). |
| Transformation aborted with a user error | `ABORT_TRANSFORMATION` was set to a non-empty value | Expected if you use the abort pattern; otherwise check the logic that sets it. |

## Related

- [BigQuery transformation reference](/transformations/bigquery/reference/) — limits, data types, UDFs.
- [Input and output mapping](/transformations/mappings/) — how staging works.
- [Tutorial: Manipulating data](/tutorial/manipulate/) — guided first transformation.
