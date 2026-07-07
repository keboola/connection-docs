---
title: How do I run a Snowflake transformation?
slug: 'transformations/snowflake-plain/how-to'
description: Create, configure, and run a Snowflake SQL transformation in Keboola from start to finish — set input mapping, write the SQL script, set output mapping, run it, and confirm the result table landed in Storage.
keywords:
  - run a Snowflake transformation
  - create Snowflake transformation
  - Snowflake SQL transformation Keboola
  - how to write SQL transformation
  - Snowflake transformation example
type: how-to
---

You have a table in Keboola Storage and you want to transform it with SQL and write the result back to Storage. This page takes you from nothing to a finished, successful run using a small worked example. For the concepts behind it, see [when to use a Snowflake transformation](/transformations/snowflake-plain/explanation/); for exact limits and syntax rules, see the [reference](/transformations/snowflake-plain/reference/).

**Time:** ~10 minutes · **You will need:** a Keboola project where you can create configurations, and one table in [Storage](/storage/tables/) to read from.

## Before you start

Get a table into Storage to use as the input. If you do not have one handy, upload the [sample CSV file](/transformations/source.csv) as a new table (Storage → your bucket → **Create Table**) — the example SQL below expects a `source` table with `first` and `second` columns. <!-- TODO(human-review): confirm the "Create Table" control label and the bucket → table path. -->

## Step 1 — Create the transformation

1. Open **Components → Transformations**. <!-- TODO(human-review): confirm top-level nav label ("Transformations" vs "Transformations & Workspaces"). -->
2. Click **New Transformation**.
3. Choose **Snowflake SQL Transformation** as the type. <!-- TODO(human-review): confirm the exact type label shown in the picker. -->
4. Give it a descriptive name (for example, `Double the second column`) and confirm.

You now have an empty transformation configuration with sections for input mapping, the script, and output mapping.

## Step 2 — Add the input mapping

The input mapping copies a Storage table into the transformation's staging area under a name your script will use.

1. In **Input Mapping**, click **New Table Input**. <!-- TODO(human-review): confirm control label. -->
2. Set **Source** to your Storage table (the sample table from *Before you start*).
3. Set the **Destination** (the staging table name) to `source`.
4. Save the mapping.

![A Snowflake transformation with the source table mapped in, a result table mapped out, and the Main Code block below](/transformations/snowflake-plain/sample-transformation.png)

## Step 3 — Write the SQL script

In the transformation's code editor, paste:

```sql
CREATE OR REPLACE TABLE "result" AS
    SELECT "first", "second" * 42 AS "larger_second" FROM "source";
```

This reads the staged `source` table and creates a `result` table with the `first` column and `second` multiplied by 42.

Quote table and column names (`"source"`, `"first"`). Snowflake folds unquoted names to upper case, which won't match the identifiers Keboola created — see [identifier case sensitivity](/transformations/snowflake-plain/reference/#identifier-case-sensitivity). You can split longer scripts into [blocks](/transformations/#writing-scripts) to keep them organized.

## Step 4 — Add the output mapping

The output mapping writes a staging table back to permanent Storage. Without it, your `result` table is discarded when the job ends.

1. In **Output Mapping**, click **New Table Output**. <!-- TODO(human-review): confirm control label. -->
2. Set **Source** (the staging table the script created) to `result`.
3. Set **Destination** to a new Storage table, for example `out.c-main.result`.
4. Save the mapping.

## Step 5 — Run it and confirm the result

1. Click **Run** on the transformation.
2. Wait for the [job](/management/jobs/) to finish with a green/success status.
3. Open **Storage**, find your destination table (`out.c-main.result`), and check the data sample: it should contain `first` and `larger_second`, with `larger_second` equal to `second × 42`.

If the table is there with the expected values, the transformation works.

## Make it faster (backend size)

If the job is slow because of large data or complex queries, raise the **backend size** in the configuration (XSmall → Small → Medium → Large). A bigger backend allocates more resources; the available sizes and the default are listed in the [reference](/transformations/snowflake-plain/reference/#backend-sizes-dynamic-backends). Dynamic backends are not available on the Free Plan.

![The Backend Size dropdown in the transformation panel with Xsmall, Small, Medium, and Large options](/transformations/snowflake-plain/backend-size.png)

## Stop a run on a condition

To abort a transformation deliberately (for example, when an integrity check fails) and return a user error, set the `ABORT_TRANSFORMATION` variable in your script. See [aborting execution](/transformations/snowflake-plain/reference/#aborting-execution-abort_transformation).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `table source not found` (or similar) | Input mapping destination name doesn't match the script | Make sure the input **Destination** is exactly `source` and the script references `"source"`. |
| `table footable not found` despite the table existing | Identifier case mismatch — unquoted names are folded to upper case | Quote identifiers (`"source"`, `"first"`); see [case sensitivity](/transformations/snowflake-plain/reference/#identifier-case-sensitivity). |
| Run succeeds but nothing appears in Storage | No output mapping, or wrong **Source** staging name | Add an output mapping whose **Source** matches the table your script created (`result`). |
| `Expression type does not match column data type ... got OBJECT` | An `ARRAY`/`OBJECT`/`VARIANT` value wasn't cast to char | Cast explicitly with `TO_CHAR(...)`; see [working with data types](/transformations/snowflake-plain/reference/#working-with-data-types). |
| Transformation aborted with a user error | `ABORT_TRANSFORMATION` was set to a non-empty value | Expected if you use the abort pattern; otherwise check the logic that sets the variable. |

## Related

- [Snowflake transformation reference](/transformations/snowflake-plain/reference/) — limits, data types, timestamps, backend sizes.
- [When should I use a Snowflake transformation?](/transformations/snowflake-plain/explanation/) — concepts and trade-offs.
- [Input and output mapping](/transformations/mappings/) — how staging works in detail.
- [Tutorial: Manipulating data](/tutorial/manipulate/) — guided first transformation.
