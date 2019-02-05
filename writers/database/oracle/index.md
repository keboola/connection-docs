---
title: Oracle
permalink: /writers/database/oracle/
---

* TOC
{:toc}

This writer sends data to an [Oracle](https://www.oracle.com/database/) database.

## Create New Configuration
Find the Oracle writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/database/oracle/ui1.png)

The first step is to **Setup Credentials**:

{: .image-popup}
![Screenshot - Main page](/writers/database/oracle/intro-page.png)

You need to provide *host name*, *user name*, *password*, *service name*.

{: .image-popup}
![Screenshot - Credentials](/writers/database/oracle/credentials.png)

We highly recommend that you create a dedicated credentials for the writer in your database. You can use the following SQL code to get started:

{% highlight sql %}
CREATE USER writer_sample IDENTIFIED BY Writer_sample1;
GRANT CREATE SESSION TO writer_sample;
GRANT CREATE TABLE TO writer_sample;
GRANT UNLIMITED TABLESPACE TO writer_sample;
{% endhighlight %}

It is also possible to secure the connection using a [SSH Tunnel](/extractors/database/#connecting-to-database).

## Table configuration
The next step is to configure the tables to write. Click the **Add new table** button:

{: .image-popup}
![Screenshot - Add Table](/writers/database/oracle/add-table.png)

Select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/writers/database/oracle/select-table.png)

The next step is to specify table configuration. Click the **Edit Columns** button to configure table columns:

{: .image-popup}
![Screenshot - Configure Table](/writers/database/oracle/configure-table.png)

Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/writers/database/oracle/table-columns.png)

For each column you can specify:

- **name** in the destination database; You can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [Oracle data types](https://docs.oracle.com/cd/B28359_01/server.111/b28318/datatype.htm#CNCPT213)); You can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; When checked, the column will be marked as nullable. This is important if the table contains empty values (`''`) -- these are converted to `NULL` during import.
- **default value**; The provided value will be set as the [default value of the column](https://docs.oracle.com/cd/B28359_01/server.111/b28310/tables003.htm#ADMIN11633) in target table.

When done configuring the columns, don't forget to **Save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the writer
can write data to tables --- **Full load** mode and **Incremental** mode.

{: .image-popup}
![Screenshot - Table Options](/writers/database/oracle/table-options.png)

In the **Incremental** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)) using the
[`MERGE`](https://docs.oracle.com/cd/B28359_01/server.111/b28286/statements_9016.htm#SQLRF01606) command. If no primary key is defined, the data is inserted.

In the **Full load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_9003.htm) command and recreated. The
`DROP` command needs to acquire a [table-level lock](https://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_9015.htm).
This means that if the database is used by other applications which acquire table-level locks, the writer may
fail with the following message:

    Query failed: 'ORA-00955: name is already used by an existing object


Additionally, you can specify a **Primary key** of the table a simple column **Data filter** and a filter for
[incremental processing](/storage/tables/#incremental-processing).
