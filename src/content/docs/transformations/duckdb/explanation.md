---
title: When should I use a DuckDB transformation?
slug: 'transformations/duckdb/explanation'
description: Understand what a DuckDB transformation is in Keboola, why it is fast and cost-effective for small-to-medium analytics, and when to choose it over Snowflake.
keywords:
  - DuckDB transformation
  - when to use DuckDB
  - DuckDB vs Snowflake
  - DuckDB analytics Keboola
  - DuckDB OLAP
type: explanation
---

A **DuckDB transformation** runs your SQL in [DuckDB](https://duckdb.org/), an in-process analytical (OLAP) database, while Keboola maps data to and from [Storage](/storage/tables/). This page explains what that means and when DuckDB is the right choice. To build one, follow the [how-to](/transformations/duckdb/how-to/); for all settings, see the [reference](/transformations/duckdb/reference/).

:::caution[Beta]
DuckDB Transformation is currently in **BETA**. Breaking changes may occur.
:::

## What it is

DuckDB runs **in-process** — there is no external database server to provision. It uses **columnar storage** optimized for analytical queries, runs independent scripts within a block **in parallel** (with automatic dependency analysis), and ships a **rich SQL dialect** with modern conveniences. For Keboola that makes it a fast, low-overhead, cost-effective backend for small-to-medium analytics.

Like every [transformation](/transformations/), it works on an isolated copy of your data: input mapping stages your Storage tables, your SQL runs against them, and output mapping writes results back.

## Why DuckDB

- **In-process execution** — no warehouse to spin up; low overhead and fast startup.
- **Columnar + parallel** — efficient on analytical (`SELECT`-heavy) workloads.
- **Cost-effective** — a cheaper alternative to cloud warehouses for datasets up to a few terabytes.
- **Rich SQL** — quality-of-life extensions (`GROUP BY ALL`, `EXCLUDE`, `ASOF JOIN`, `SUMMARIZE`); see the [reference](/transformations/duckdb/reference/#sql-extensions).

## When to use DuckDB vs. Snowflake

**Choose DuckDB for:**

- Ad-hoc analysis and small-to-medium datasets (under a few TB)
- Rapid prototyping, development, and testing
- Projects with limited budgets

**Choose [Snowflake](/transformations/snowflake-plain/) for:**

- Very large datasets (TB+) and complex enterprise workloads
- Sharing a warehouse across multiple processes
- Maximum scalability and Snowflake-specific features

Migrating existing Snowflake transformations? See the [Snowflake to DuckDB migration guide](/transformations/duckdb/snowflake-migration/).

## What DuckDB is not

DuckDB is an **OLAP** database optimized for `SELECT` and analytical queries. Avoid workflows with frequent `INSERT`/`UPDATE` operations — for transactional workloads, use a different backend such as [Snowflake](/transformations/snowflake-plain/).

## Designing maintainable transformations

- Split complex transformations into smaller steps, each producing one output table.
- Use consistent naming for output tables (for example, `stg_customers`, `fact_orders`, `dim_products`).
- Document non-obvious business logic directly in the SQL.

Because scripts within a block run in parallel based on a dependency graph, organizing logic into clear blocks lets the engine optimize execution for you — see [block-based orchestration](/transformations/duckdb/reference/#block-based-orchestration).
