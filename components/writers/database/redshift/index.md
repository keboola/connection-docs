---
title: Redshift
permalink: /components/writers/database/redshift/
redirect_from:
    - /writers/database/redshift/

---

* TOC
{:toc}

This writer sends data to a [Redshift](https://aws.amazon.com/redshift/) database. It can either write data
to an existing Redshift database, or to a new database it provisions to you. The latter case is useful
for sharing your data in form of an SQL database with some service. For example, you can use it to send
data to [Tableau](https://www.tableau.com/) or [PowerBI](https://powerbi.microsoft.com/en-us/).

## Create New Configuration
Find the Redshift writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/components/writers/database/redshift/ui1.png)

The first step is to **Set Up Credentials**:

{: .image-popup}
![Screenshot - Main page](/components/writers/database/redshift/intro-page.png)

There are two modes of operation of the writer:

- **Own Redshift database** --- Use this when you have your own Redshift database -- i.e., you have your own Redshift cluster, or someone gave you credentials of a database to write to.
- **Keboola Redshift database** --- In this mode, the writer will create a new database for you and **give you credentials** to it.

{: .image-popup}
![Screenshot - Credential types](/components/writers/database/redshift/credentials.png)

### Own Redshift Database
You need to provide a *host name*, *user name*, *password*, *database name*, and *schema*.

{: .image-popup}
![Screenshot - Own Credentials](/components/writers/database/redshift/own-credentials.png)

We highly recommend that you create dedicated credentials for the writer in your Redshift database. You can use the following SQL code to get started:

{% highlight sql %}
CREATE GROUP writer_sample;
CREATE SCHEMA writer_sample;
GRANT ALL ON SCHEMA writer_sample TO GROUP writer_sample;
CREATE USER writer_sample WITH PASSWORD 'Writer_sample1';
ALTER SCHEMA writer_sample OWNER TO writer_sample;
ALTER USER writer_sample SET search_path TO writer_sample;
ALTER GROUP writer_sample ADD USER writer_sample;
{% endhighlight %}

It is also possible to secure the connection using an [SSH tunnel](/components/extractors/database/#connecting-to-database).

### Keboola Redshift Database
A Keboola Redshift database is created by the writer and the credentials are provisioned for you:

{: .image-popup}
![Screenshot - Provisioned Credentials](/components/writers/database/redshift/provisioned-credentials.png)

You can share the credentials with whatever service that needs to access your data --- for example, with [Tableau Online](https://www.tableau.com/products/cloud-bi).
Note that the database is provided solely for the purpose of **sharing your existing data** with the outside world. This means that it must not be receiving
any data (outside those provided by the writer itself, of course). This is a contractual limitation.
Also note that the number of provisioned Redshift databases is part of [project limits](/management/project/limits/).

*Note: This feature is available only for projects with the Redshift [Storage backend](/storage/#storage-data). If you need a provisioned database in non-Redshift
projects, use the [Snowflake writer](/components/writers/database/snowflake/#keboola-snowflake-database) for the purpose.*

## Table Configuration
Regardless of the credentials used, the next step is to configure the tables to write. Click **Add New Table**:

{: .image-popup}
![Screenshot - Add Table](/components/writers/database/redshift/add-table.png)

Select an existing table from Storage:

{: .image-popup}
![Screenshot - Select Table](/components/writers/database/redshift/select-table.png)

The next step is to specify table configuration. Click the **Edit Columns** button to configure the table columns:

{: .image-popup}
![Screenshot - Configure Table](/components/writers/database/redshift/configure-table.png)

Use the **preview** icon to peek at the column contents.

{: .image-popup}
![Screenshot - Table Columns](/components/writers/database/redshift/table-columns.png)

For each column you can specify its

- **name** in the destination database; you can also use the select box in the table header to bulk convert the case of all names.
- **data type** (one of [Redshift data types](https://docs.aws.amazon.com/redshift/latest/dg/c_Supported_data_types.html)); you can also use the select box in the table header to bulk set the type for all columns. Setting the data type to `IGNORE` means that column will not be present in the destination table.
- **nullable**; when checked, the table column will be marked as nullable. During import, values containing the string `NULL` will be converted to an actual `NULL`.
- **default value**; the provided value will be set as the [default value of the column](https://docs.aws.amazon.com/redshift/latest/dg/r_ALTER_TABLE.html#r_ALTER_TABLE-parameters) in target table.

When done configuring the columns, don't forget to **Save** the settings.

### Load Options
At the top of the page, you can specify the target table name and additional load options. There are two main options how the writer
can write data to tables --- **Full Load** and **Incremental Load**.

{: .image-popup}
![Screenshot - Table Options](/components/writers/database/redshift/table-options.png)

In the **Incremental Load**, the data are bulk inserted into
the destination table and the table structure must match (including the data types). That means the structure of the target table
will not be modified. If the target table doesn't exist, it will be created. If a primary key is defined on the table, the
data is [upserted](https://en.wikipedia.org/wiki/Merge_(SQL)). If no primary key is defined, the data is inserted.

In the **Full Load** mode, the table is completely overwritten including the table structure. The table is removed
using the [`DROP`](https://docs.aws.amazon.com/redshift/latest/dg/r_DROP_TABLE.html) command and recreated. The
`DROP` command needs to acquire a [table-level lock](https://docs.aws.amazon.com/redshift/latest/dg/r_LOCK.html).
This means that if the database is used by other applications which acquire table-level locks, the writer may
freeze waiting for the locks to be released. See the [Redshift docs](https://docs.aws.amazon.com/redshift/latest/dg/c_Concurrent_writes.html)
for more details.

Additionally, you can specify a **Primary key** of the table, a simple column **Data filter**, and a filter for
[incremental processing](/storage/tables/#incremental-processing).

## Using Keboola Provisioned Database
The writer offers the option to create a [Keboola Provisioned database](#keboola-redshift-database) for you. You can
use this database to connect KBC to a wide range of consumers --- especially Business Intelligence tools and Analytics.
The database can be queried in real time but is still completely isolated from your project Storage.

### Connect to Looker
It is possible to use the Redshift writer to share data with [Looker](https://looker.com/).
To share data between your KBC project and PowerBI, choose **Keboola Redshift Database** when configuring the credentials.
The writer will create a dedicated database for you and give you credentials. Run the writer and when it is finished, you can
connect the Looker data sources. Follow the official
[instructions](https://docs.looker.com/setup-and-management/connecting-to-db). Note that you
can skip a number of steps because a dedicated user is already created for you.

### Connect to Power BI Desktop
It is possible to use the Redshift writer to share data with [Power BI Desktop](https://powerbi.microsoft.com/en-us/desktop/) or
[Tableau Online](https://www.tableau.com/products/cloud-bi).
To share data between your KBC project and PowerBI, choose **Keboola Redshift Database** when configuring the credentials.
The writer will create a dedicated database for you and give you credentials. Run the writer and when it is finished, you can
connect the Power BI data sources. Follow the official [instructions for Power BI Desktop](https://docs.microsoft.com/en-us/power-bi/desktop-connect-redshift).

### Connect to Qlik
It is possible to use the Redshift writer to share data with [Qlik Sense](https://www.qlik.com/us/products/qlik-sense)
and [QlikView](https://www.qlik.com/us/products/qlikview).
To share data between your KBC project and PowerBI, choose **Keboola Redshift Database** when configuring the credentials.
The writer will create a dedicated database for you and give you credentials. Run the writer and when it is finished, you can
connect the Qlik data sources. Follow the Qlik official [integration guide](https://help.qlik.com/en-US/connectors/Subsystems/ODBC_connector_help/Content/Connectors_ODBC/Redshift/Create-Redshift-connection.htm).

### Connect to Tableau
It is possible to use the Redshift writer to share data with [Tableau Desktop](https://www.tableau.com/products/desktop) or
[Tableau Online](https://www.tableau.com/products/cloud-bi). This is usually more efficient and
faster than loading data through [TDE files](https://www.tableau.com/about/blog/2014/7/understanding-tableau-data-extracts-part1)
with the [TDE writer](/components/writers/bi-tools/tableau/).

To share data between your KBC project and Tableau, choose **Keboola Redshift Database** when configuring the credentials.
The writer will create a dedicated database for you and give you credentials. Run the writer and when it is finished, you can
connect the Tableau data sources. Follow the official
[instructions for Tableau Desktop](https://onlinehelp.tableau.com/current/pro/desktop/en-us/examples_amazonredshift.htm)
or for [Tableau Online](https://onlinehelp.tableau.com/current/online/en-us/to_connect_live_sql.htm).
