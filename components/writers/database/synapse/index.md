---
title: Synapse
permalink: /components/writers/database/synapse/
---

* TOC
{:toc}

This writer sends data to a [Azure Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) database.

**This writer is only available on the Azure [Keboola stacks](/overview/#stacks).**

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Synapse** writer.

The first step is to **Set Up Database Credentials**.

You need to provide a *host name*, *port*, *user name*, *password*, *database name* and *schema*.

{: .image-popup}
![Screenshot - Save Credentials](/components/writers/database/synapse/synapse-1.png)

We highly recommend to create a dedicated credentials for the writer.

First, create a login in the **`master`** database:

```
sqlcmd -S hostname -U user -P password -d master -I
```

{% highlight sql %}
CREATE LOGIN writer_sample WITH PASSWORD = '123pass###';
{% endhighlight %}

Then connect to your *database* (not master). Synapse doesn't support database switching. 

```
sqlcmd -S hostname -U user -P password -d database -I
```

Continue by creating a user and grant the permissions:
{% highlight sql %}
CREATE SCHEMA writer_sample_schema;
CREATE ROLE writer_sample_role;
CREATE USER writer_sample FROM LOGIN writer_sample WITH DEFAULT_SCHEMA=writer_sample_schema;
GRANT EXECUTE, CREATE TABLE TO writer_sample_role;
GRANT ALTER, SELECT, INSERT, UPDATE, DELETE ON SCHEMA :: writer_sample_schema TO writer_sample_role;
GRANT ADMINISTER DATABASE BULK OPERATIONS TO writer_sample_role;
EXEC sp_addrolemember 'writer_sample_role', 'writer_sample';
{% endhighlight %}


## Table Configuration
The next step is to configure the tables to write. 

Click the **Add new table** button:

{: .image-popup}
![Screenshot - Add Table Button](/components/writers/database/synapse/synapse-2.png)

Select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/components/writers/database/synapse/synapse-3.png)

The next step is to specify table configuration. Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/components/writers/database/synapse/synapse-4.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [Azure Synapse data types](https://docs.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-data-types)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; when checked, the column will be marked as nullable and empty values (`''`) in that column will be converted to `NULL`. Use this for non-string columns with missing data.
- **default value**; the provided value will be set as the [default value of the column](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql?view=sql-server-2017#default-definitions) in the target table.

When done configuring the columns, don't forget to **save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the writer
can write data to tables --- **Full Load** and **Incremental Load**.

{: .image-popup}
![Screenshot - Table Options](/components/writers/database/synapse/synapse-5.png)

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
