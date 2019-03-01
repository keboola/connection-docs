---
title: MySQL
permalink: /writers/database/mysql/
---

* TOC
{:toc}

This writer sends data to a [MySQL](https://www.mysql.com/products/) or [MariaDB](https://mariadb.org/) database.

## Create New Configuration
Find the MySQL writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/database/mysql/ui1.png)

The first step is to **Set Up Credentials**:

{: .image-popup}
![Screenshot - Main page](/writers/database/mysql/intro-page.png)

You need to provide a *host name*, *user name*, *password*, and a *database name* (MySQL [*schema*](https://dev.mysql.com/doc/refman/8.0/en/glossary.html#glos_schema)).

{: .image-popup}
![Screenshot - Credentials](/writers/database/mysql/credentials.png)

We highly recommend that you create dedicated credentials for the writer in your database. You can use the following SQL code to get started:

{% highlight sql %}
CREATE DATABASE writer_sample;
CREATE USER 'writer_sample' IDENTIFIED BY 'Writer_sample1';
GRANT CREATE TEMPORARY TABLES, CREATE, DROP, SELECT, INSERT, UPDATE ON writer_sample.*
    TO writer_sample;
{% endhighlight %}

It is also possible to secure the connection using an [SSH tunnel](/extractors/database/#connecting-to-database).

## Table Configuration
The next step is to configure the tables you want to write. Click **Add New Table**:

{: .image-popup}
![Screenshot - Add Table](/writers/database/mysql/add-table.png)

Select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/writers/database/mysql/select-table.png)

Then specify table configuration. Click the **Edit Columns** button to configure the table columns:

{: .image-popup}
![Screenshot - Configure Table](/writers/database/mysql/configure-table.png)

Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/writers/database/mysql/table-columns.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [MySQL data types](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that the column will not be present in the destination table.
- **nullable**; when checked, the column will be marked as nullable and empty values (`''`) in that column will be converted to `NULL`. Use this for non-string columns with missing data.
- **default value**; the provided value will be set as the [default value of the column](https://dev.mysql.com/doc/refman/8.0/en/data-type-defaults.html) in the target table.

When done configuring the columns, don't forget to **save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the writer
can write data to tables --- **Full Load** and **Incremental Load**.

{: .image-popup}
![Screenshot - Table Options](/writers/database/mysql/table-options.png)

In the **Incremental Load** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full Load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://dev.mysql.com/doc/refman/8.0/en/drop-table.html) command and recreated. The
`DROP` command needs to acquire a [table-level lock](https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html).
This means that if the database is used by other applications which acquire table-level locks, the writer may
freeze waiting for the locks to be released.

Additionally, you can specify a **primary key** of the table, a simple column **data filter**, and a filter for
[incremental processing](/storage/tables/#incremental-processing).
