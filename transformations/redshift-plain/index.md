---
title: Redshift Transformation
permalink: /transformations/redshift-plain/
---

* TOC
{:toc}

[AWS Redshift](https://aws.amazon.com/redshift/) is based on PostgreSQL 8.0, where AWS added powerful scaling 
and made it available in the cloud. Transformations run on your own dedicated cluster in Keboola.

## Example
To create a simple Redshift transformation, follow these steps:

- Create a table in Storage by uploading the [sample CSV file](/transformations/source.csv).
- Create an input mapping from that table, setting its destination to `source`.
- Create an output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.
 
{% highlight sql %}
CREATE TABLE "result" AS SELECT * FROM "source";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/redshift-plain/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).

## Limits
Redshift in Keboola does not support functions or stored procedures.

There are basic constraints set to keep your Redshift cluster healthy. By upgrading your Redshift cluster 
to a larger size, these limits can be increased.

- Redshift queries are limited to 3,600 seconds by default.
- All Redshift queries are performed on the cluster assigned to your project. By default, there is a limit of five
  concurrent queries. Additional queries will be queued.
- Queries containing comments longer than 8,192 characters will segfault.

## Best Practices

**Quoting**: Use double quotes (`"`) to encapsulate table and column names.

**Case sensitivity**: Redshift is case insensitive and stores all column and table names in lower case. However,
Storage is case sensitive (be careful when migrating transformations to Redshift, letter case could cause problems
in the output mapping).
