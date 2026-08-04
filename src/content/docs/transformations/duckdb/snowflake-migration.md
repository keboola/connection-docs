---
title: Snowflake to DuckDB Migration
description: This guide covers the key differences between Snowflake and DuckDB SQL dialects and provides practical advice for migrating your Snowflake transformations to…
slug: 'transformations/duckdb/snowflake-migration'
---



This guide covers the key differences between Snowflake and DuckDB SQL dialects and provides practical advice
for migrating your Snowflake transformations to DuckDB in Keboola.

## Automatic SQL Transpilation

[SQLGlot](https://github.com/tobymao/sqlglot) can automatically convert approximately 85% of Snowflake SQL syntax to DuckDB.
However, some constructs require manual adjustment. The sections below cover the most common differences you will encounter.

You can also use the **Kai AI assistant** in Keboola to help with migration.

## Transformation Migration Component

Keboola provides an experimental **Transformation Migration** component (`keboola.app-transformation-migration`) that automates 
the migration of Snowflake transformations to DuckDB. The component handles SQL dialect translation, preserves input/output 
table mappings, and creates new DuckDB transformation configurations automatically.

**Important:** The automatic migration is **not 100% accurate**. The success rate depends on the complexity of your SQL, 
data types, and Snowflake-specific features used. Expect that roughly **25% of migrated transformations will require manual 
adjustments** --- for example, fixing case sensitivity issues, replacing unsupported functions, or adjusting data type casts. 
Always review and test the migrated configurations before using them in production.

### Tutorial: Migrating Snowflake Transformations

#### Step 1: Create a New Configuration

In your Keboola project, go to **Components** and search for **Transformation Migration**. Create a new configuration.
Set the following parameters:

- **Source Branch** --- select the branch containing your Snowflake transformations (default: `default`).
- **Destination Branch** --- choose an existing dev branch for the migrated configurations, or create a new one.
- **Source Transformation Type** --- select `Snowflake`.
- **Destination Transformation Type** --- select `DuckDB`.
- **Destination Config Name Pattern** --- use `%s` as a placeholder for the original name 
  (e.g., `%s` keeps the same name, `%s_duckdb` appends a suffix).

![Migration Component Configuration](/transformations/duckdb/migration-component.png)

#### Step 2: Select Transformations to Migrate

Click **Load Transformations** to populate the list of available Snowflake transformations.
Select one or more transformations you want to migrate to DuckDB.

![Select Transformations to Migrate](/transformations/duckdb/migration-select-transformations.png)

#### Step 3: Save and Run

After selecting the transformations, click **Save** and then **Run Component**.

![Save Configuration and Run](/transformations/duckdb/migration-save-and-run.png)

#### Step 4: Review the Job

Once the job completes, review the migration summary in the job detail. The logs show which transformations 
were migrated successfully and provide links to the newly created DuckDB configurations.

![Job Detail with Migration Results](/transformations/duckdb/migration-job-detail.png)

#### Step 5: Review and Adjust the Migrated Configuration

Open the newly created DuckDB transformation. The component preserves all input/output table mappings and runtime settings.
**Review the SQL code carefully** --- some queries may need manual adjustments due to syntax differences between 
Snowflake and DuckDB (see the sections below for common differences).

![Migrated DuckDB Transformation](/transformations/duckdb/migration-result.png)

### What the Component Does

- Uses [SQLGlot](https://github.com/tobymao/sqlglot) to automatically translate SQL code blocks from Snowflake to DuckDB dialect.
- Preserves all input/output table mappings and runtime settings (backend size, etc.).
- If SQL translation fails for any code block, the original Snowflake SQL is preserved as comments in the DuckDB configuration, 
  and an error is reported at the end of the migration.

### Limitations

- The automatic SQL translation is **not perfect**. Complex queries, Snowflake-specific functions, and edge cases 
  in data types may not be converted correctly.
- Roughly **25% of migrated transformations** will need some manual fixes --- typically related to case sensitivity, 
  unsupported functions, or data type differences.
- The component is **experimental** and may contain unhandled bugs or have various limitations.
- Always **test the migrated transformations** on a dev branch before deploying to production.

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

```sql
-- Recommended: use lowercase names
CREATE TABLE mytable AS SELECT ...;
```

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

```sql
-- Snowflake
SELECT * FROM orders
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1;

-- DuckDB
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM orders
) WHERE rn = 1;
```

### Null Handling

```sql
-- Snowflake
SELECT NVL(column_a, 'default') FROM my_table;

-- DuckDB
SELECT COALESCE(column_a, 'default') FROM my_table;
```

### Conditional Expressions

```sql
-- Snowflake
SELECT IFF(status = 'active', 'yes', 'no') FROM users;

-- DuckDB
SELECT CASE WHEN status = 'active' THEN 'yes' ELSE 'no' END FROM users;
```

### Date Arithmetic

```sql
-- Snowflake
SELECT DATEADD(day, 7, order_date) FROM orders;

-- DuckDB
SELECT order_date + INTERVAL '7 days' FROM orders;
```

```sql
-- Snowflake
SELECT DATEDIFF(day, start_date, end_date) FROM projects;

-- DuckDB
SELECT date_diff('day', start_date, end_date) FROM projects;
```

### String Aggregation

```sql
-- Snowflake
SELECT department, LISTAGG(employee_name, ', ') WITHIN GROUP (ORDER BY employee_name)
FROM employees GROUP BY department;

-- DuckDB
SELECT department, STRING_AGG(employee_name, ', ')
FROM employees GROUP BY department;
```

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

```sql
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
```

**Key differences:**

### Transient Tables

```sql
-- Snowflake only --- not supported in DuckDB
CREATE TRANSIENT TABLE staging_data (id INT, value VARCHAR);
```

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
