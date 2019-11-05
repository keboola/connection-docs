---
title: Extractors for SQL Databases
permalink: /components/extractors/database/sqldb/
redirect_from:
    - /extractors/database/sqldb/

---

* TOC
{:toc}

Each extractor from an SQL database allows you to extract data from selected tables, or results from arbitrary SQL queries.

The extractors for supported SQL databases ([Cloudera Impala](https://www.cloudera.com/products/apache-hadoop/impala.html), 
[Firebird](http://www.firebirdsql.org/), [IBM DB2](http://www.ibm.com/analytics/us/en/technology/db2/), 
[Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/), [MySQL](https://www.mysql.com/),
[Oracle](http://www.oracle.com/index.html), [PostgreSQL](http://www.postgresql.org/), [Teradata](http://www.teradata.com)) are configured
in the same way and have an [advanced mode](/components/extractors/database/sqldb/#advanced-mode). All notable differences are listed 
in the section [Server Specific Notes](#server-specific-notes).

Before you start configuring your SQL extractor, consider securing your connection to your internal database to avoid exposing 
your database server to the internet by [setting up an SSH Tunnel](/components/extractors/database/#connecting-to-database).

*Note: Quick introduction to extracting data from the Snowflake Database Server is also part of our [tutorial](/tutorial/load/database/).*

## Initial Setup
After you [create a configuration](/components/#creating-component-configuration), the first step is to configure database credentials using the **Setup credentials first** button:

{: .image-popup}
![Screenshot - Configure Credentials Start](/components/extractors/database/sqldb/sqldb-1.png)

Fill in the credentials to the database. See section [Server Specific Notes](#server-specific-notes) for description of non-standard fields.
After testing the credentials, **Save** them:

{: .image-popup}
![Screenshot - Configure Credentials](/components/extractors/database/sqldb/sqldb-2.png)

After saving the credentials, the extractor will automatically fetch the list of database tables accessible by the provided credentials.
Select the tables you want to extract and click the **Create** button:

{: .image-popup}
![Screenshot - Select Tables](/components/extractors/database/sqldb/sqldb-3.png)

You can modify the configured tables by clicking on the appropriate row, or add new tables via the **New Table** button.
Each table may be also extracted individually, or it may be disabled so that it is not extracted when the entire configuration is run.
Existing credentials can be changed using the **Database Credentials** link.

{: .image-popup}
![Screenshot - Table list](/components/extractors/database/sqldb/sqldb-4.png)

## Modify Configuration
If you want to modify table extraction setup, click on the corresponding row. You'll get to the table detail view:

{: .image-popup}
![Screenshot - Table Detail](/components/extractors/database/sqldb/sqldb-5.png)

Here you can modify the source table, limit the extraction to specific columns or change the destination table name in
[Storage](/storage/). The table details also allows you to define [**Primary Key**](/storage/tables/#primary-keys)
and [**Incremental Loading**](/storage/tables/#incremental-loading).
We highly recommend you define a **primary key** where possible. [Primary keys](/storage/tables/#primary-keys) substantially
speed up both the data loads and further processing of the table. Also
use [incremental loading](/storage/tables/#incremental-loading) when possible --- again that speeds up the data loads considerably.
Both options require knowledge of the source table, so don't turn them on blindly.

### Advanced Mode
The table detail also allows you to switch to **Advanced mode**:

{: .image-popup}
![Screenshot - Table Detail Advanced](/components/extractors/database/sqldb/sqldb-6.png)

In advanced mode, you can write an arbitrary `SELECT` query, the result of that query will be imported to a
[Storage](/storage/) table. The SQL query is executed on the source server without any processing, that means that
you have to follow the SQL dialect of the particular server you're working with.
Please keep the following in mind when using the advanced mode:

- Use as **simple queries** as possible.
- Define a **primary key** where possible.

Avoid doing complex joins and aggregations in SQL queries.
Remember that these queries are executed on the database server you are extracting from.
This database system might not be designed or optimized for complex SELECT queries.
Complex queries may result in timeouts, or they might produce unnecessary loads on your internal systems.
Instead, import raw data, and then use KBC tools to give it the shape you want.

## Server Specific Notes

### MySQL Encryption
The MySQL database server also supports encrypting the whole database communication using SSL Certificates. See the
[official guide](http://dev.mysql.com/doc/refman/5.7/en/creating-ssl-files-using-openssl.html) for instructions on setting it up.

### MySQL Network Compression
Enables [MySQL Network Compression](https://dev.mysql.com/doc/refman/5.7/en/group-replication-message-compression.html). Pros and cons
of this feature are quite well discussed on [StackOverflow](https://stackoverflow.com/questions/2506460/when-should-i-use-mysql-compressed-protocol).

### MS SQL Server Advanced Mode
The SQL Server export uses the [BCP utility](https://docs.microsoft.com/en-us/sql/tools/bcp-utility?view=sql-server-2017) to export data.
For this reason, if you are writing advanced mode queries you have to quote the values of non-numeric columns (text, datetime, etc.) --- so that the selected
value is `"some text"` instead of `some text`. This can be done by e.g. `SELECT char(34) + [my_text_column] + char(34)`.
The [`CHAR`](https://docs.microsoft.com/en-us/sql/t-sql/functions/char-transact-sql?view=sql-server-2017) function with argument `34` produces
the double quote character `"`.
When the extracted text itself may contain quotes, you need to escape them by replacing `"` with `""`. Full example:

{% highlight sql %}
SELECT char(34) + REPLACE([my_varchar_column], char(34), char(34) + char(34)) + char(34) FROM [my_table]
{% endhighlight %}

The extractor will still work if you don't do these things, but the BCP will fail and the backup, much slower method
will be used. In that case the message  `BCP command failed: ... Attempting export using pdo_sqlsrv` will be logged in the extraction
job events.

### Azure-Hosted MS SQL Server
An SQL Server instance hosted on Azure will normally have a host name such as `[srvName].databases.windows.net`.
If the hostname is provided as IP address e.g. `123.123.123.123` the username needs to have the suffix `@[srvName]` as in, for example, `keboola@srvKeboola`.

### Snowflake
When extracting data from a Snowflake database, the permissions must be set to allow the
specified user to use the specified warehouse.

The following SQL code creates the role and user `KEBOOLA_SNOWFLAKE_EXTRACTOR` and grants them access
to `MY_WAREHOUSE` warehouse, `MY_DATA` database, and `MY_SCHEMA` schema.

{% highlight sql %}
CREATE ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT USAGE ON WAREHOUSE MY_WAREHOUSE TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT USAGE ON DATABASE MY_DATA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT USAGE ON SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT SELECT ON ALL TABLES IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT SELECT ON ALL VIEWS IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
CREATE USER KEBOOLA_SNOWFLAKE_EXTRACTOR PASSWORD = 'MY_PASSWORD' DEFAULT_ROLE = KEBOOLA_SNOWFLAKE_EXTRACTOR MUST_CHANGE_PASSWORD = FALSE;
GRANT ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR TO USER KEBOOLA_SNOWFLAKE_EXTRACTOR;
{% endhighlight %}

Note that with the above setup, the user will not have access to newly created tables.
You will either have to use a more permissive role or reset the permissions by calling:

{% highlight sql %}
GRANT SELECT ON ALL TABLES IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT SELECT ON ALL VIEWS IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
{% endhighlight %}
