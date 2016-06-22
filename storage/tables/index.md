---
title: Tables
permalink: /storage/tables/
---

The Table storage of your project is accessible through *Storage* - *Tables* view. Your data tables are organized into
*buckets* which are organized into *stages*. There are three stages available:

- 'in' - for input data (usually result from extractors)
- 'out' - for processed data (usually result from transformations or applications)
- 'sys' - deprecated stage used for configuration of some components

When you create a new bucket, you must select a single stage from the above and also a database
backend. Choose a suitable backend based on [their properties](/storage/#backends). To get
started with creating buckets and tables, see the corresponding part of the
[tutorial](/overview/tutorial/load/).

{: .image-popup}
![Screenshot - Create bucket](/storage/tables/create-bucket.png)

In buckets you can create actual tables containing your data. Tables are primarily created by
KBC components (extractors, transformations, applications), or imported from CSV files. When importing
data to an **existing table** the imported table must have all the columns of the old
table (even if the old table is empty). If some
columns are missing, you will receive a message like this:

    Some columns are missing in csv file. Missing columns: lat,long. Expected columns: lat,long.'
    Please check if expected delimiter "," is used in csv file.

Also note, that the imported file **may** contain additional columns not present in the existing
table. In that case, the columns from the imported table will be added to the existing table.

## Aliases
Apart from actual tables, it is also possible to create aliases. Aliases are internally implemented
as [database views](https://en.wikipedia.org/wiki/View_(SQL) and they inherit their basic properties.
Alias does not contain any actual data, it is simply a link to existing data. Hence alias cannot
be written to and its size does not count to your project quota. Also note that if you create an
alias from a table, that table cannot be deleted unless the alias is deleted. If you attempt to do so, you
will receive an error message similar to:

    Table blog-data cannot be deleted. Please delete first its aliases: in.c-tutorial.blog-data,in.c-my-bucket.blog-data.

There are two types of aliases
**Simple Alias** available for MySQL backend and **Custom SQL Alias** available for Redshift backend.
You can see example use of an alias in the [tutorial](/overview/tutorial/load/googledrive/#aftermath).

{: .image-popup}
![Screenshot - Create alias](/storage/tables/create-alias.png)

### Simple alias
Simple alias is allowed in these bucket Stage combinations:

- in -> in
- in -> out
- out -> out

Simple aliases cannot be chained and can be applied only between buckets with same backend. Alias table
can be filtered by simple condition.

{: .image-popup}
![Screenshot - Create Simple alias](/storage/tables/create-simple-alias.png)

There are some limitation - filtering is enabled only on indexed columns. When an alias is created, the index
on filtered column of source table cannot be removed. By default alias columns are automatically synchronized
with source table (when you add columns to the source table, it will get added to the alias automatically).
You can disable this behaviour by disabling *Synchronize columns with source table*.

### Custom SQL Alias
Custom SQL Alias table is defined by SQL select like `SELECT * FROM "in.c-main"."blog-data"`.
You can access all your tables in buckets with the same backend, select can also join data from
multiple tables. These aliases are supported only in Redshift backend.

{: .image-popup}
![Screenshot - Create Custom alias](/storage/tables/create-custom-alias.png)

## Copying Tables / Table Snapshots
If you want to physically copy a table, you can use the
[*table snapshot*](/overview/tutorial/management/#table-snapshots) feature. Table Snapshot will create a copy of the
table contents in the time you created the snapshot. The snapshot can then be used immediatelly to make a
physical copy of the table, or later to revert the table into previous state.

Table Snapshots can be usefull when you are experimenting with extractors or transformations or generally during
refactoring of your project - you can create a copy of a table and then make sure that the output remained the same.
Table Snapshots can also be used as a workaround to renaming tables which is not available yet.
