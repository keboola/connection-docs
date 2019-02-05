---
title: SQL Server
permalink: /writers/database/mssql/
---

* TOC
{:toc}

This writer sends data to a [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2017) database.

## Create New Configuration
Find the SQL Server writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/database/mssql/ui1.png)

The first step is to **Setup Credentials**:

{: .image-popup}
![Screenshot - Main page](/writers/database/mssql/intro-page.png)

You need to provide *host name*, *user name*, *password*, *database name* and SQL Server version and optionally *instance name* if needed for the connection.

{: .image-popup}
![Screenshot - Credentials](/writers/database/mssql/credentials.png)

We highly recommend that you create a dedicated credentials for the writer in your database. You can use the following SQL code to get started:

{% highlight sql %}
CREATE LOGIN writer_sample WITH PASSWORD = 'Writer_sample1';
CREATE DATABASE writer_sample;
USE writer_sample;
CREATE SCHEMA writer_sample_schema;
CREATE ROLE writer_sample_role;
CREATE USER writer_sample FROM LOGIN writer_sample WITH DEFAULT_SCHEMA=writer_sample_schema;
GRANT EXECUTE, CREATE TABLE TO writer_sample_role;
GRANT ALTER, SELECT, INSERT, UPDATE, DELETE ON SCHEMA :: writer_sample_schema TO writer_sample_role;
ALTER ROLE writer_sample_role ADD MEMBER writer_sample;
{% endhighlight %}

It is also possible to secure the connection using a [SSH Tunnel](/extractors/database/#connecting-to-database).

## Table configuration
The next step is to configure the tables to write. Click the **Add new table** button:

{: .image-popup}
![Screenshot - Add Table](/writers/database/mssql/add-table.png)

Select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/writers/database/mssql/select-table.png)

The next step is to specify table configuration. Click the **Edit Columns** button to configure table columns:

{: .image-popup}
![Screenshot - Configure Table](/writers/database/mssql/configure-table.png)

Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/writers/database/mssql/table-columns.png)

For each column you can specify:

- **name** in the destination database; You can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [SQL Server data types](https://docs.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql)); You can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; When checked, the column will be marked as nullable and empty values (`''`) in that column will be converted to `NULL`. Use this for non-string columns with missing data.
- **default value**; The provided value will be set as the [default value of the column](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql?view=sql-server-2017#default-definitions) in target table.

When done configuring the columns, don't forget to **Save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the writer
can write data to tables --- **Full load** mode and **Incremental** mode.

{: .image-popup}
![Screenshot - Table Options](/writers/database/mssql/table-options.png)

In the **Incremental** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://docs.microsoft.com/en-us/sql/t-sql/statements/drop-table-transact-sql) command and recreated. The
`DROP` command needs to acquire a [table-level lock](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide).
This means that if the database is used by other applications which acquire table-level locks, the writer may
freeze waiting for the locks to be released.

Additionally, you can specify a **Primary key** of the table a simple column **Data filter** and a filter for
[incremental processing](/storage/tables/#incremental-processing).
