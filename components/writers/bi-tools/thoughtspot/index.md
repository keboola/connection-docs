---
title: ThoughtSpot
permalink: /components/writers/bi-tools/thoughtspot/
redirect_from:
    - /writers/bi-tools/thoughtspot/
---

* TOC
{:toc}

This writer sends data to a [ThoughtSpot](https://www.thoughtspot.com/product) platform.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **ThoughtSpot** writer.
Then **Set Up Credentials**. You need to provide a [*host name*](https://docs.thoughtspot.com/5.0/data-integrate/clients/use-jdbc-driver.html), *user name*, *password*, *database name*, *schema* and *SSH user* and *SSH password*.
The writer uses the [TSLOAD CLI tool](https://docs.thoughtspot.com/5.0/admin/loading/use-data-importer.html#) and TQL commands to load that data.
These commands are executed on the server through an SSH connection. Therefore the
[SSH credentials](https://docs.thoughtspot.com/4.4/app-integrate/introduction/logins.html) are needed to connect to the server instance.

{: .image-popup}
![Screenshot - Credentials](/components/writers/bi-tools/thoughtspot/thoughtspot-1.png)

## Table Configuration
The next step is to configure the tables you want to write. Click the **Add New Table** button and select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/components/writers/bi-tools/thoughtspot/thoughtspot-2.png)

The next step is to specify table configuration. Click the **Edit Columns** button to configure the table columns:

{: .image-popup}
![Screenshot - Configure Table](/components/writers/bi-tools/thoughtspot/thoughtspot-3.png)

Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/components/writers/bi-tools/thoughtspot/thoughtspot-4.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [supported data types](https://docs.thoughtspot.com/5.0/admin/loading/datatypes.html#)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that the column will not be present in the destination table.

When done configuring the columns, don't forget to **Save** the settings.

### Load Options
At the top of the page, you can specify the target table type and name additional load options. The table type is
one of `STANDARD`, `FACT`, and `DIMENSION`. See an [explanatory article](https://www.thoughtspot.com/fact-and-dimension/dimensional-data-modeling-4-simple-steps)
about schema design or the [official guide](https://docs.thoughtspot.com/5.0/admin/data-modeling/data-modeling-settings.html) for
more details on designing the data schema.

{: .image-popup}
![Screenshot - Table Type](/components/writers/bi-tools/thoughtspot/thoughtspot-5.png)

There are two main options how the writer can write data to tables --- **Full Load** mode and **Incremental Load** mode.

{: .image-popup}
![Screenshot - Table Options](/components/writers/bi-tools/thoughtspot/thoughtspot-6.png)

In the **Incremental Load** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full Load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://docs.thoughtspot.com/5.0/admin/loading/check-dependencies-tql.html) command and recreated.

Additionally, you can specify a **Primary key** of the table, a simple column **data filter**, and a filter for
[incremental processing](/storage/tables/#incremental-processing).
