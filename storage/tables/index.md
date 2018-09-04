---
title: Tables
permalink: /storage/tables/
---

* TOC
{:toc}

Your project *Table Storage* is available in the **Tables** tab in the Storage section.
All data tables are organized into [buckets](/storage/buckets/) that can also be
used to [share tables](/storage/buckets/sharing/) between projects.

The actual data tables and the buckets are created primarily by KBC components (extractors, transformations
and applications), or they are imported from CSV files. In case you want to import data to an already
**existing table**, the imported table must have all the columns of the old, existing table, even if the old
table is empty. If some columns are missing, you will receive a message like this:

    Some columns are missing in the csv file. Missing columns: lat,long. Expected columns: lat,long.
    Please check if the expected "," delimiter is used in the csv file.

Also note that the imported file **may** contain additional columns not present in the existing
table. In that case, the columns from the imported table will be added to the existing table.

## Aliases
Apart from actual tables, it is also possible to create aliases. They are internally implemented
as [database views](https://en.wikipedia.org/wiki/View_(SQL)) and inherit their basic properties.

An alias does not contain any actual data; it is simply a link to some already existing data.
Hence an alias cannot be written to, and its size does not count to your project quota.

In addition, if you create an alias from a table, the table **cannot be deleted** without the alias
being deleted as well. If you attempt to do so, you will receive an error message similar to this one:

    The blog-data table cannot be deleted. Please delete its aliases first: in.c-tutorial.blog-data,in.c-my-bucket.blog-data.

{: .image-popup}
![Screenshot - Create alias](/storage/tables/create-alias.png)

Aliases cannot be chained and can be applied only between buckets with the same backend.
An alias table can be filtered by a simple condition.

{: .image-popup}
![Screenshot - Create Simple alias](/storage/tables/create-simple-alias.png)

If you select any table from any bucket in Storage, detailed information about the table will be displayed
on the right side of your screen. This is what we refer to as the **table detail** throughout our documentation.

{: .image-popup}
![Screenshot - Simple alias result](/storage/tables/create-simple-alias-result.png)

There are the following limitations to aliases:

- Filtering is enabled only on [indexed columns](/storage/tables/#primary-keys-and-indexes).
- When an alias is created, the index on the filtered column of the source table cannot be removed.
- Alias columns are automatically synchronized, by default, with the source table. Columns added to the source
table will be added to the alias automatically.
You can prevent this by disabling *Synchronize columns with source table*.

## Primary Keys and Indexes
Each table may have a **primary key** defined on one or more columns. A primary key represents an
identifier of each row in the table. Each primary key can be defined manually on a table or as part of
[Output Mapping](/manipulation/transformations/mappings/#output-mapping) of
[Transformations](/manipulation/transformations/) and [Applications](/manipulation/applications/).
The settings on both places must match, otherwise you will receive an error:

    Output mapping does not match destination table: primary key '' does not match 'Id' in 'out.c-tutorial.opportunity_denorm' (check transformations Denormalize opportunities (id opportunity.denormalize-opportunities)).

This means that you cannot change the primary key of a table freely. Also note that you cannot set
the primary key on a column which contains duplicates --- you will receive the following error:

    Cannot create new primary key, duplicate values in primary key columns

If you want to manually set a primary key on a table, you can do so in **Storage**:

{: .image-popup}
![Screenshot - Create Primary Key](/storage/tables/create-primary-key-1.png)

Then select the columns you wish to add to the primary key:

{: .image-popup}
![Screenshot - Select columns](/storage/tables/create-primary-key-2.png)

To remove an existing primary key, click the **bin** icon:

{: .image-popup}
![Screenshot - Remove Primary Key](/storage/tables/remove-primary-key.png)

Note that creating and removing the primary key can take some time on large tables.

Apart from the primary key, you can mark a column as indexed. Indexes have some performance effects only
on the deprecated MySQL backend. On the Redshfit and Snowflake backends, marking a column as indexed does
not have any effect. You can mark a column as indexed in the table detail:

{: .image-popup}
![Screenshot - Create Index](/storage/tables/create-index.png)

### Primary Key Deduplication
When a primary key is defined on a column, the value of that column is guaranteed to be **unique** in that table.
As data are loaded into the table, only one of the rows with duplicate values is preserved.
All the other duplicates are ignored.
Let's say you have a table with three columns: `name` and `money`.  The primary key is defined
on the column `name`.

|name|money|
|---|---|
|John|$150|
|John|$340|
|Darla|$600|
|Annie|$500|
|John|$340000|
|Darla|$600000|

their uniqueness is checked and the data are de-duplicated. The result table looks like this:

|name|money|
|---|---|
|John|$150|
|Darla|$600|
|John|$340000|
|Annie|$500|

The order of rows in the imported file is not important and is not kept. That means that from each of
the duplicate rows a randomly selected one is kept and all others are discarded.
In our example, the rows `John,$340` and `Darla,$60000` were discarded.

With a primary key defined on **multiple columns**, the combination of their values is unique.
Let's say you have a table with three columns: `name`, `age` and `money`.  The primary key is defined
on two of them: `name` and `age`.
When you load the following data into your table:

|name|age|money|
|---|---|---|
|John|15|$150|
|John|34|$340|
|Darla|60|$600|
|Annie|30|$500|
|John|34|$340000|
|Darla|60|$600000|

their uniqueness is checked and the data are de-duplicated. The result table looks like this:

|name|age|money|
|---|---|---|
|John|15|$150|
|Darla|60|$600|
|John|34|$340000|
|Annie|30|$500|

Again, the order of rows in the imported file is not important and is not kept.
In our example, the rows `John,34,$340` and `Darla,60,$600000` were discarded.

### Incremental Loading
When a primary key is defined on a column, it is also possible to take advantage of incremental loads.
If you load data into a table incrementally, new rows will be added and existing rows will be updated
unless they are completely identical to the existing rows. No rows will be deleted.
 If you have a table with a primary key defined on the column `name`:

|name|money|
|---|---|
|John|$150|
|John|$340|
|Darla|$600|

and you import the following data to the table:

|name|money|
|---|---|
|Annie|$500000|
|John|$340000|
|Darla|$600000|

the result table will contain:

|name|money|
|---|---|
|John|$150|
|Darla|$600000|
|John|$340000|
|Annie|$500000|

When importing data into a table with a primary key, the uniqueness is checked.
The record `John,$340000` will overwrite the row `John,$340`, because it has the same primary key value.
The above applies only when **incremental load** is used.

When incremental is not used, the contents of the target table are cleared before the load. When a primary key
is not defined and an incremental load is used, it simply appends the data to the table and does not update anything.

### Incremental Processing
When a table is loaded incrementally the update time of each row is recorded internally. This information
can be later used in Input Mapping of many components (especially [Transformations](/manipulation/transformations/mappings/#input-mapping)).
In input mapping, you may specify the `Changed in last` option which allows the component to process only an increment of the data:

{: .image-popup}
![Screenshot - Incremental Processing](/storage/tables/incremental-processing.png)

Extending the [above example](#incremental-loading) - if you have a table with a primary key defined on the column `name`:

|name|money|
|---|---|
|John|$150|
|Peter|$340|
|Darla|$600|

and you import the following data to the table:

|name|money|
|---|---|
|Darla|$600000|
|Peter|$340|
|Annie|$500000|
|Melanie|$900000|

assuming that the import was on 2010-01-02 10:00 the result table will contain (the *\*updated\** column is not an actual column of the table, it is just displayed here for illustration purposes):

|name|money|*\*updated\**
|---|---|---|
|John|$150|2010-01-01 10:00|
|Darla|$600000|**2010-01-02 10:00**|
|Peter|$340|2010-01-01 10:00|
|Annie|$500000|**2010-01-02 10:00**|
|Melanie|$900000|**2010-01-02 10:00**|

Therefore three rows from the table will be considered as changed (added or updated). Now when you run a component (e.g. transformation)
with `Changed in last` option, various things can happen:
- `Changed in last` is set to `1 day`, and the component is started anytime between `2010-01-02 10:00` and `2010-01-03 10:00` it will receive **three** rows.
- `Changed in last` is set to `1 day`, and the component is started anytime after `2010-01-03 10:00` it will receive **no** rows.
- `Changed in last` is set to `2 day`, and the component is started anytime between `2010-01-02 10:00` and `2010-01-03 10:00` it will receive **five** rows.

Notice that the record for *Peter* was **not updated**, because it was not changed at all (the 
imported row was completely identical to the existing one). Therefore, 
when using incremental processing set to `1 day`, you will not receive that row in input mapping.
