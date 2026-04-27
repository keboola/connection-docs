---
title: Snowflake to DuckDB Migration
permalink: /transformations/duckdb/snowflake-migration/
---

* TOC
{:toc}

This guide covers the key differences between Snowflake and DuckDB SQL dialects and provides practical advice
for migrating your Snowflake transformations to DuckDB in Keboola.

## Automatic SQL Transpilation

[SQLGlot](https://github.com/tobymao/sqlglot) can automatically convert approximately 85% of Snowflake SQL syntax to DuckDB.
However, some constructs require manual adjustment. The sections below cover the most common differences you will encounter.

You can also use the **Kai AI assistant** in Keboola to help with migration.

## Identifier Case Sensitivity

This is one of the most critical differences when migrating.

**Snowflake:**
- Unquoted identifiers are converted to **uppercase** (`MyTable` becomes `MYTABLE`).
- Quoted identifiers are **case-sensitive** (`"MyTable"` and `"MYTABLE"` are different tables).

**DuckDB table names:**
- Unquoted table names are converted to **lowercase** (`MyTable` becomes `mytable`).
- Quoted table names are **case-sensitive** (`"MyTable"` references exactly `MyTable`).

**DuckDB column names:**
- Columns are **always case-sensitive** regardless of quoting (`SELECT columnName` and `SELECT ColumnName` refer to different columns).

**Migration tip:** Use consistent **lowercase** naming in DuckDB:

{% highlight sql %}
-- Recommended: use lowercase names
CREATE TABLE mytable AS SELECT ...;
{% endhighlight %}

## Data Type Mapping

| Snowflake | DuckDB | Notes |
|---|---|---|
| `VARIANT` | `JSON` or `VARCHAR` | Semi-structured data |
| `ARRAY` | `LIST` | Native arrays |
| `OBJECT` | `STRUCT` or `JSON` | Nested objects |
| `INTEGER` | `INTEGER` | Same |
| `VARCHAR` | `VARCHAR` | Same |
| `TIMESTAMP` | `TIMESTAMP` | Same |
| `FLOAT` | `FLOAT` | Same |
| `BOOLEAN` | `BOOLEAN` | Same |
| `DATE` | `DATE` | Same |

## SQL Function Differences

### Window Functions

Snowflake supports the `QUALIFY` clause for filtering window function results. DuckDB does not support `QUALIFY`;
use a subquery with `WHERE` instead.

{% highlight sql %}
-- Snowflake
SELECT * FROM orders
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1;

-- DuckDB
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM orders
) WHERE rn = 1;
{% endhighlight %}

### Null Handling

{% highlight sql %}
-- Snowflake
SELECT NVL(column_a, 'default') FROM my_table;

-- DuckDB
SELECT COALESCE(column_a, 'default') FROM my_table;
{% endhighlight %}

### Conditional Expressions

{% highlight sql %}
-- Snowflake
SELECT IFF(status = 'active', 'yes', 'no') FROM users;

-- DuckDB
SELECT CASE WHEN status = 'active' THEN 'yes' ELSE 'no' END FROM users;
{% endhighlight %}

### Date Arithmetic

{% highlight sql %}
-- Snowflake
SELECT DATEADD(day, 7, order_date) FROM orders;

-- DuckDB
SELECT order_date + INTERVAL '7 days' FROM orders;
{% endhighlight %}

{% highlight sql %}
-- Snowflake
SELECT DATEDIFF(day, start_date, end_date) FROM projects;

-- DuckDB
SELECT date_diff('day', start_date, end_date) FROM projects;
{% endhighlight %}

### String Aggregation

{% highlight sql %}
-- Snowflake
SELECT department, LISTAGG(employee_name, ', ') WITHIN GROUP (ORDER BY employee_name)
FROM employees GROUP BY department;

-- DuckDB
SELECT department, STRING_AGG(employee_name, ', ')
FROM employees GROUP BY department;
{% endhighlight %}

## Functions That Work the Same

The following functions have the same syntax in both Snowflake and DuckDB:

- `SUBSTRING(str, start, len)`
- `POSITION('x' IN str)`
- `CONCAT(a, b)` --- both handle `NULL` gracefully
- `a || b` --- both return `NULL` if any input is `NULL`
- `LIMIT n`
- `FETCH FIRST n ROWS`
- `COALESCE(a, b, c)`
- `CAST(value AS type)`

## CREATE TABLE Syntax

**Same in both:**

{% highlight sql %}
-- Basic table creation
CREATE TABLE customers (id INT, name VARCHAR);

-- Primary keys
CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR);

-- Temporary tables
CREATE TEMP TABLE temp_data (id INT);
CREATE TEMPORARY TABLE temp_data (id INT);

-- CREATE TABLE AS SELECT (CTAS)
CREATE TABLE new_table AS SELECT * FROM old_table;

-- CREATE OR REPLACE
CREATE OR REPLACE TABLE customers AS SELECT * FROM source;

-- IF NOT EXISTS
CREATE TABLE IF NOT EXISTS customers (id INT);
{% endhighlight %}

**Key differences:**

### Transient Tables

{% highlight sql %}
-- Snowflake only --- not supported in DuckDB
CREATE TRANSIENT TABLE staging_data (id INT, value VARCHAR);
{% endhighlight %}

DuckDB does not have a `TRANSIENT` keyword. Use regular or `TEMP` tables instead.

### Temporary Table Schemas

- **Snowflake:** Temporary tables can be created in any schema.
- **DuckDB:** Temporary tables are **always** in the `temp.main` schema (you cannot specify a different schema).
- **Both:** Temporary tables are automatically dropped at the end of the session.

### Name Collisions

In DuckDB, a temporary table can have the same name as a regular table. The temporary table takes **priority**.
To access the regular table explicitly, use its fully qualified name: `memory.main.table_name`.

## Summary of Common Replacements

| Category | Snowflake | DuckDB |
|---|---|---|
| Window functions | `QUALIFY` | `ROW_NUMBER()` + `WHERE` |
| Null handling | `NVL(a, b)` | `COALESCE(a, b)` |
| Conditionals | `IFF(cond, a, b)` | `CASE WHEN cond THEN a ELSE b END` |
| Date math | `DATEADD(unit, n, date)` | `date + INTERVAL 'n unit'` |
| Date diff | `DATEDIFF(unit, d1, d2)` | `date_diff('unit', d1, d2)` |
| String aggregation | `LISTAGG(...) WITHIN GROUP` | `STRING_AGG(...)` |
| Temp tables | `CREATE TEMPORARY TABLE` | `CREATE TEMP TABLE` (same) |
| Transient tables | `CREATE TRANSIENT TABLE` | Not supported |

## Migration Tips

1. **Start with SQLGlot** --- it handles most syntax conversions automatically.
2. **Watch out for case sensitivity** --- Snowflake defaults to uppercase, DuckDB to lowercase.
3. **Test queries incrementally** --- migrate one block at a time and verify results.
4. **Use Kai AI assistant** --- it can help identify and fix syntax differences.
5. **Check column aliases** --- DuckDB handles column aliases differently than Snowflake in some contexts. `GROUP BY ALL` can help resolve alias-related issues.
6. **Verify aggregate functions** --- if your input tables are non-typed, enable **Infer input table data types** or add explicit `CAST()` calls to avoid type errors with functions like `SUM()` or `AVG()`.

## DuckDB Snowflake Extension

For local development, DuckDB provides a [Snowflake extension](https://duckdb.org/community_extensions/extensions/snowflake)
that lets you attach data from Snowflake and work with it using DuckDB syntax. This can be useful for testing migration queries locally before deploying them in Keboola.
