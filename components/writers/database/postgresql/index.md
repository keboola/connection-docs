---
title: PostgreSQL
permalink: /components/writers/database/postgresql/
redirect_from:
    - /writers/database/postgresql/

---

* TOC
{:toc}

This data destination connector sends data to a [PostgreSQL](https://www.postgresql.org/) database.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **PostgreSQL** data destination connector.

The first step is to **Set Up Database Credentials**.
You need to provide a *host name*, *user name*, *password*, *database name*, and *schema*.

{: .image-popup}
![Screenshot - Credentials](/components/writers/database/postgresql/postgre-2.png)

We highly recommend that you create dedicated credentials for the connector in your database. You can use the following SQL code to get started:

{% highlight sql %}
CREATE SCHEMA writer_sample;
CREATE USER writer_sample WITH PASSWORD 'Writer_sample1';
GRANT ALL ON SCHEMA writer_sample TO writer_sample;
ALTER SCHEMA writer_sample OWNER TO writer_sample;
ALTER USER writer_sample SET search_path TO writer_sample;
{% endhighlight %}

It is also possible to secure the connection using an [SSH tunnel](/components/extractors/database/#connecting-to-database).

## Table Configuration
The next step is to configure the tables you want to write. Click **Add New Table** and select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/components/writers/database/postgresql/postgre-3.png)

The next step is to specify table configuration. Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/components/writers/database/postgresql/postgre-5.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [PostgreSQL data types](https://www.postgresql.org/docs/11/datatype.html)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; when checked, the column will be marked as nullable and empty values (`''`) in that column will be converted to `NULL`. Use this for non-string columns with missing data.
- **default value**; the provided value will be set as the [default value of the column](https://www.postgresql.org/docs/11/sql-createtable.html) in the target table.

When done configuring the columns, don't forget to **save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the connector
can write data to tables --- **Full Load** and **Incremental Load**.

{: .image-popup}
![Screenshot - Table Options](/components/writers/database/postgresql/postgre-6.png)

In the **Incremental Load** mode, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full Load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://www.postgresql.org/docs/11/sql-droptable.html) command and recreated. The
`DROP` command needs to acquire a [table-level lock](https://www.postgresql.org/docs/current/explicit-locking.html).
This means that if the database is used by other applications which acquire table-level locks, the connector may
freeze waiting for the locks to be released. This will be recorded in the connector logs with a message similar to this:

    Table "account" is locked by 1 transactions, waiting for them to finish

Additionally, you can specify a **Primary key** of the table, a simple column **Data filter**, and a filter for
[incremental processing](/storage/tables/#incremental-processing).
