---
title: Input and Output Mapping
slug: 'transformations/mappings'
---

*To configure input and output mappings in the process of creating a transformation, 
go to our [Getting Started tutorial](/tutorial/manipulate/).*



When manipulating your data, there is no need to worry about accidentally modifying the wrong tables.
**Mapping separates the source data from your transformation script**. It creates a secure staging area
with data copied from specified tables and brings only specified tables and files back to Storage.
While the concept of mapping is most important for transformations, it actually applies to every 
single [component](/components/).

Two mapping types must be set up before running a transformation:

1. **Input Mapping** --- This is a list of Storage tables used in your transformation.
If an input mapping does not fit well to your use case, then a [read-only input mapping](/transformations/mappings/#read-only-input-mapping) offers straightforward access to the data, and will drastically reduce the execution time.
This feature is useful in the following scenarios:
   - Slow transformations where a clone is not used (input mapping)
   - Complex flows that move data from a data source to the workspace where they are accessed by other apps
   - Cases where updating data in Storage via output mapping causes multiple data movement operations
2. **Output Mapping** --- This is a list of tables written into Storage after running the transformation. 
Tables not listed are neither modified nor permanently stored (i.e., they are temporary). 
They are deleted from the transformation staging area when the execution finishes. 

![Simple input and output mapping](/transformations/mappings/mappings.png)

*Table names referenced by mappings are automatically quoted by Keboola. 
This is especially important for Snowflake, which is case sensitive.*

The concept of mapping helps to make the transformations repeatable and protect the project [Storage](/storage/). 
You can always rely on the following:
- Having an empty staging Storage (no need to clean up before transformations)
- Having an isolated staging Storage (no need to worry about interference with other transformations)
- Having a stateless transformation (no need to worry about having left-over variables and settings from something else)
- Resource cleanup (no need to worry about cleaning up temporary data after yourself)
- Resource conflict (no need to worry about naming data in the staging Storage)

While this makes some operations seemingly unnecessarily complicated, it ensures that transformations
are repeatable and you can't inadvertently overwrite data in the project Storage. For ad-hoc
operations, we recommend you use **[workspaces](/workspace/)**. For 
bulk operations, consider taking advantage of **[variables](/transformations/variables/)**
and [programmatic automation](https://developers.keboola.com/automate/).

## Input Mapping
Both [Storage tables](/storage/tables/) and [Storage files](/storage/files/) can be used in the input mapping of a transformation.
The common first choice is to use an input mapping with tables.

### Table Input Mapping
Depending on the transformation backend, the table input mapping process can do the following:

- **Database Staging**: Copy the selected tables to *tables* in a newly created *database* schema. If you have not selected any tables and [read-only input mappings](/transformations/mappings/#read-only-input-mapping) are enabled, you can access them automatically in the workspace. In this case the tables are not copied.
- **File Staging**: Export the selected tables to *CSV files* and copy them to a designated staging *Storage* 
(not to be confused with a [file mapping](/transformations/mappings/#file-mapping), as we're still working with tables).

Depending on the transformation types, you can either build your transformations working 
with database tables or with CSV files. Furthermore, the CSV files can be placed locally with the transformation
script or they can be placed on a remote storage such as [Amazon S3](https://aws.amazon.com/s3/) or 
[Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).
The supported database type is [Snowflake](https://www.snowflake.com/).

![Table Input mapping](/transformations/mappings/table-input-mapping.png)

*See an example of [setting up an input mapping](/tutorial/manipulate/#input-mapping) in our tutorial.*

#### Options

:::caution
When using table with native data types, following options will not be available.
:::


- **Source** --- Select a table or a bucket in Storage as the source table for your transformation. If you select 
a bucket, it is the equivalent of selecting all tables currently present in the bucket. It does not automatically 
add future tables to the selection.
- **File name** / **Table Name** --- Enter the destination name of the mapping that is the *Source* table/file 
name to be used inside the transformation. This is an arbitrary name you'd like to use as a reference for the table 
inside the transformation script (it fills in automatically, but it can be changed). For **File Staging**, it is a good 
idea to add the `.csv` extension. For **Database Staging**, the table name is automatically quoted, which means you can 
use an arbitrary name. It also means that they may be case sensitive, for instance, if the destination is in Snowflake staging.
- **Columns** --- Select specific columns if you do not want to import them all; 
this saves processing time for larger tables.
- **Changed in last** --- If you use [incremental processing](/storage/tables/#incremental-processing), 
this comes in handy; import only rows changed or created within the selected time period. 
The supported time dimensions are `minutes`, `hours`, and `days`.
- **Data filter** --- Filter source rows to the rows that match this single-column multiple-values filter. 
When used together with *Changed in last*, the returned rows must match both conditions.
- **Data types** --- Configure [data types](#data-types).

If the terms *source* and *destination* look confusing, consult the image below. We always use them in a specific
context. That means input mapping destination is the same file as the source for a transformation script.

![Source vs. destination](/transformations/mappings/source-destination.svg)

#### Data types
:::caution
When selecting user defined data types the transformation jobs can take longer than usual because new typed table will be created in the background before materializing in output into final output table
:::

The data types option allows you to configure settings of data types for the destination table. Data types are applicable only
for destinations in **database staging**. Select *User defined* to configure data types for individual columns. The types
are pre-configured with data types stored in the [table metadata](/storage/tables/data-types/). The **Type**, **Length**, 
and **Nullable** options define the destination table structure in the staging database. 

The option **Convert empty values to null** adds additional processing which is particularly important for non-string columns. 
All data in Storage tables are stored in string columns, and empty values (be it true `NULL` values, or empty strings) are stored 
as empty strings. When converting such values back to, for example, `INTEGER` or `TIMESTAMP`, they have to be converted to true 
SQL `NULL` values to be successfully inserted.

![Data Types Setting](/transformations/mappings/data-types.png)

The pre-set data types are only suggestions, you can change them to your liking. You can also use the three dots menu to bulk set 
the types. Beware, however, that if a column contains values not matching the type, the entire load (and transformation) will 
fail. In such a case, it's reasonable to revert to `VARCHAR` types -- for example, by setting **Data types** to **None**. 

#### Loading type (Snowflake and BigQuery)
When working with large tables, it may become important to understand how the tables are loaded into a staging
database. Keboola uses three loading strategies --- `COPY`, `CLONE`, and `VIEW` --- plus an `AUTO` mode (the default)
that picks the best available strategy for each table:

- **`CLONE`** --- a highly optimized operation that loads an arbitrarily large table in near-constant time, because it
physically moves no data. `CLONE` can't be combined with filters, data type configurations, or incremental loading.
It is supported on **Snowflake** and **BigQuery** backends.
- **`COPY`** --- a full physical copy of the data into the staging database. Always available; used when neither `CLONE`
nor `VIEW` can be applied (for example, when filters or data types are configured).
- **`VIEW`** --- loads the table as a read-only view instead of copying any data; the data is read live from its source
location. Used for **linked, external, and alias tables**.

You can set the strategy per table with the **Load type** option in the input mapping (**Auto**, **Copy**, **Clone**, or **View**):

![Load type options in the input mapping](/transformations/mappings/load-type-options.png)

**How `AUTO` decides.** `AUTO` prefers `CLONE` whenever the table can be cloned. On **BigQuery**, tables that can't be
cloned --- **linked, external, and alias tables** --- are loaded as a read-only `VIEW`. When filters, data type
configurations, or incremental loading are used (which neither `CLONE` nor `VIEW` supports), `AUTO` falls back to `COPY`.
If you explicitly request `CLONE` for a table that can't be cloned (for example, a [linked-bucket](/catalog/) table on
BigQuery, or any table with incompatible options such as `incremental`), the request fails.

In the input mapping, tables that will be loaded as a read-only view are marked with a view icon:

![Read-only view indicator in the input mapping](/transformations/mappings/read-only-view-indicator.png)

:::note[Default load type on BigQuery]
On BigQuery, the default input-mapping load type is controlled by the **BigQuery Input Mapping – Default Load Type View**
feature. While this feature is enabled --- the current state in most projects --- input tables default to `VIEW`, just as
before. That's perfectly fine, and nothing changes for you.

To make `CLONE` the default in your project right now, **disable** the **BigQuery Input Mapping – Default Load Type View**
feature in your project's **Settings → Features**. New input loads will then default to `CLONE` (matching Snowflake) for
faster, more consistent loading, with the automatic `VIEW`/`COPY` fallbacks described above. You can always override the
strategy per table with the **Load type** option above.

Keboola is gradually disabling this feature across all BigQuery projects, with the rollout completing by **July 15, 2026**.
After that, `CLONE` becomes the default load type on BigQuery for everyone.
:::

This might present a dilemma when loading huge tables. A logical approach when trying to speed up loading a large table would
be setting data types and adding filters to copy only the necessary ones. You might find out, however, that at some point, it's
actually faster to remove the filters and data types, take advantage of the `CLONE` loading type, and apply the filters
inside the transformation. Also, when you need more complex filters (filtering by multiple columns or ranges), it's best to
remove the filter completely from the input mapping, take advantage of the clone loading, and do the filtering inside of the
transformation.

You can verify the table loading type in the events --- copy table:

![Table Copy](/transformations/mappings/table-copy.png)

Clone table:

![Table Clone](/transformations/mappings/table-clone.png)

The `CLONE` mapping will execute almost instantly for a table of any size (typically under 10 seconds)
as it physically does not move any data.

On the other hand, you can use a [read-only input mapping](/transformations/mappings/#read-only-input-mapping) which makes all the buckets and tables available with read access,
so there is no need to clone the tables into a new schema. You can simply read from these buckets and tables in the transformation.
This function is automatically enabled in transformations.

##### Read-only input mapping

*Note: You must be using [new transformations](/transformations/#new-transformations) to see this feature.*

When **read-only input mappings** are enabled, you automatically have read access to all buckets and tables in the project (this also applies to linked buckets).
Alias tables are materialized as database VIEWs and are fully accessible via read-only input mappings — including filtered aliases and aliases from linked buckets.
   
There is no need to set anything for a **read-only input mapping** in **transformations**, all tables in Storage are automatically accessible in the transformation.
This also applies to linked buckets. *Note that buckets and tables belong
to another project, so you need to access the tables using the fully qualified identifier, including the database and schema, in the source project.*

Users can enable or disable read-only access to the storage in **user workspaces** and the **Snowflake data destination**. If read-only access is disabled, users must define an input mapping as they typically do.

![Storage](/transformations/mappings/storage.png)

You have read access to all the tables in your project's Storage directly on the underlying backend. However, this means you need to use the internal ID of a bucket (`in.c-main` instead of `main` as you see in the UI). 

![Read Only Input Mapping in transformation](/transformations/mappings/read-only-transformation.png)

In the transformation code (Snowflake), we select from the table **"in.c-main"."users"** and create a new table: `create table "cities" as select "city" from "in.c-main"."users";`.
Depending on the backend, the SQL format is different. More info regarding access to individual tables depending on the backend can be found in the documentation of those individual backends ( [Snowflake](/transformations/snowflake-plain/#bucket-objects-for-read-only-input-mapping), [BigQuery](/transformations/bigquery/#bucket-objects-for-read-only-input-mapping) ).

As you can see, a **read-only input mapping** allows you to read a table created in Storage directly in the transformation.

![Read Only Input Mapping Storage](/transformations/mappings/read-only-trasnformation-storage.png)



#### _timestamp system column
A cloned table is an exact copy of the source table, including the `_timestamp` system column.
This column is used internally by Keboola for comparison with the value of the *Changed in last* filter.

The column type differs by backend: `TIMESTAMP_NTZ(9)` on Snowflake and `TIMESTAMP` on BigQuery.
The value contains the [last change of the row](/storage/tables/#manual-incremental-processing).
You can use this column to set up [incremental processing](/storage/tables/#incremental-processing),
i.e., to replace the role of the **Changed in Last** filter in the input mapping (which you can't use with a clone mapping).

**Important: The _timestamp column cannot be imported back to Storage.**

When you attempt to do so, you'll get the following error:

	Failed to process output mapping: Failed to load table "out.c-test.opportunity":
	Invalid columns: _timestamp: Only alphanumeric characters and underscores are allowed in the column name.
	Underscore is not allowed on the beginning.

If you are not using the `_timestamp` column in your transformation, you can either use the `dropTimestampColumn` option
in the input mapping to exclude it automatically, or drop it manually:

In Snowflake:

	`ALTER TABLE "my-table" DROP COLUMN "_timestamp";`

In BigQuery:

	`ALTER TABLE my-table DROP COLUMN _timestamp;`

The `_timestamp` column is not present on tables loaded using the copy method.

### File Input Mapping
The file input mapping process exports the selected files from [file Storage](/storage/files/) and copies them to the 
staging Storage. Depending on the transformation, this can be either a drive local to the transformation
or a remote storage such as [Amazon S3](https://aws.amazon.com/s3/) or 
[Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/). A file input mapping cannot operate 
with storage tables, but it comes in handy for processing files that cannot be converted to tables (binary files, 
malformed files, etc.) or, for example, to work with pre-trained models that you can use in a transformation.

![File Input Mapping](/transformations/mappings/file-input-mapping.png)

#### Options
- **Tags** — [tags](/storage/files/#uploading-file) used to select files.
- **Changed Since** — the time range for selecting files. Either a static range (e.g. `30 minutes`) or *Since last successful run* for incremental processing (see below). With a static range, a file must satisfy **both** the tags **and** the range to be selected.
- **Query** *(deprecated, do not use)* — legacy option for a customized [Elastic query](https://www.elastic.co/guide/en/elasticsearch/reference/5.0/query-dsl-query-string-query.html#query-string-syntax).
- **Processed Tags** *(deprecated, do not use)* — legacy option that assigned tags to input files after the transformation finished, used to process files incrementally.

:::caution
*Processed Tags* and *Query* are deprecated and not compatible with [development branches](/tutorial/branches/). New configurations should not use them, and the UI no longer offers them. Existing configurations continue to work; affected projects will be contacted before any breaking change.
:::

#### Incremental file processing

Incremental processing is active when **Changed Since** is set to *Since last successful run*. In this mode, the configuration stores a reference to the newest file matching the specified tags. The next run continues with files newer than that reference, so the transformation is automatically fed only the files that have not yet been processed.

To manipulate the state — for example, to run a backfill — use **Debug Mode → Update State** to reset it.

## Output Mapping
An output mapping takes results (tables and files) from your transformation and stores them back in Storage. 
It can create, overwrite, and append any table. 
These tables are typically derived from the tables/files in the input mapping. In SQL transformations, 
you can use any `CREATE TABLE`, `CREATE VIEW`, `INSERT`, `UPDATE` or `DELETE` queries to create the desired result.

The result of output mapping can be both [Storage tables](/storage/tables/) and [Storage files](/storage/files/).
The common first choice is to use the table output mapping. The rule is that any tables or files *not* specified in the output mapping
are considered temporary and are deleted when the transformation job ends. You can use this to your advantage and 
simplify the transformation script implementation (no need to worry about cleanup or intermediary steps). 

Keep in mind that every table or file specified in the output mapping must be physically present in the staging area. 
A missing source table for the output mapping is an error. This is important when the results of a transformation are 
empty --- you have to ensure that an empty table or an empty file (with a header or 
a [manifest](https://developers.keboola.com/extend/common-interface/manifest-files/#dataouttables-manifests)) is created.

### Table Output Mapping
Depending on the transformation backend, the table output mapping process can do the following:

- In case of **Database Staging** --- copy the specified tables from the staging *database* into 
the project [Storage tables](/storage/tables/).
- In case of **File Staging** --- import the specified *CSV files* into project [Storage tables](/storage/tables/).

The supported staging database type is [Snowflake](https://www.snowflake.com/).
The supported staging for CSV files is a storage local to the transformation.

![Table Output Mapping](/transformations/mappings/table-output-mapping.png)

*See an example of [setting up an output mapping](/tutorial/manipulate/#output-mapping) in our tutorial.*

#### Options
- **Table** --- Enter the name of the table that should be created in the transformation. 
- **Destination** --- Select or type in the name of the [Storage](/storage/tables/) output table that will contain 
the results of your transformation (i.e., contents of the Output Mapping *source* table). 
	- If this table does not exist yet, it will be created once the transformation runs. 
	- If this table already exists in Storage, the source table must match the structure of the destination table (all 
	columns must be present, new columns will be added automatically).  
- **Incremental** --- Check this option to make sure that in case the *Destination* table already exists, 
it is not overwritten, but resulting data is appended to it. However, any existing row having the same primary key 
as a new row will be replaced. See the description of 
[incremental loading](/storage/tables/#incremental-loading) for a detailed explanation and examples.
- **Primary key** --- The [primary key](/storage/tables/#primary-keys) of the destination table; if the table already exists, 
the primary key must match. Feel free to use a multi-column primary key.
- **Deduplication Strategy** --- This allows to switch in Snowflake transformations from the default load Upsert to Insert. Upsert option uses deduplication based on primary keys and ensures data quality. By switching to Insert, the load performs faster but skips deduplication and type casting - meaning you are responsible for uniqueness and correct data types. As this option is for high data maturity users, you can ask our support to enable this for your project as Deduplication Strategy is under feature flag.
-  **Delete rows** --- When Incremental loading is enabled, you can delete specific rows from the destination table before importing new data into the Storage. This gives you precise control over incremental updates. There are 2 options you can use:
   1. **Delete rows from values** - this option lets you manually specify values that identify rows to be removed from your destination table. This is particularly useful when the rows to delete are consistent, predictable, or rarely changing.
   2. **Delete rows from transformation table** - this option enables you to define deletion criteria using live data generated in your transformation. 
  This method provides flexibility for more complex, data-driven scenarios, such as removing obsolete records based on recent transactions or other dynamic conditions. This option needs to be enabled by navigating to Project Settings → Features → Delete rows from transformation table. Please note that this option **is available in the production environment only** and **is not supported in development branches** (e.g. for testing or configuration changes in a development branch, the option will not be applied).
	- **How the Delete Rows feature Works**

     	Deletion is performed using SQL `DELETE` statements:

     	- Each deletion query you configure creates a separate SQL `DELETE` statement:

       	```sql
       	DELETE FROM table_name WHERE condition;
       	```

     	- Multiple filters within a single query combine into a single `DELETE` with `AND` conditions:

       	```sql
       	DELETE FROM table_name WHERE condition1 AND condition2 AND ...;
       	```

     	- Multiple queries result in separate `DELETE` statements, functioning as logical `OR`:

       	```sql
       	DELETE FROM table_name WHERE condition1;
       	DELETE FROM table_name WHERE condition2;
       	```

     	In this scenario, rows matching **any** of the specified conditions across the queries will be deleted.

     **Note:** This process enables advanced row-level deletion logic, suitable for dynamic datasets where conditions may change per run.

**Important:** Multiple output mappings can be created for your transformation. Each source table can be used only once however.


### File Output Mapping
A file output mapping is used to store files produced by the transformation as [Storage files](/storage/files/). 
If you want to store CSV files as [Storage tables](/storage/tables/), use 
[table output mapping](/transformations/mappings/#table-output-mapping).

A file output mapping can be useful when your transformation produces, for example, trained models that 
are to be used in another transformation.

Only the files stored directly in the `out/files/` directory can be mapped, subdirectories are not supported
(`out/files/file.txt` will work, `out/files/subdir/file.txt` won't).

![File Output Mapping](/transformations/mappings/file-output-mapping.png)

#### Options
- **Source** --- Name of the source file for mapping
- **Tag** --- Tags which will be applied to the target file uploaded in [Storage](/storage/tables/)
- **Permanent** - This option makes the file stay in the file Storage, until you delete it manually. 
If unchecked, the target file will be deleted after 15 days.

### Direct Mode Output Mapping
Direct Mode Output Mapping lets your transformation write directly to Storage tables instead of going through
the standard copy-based output mapping process. With Direct Mode output mapping enabled, the transformation
user receives write privileges on specific Storage tables. Any `INSERT`, `UPDATE`, `DELETE`,
or `TRUNCATE` you run in your transformation SQL can be applied immediately to the destination table --- there is no
separate import step.

This feature is available as a **private beta** and must be enabled by [Keboola Support](/management/support/).

![Direct Mode Output Mapping](/transformations/mappings/manual-output-mapping.png)

#### When to Use Direct Mode Output Mapping
Direct Mode output mapping is designed for **advanced users with high data maturity** who are comfortable writing
production-quality SQL and managing data consistency themselves. Typical use cases include:

- **Large incremental loads** --- Standard output mapping on a 150 GB table with a single-row append can take over
  an hour due to deduplication and copy overhead. Direct Mode output mapping reduces this to seconds.
- **Minimal overhead workflows** --- When the standard mapping pipeline (copy to staging, deduplicate, import)
  creates unnecessary overhead for your workload.

**Performance comparison** (incremental load --- 1 row added to a 150 GB table):

| Method | Approximate Time |
|--------|-----------------|
| Standard output mapping (Upsert) | ~160 min |
| Simplified output mapping (Insert) | ~55 min |
| **Direct Mode output mapping** | **~11 seconds** |

#### Supported Backends
Direct Mode output mapping is available for any component that uses a **Snowflake** or **BigQuery** workspace,
including [transformations](/transformations/) and [data apps](/components/data-apps/). 

:::caution
Workspaces (standalone or via SQL editor) are not supported for time being.
:::

#### How It Works
When a component with Direct Mode output mapping runs:

1. The workspace role/service account receives **write privileges** on the specified Storage tables.
2. Your transformation SQL operates directly on Storage tables using their read-only storage paths
   (e.g., `"KBC_USE4_33"."in.c-raw-data"."my-table"`).
3. After the transformation finishes, Keboola runs a **refresh job** that updates table metadata,
   row counts, and statistics. No data is copied --- the changes are already in place.

The workspace receives these privileges on each granted table:
- `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE` (Snowflake)
- `bigquery.tables.getData`, `bigquery.tables.updateData`, `bigquery.tables.get` (BigQuery)

The workspace **cannot**:
- Create new tables in the bucket
- Drop or alter existing tables
- Write to tables not listed in the output mapping

#### Configuration
Direct Mode output mapping is configured per output table in the transformation configuration JSON.
To set it up, switch to the JSON editor in the output mapping section and add the `unload_strategy` field:

```json
{
  "storage": {
    "output": {
      "tables": [
        {
          "destination": "out.c-my-bucket.my_table",
          "unload_strategy": "direct-grant"
        }
      ]
    }
  }
}
```

The `unload_strategy` field accepts two values:
- `direct-grant` --- Write directly to the Storage table (Direct Mode output mapping).
- `copy` --- Standard output mapping (default when the field is omitted).

You can mix both strategies in a single transformation --- some tables can use Direct Mode output mapping while
others use the standard copy strategy.

#### Good Practices

**Write idempotent SQL.** Because there is no automatic rollback on failure, your SQL should be safe
to re-run. Use patterns like `MERGE` or `DELETE` + `INSERT` within a transaction:

```sql
BEGIN;
DELETE FROM "in.c-my-bucket"."sales"
  WHERE date = CURRENT_DATE();
INSERT INTO "in.c-my-bucket"."sales"
  SELECT * FROM "my_staging_table"
  WHERE date = CURRENT_DATE();
COMMIT;
```

**Handle deduplication yourself.** Use `MERGE` statements or explicit `DELETE` before `INSERT`
to avoid duplicate rows:

```sql
MERGE INTO "in.c-my-bucket"."customers" AS target
USING "my_staging_table" AS source
ON target."id" = source."id"
WHEN MATCHED THEN UPDATE SET
  target."name" = source."name",
  target."email" = source."email"
WHEN NOT MATCHED THEN INSERT ("id", "name", "email")
  VALUES (source."id", source."name", source."email");
```

**Test in a non-production environment first.** Direct Mode output mapping writes affect data immediately.
Validate your transformation logic thoroughly before pointing it at production tables.

**Use the read-only storage path for table references.** In your SQL, reference tables by their
full Storage path (e.g., `"SCHEMA"."in.c-bucket"."table"`), not by workspace-local names.

#### Bad Practices

**Do not rely on automatic deduplication.** Unlike standard output mapping, Keboola does **not**
deduplicate data based on primary keys. Primary keys on Snowflake and BigQuery are not enforced by the
backend, so a primary key defined in Storage will not prevent duplicates on direct writes.
Running a plain `INSERT` repeatedly will create duplicate rows:

```sql
-- BAD: This will create duplicates on every run
INSERT INTO "in.c-my-bucket"."customers"
  SELECT * FROM "my_staging_table";
```

**Do not assume type checking.** Keboola does not verify that column data types in your SQL match
the Storage table metadata. Mismatched types may cause errors or silent data inconsistencies.

**Do not use DDL statements.** You cannot `CREATE TABLE`, `DROP TABLE`, `ALTER TABLE`, or
`SWAP TABLE` on Storage tables through Direct Mode output mapping. Schema changes must be done through
[Storage](/storage/tables/).

**Do not use Direct Mode output mapping in development branches for production data.** Development branches
currently share the same Snowflake schema as production. Writing via Direct Mode output mapping in a dev branch
**will modify production data**. This limitation is being addressed in a future release.

#### Limitations

- **No automatic deduplication** --- Primary keys on Snowflake and BigQuery are not enforced by the
  backend, so they will not prevent duplicates on direct writes. You must handle deduplication in your SQL.
- **No type checking or casting** --- Column types are not validated against Storage metadata.
- **No schema changes** --- You cannot alter table structure (add/remove/rename columns). Use
  [Storage](/storage/tables/) for schema modifications.
- **No automatic rollback** --- If a transformation fails mid-execution, the table may be left in a
  partially written state. Wrap related operations in transactions to mitigate this.
- **Limited auditability** --- Only an import event is created on success, compared to the more
  detailed event trail of standard output mapping.
- **Development branch isolation not supported** --- Dev branch writes affect production data
  on Snowflake. Use caution when testing.
- **Read-only, external, and linked buckets are not supported** --- Direct Mode output mapping cannot write
  to buckets that are read-only, external schemas, or linked from another project.
