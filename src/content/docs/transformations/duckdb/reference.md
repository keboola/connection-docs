---
title: DuckDB transformation reference
slug: 'transformations/duckdb/reference'
description: Lookup reference for DuckDB SQL transformations in Keboola — configuration settings, backend sizes, versions, sync actions, block orchestration, Parquet and type inference, case sensitivity, and SQL extensions.
keywords:
  - DuckDB transformation settings
  - DuckDB backend size
  - DuckDB version
  - DuckDB sync actions
  - DuckDB parquet
  - DuckDB infer data types
  - DuckDB case sensitivity
  - DuckDB SQL extensions
type: reference
---

Reference material for [DuckDB SQL transformations](/transformations/duckdb/). To create one, see the [how-to](/transformations/duckdb/how-to/); for when to choose DuckDB, see the [explanation](/transformations/duckdb/explanation/).

:::caution[Beta]
DuckDB Transformation is currently in **BETA**. Breaking changes may occur.
:::

<!-- Verified vs code (PRDCT-354 audit, Block B): the settings, parameter names
     (threads, max_memory_mb, dtypes_infer, debug, syntax_check, duckdb_version),
     SUPPORTED_VERSIONS={1.5.2,1.4.4}, the 4 sync actions, and block orchestration
     are confirmed against configuration.py / versions.py / component.py. The
     backend sizes/memory figures and the default Timeout are platform-level and
     remain flagged inline below. -->


## Configuration settings

Set these on the right-side panel of the transformation configuration:

![The DuckDB transformation configuration page with the settings panel on the right — Timeout, Backend size, DuckDB version, and the data-type toggles](/transformations/duckdb/configuration.png)

