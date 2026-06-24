---
title: When should I use a Snowflake transformation?
slug: 'transformations/snowflake-plain/explanation'
description: Understand what a Snowflake SQL transformation is in Keboola, why and when to choose it over Python, R, BigQuery, or DuckDB, and how it fits into the input-mapping → script → output-mapping flow.
keywords:
  - Snowflake transformation
  - Snowflake transformations
  - when to use Snowflake transformation
  - SQL transformation Keboola
  - Snowflake vs Python transformation
  - Snowflake backend
type: explanation
---

A **Snowflake transformation** runs your [SQL](https://www.snowflake.com/) against a Snowflake database that Keboola manages for you. You write `SELECT` / `CREATE TABLE` statements; Keboola takes care of the warehouse, the staging area, and moving results back to [Storage](/storage/tables/). This page explains what that means and when it is the right choice. To build one, follow the [how-to](/transformations/snowflake-plain/how-to/); for exact limits and syntax rules, see the [reference](/transformations/snowflake-plain/reference/).

## What it is

Like every [transformation](/transformations/), a Snowflake transformation operates on an isolated copy of your data, not on Storage directly:

1. **Input mapping** copies the Storage tables you name into a temporary staging schema.
2. Your **SQL script** runs against that staging schema.
3. **Output mapping** writes the resulting tables back to Storage.

Because it works on a copy, you can rename or restructure Storage tables without breaking the script, and a failed run never corrupts your source data.

## Why Snowflake

Snowflake is a cloud data warehouse, which removes most of the operational burden of traditional databases:

- **No database administration** — no servers, vacuuming, or patching to manage.
- **No indexes, sort keys, distribution styles, or column compression** to design and tune.
- **Easy scaling** — increase the [backend size](/transformations/snowflake-plain/reference/#backend-sizes-dynamic-backends) when a job needs more power, without rewriting anything.
- **Simple data types** and a familiar SQL dialect.
- **Strong processing power and throughput** for large joins and aggregations.

Being a managed cloud service, Snowflake also ships continuous updates; occasionally that means behavioral changes worth tracking in the [release notes](https://docs.snowflake.com/en/release-notes/overview).

## When to use it (and when not to)

Choose a Snowflake transformation when:

- Your logic is naturally expressed in **SQL** — joins, aggregations, filtering, denormalizing, integrity checks.
- Your data is **tabular** and you want set-based processing close to where the data already lives.
- You want to scale up heavy jobs simply by [changing the backend size](/transformations/snowflake-plain/how-to/#make-it-faster-backend-size).

Consider a different backend when:

- You need **procedural code**, custom libraries, or ML — use a [Python](/transformations/python-plain/) or [R](/transformations/r-plain/) transformation.
- Your project runs on a different warehouse — Keboola also offers [BigQuery](/transformations/bigquery/), [DuckDB](/transformations/duckdb/), and [Oracle](/transformations/oracle/) transformations. The concepts on this page are the same; the SQL dialect and limits differ.

## Things to understand up front

Two Snowflake behaviors trip people up; both are detailed in the [reference](/transformations/snowflake-plain/reference/):

- **Case sensitivity.** Snowflake folds unquoted identifiers to upper case, but Keboola creates tables and columns in their original case. Quote your identifiers (`"my_column"`) so they match — see [identifier case sensitivity](/transformations/snowflake-plain/reference/#identifier-case-sensitivity).
- **Everything lands as character data.** Storage stores columns as character types, so values are cast to char on output — and `ARRAY`, `OBJECT`, and `VARIANT` must be cast explicitly. See [working with data types](/transformations/snowflake-plain/reference/#working-with-data-types).

Understanding these two points early saves most of the debugging time newcomers spend on Snowflake transformations.
