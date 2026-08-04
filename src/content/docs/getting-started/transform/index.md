---
title: 'Transform Your Data'
slug: 'getting-started/transform'
description: 'Create an SQL transformation that joins your loaded tables into one denormalized table, and learn how input and output mapping keep Storage safe.'
redirect_from:
  - /tutorial/manipulate/
---

Four raw tables are not much use on their own. This step joins them into one wide table with
SQL, and introduces the mechanism that keeps your source data safe while you do it.
Step 3 of the [Getting Started](/getting-started/) arc.

<!-- Tutorial-type page (step 3 of 6). Walked live in project 264 on 2026-08-04: the button is
"Create Transformation", the dialog is "New Transformation", the sections are "Table Input
Mapping" (Add Table Input) and "Table Output Mapping" (New Table Output), Source is multi-select,
and Queries offers "Create Multiple Queries". The Snowflake SQL ran successfully against the four
HTTP tables. The SQL was RUN twice (jobs 95584510 and
95584854, 53s and 43s) producing out.c-denormalize-opportunities.opportunity_denorm with 639 rows
and 23 columns both times — so the output bucket really is plural, and the transformation is
re-runnable. All ten screenshots are fresh captures from that walk. -->

## What you need

Four tables in Storage — `opportunity`, `account`, `user` and `level` — from
[Load Your Data](/getting-started/load/). They sit in whatever bucket the connector created,
and its name contains a configuration ID, so yours will not match the screenshots.

That does not matter. What the SQL depends on is the **Table name** you give each table in the
input mapping below: those must be exactly `opportunity`, `account`, `user` and `level`, or you
have to edit the queries to match.

## How a transformation works

A transformation never runs against your Storage tables directly. Keboola copies the tables
you ask for into a temporary database schema, runs your queries there, and copies back only
the results you ask for. Three settings control that:

