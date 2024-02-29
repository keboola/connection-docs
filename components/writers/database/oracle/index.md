---
title: Oracle
permalink: /components/writers/database/oracle/
redirect_from:
    - /writers/database/oracle/
---

* TOC
{:toc}

This data destination connector sends data to an [Oracle](https://www.oracle.com/database/) database.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Oracle** data destination connector.

The first step is to **Set Up Database Credentials**.
You need to provide a *host name*, *user name*, *password*, and a *service name*.

{: .image-popup}
![Screenshot - Credentials](/components/writers/database/oracle/oracle-2.png)

We highly recommend that you create dedicated credentials for the connector in your database. You can use the following SQL code to get started:

{% highlight sql %}
CREATE USER writer_sample IDENTIFIED BY Writer_sample1;
GRANT CREATE SESSION TO writer_sample;
GRANT CREATE TABLE TO writer_sample;
GRANT UNLIMITED TABLESPACE TO writer_sample;
{% endhighlight %}

It is also possible to secure the connection using an [SSH tunnel](/components/extractors/database/#connecting-to-database).

## Table Configuration
The next step is to configure the tables you want to write. Click **Add New Table** and select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/components/writers/database/oracle/oracle-3.png)

The next step is to specify table configuration. Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/components/writers/database/oracle/oracle-5.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [Oracle data types](https://docs.oracle.com/cd/B28359_01/server.111/b28318/datatype.htm#CNCPT213)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; when checked, the column will be marked as nullable. This is important if the table contains empty values (`''`) -- these are converted to `NULL` during import.
- **default value**; the provided value will be set as the [default value of the column](https://docs.oracle.com/cd/B28359_01/server.111/b28310/tables003.htm#ADMIN11633) in the target table.

When done configuring the columns, don't forget to **save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the connector
can write data to tables --- **Full Load** and **Incremental Load**.

{: .image-popup}
![Screenshot - Table Options](/components/writers/database/oracle/oracle-6.png)

In the **Incremental Load** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)) using the
[`MERGE`](https://docs.oracle.com/cd/B28359_01/server.111/b28286/statements_9016.htm#SQLRF01606) command. If no primary key is defined, the data is inserted.

In the **Full Load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_9003.htm) command and recreated. The
`DROP` command needs to acquire a [table-level lock](https://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_9015.htm).
This means that if the database is used by other applications which acquire table-level locks, the connector may
fail with the following message:

    Query failed: 'ORA-00955: name is already used by an existing object

Additionally, you can specify a **Primary key** of the table, a simple column **Data filter**, and a filter for
[incremental processing](/storage/tables/#incremental-processing).
