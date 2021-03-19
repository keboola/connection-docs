---
title: Redshift Transformation
permalink: /transformations/redshift-plain/
---

* TOC
{:toc}

AWS Redshift is based on PostgreSQL 8.0 where AWS added powerful scaling and made it available in cloud. Transformations run on your own dedicated cluster in Keboola Connection.

## Example

To create a simple Redshift transformation, follow these steps:
 - upload the [sample CSV file](/transformations/source.csv) into your storage,
 - Set the input mapping from that table to `source`,
 - Set the output mapping for the destination table to a new table in your Storage,
 - Copy & paste the below script into the transformation code.,
 - Save and run the transformation.
 
{% highlight sql %}
CREATE TABLE "result" AS SELECT * FROM "source";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/redshift-plain/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).

## Limits
Redshift in Keboola Connection does not support functions or stored procedures.

There are basic constrains set to keep your Redshift cluster healthy. By upgrading your Redshift cluster to a
larger size, these limits can be increased.

- Redshift queries are limited to 3,600 seconds by default.
- All Redshift queries are performed on the cluster assigned to your project. By default, there is a limit of five
  concurrent queries. Additional queries will be queued.
- Queries containing comments longer than 8,192 characters will segfault.

## Best Practices

**Quoting** -- Use double quotes (`"`) to encapsulate table and column names.

**Case sensitivity** -- Redshift is case insensitive and stores all column and table names in lower case. However,
Storage is case sensitive (be careful when migrating transformations to Redshift, letter case could cause problems
in the output mapping).

**COPY Options** -- The default COPY command looks like this:

{% highlight sql %}
COPY "table FROM 's3://bucket/file'
CREDENTIALS 'aws_access_key_id=key;aws_secret_access_key=secret'"
NULL AS 'NULL' ACCEPTANYDATE TRUNCATECOLUMNS
DELIMITER ',' CSV QUOTE '"'
GZIP IGNOREHEADER 1;
{% endhighlight %}
