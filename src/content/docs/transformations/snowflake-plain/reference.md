---
title: Snowflake transformation reference
slug: 'transformations/snowflake-plain/reference'
description: Lookup reference for Snowflake SQL transformations in Keboola — limits, backend sizes, identifier case sensitivity, data-type casting, timestamp handling, the abort variable, and read-only input mapping.
keywords:
  - Snowflake transformation limits
  - Snowflake transformation backend size
  - Snowflake case sensitivity
  - Snowflake data types Keboola
  - ABORT_TRANSFORMATION
  - Snowflake timestamp format
  - read-only input mapping Snowflake
type: reference
---

Reference material for [Snowflake SQL transformations](/transformations/snowflake-plain/). To create one, see the [how-to](/transformations/snowflake-plain/how-to/); for when and why to use them, see the [explanation](/transformations/snowflake-plain/explanation/).

<!-- Verified vs code (PRDCT-354 audit, Block B): query_timeout=7200,
     ABORT_TRANSFORMATION, and the copy/clone loading types are confirmed
     against snowflake-transformation ConfigDefinition.php / platform. Items
     still unverified are flagged inline below. -->

## Limits

| Limit | Value | Notes |
|---|---|---|
| Query runtime | 7,200 seconds (default) | Long-running queries are cancelled past this. |
| Comment length | 8,192 characters | <!-- TODO(human-review): not in the code audit — confirm. --> Queries containing a comment longer than this will segfault. |
| Constraints | Defined but not enforced | `PRIMARY KEY` / `UNIQUE` are accepted but [not enforced by Snowflake](https://docs.snowflake.com/en/sql-reference/constraints-overview). |

Snowflake is a cloud database that ships continuous updates and behavioral changes. Track them in the official [Snowflake release notes](https://docs.snowflake.com/en/release-notes/overview).

## Loading type (copy vs. clone)

When data is loaded into a Snowflake transformation there are two methods — **copy** and **clone**. They are configured on the input mapping; see [loading type](/transformations/mappings/#loading-type-snowflake-and-bigquery).

## Backend sizes (dynamic backends)

A larger backend allocates more resources to speed up a transformation that processes large volumes or complex queries. Set the size in the configuration (see [how to change it](/transformations/snowflake-plain/how-to/#make-it-faster-backend-size)).

| Size | Notes |
|---|---|
| XSmall | |
| Small | Default |
| Medium | |
| Large | |

<!-- TODO(human-review): confirm the exact list of available sizes and the default — these are product/billing-sensitive values. -->

Dynamic backends are **not** available on the [Free Plan (Pay As You Go)](/management/payg-project/). <!-- TODO(human-review): confirm plan-availability rule. -->

## Aborting execution (`ABORT_TRANSFORMATION`)

To stop a transformation and exit with a user error, set the `ABORT_TRANSFORMATION` variable to any non-empty string. The engine checks it after each successfully executed query and returns the value as a user error (for example, `Transformation aborted: Integrity check failed.`).

```sql
SET ABORT_TRANSFORMATION = (
  SELECT
      CASE
          WHEN COUNT = 0 THEN ''
          ELSE 'Integrity check failed'
      END
  FROM (
    SELECT COUNT(*) AS COUNT FROM INTEGRITY_CHECK WHERE RESULT = 'failed'
  )
);
```

The example sets `ABORT_TRANSFORMATION` to `'Integrity check failed'` when the `INTEGRITY_CHECK` table has one or more rows with `RESULT = 'failed'`. An empty string does not abort.

![A failed job whose event log shows the SET ABORT_TRANSFORMATION query and the "Transformation aborted" message](/transformations/snowflake-plain/abort.png)

## Identifier case sensitivity

Snowflake is [case sensitive](https://docs.snowflake.com/en/sql-reference/identifiers-syntax#label-identifier-casing). Unquoted table/column names are folded to **upper case**; quoted names keep their case. Keboola creates tables and columns with their original case, so unquoted identifiers in your script may not match.

Given a table created unquoted:

```sql
-- creates table FOOTABLE
CREATE TABLE footable (...);
```

all of these match it:

```sql
SELECT * FROM FOOTABLE;
SELECT * FROM "FOOTABLE";
SELECT * FROM footable;
```

while this does **not**:

```sql
-- table footable not found!
SELECT * FROM "footable";
```

Quoting every table and column name is strongly recommended so identifiers match what Keboola created:

```sql
SELECT "barcolumn" FROM "footable";
```

This matters most when setting up [input and output mappings](/transformations/mappings/).

## Working with data types

Storage [tables](/storage/tables/) store data as character types. When a table is used on output mapping you can rely on implicit casting to char:

```sql
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM TIMESTAMP, NUM NUMERIC);

INSERT INTO "test" (ID, TM, NUM)
SELECT 'first', CURRENT_TIMESTAMP, 12.5;
```

Or create the table with character columns directly:

```sql
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM VARCHAR, NUM VARCHAR);

INSERT INTO "test" (ID, TM, NUM)
SELECT 'first', CURRENT_TIMESTAMP, 12.5;
```

Or cast explicitly:

```sql
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM VARCHAR, NUM VARCHAR);

INSERT INTO "test" (ID, TM, NUM)
SELECT
    TO_CHAR('first'),
    TO_CHAR(CURRENT_TIMESTAMP),
    TO_CHAR(12.5)
;
```

For [semi-structured types](https://docs.snowflake.com/en/sql-reference/data-types-semistructured) you **must** cast explicitly:

```sql
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM VARCHAR, NUM VARCHAR, OBJ VARCHAR);

INSERT INTO "test" (ID, TM, NUM, OBJ)
SELECT
    'first',
    CURRENT_TIMESTAMP,
    12.5,
    TO_CHAR( --  <- required!
        OBJECT_CONSTRUCT(
            'NAME','name',
            'CIN','123'
        )
    )
;
```

Implicit casting does **not** work for `ARRAY`, `OBJECT`, and `VARIANT`. This code:

```sql
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM TIMESTAMP, NUM NUMERIC, OBJ OBJECT);

INSERT INTO "test" (ID, TM, NUM, OBJ)
SELECT
    'first',
    CURRENT_TIMESTAMP,
    12.5,
    OBJECT_CONSTRUCT(
        'NAME','name',
        'CIN','123'
    )
;
```

fails with:

```
Expression type does not match column data type, expecting VARCHAR(16777216) but got OBJECT for column OBJ, SQL state 22000
```

## Timestamp columns

By default Snowflake uses the `YYYY-MM-DD HH24:MI:SS.FF3` [format](https://docs.snowflake.com/en/sql-reference/functions-conversion#label-date-time-format-conversion) when converting a `timestamp` column to a character string. So:

```sql
CREATE TABLE "ts_test" AS (SELECT CURRENT_TIMESTAMP AS "ts");
```

lands in Storage as `2018-04-09 06:43:57.866 -0700`. To control the output, cast to a string first:

```sql
CREATE TABLE "out" AS
    (SELECT TO_CHAR("ts", 'YYYY-MM-DD HH:MI:SS') AS "ts" FROM "ts_test");
```

Do **not** use `ALTER SESSION` to change the default timestamp format — the loading and unloading sessions are separate from your transformation/sandbox session and the format may change unexpectedly.

In the AWS US Keboola [region](https://developers.keboola.com/overview/api/#regions-and-endpoints) (`connection.keboola.com`), these [Snowflake parameters](https://docs.snowflake.com/en/sql-reference/parameters) are overridden: <!-- TODO(human-review): confirm these region-specific overrides are current. -->

| Parameter | Value |
|---|---|
| `TIMESTAMP_OUTPUT_FORMAT` | `DY, DD MON YYYY HH24:MI:SS TZHTZM` |
| `TIMESTAMP_TYPE_MAPPING` | `TIMESTAMP_LTZ` |
| `TIMESTAMP_DAY_IS_ALWAYS_24H` | `yes` |

Snowflake also works with time zones (and [Daylight Saving Time](https://en.wikipedia.org/wiki/Daylight_saving_time)), so distinguish the conversion functions:

```sql
SELECT
    -- yields 2013-03-10 02:12:00.000 +0000
    TO_TIMESTAMP_NTZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'),
    -- yields 2013-03-10 03:12:00.000 -0700
    TO_TIMESTAMP_TZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'),
    -- yields 2013-03-10 03:12:00.000 -0700
    TO_TIMESTAMP('10.3.2013 2:12', 'DD.MM.YYYY HH:MI');
```

## Read-only input mapping: buckets and schemas

How a read-only input mapping works in general is described under [read-only input mapping](/transformations/mappings/#read-only-input-mapping).

- Buckets are represented by **schemas**. List every schema available to your account with `SHOW SCHEMAS IN ACCOUNT;` — each schema is a bucket.
- Alias tables are materialized as database **views** and are reachable via read-only input mappings, including filtered aliases and aliases from linked buckets.
- For a **linked bucket**, the schema lives in another database, so you must include that project's database name. Example: bucket `in.c-customers` linked from `in.c-crm-extractor` in project `123` is referenced as `"KEBOOLA_123"."in.c-crm-extractor"."my-table"`.

When developing, the easiest way to find the correct database and schema names is to create a [workspace](/transformations/#developing-transformations) with read-only input mappings enabled and inspect the database directly.
