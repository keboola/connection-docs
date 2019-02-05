---
title: Thoughtspot
permalink: /writers/bi-tools/thoughtspot/
---

* TOC
{:toc}

This writer sends data to a [ThoughtSpot](https://www.thoughtspot.com/product) platform.

## Create New Configuration
Find the ThoughtSpot writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/bi-tools/thoughtspot/ui1.png)

The first step is to **Setup Credentials**:

{: .image-popup}
![Screenshot - Main page](/writers/bi-tools/thoughtspot/intro-page.png)

You need to provide [*host name*](https://docs.thoughtspot.com/5.0/data-integrate/clients/use-jdbc-driver.html), *user name*, *password*, *database name*, *schema* and *SSH user* and *SSH password*.
The writer uses the [TSLOAD CLI tool](https://docs.thoughtspot.com/5.0/admin/loading/use-data-importer.html#) and TQL commands to load that data.
These commands are executed on the server through SSH connection. Therefore the
[SSH credentials](https://docs.thoughtspot.com/4.4/app-integrate/introduction/logins.html) are needed to connect to the server instance.

{: .image-popup}
![Screenshot - Credentials](/writers/bi-tools/thoughtspot/credentials.png)

## Table configuration
The next step is to configure the tables to write. Click the **Add new table** button:

{: .image-popup}
![Screenshot - Add Table](/writers/bi-tools/thoughtspot/add-table.png)

Select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/writers/bi-tools/thoughtspot/select-table.png)

The next step is to specify table configuration. Click the **Edit Columns** button to configure table columns:

{: .image-popup}
![Screenshot - Configure Table](/writers/bi-tools/thoughtspot/configure-table.png)

Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/writers/bi-tools/thoughtspot/table-columns.png)

For each column you can specify:

- **name** in the destination database; You can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [supported data types](https://docs.thoughtspot.com/5.0/admin/loading/datatypes.html#)); You can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.

When done configuring the columns, don't forget to **Save** the settings.

### Load Options
At the top of the page, you can specify the target table type and name and additional load options. The table type is
one of `STANDARD`, `FACT` and `DIMENSION`. See an [explanatory article](https://www.thoughtspot.com/fact-and-dimension/dimensional-data-modeling-4-simple-steps)
about schema design or the [official guide](https://docs.thoughtspot.com/5.0/admin/data-modeling/data-modeling-settings.html) for
more details on designing the data schema.

{: .image-popup}
![Screenshot - Table Type](/writers/bi-tools/thoughtspot/table-type.png)

There are two main options how the writer can write data to tables --- **Full load** mode and **Incremental** mode.

{: .image-popup}
![Screenshot - Table Options](/writers/bi-tools/thoughtspot/table-options.png)

In the **Incremental** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://docs.thoughtspot.com/5.0/admin/loading/check-dependencies-tql.html) command and recreated.

Additionally, you can specify a **Primary key** of the table a simple column **Data filter** and a filter for
[incremental processing](/storage/tables/#incremental-processing).
