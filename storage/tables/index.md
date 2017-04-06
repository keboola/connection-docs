---
title: Tables
permalink: /storage/tables/
---

* TOC
{:toc}

Your project table storage is available in the **Tables** tab in the Storage section. 
All data tables are organized into [buckets](/storage/buckets/) that can also be 
used to [share tables](/storage/buckets/sharing/) between projects.

The actual data tables and the buckets are created primarily by KBC components (extractors, transformations and applications),
or they are imported from CSV files. In case you want to import data to an already **existing table**,
the imported table must have all the columns of the old, existing table, even if the old table is empty.
If some columns are missing, you will receive a message like this:

    Some columns are missing in the csv file. Missing columns: lat,long. Expected columns: lat,long.
    Please check if the expected "," delimiter is used in the csv file.

Also note that the imported file **may** contain additional columns not present in the existing
table. In that case, the columns from the imported table will be added to the existing table.

## Aliases
Apart from actual tables, it is also possible to create aliases. They are internally implemented
as [database views](https://en.wikipedia.org/wiki/View_(SQL)) and inherit their basic properties.

An alias does not contain any actual data; it is simply a link to some already existing data.
Hence an alias cannot be written to, and its size does not count to your project quota.

In addition, if you create an alias from a table, the table **cannot be deleted** without the alias being deleted as well.
If you attempt to do so, you will receive an error message similar to this one:

    The blog-data table cannot be deleted. Please delete its aliases first: in.c-tutorial.blog-data,in.c-my-bucket.blog-data.

See an example use of an alias in our [tutorial](/tutorial/load/googledrive/#aftermath).

{: .image-popup}
![Screenshot - Create alias](/storage/tables/create-alias.png)

If you select any table from any bucket in Storage, detailed information about the table will be displayed on the right side of your screen.
This is what we refer to as the **Table detail** throughout our documentation.

Aliases cannot be chained and can be applied only between buckets with the same backend.
An alias table can be filtered by a simple condition.

{: .image-popup}
![Screenshot - Create Simple alias](/storage/tables/create-simple-alias.png)

There are the following limitations:

- Filtering is enabled only on [indexed columns](todo).
- When an alias is created, the index on the filtered column of the source table cannot be removed.
- Alias columns are automatically synchronized, by default, with the source table. Columns added to the source table will be added to the alias automatically.
You can prevent this by disabling *Synchronize columns with source table*.

## Primary Keys and Indexes
Each table may have a **primary key** defined on one ore more columns. A primary key represents an
identifier of each row in the table. Primary key is can be defined manually on a table or as part of 
[Output mapping](/manipulation/transformations/mappings/#output-mapping) of 
[Transformations](/manipulation/transformations/) and 
[Applications](/manipulation/applications/). The settings on both places must match otherwise you will receive an
error:

    Output mapping does not match destination table: primary key '' does not match 'Id' in 'out.c-tutorial.opportunity_denorm' (check transformations Denormalize opportunities (id opportunity.denormalize-opportunities)).

This means that you cannot change the primary key of a table freely. Also note that you cannot set the primary 
table on a column which contains duplicates --- you will receive the following error: 

    Cannot crate new primary key, duplicate values in primary key columns

If you want to manually set a primary key on a table, you can do so in `Storage`:

{: .image-popup}
![Screenshot - Create Primary Key](/storage/tables/create-primary-key-1.png)

Then select the columns you wish to add to the primary key:

{: .image-popup}
![Screenshot - Select columns](/storage/tables/create-primary-key-2.png)

To remove an existing primary key, click the bin icon:

{: .image-popup}
![Screenshot - Remove Primary Key](/storage/tables/remove-primary-key.png)

Note that creating and removing the primary key can take some time on large tables.

Apart from the primary key, you can mark a column as indexed. Indexes do have some performance effects only
on the deprecated MySQL backend. On the Redshfit and Snowflake backends marking a column as indexed does
not have any effect. You can mark a column as indexed in the table detail:

{: .image-popup}
![Screenshot - Create Index](/storage/tables/create-index.png)

### Primary Key Deduplication
When a primary key is defined on column, the value of that column is guaranteed to be unique in the table.
If you load new data into the table, the **rows with duplicate values of primary key will be ignored**. If the
primary key is defined on multiple columns, the combination of their values must be unique. If you have the 
following table with a primary key defined on columns `name` and `age`:

|name|age|money|
|---|---|---|
|John|24|$43|
|Jane|24|$41|
|John|40|$45|

And you import the following data to the table:

|name|age|money|
|---|---|---|
|Annie|30|$50|
|John|24|$40000|
|Jane|40|$7000|

The result table will contain:

|name|age|money|
|---|---|---|
|John|24|$43|
|Jane|24|$41|
|John|40|$45|
|Annie|30|$50|
|Jane|40|$7000|

When importing data into a table with primary key, the uniqueness is checked and data are de-duplicated. 
The record `John,24,$40000` will be ignored, because it violates the primary key.

## Copying Tables / Table Snapshots
If you want to physically copy a table, use the [*table snapshot*](/tutorial/management/#table-snapshots) feature.
A copy of the table contents at the time of creating the snapshot will be made.
It can be used immediately to make a physical copy of the table, or later to revert the table into its previous state.

Table Snapshots are useful when **experimenting** with extractors or transformations, or generally when **refactoring** your project:
you can create a copy of your output table, experiment a little, and then compare the new output table with the original one to make sure your output remained the same.
They can also be used as a workaround to renaming tables; however, this feature is not available yet.