| Setting | Description | Default |
|---|---|---|
| **Timeout** | Maximum execution time. | 1 hour <!-- TODO(human-review): confirm default --> |
| **Backend size** | Memory allocated (see [Backend sizes](#backend-sizes)). | Small |
| **DuckDB version** | Which DuckDB version runs the transformation (see [DuckDB version](#duckdb-version)). | `latest` |
| **Automatic data types** | Automatically assign data types to output tables. | <!-- TODO(human-review): confirm default --> |
| **Use parquet for input tables** | Load inputs as Parquet instead of CSV (see [Parquet format](#parquet-format)). | Off |
| **Infer input table data types** | Infer types from input tables (see [Infer input table data types](#infer-input-table-data-types)). | Off |
| **Debug mode** | Enable debug logging for troubleshooting. | Off |

### DuckDB version

Select the DuckDB version used to run the transformation. Use `latest` (default) to always run on the most recent supported version, or pin a specific supported version — **`1.5.2`** or **`1.4.4`** — for stability. Each supported version runs in its own isolated environment.

## Backend sizes

A larger backend allocates more memory. See the [how-to](/transformations/duckdb/how-to/#make-it-faster-backend-size) for how to change it.

| Backend size | Memory | Recommended for |
|---|---|---|
| **XSmall** | 8 GB | Small datasets, testing |
| **Small** *(default)* | 16 GB | Most use cases |
| **Medium** | 32 GB | Large datasets (5 GB+) |
| **Large** | 113.6 GB | Very large datasets (10 GB+) |

<!-- TODO(human-review): confirm backend sizes, memory figures, and the default. -->

Dynamic backends are **not** available on the [Free Plan (Pay As You Go)](/management/payg-project/). <!-- TODO(human-review): confirm plan-availability rule. -->

### Auto-resource detection

DuckDB automatically detects available CPU and memory. You can also set resource limits manually with the `threads` and `max_memory_mb` parameters in the transformation configuration.

## Block-based orchestration

DuckDB transformations organize and execute SQL with **block-based orchestration**:

- **Blocks** run **sequentially** (one after another).
- **Scripts** (code pieces) within a block run **in parallel** when they have no dependencies on each other.
- The system uses [SQLGlot](https://github.com/tobymao/sqlglot) to analyze SQL and build a **DAG** of dependencies, then optimizes execution order automatically.

## Sync actions

Four **sync actions** help you debug and visualize without running the full transformation, available from the configuration page:

| Action | Name | What it does |
|---|---|---|
| Syntax check | `syntax_check` | Validates SQL syntax without executing queries. |
| Lineage visualization | `lineage_visualization` | Markdown diagram of data dependencies (how tables flow through). |
| Execution plan visualization | `execution_plan_visualization` | Shows the planned execution order (blocks and batches). |
| Expected input tables | `expected_input_tables` | Lists the input tables the transformation expects, based on SQL analysis. |

## Parquet format

By default, input tables are loaded as CSV. Enabling **Use parquet for input tables** loads them as Parquet, which is much faster, uses less memory, and is columnar (optimized for analytics). Recommended for datasets larger than 1 GB.

## Infer input table data types

Keboola Storage tables can be **non-typed** (all columns `VARCHAR`). With type inference off, every input value is a string, so functions like `SUM()` fail because they expect numeric types.

Enable **Infer input table data types** to have DuckDB detect the real types (for example `INTEGER`, `FLOAT`, `DATE`) so aggregate and type-specific operations work and output columns are properly typed.

## Semicolons between statements

Each SQL statement **must end with a semicolon** (`;`). Separate multiple statements in one script:

```sql
-- Correct: each statement ends with a semicolon
CREATE TABLE "output_a" AS SELECT * FROM "input_a";

CREATE TABLE "output_b" AS SELECT * FROM "input_b";
```

Missing semicolons cause syntax errors.

## Identifier case sensitivity

DuckDB handles case differently from Snowflake:

- **Unquoted table names** are folded to **lowercase** (`SELECT * FROM MyTable` references `mytable`).
- **Quoted table names** are case-sensitive (`SELECT * FROM "MyTable"` references exactly `MyTable`).
- **Columns are always case-sensitive**, regardless of quoting (`columnName` and `ColumnName` are different columns).

Use consistent casing, and quote names with mixed case or special characters: `"TaBlE-stage"`. Input table names are typically lowercase unless quoted.

## Working with data types

With **Infer input table data types** disabled, all input columns load as `VARCHAR` and you must cast explicitly:

```sql
CREATE TABLE "result" AS
SELECT
    CAST("amount" AS DECIMAL) AS "amount",
    CAST("created_at" AS TIMESTAMP) AS "created_at"
FROM "source";
```

With inference enabled, DuckDB assigns the correct types and you can use them directly.

## SQL extensions

DuckDB adds quality-of-life SQL extensions:

```sql
-- GROUP BY ALL: group by all non-aggregated columns
SELECT product, category, SUM(sales) FROM orders GROUP BY ALL;

-- EXCLUDE: select all columns except some
SELECT * EXCLUDE (password, ssn, credit_card) FROM users;

-- ASOF JOIN: match nearest (e.g. time-series where timestamps don't align)
SELECT s.player_id, s.score, w.temperature
FROM scores s
ASOF JOIN weather w ON s.score_time >= w.timestamp;

-- SUMMARIZE: quick profiling (min, max, null %, unique counts)
SUMMARIZE SELECT * FROM my_table;
```

## Query optimization

- **Filter and project early** — apply `WHERE` at the source and select only the columns you need, to reduce scanned data.
- **Use `EXPLAIN`** — prefix a query with `EXPLAIN` to see the execution plan and find expensive operations.

```sql
EXPLAIN SELECT product_category, SUM(price) AS total_revenue
FROM sales
WHERE sale_date >= '2023-01-01'
GROUP BY product_category
ORDER BY total_revenue DESC;
```

## Memory management for large datasets

For datasets larger than 10 GB, configure on-disk processing with `PRAGMA` settings:

```sql
PRAGMA memory_limit='8GB';
PRAGMA temp_directory='/tmp/duckdb_temp';
PRAGMA threads=4;
PRAGMA enable_object_cache;
```