1. **[Input mapping](/transformations/mappings/#input-mapping)** — which Storage tables get
   copied in, and what they are called inside the transformation. Anything you do not list
   is not visible to your code.
2. **[Output mapping](/transformations/mappings/#output-mapping)** — which tables your code
   produces get written back to Storage, and where. Anything you do not list is thrown away
   when the job ends.
3. **Queries** — the SQL itself, organized into named code blocks.

That is the safeguard: the only tables your transformation can change are the ones named in
the output mapping. It is also what lets Keboola track data lineage across the project.

![Screenshot - How mapping works](/getting-started/transform/mapping.png)

## Create the transformation

1. Open **Transformations**.

   ![Screenshot - Transformations section](/getting-started/transform/00-transformations.png)

2. Click **Create Transformation**. The **New Transformation** dialog lists what this project
   can run — *Snowflake SQL Transformation*, *Python*, *R*, and *DuckDB Transformation* (beta),
   or *BigQuery SQL Transformation* on a BigQuery project.

   **This list is how you find out which SQL dialect you need.** New
   [Free Plan](/management/payg-project/) projects default to the
   [BigQuery backend](/storage/); contract customers choose theirs. Pick the SQL transformation
   your project offers, and use the matching query block below.

   ![Screenshot - The New Transformation dialog](/getting-started/transform/01-new-transformation.png)

3. Name it `Denormalize opportunities`, add a description, and in **Folder** type `Opportunity`
   and pick **Create folder "Opportunity"**. Folders are cosmetic, but they are the difference
   between a browsable project and a wall of configurations. Ignore **Use predefined code
   pattern**. Click **Create transformation**.

   ![Screenshot - Name the transformation](/getting-started/transform/02-name-transformation.png)

## Set the input mapping

1. In **Table Input Mapping**, click **Add Table Input**.

2. **Source** searches your Storage as you type — type `opportunity` and tick the table. The
   picker is multi-select, so you can tick `account`, `user` and `level` in the same go; it
   keeps a count of what you have chosen.

   ![Screenshot - Selecting source tables](/getting-started/transform/03-input-source.png)

3. With a single table selected, **Table name** fills in automatically — `opportunity`. That is
   the name your SQL uses, and it is what makes the queries below work no matter which bucket
   the table actually lives in.

4. Click **Add Input**.

You should end up with four inputs — `opportunity`, `account`, `user`, `level`:

![Screenshot - The finished input mapping](/getting-started/transform/04-input-mapping.png)

Input mapping has more to it — incremental processing with **Changed in Last**, column
filters, data filters. None of it is needed here; see
[input mapping](/transformations/mappings/#input-mapping) when you have a large table to
process.

## Set the output mapping

1. In **Table Output Mapping**, click **New Table Output**.

2. In **Table name**, enter `opportunity_denorm`. This is the name of a table your SQL will
   create — it does not exist yet.

3. **Destination** is filled in for you from the transformation's name:
   `out.c-denormalize-opportunities.opportunity_denorm` — the `out` stage, a bucket named after
   the transformation (note the plural), and the table. Neither the bucket nor the table exists
   yet; both are created the first time the transformation runs.

   ![Screenshot - The finished output mapping](/getting-started/transform/06-output-mapping.png)

## Write the queries

In the empty **Queries** section, click **Create Multiple Queries**. Your SQL lives in a *code*
inside a *block*: you get `Block 1` holding one code. Name the code `Opportunity denorm`, paste
the SQL for **your project's backend**, and save.

Later you can add another code to the same block with **New Code**, or a whole second block with
**New Code Block** — that is how a longer transformation gets organized. Once there is code,
the **Queries** header offers **Copy Code** and **Edit Code**.

### If your project uses Snowflake

```sql
CREATE TABLE "tmp_level" AS
    SELECT "Name", CASE
        WHEN "Level" = 'S' THEN 'Senior'
        WHEN "Level" = 'M' THEN 'Intermediate'
        WHEN "Level" = 'J' THEN 'Junior' END AS "Level"
    FROM "level";

CREATE TABLE "tmp_opportunity" AS
    SELECT *, CASE
        WHEN "Probability" < 50 THEN 'Poor'
        WHEN "Probability" < 70 THEN 'Good'
        ELSE 'Excellent' END AS "ProbabilityClass"
    FROM "opportunity";

CREATE TABLE "opportunity_denorm" AS
    SELECT "tmp_opportunity".*,
        "user"."Name" AS "UserName", "user"."Sales_Market" AS "UserSalesMarket",
        "user"."Global_Market" AS "UserGlobalMarket",
        "account"."Name" AS "AccountName", "account"."Region" AS "AccountRegion",
        "account"."Status" AS "AccountStatus", "account"."FirstOrder" AS "AccountFirstOrder"
    FROM "tmp_opportunity"
        JOIN "user" ON "tmp_opportunity"."OwnerId" = "user"."Id"
        JOIN "account" ON "tmp_opportunity"."AccountId" = "account"."Id"
        JOIN "tmp_level" ON "user"."Name" = "tmp_level"."Name";
```

Three queries, in order: spell out the seniority codes; classify each opportunity by how
likely it is to close; then join everything into `opportunity_denorm`. Only that last table
is in the output mapping, so the two `tmp_` tables vanish when the job finishes.

Every identifier is double-quoted because Snowflake uppercases unquoted ones, and the
column names in the sample data are mixed case.

![Screenshot - The configured transformation](/getting-started/transform/07-configured.png)

### If your project uses BigQuery

[BigQuery](/transformations/bigquery/) does not quote identifiers this way, and CTEs replace
the temporary tables. The result is the same table:

```sql
CREATE TABLE opportunity_denorm AS
WITH tmp_level AS (
    SELECT
        Name,
        CASE
            WHEN Level = 'S' THEN 'Senior'
            WHEN Level = 'M' THEN 'Intermediate'
            WHEN Level = 'J' THEN 'Junior'
        END AS Level
    FROM
        level
),
tmp_opportunity AS (
    SELECT
        * EXCEPT (_timestamp),
        CASE
            WHEN CAST(Probability as INT64) < 50 THEN 'Poor'
            WHEN CAST(Probability as INT64) < 70 THEN 'Good'
            ELSE 'Excellent'
        END AS ProbabilityClass
    FROM
        opportunity
)
SELECT
    tmp_opportunity.*,
    user.Name AS UserName,
    user.Sales_Market AS UserSalesMarket,
    user.Global_Market AS UserGlobalMarket,
    account.Name AS AccountName,
    account.Region AS AccountRegion,
    account.Status AS AccountStatus,
    account.FirstOrder AS AccountFirstOrder
FROM
    tmp_opportunity
JOIN
    user ON tmp_opportunity.OwnerId = user.Id
JOIN
    account ON tmp_opportunity.AccountId = account.Id
JOIN
    tmp_level ON user.Name = tmp_level.Name;
```

<!-- VERIFY(owner): this BigQuery variant is carried over from the previous version of the
page and has NOT been run against a BigQuery project — the demo project (264) is Snowflake,
so it could not be tested during the rewrite. It matters more than it used to: new Free Plan
projects default to BigQuery (storage/index.md), so this is the block most new readers will
use. The original also referenced `Level`.`Level` inside the CTE, which looks wrong;
corrected to `Level` here but unverified. -->

## Run it and check the result

Click **Run Transformation** and confirm with **Run**. That creates a background job which copies
the input tables in, runs your SQL, and writes `opportunity_denorm` back to Storage. The job log
spells the mechanism out — *"Loading 4 tables to workspace"*, then *"Cloned table … into workspace
WORKSPACE_… as opportunity"* — which is the mapping model from the top of this page, in action.

![Screenshot - Running the transformation](/getting-started/transform/08-run.png)

A **Snowflake SQL job has been scheduled** notification appears with a **Show job** link; you can
also find it under **Jobs**. It takes under a minute — the run behind these screenshots took 53
seconds — and a green **Success** means it worked.

![Screenshot - Successful job](/getting-started/transform/09-job-success.png)

Then open **Storage**: there is a new bucket `out.c-denormalize-opportunities` holding
`opportunity_denorm` — **639 rows and 23 columns**. That row count is the same as the source
`opportunity` table, which is the quickest sanity check that the three joins matched every row
without duplicating any.

The 23 columns are the original 15 plus the eight the SQL added: `ProbabilityClass`, `UserName`,
`UserSalesMarket`, `UserGlobalMarket`, `AccountName`, `AccountRegion`, `AccountStatus` and
`AccountFirstOrder`.

The table list also has a **Recently Updated By** column, showing `Denormalize opportunities /
Snowflake SQL` — the fastest way to answer "where did this table come from?" months later.

![Screenshot - The new table in Storage](/getting-started/transform/10-table-in-storage.png)

Running the transformation again simply rebuilds the table; it is safe to re-run while you are
experimenting.

## If it goes wrong

- **`Object 'ACCOUNT' does not exist`** (Snowflake). A table is missing from the input
  mapping, or the **Table name** inside the transformation differs from what the SQL uses.
  Snowflake uppercases unquoted identifiers, which is why every identifier is double-quoted.
  On BigQuery the equivalent error is `Table ... was not found`.
- **The job succeeds but Storage has no new table.** The output mapping is empty or names a
  table your SQL never creates. The names must match exactly: `opportunity_denorm`.
- **`Numeric value '' is not recognized`.** Tables loaded from CSV arrive as text columns
  unless you give them types, so an empty cell is `''` rather than `NULL` and a comparison
  like `"Probability" < 50` fails on it. The sample data has no empty values, so you will not
  hit this here — but with your own data, cast defensively:
  `TRY_CAST("Probability" AS NUMBER(38,9))` on Snowflake,
  `SAFE_CAST(Probability AS INT64)` on BigQuery.
- **You want to see what the query actually returns before saving.** That is what a
  [workspace](/getting-started/transform/workspace/) is for.

:::tip[Or ask Kai]
Kai reads the job log, so it is faster at this than you are:

> My transformation `Denormalize opportunities` failed. Read the last job's log and tell me
> what to fix.
:::

## Going further

- [Use a Workspace](/getting-started/transform/workspace/) — develop and test queries
  against a copy of the data before committing them to a transformation. This is how the
  work is really done.

**Next:** [Send your data somewhere →](/getting-started/write/)
