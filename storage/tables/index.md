---
title: Tables
permalink: /storage/tables/
---

* TOC
{:toc}

Your project table storage is available in the *Tables* tab in the *Storage* section. All data tables are organized into
*buckets* which are further organized into the following three *stages*:

- **in** - for input data (usually extractor results)
- **out** - for processed data (usually results of transformations or applications)
- **sys** - deprecated stage used for configuration of some components

When creating a new bucket, select one of the stages and a suitable [database backend](/storage/#backends) based on its properties. 
For detailed information on how to create a bucket and its tables, see the corresponding part of our [tutorial](/overview/tutorial/load/).

{: .image-popup}
![Screenshot - Create bucket](/storage/tables/create-bucket.png)

The actual data tables in the buckets are created primarily by KBC components (extractors, transformations and applications), 
or they are imported from CSV files. In case you want to import data to an already **existing table**, 
the imported table must have all the columns of the old, existing table, even if it the old table is empty. 
If some columns are missing, you will receive a message like this:

    Some columns are missing in the csv file. Missing columns: lat,long. Expected columns: lat,long.
    Please check if the expected "," delimiter is used in the csv file.

Also note that the imported file **may** contain additional columns not present in the existing
table. In that case, the columns from the imported table will be added to the existing table.

## Aliases
Apart from actual tables, it is also possible to create aliases. They are internally implemented
as [database views](https://en.wikipedia.org/wiki/View_(SQL)) and inherit their basic properties.

An alias does not contain any actual data; it is simply a link to some already existing data. 
Hence an alias cannot be written to and its size does not count to your project quota. 

In addition, if you create an alias from a table, the table **cannot be deleted** without the alias being deleted as well. 
If you attempt to do so, you will receive an error message similar to this one:

    The blog-data table cannot be deleted. Please delete its aliases first: in.c-tutorial.blog-data,in.c-my-bucket.blog-data.

There are two types of aliases:

- **Simple Alias** -- available for the MySQL backend
- **Custom SQL Alias** -- available for the Redshift backend

See an example use of an alias in our [tutorial](/overview/tutorial/load/googledrive/#aftermath).

{: .image-popup}
![Screenshot - Create alias](/storage/tables/create-alias.png)

### Simple Alias
The simple alias is allowed in these bucket stage combinations:

- in -> in
- in -> out
- out -> out

Simple aliases cannot be chained and can be applied only between buckets with the same backend. 
An alias table can be filtered by a simple condition.

{: .image-popup}
![Screenshot - Create Simple alias](/storage/tables/create-simple-alias.png)

There are the following limitations:

- Filtering is enabled only on indexed columns. 
- When an alias is created, the index on the filtered column of the source table cannot be removed. 
- Alias columns are automatically synchronized, by default, with the source table. Columns added to the source table will be added to the alias automatically.
You can prevent this by disabling *Synchronize columns with source table*.

### Custom SQL Alias
The Custom SQL Alias table is defined by SQL select like `SELECT * FROM "in.c-main"."blog-data"`.
Select can also join data from multiple tables. You can access all your tables in any bucket, as long as they use Redshift, the backend supported by this type of alias.

{: .image-popup}
![Screenshot - Create Custom alias](/storage/tables/create-custom-alias.png)

## Copying Tables / Table Snapshots
If you want to physically copy a table, use the [*table snapshot*](/overview/tutorial/management/#table-snapshots) feature. 
A copy of the table contents at the time of creating the snapshot will be made. 
It can be used immediately to make a physical copy of the table, or later to revert the table into its previous state.

Table Snapshots are useful when experimenting with extractors or transformations, or generally when refactoring your project: 
you can create a copy of your output table, experiment a little, and then compare the new output table with the original one to make sure your output remained the same.
They can also be used as a workaround to renaming tables because it is not available yet.
