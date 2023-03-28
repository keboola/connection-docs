---
title: Input and Output Mapping
permalink: /transformations/mappings/
---

*To configure input and output mappings in the process of creating a transformation, 
go to our [Getting Started tutorial](/tutorial/manipulate/).*

* TOC
{:toc}

When manipulating your data, there is no need to worry about accidentally modifying the wrong tables.
**Mapping separates the source data from your transformation script**. It creates a secure staging area
with data copied from specified tables and brings only specified tables and files back to Storage.
While the concept of mapping is most important for transformations, it actually applies to every 
single [component](/components/).

There are two types of mapping that have to be set up before running a transformation:

1. **Input Mapping** --- what Storage tables are used in your transformation;
Depending on whether you use [Read-Only Input Mapping](/transformations/mappings/#read-only-input-mapping), it differs whether you have to add tables to the input mapping or not.
In transformation, [Read-Only Input Mapping](/transformations/mappings/#read-only-input-mapping) is automatically enabled and for workspace you can select this option when you create a new workspace.
   2. When **Read-Only Input Mapping** is enabled, you automatically have read access to all buckets and tables in the project (this also applies to linked buckets). However, you can still manually add tables to Input Mapping.
   3. With **Read-Only Input Mapping** disabled, tables not mentioned in Input Mapping cannot be used.
2. **Output Mapping** --- what tables are written into Storage after running the transformation; 
tables not mentioned in *Output Mapping* are never modified nor permanently stored (i.e., they are temporary). 
They are deleted from the transformation staging area when the execution finishes. 

{: .image-popup}
![Simple input and output mapping](/transformations/mappings/mappings.png)

*Table names referenced by mappings are automatically quoted by Keboola Connection. 
This is especially important for Snowflake, which is case sensitive.*

## Overview
The concept of mapping helps to make the transformations repeatable and protect the project [Storage](/storage/). 
You can always rely on the following:
- Having an empty staging storage (no need to clean up before transformations)
- Having an isolated staging storage (no need to worry about interference with other transformations)
- Having a stateless transformation (no need to worry about having left-over variables and settings from something else)
- Resource cleanup (no need to worry about cleaning up temporary data after yourself)
- Resource conflict (no need to worry about naming data in the staging storage)

While this makes some operations seemingly unnecessarily complicated, it ensures that transformations
are repeatable and you can't inadvertently overwrite data in project Storage. For ad-hoc
operations, we recommend you use **[Workspaces](/transformations/workspace/)**. For 
bulk operations, consider taking advantage of **[Variables](/transformations/variables/)**
and [programmatic automation](https://developers.keboola.com/automate/).

## Input Mapping
Both [Storage Tables](/storage/tables/) and [Storage Files](/storage/files/) can be used in transformations input mapping.
Table input mapping is the common first choice.

### Table Input Mapping
Depending on the transformation backend, the table input mapping process can do the following:

- In case of **Database Staging** --- copy the selected tables to *tables* into a newly created *database* schema, 
  or in case you have not selected any tables and [Read-Only Input Mapping](/transformations/mappings/#read-only-input-mapping) is enabled, you can access them automatically in Workspace and no copying is done.
- In case of **File Staging** --- export selected tables to *CSV files* and copy them to a designated staging *storage* 
(not to be confused with [File Mapping](/transformations/mappings/#file-mapping), we're still working with tables).

Depending on the transformation types you can either build your transformations working 
with database tables or with CSV files. Furthermore, the CSV files can be placed locally with the transformation
script or they can be placed on a remote storage such as [Amazon S3](https://aws.amazon.com/s3/) or 
[Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).
The supported database types are [Snowflake](https://www.snowflake.com/), 
[Redshift](https://aws.amazon.com/redshift/), and [Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/).

{: .image-popup}
![Table Input mapping](/transformations/mappings/table-input-mapping.png)

*See an example of [setting up Input Mapping](/tutorial/manipulate/#input-mapping) in our tutorial.*

#### Options
- **Source** --- Select a table or a bucket in Storage as the source table for your transformation. In case you select 
a bucket, it is the equivalent of selecting all tables currently present in the bucket. It does not automatically 
add future tables to the selection.
- **File name** / **Table Name** --- Enter the destination name of the mapping that is the is the *Source* table/file 
name to be used inside the transformation. This is an arbitrary name you'd like to use as a reference for the table 
inside the transformation script (it fills in automatically, but it can be changed). For **File Staging**, it is a good 
idea to add the `.csv` extension. For **Database Staging**, the table name is automatically quoted, which means you can 
use an arbitrary name. It also means that they may be case sensitive, for instance, if the destination is in Snowflake staging.
- **Columns** --- Select specific columns if you do not want to import them all; 
this saves processing time for larger tables.
- **Changed in last** --- If you are into [incremental processing](/storage/tables/#incremental-processing), 
this comes in handy; import only rows changed or created within the selected time period. 
The supported time dimensions are `minutes`, `hours`, and `days`.
- **Data filter** --- Filter source rows to the rows that match this single-column multiple-values filter. 
When used together with *Changed in last*, the returned rows must match both conditions.
- **Data types** --- Configure [Data types](#data-types).

If the terms *source* and *destination* look confusing, consult the image below. We always use them in a specific
context. That means input mapping destination is the same file as the source for a transformation script.

{: .image-popup}
![Source vs. destination](/transformations/mappings/source-destination.svg)

#### Data Types
The Data types option allows you to configure settings of data types for the destination table. Data types are applicable only
for destinations in **database staging**. Select *User defined* to configure data types for individual columns. The types
are pre-configured with data types stored in the [table metadata](/storage/tables/data-types/). The **Type**, **Length** 
and **Nullable** options define the destination table structure in the staging database. 

The option **Convert empty values to null** adds additional processing which is particularly important for non-string columns. 
All data in Storage tables are stored in string columns, and empty values (be it true `NULL` values, or empty strings) are stored 
as empty strings. When converting such values back to, for example, `INTEGER` or `TIMESTAMP`, they have to be converted to true 
SQL `NULL` values to be successfully inserted.

{: .image-popup}
![Data Types Setting](/transformations/mappings/data-types.png)

The pre-set data types are only suggestions, you can change them to your liking. You can also use the three dots menu to bulk set 
the types. Beware, however, that if a column contains values not matching the type, the entire load (and transformation) will 
fail. In such case, it's reasonable to revert to `VARCHAR` types -- for example, by setting **Data types** to **None**. 

#### Snowflake Loading Type
When working with large tables, it may become important to understand how the tables are loaded into a Snowflake staging 
database. We use two loading options `COPY` and `CLONE`. The clone copy type is a highly optimized operation which 
allows loading an arbitrary large table in near-constant time. There is a limitation, however, that the clone type can't be used 
together with any filters or data type configurations. 

This might present a dilemma when loading huge tables. A logical approach when trying to speed up loading a large table would
be setting data types and adding filters to copy only the necessary ones. You might find out, however, that at some point, it's 
actually faster to remove the filters and data types, take advantage of the `CLONE` loading type and apply the filters
inside the transformation. Also, when you need more complex filters (filtering by multiple columns or ranges), it's best to
remove the filter completely from input mapping, take advantage of the clone loading and do the filtering inside of the
transformation.

You can verify the table loading type in the events --- copy table:

{: .image-popup}
![Table Copy](/transformations/mappings/table-copy.png)

Clone table:

{: .image-popup}
![Table Clone](/transformations/mappings/table-clone.png)

The `CLONE` mapping will execute almost instantly for a table of any size (typically under 10 seconds) 
as it physically does not move any data.

On the other hand, you can use [Read-Only Input Mapping](/transformations/mappings/#read-only-input-mapping) which makes available all buckets and tables with read access,
so there is no need to clone the tables into a new schema, you can simply read from these buckets and tables in the trace.
This function is automatically enabled in the transformations.

##### Read-Only Input Mapping
For using **Read-Only Input Mapping** there is no need to set anything else and for transformations, tables are automatically accessible in transformation. 

{: .image-popup}
![Storage](/transformations/mappings/storage.png)

The way it works is that you have read access to all tables that exist in the storage in your project.

{: .image-popup}
![Read Only Input Mapping in transformation](/transformations/mappings/read-only-transformation.png)

In the transformation (Snowflake) code I select from the table **"in.c-main"."users"** and create a new table  `create table "cities" as select "city" from "in.c-main"."users";`.
Depending on the backend, access to tables is different, how to access individual tables depending on the backend is then explained directly in the documentation of individual backends.

This is all thanks to **Read-Only Input Mapping** which allows me to use the table created in the storage directly to read in the transformation.

{: .image-popup}
![Read Only Input Mapping Storage](/transformations/mappings/read-only-trasnformation-storage.png)



#### _timestamp system column
A table loaded using `CLONE` will contain all columns of the original table plus a new `_timestamp` column.
This column is used internally by Keboola Connection for comparison with the value of the *Changed in last* filter. 

The value in the column contains a unix timestamp of the [last change of the row](/storage/tables/#manual-incremental-processing). 
You can use this column to set up [incremental processing](/storage/tables/#incremental-processing),
i.e., to replace the role of the **Changed in Last** filter in input mapping (which you can't use with clone mapping).

**Important: The _timestamp column cannot be imported back to storage.** 

When you attempt to do so, you'll get the following error:

	Failed to process output mapping: Failed to load table "out.c-test.opportunity": 
	Invalid columns: _timestamp: Only alphanumeric characters and underscores are allowed in column name. 
	Underscore is not allowed on the beginning.

If you are not using the `_timestamp` column in your transformation, you have to drop it - for example:

	`ALTER TABLE "my-table" DROP COLUMN "_timestamp";`

The `_timestamp` column is not present on tables loaded using the copy method.

### File Input Mapping
The file input mapping process exports the selected files from [File Storage](/storage/files/) and copies them to the 
staging storage. Depending on the transformation, this can be either a drive local to the transformation
or a remote storage such as [Amazon S3](https://aws.amazon.com/s3/) or 
[Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/). File input mapping cannot operate 
with Storage tables, but it comes in handy for processing files that cannot be converted to tables (binary files, 
malformed files, etc.) or, for example, to work with pre-trained models that you can use in a transformation.

{: .image-popup}
![File Input Mapping](/transformations/mappings/file-input-mapping.png)

#### Options
- **Tags** --- specify [tags](/storage/files/#uploading-file) which 
will be used to select files.
- **Query** --- in case selecting files by tags is not precise enough, you can use 
[Elastic query](https://www.elastic.co/guide/en/elasticsearch/reference/5.0/query-dsl-query-string-query.html#query-string-syntax)
to refine the search. If you combine *query* with *tags*, both conditions must be met.
- **Processed Tags** --- specify tags which will be assigned to the input files once the transformation is finished.
This allows you to process Storage files in an incremental fashion. You can combine this setting with the *query* 
option to omit already processed files in recurring transformations.

## Output Mapping
The output mapping takes results (tables and files) from your transformation and stores them back in Storage. 
It can create, overwrite, and append any table. 
These tables are typically derived from the tables/files in the input mapping. In SQL transformations, 
you can use any `CREATE TABLE`, `CREATE VIEW`, `INSERT`, `UPDATE` or `DELETE` queries to create the desired result.

The result of output mapping can be both [Storage Tables](/storage/tables/) and [Storage Files](/storage/files/).
Table output mapping is the common first choice. The rule is that any tables or files *not* specified in the output mapping
are considered as temporary and are deleted when the transformation job ends. You can use this to your advantage and 
simplify the transformation script implementation (no need to worry about cleanup or intermediary steps). 

Keep in mind that every table or file specified in output mapping must be physically present in the staging area. 
A missing source table for the output mapping is an error. This is important when the results of a transformation are 
empty --- you have to ensure that an empty table or an empty file (with a header or 
a [manifest](https://developers.keboola.com/extend/common-interface/manifest-files/#dataouttables-manifests)) is created.

### Table Output Mapping
Depending on the transformation backend, the table output mapping process can do the following:

- In case of **Database Staging** --- copy the specified tables from the staging *database* into 
the project [Storage Tables](/storage/tables/).
- In case of **File Staging** --- import the specified *CSV files* into project [Storage Tables](/storage/tables/).

The supported staging database types are as follows: [Snowflake](https://www.snowflake.com/), 
[Redshift](https://aws.amazon.com/redshift/), and [Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/). 
The supported  staging for CSV files is a storage local to the transformation.

{: .image-popup}
![Table Output Mapping](/transformations/mappings/table-output-mapping.png)

*See an example of [setting up Output Mapping](/tutorial/manipulate/#output-mapping) in our tutorial.*

#### Options
- **Table** --- Enter the name of the table that should be created in the transformation. 
- **Destination** --- Select or type in the name of the [Storage](/storage/tables/) output table that will contain 
the results of your transformation (i.e., contents of the Output Mapping *Source* table). 
	- If this table does not exist yet, it will be created once the transformation runs. 
	- If this table already exists in Storage, the source table must match the structure of the destination table (all 
	columns must be present, new columns will be added automatically).  
- **Incremental** --- Check this option to make sure that in case the *Destination* table already exists, 
it is not overwritten, but resulting data is appended to it. However, any existing row having the same primary key 
as a new row will be replaced. See the description of 
[incremental loading](/storage/tables/#incremental-loading) for a detailed explanation and examples.
- **Primary key** --- The [primary key](/storage/tables/#primary-keys) of the destination table; if the table already exists, 
the primary key must match. Feel free to use a multi-column primary key.
- **Delete rows** --- Delete rows matching the criteria from the destination table before importing the data. This option is 
enabled only when *Incremental* is switched on.

**Important:** Multiple Output Mappings can be created for your transformation. Each source table can be used only once however.

### File Output Mapping
File Output mapping is used to store files produced by the transformation as [Storage Files](/storage/files/). 
If you want to store CSV files as [Storage Tables](/storage/tables/), use 
[Table Output Mapping](/transformations/mappings/#table-output-mapping).

File output mapping can be useful when your transformation produces, for example, trained models that 
are to be used in another transformation.

Only files stored directly in the `out/files/` directory can be mapped, subdirectories are not supported
(`out/files/file.txt` will work, `out/files/subdir/file.txt` won't).

{: .image-popup}
![File Output Mapping](/transformations/mappings/file-output-mapping.png)

#### Options
- **Source** --- Name of the source file for mapping
- **Tag** --- Tags which will be applied to the target file uploaded in [Storage](/storage/tables/)
- **Permanent** - This option makes the file stay in the File Storage, until you delete it manually. 
If unchecked, the target file will be deleted after 15 days.
