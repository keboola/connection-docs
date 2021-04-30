---
title: SQL Server
permalink: /components/writers/database/mssql/
redirect_from:
    - /writers/database/mssql/
---

* TOC
{:toc}

This writer sends data to a [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2017) database.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **SQL Server** writer.

The first step is to **Set Up Database Credentials**.
You need to provide a *host name*, *user name*, *password*, *database name*, and SQL Server version; optionally, an *instance name* if needed for the connection.

{: .image-popup}
![Screenshot - Save Credentials](/components/writers/database/mssql/mssql-2.png)

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

It is also possible to secure the connection using an [SSH tunnel](/components/extractors/database/#connecting-to-database).

## Table Configuration
The next step is to configure the tables to write. Click the **Add new table** button and select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/components/writers/database/mssql/mssql-3.png)

The next step is to specify table configuration. Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/components/writers/database/mssql/mssql-5.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [SQL Server data types](https://docs.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; when checked, the column will be marked as nullable and empty values (`''`) in that column will be converted to `NULL`. Use this for non-string columns with missing data.
- **default value**; the provided value will be set as the [default value of the column](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql?view=sql-server-2017#default-definitions) in the target table.

When done configuring the columns, don't forget to **save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the writer
can write data to tables --- **Full Load** and **Incremental Load**.

{: .image-popup}
![Screenshot - Table Options](/components/writers/database/mssql/mssql-6.png)

In the **Incremental Load** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full Load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://docs.microsoft.com/en-us/sql/t-sql/statements/drop-table-transact-sql) command and recreated. The
`DROP` command needs to acquire a [table-level lock](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide).
This means that if the database is used by other applications which acquire table-level locks, the writer may
freeze waiting for the locks to be released.

Additionally, you can specify a **Primary key** of the table, a simple column **Data filter**, and a filter for
[incremental processing](/storage/tables/#incremental-processing).

## Binary types

For binary types `binary`, `varbinary`, `image`, the following rules apply:
- If value **starts with `0x`** and **length of the value is even number**, then it is a HEX value according to the [MsSQL specification (style 1)](https://docs.microsoft.com/en-us/sql/t-sql/functions/cast-and-convert-transact-sql?redirectedfrom=MSDN&view=sql-server-ver15#binary-styles).
    - Example: `"0xabcdef"` is converted to binary value `0xabcdef`.
- Else, the value is a string. MsSQL adds separator `\0` after each char code, when storing string as the binary type.
    - Example: `"0xabcde"` is converted to binary value `0\0x\0a\0b\0c\0d\0e`.
    - Example: `"dog"` is converted to binary value `d\0o\0g\0`.
