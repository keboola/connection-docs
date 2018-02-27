---
title: Extractors for SQL Databases
permalink: /extractors/database/sqldb/
---

* TOC
{:toc}

*All extractors for SQL databases are configured in the same way.*
*See our [tutorial](/tutorial/load/database/) for help.*

## Database Extractor Configuration
After creating a new configuration and setting up database credentials,
select which tables you want to import to KBC Storage.

## Advanced Mode -- Best Practices
If you'd prefer to write your own query to extract data to KBC Storage, use the advanced mode checkbox.

{: .image-popup}
![Screenshot - Advanced Mode](/extractors/database/advancedMode.png)

Please keep the following in mind when using the advanced mode:

- Use as **simple queries** as possible. Avoid doing complex joins and aggregations.
Keep in mind that these queries are executed on the database server you are extracting from.
This database system might not be designed or optimized for complex SELECT queries.
Complex queries may result in timeouts, or they might produce unnecessary loads on your internal systems.
Instead, import raw data, and then use KBC tools to give it the shape you want.

- Define a **primary key** where possible. [Primary keys](/storage/tables/#primary-keys-and-indexes) substantially speed up both the data loads and further processing of the table. Also
use [incremental loading](/storage/tables/#incremental-loading) when possible.

## Server Specific Notes

### MySQL Encryption
The MySQL database server also supports encrypting the whole database communication using SSL Certificates. See the
[official guide](http://dev.mysql.com/doc/refman/5.7/en/creating-ssl-files-using-openssl.html) for instructions on setting it up.

### Azure-hosted MS SQL Server
A MS SQL Server instance hosted on Azure will normally have a host name such as `[srvName].databases.microsoft.net`.
The `[srvName]` is not an instance name, so the instance name should be left blank.
But the username needs to have the suffix `@[srvName]` as in, for example, `keboola@srvKeboola`.

### Snowflake
When extracting data from Snowflake database, the permissions must be set to allow the
specified user to use the specified warehouse.

The following SQL code, creates role and user `KEBOOLA_SNOWFLAKE_EXTRACTOR` and grants them access
to `MY_WAREHOUSE` warehouse, `MY_DATA` database and `MY_SCHEMA` schema.

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

Note that the with the above setup, the user will not have access to newly created tables,
you'll either have to use more permissive role or reset the permissions by calling:

{% highlight sql %}
GRANT SELECT ON ALL TABLES IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
GRANT SELECT ON ALL VIEWS IN SCHEMA MY_DATA.MY_SCHEMA TO ROLE KEBOOLA_SNOWFLAKE_EXTRACTOR;
{% endhighlight %}
