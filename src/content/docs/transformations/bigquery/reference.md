---
title: BigQuery transformation reference
slug: 'transformations/bigquery/reference'
description: Lookup reference for BigQuery SQL transformations in Keboola — query limits, the abort variable, data-type casting to STRING, and user-defined functions.
keywords:
  - BigQuery transformation limits
  - BigQuery query timeout
  - ABORT_TRANSFORMATION BigQuery
  - BigQuery data types Keboola
  - BigQuery temporary UDF
type: reference
---

Reference material for [BigQuery SQL transformations](/transformations/bigquery/). To create one, see the [how-to](/transformations/bigquery/how-to/).

<!-- Verified vs code (PRDCT-354 audit, Block B): the Query timeout parameter
     defaults to 0 and ABORT_TRANSFORMATION (STRING DEFAULT '') are confirmed
     against google-bigquery-transformation ConfigDefinition.php / Transformation.php.
     The GCP-side "2 hours" runtime claim is platform-level and unverified. -->

## Limits

| Limit | Value | Notes |
|---|---|---|
| Query runtime | 2 hours (BigQuery default) | <!-- TODO(human-review): GCP-side claim, not in the code audit — current GCP query-jobs quota may be 6h. --> Adjustable per configuration via the **Query timeout** parameter. See [BigQuery query-jobs quotas](https://cloud.google.com/bigquery/quotas#query_jobs). |
| Tables per query | Capped | BigQuery limits the [number of tables referenced by a single query](https://cloud.google.com/bigquery/quotas#tables). |
| Mutations | Discouraged | BigQuery favors an append-only model; row-level mutations are [generally discouraged](https://cloud.google.com/bigquery/docs/best-practices-costs#avoid_using_dml). |

**Query timeout** parameter — overrides the per-query runtime limit. Default: `0` (use BigQuery's own default).

For BigQuery limitations specific to Keboola, see [BigQuery Limitations](/storage/byodb/#bigquery-limitations). Track upstream changes in the [BigQuery release notes](https://cloud.google.com/bigquery/docs/release-notes).

## Aborting execution (`ABORT_TRANSFORMATION`)

To stop a transformation and exit with a user error, set the `ABORT_TRANSFORMATION` variable to any non-empty string. The variable is already declared internally — you only set its value. The engine checks it after each successfully executed query and returns the value as a user error (for example, `Transformation aborted: Integrity check failed.`).

```sql
SET ABORT_TRANSFORMATION = (
    SELECT IF(COUNT(*) = 0, '', 'Integrity check failed')
    FROM INTEGRITY_CHECK
    WHERE RESULT = 'failed'
);
```

This sets `ABORT_TRANSFORMATION` to `'Integrity check failed'` when the `INTEGRITY_CHECK` table has one or more rows with `RESULT = 'failed'`. An empty string does not abort.

## Working with data types

Keboola Storage [tables](/storage/tables/) store data as character types. When creating an output-mapping table you can rely on implicit casting to `STRING`:

```sql
CREATE OR REPLACE TABLE test (ID STRING, TM TIMESTAMP, NUM FLOAT64);

INSERT INTO test (ID, TM, NUM)
SELECT 'first', CURRENT_TIMESTAMP(), 12.5;
```

Or create all columns as `STRING`:

```sql
CREATE OR REPLACE TABLE test (ID STRING, TM STRING, NUM STRING);

INSERT INTO test (ID, TM, NUM)
SELECT 'first', FORMAT_TIMESTAMP('%F %T', CURRENT_TIMESTAMP()), CAST(12.5 AS STRING);
```

Or cast explicitly:

```sql
CREATE OR REPLACE TABLE test (ID STRING, TM STRING, NUM STRING);

INSERT INTO test (ID, TM, NUM)
SELECT
    CAST('first' AS STRING),
    CAST(FORMAT_TIMESTAMP('%F %T', CURRENT_TIMESTAMP()) AS STRING),
    CAST(12.5 AS STRING)
;
```

For structured/semi-structured values, cast explicitly (for example, serialize a `STRUCT` to JSON):

```sql
CREATE OR REPLACE TABLE test (ID STRING, TM STRING, NUM STRING, OBJ STRING);

INSERT INTO test (ID, TM, NUM, OBJ)
SELECT
    'first',
    FORMAT_TIMESTAMP('%F %T', CURRENT_TIMESTAMP()),
    CAST(12.5 AS STRING),
    TO_JSON_STRING(STRUCT('name' AS NAME, '123' AS CIN))
;
```

## User-defined functions (UDFs)

BigQuery has two kinds of UDF: **persistent** (stored in a dataset, reusable) and **temporary** (available only within the session that creates them).

Because a BigQuery transformation always runs in a **new session and a new dataset**, you can only use **temporary** UDFs — create them with `CREATE TEMP FUNCTION`. See the [BigQuery UDF documentation](https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions).
