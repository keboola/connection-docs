---
title: Firebolt
permalink: /components/writers/database/firebolt/
redirect_from:
    - /writers/database/firebolt/
---

* TOC
{:toc}

This writer sends data to a [Firebolt](https://www.firebolt.io/) database.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Firebolt** writer.

The first step is to **set up credentials**:

empty credentials to set up
{: .image-popup}
![Screenshot - Credentials page](/components/writers/database/firebolt/firebolt-1.png)

filling out credentials
{: .image-popup}
![Screenshot - Main page](/components/writers/database/firebolt/firebolt-creds.png)

setting primary and join index
{: .image-popup}
![Screenshot - Main page](/components/writers/database/firebolt/firebolt-index-settings.png)

setting load settings on the firebolt side
{: .image-popup}
![Screenshot - Main page](/components/writers/database/firebolt/firebolt-load-type.png)


selecting table type
{: .image-popup}
![Screenshot - Main page](/components/writers/database/firebolt/firebolt-table-type.png)

whole config in one pic
{: .image-popup}
![Screenshot - Main page](/components/writers/database/firebolt/firebolt-whole-config.png)








## Table Configuration
The next step is to configure the tables you want to write. Click **Add New Table** and select an existing table from Storage:

{: .image-popup}
![Screenshot - New table page](/components/writers/database/firebolt/firebolt-new-table.png)

The next step is to specify table configuration. Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Main page](/components/writers/database/firebolt/firebolt-whole-config.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [Firebolt data types](https://docs.firebolt.io/general-reference/data-types)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; when checked, the column will be marked as nullable and empty values (`''`) in that column will be converted to `NULL`. Use this for non-string columns with missing data.

The Firebolt writer can take advantage of the [column metadata](/storage/tables/#metadata). If they are available, the
column types are pre-filled automatically. Make sure to verify the suggested types, however. These data types are taken
from the data source and may not be the best choice for the data destination.

When done configuring the columns, don't forget to **save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the writer
can write data to tables --- **Full Load** and **Incremental Load**.

{: .image-popup}
![Screenshot - Main page](/components/writers/database/firebolt/firebolt-load.png)

In the **Incremental Load** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full Load** mode, the table is completely overwritten including the table structure. The table is overwritten
using the [`ALTER SWAP`](https://docs.snowflake.net/manuals/sql-reference/sql/alter-table.html#parameters) command, which ensures
the shortest unavailability of the target table. However, this operation still drops the table.

## Firebolt indexes

The 

### Primary index

### Join index

### Aggregation index


