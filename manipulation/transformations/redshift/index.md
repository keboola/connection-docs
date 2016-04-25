---
title: Redshift
permalink: /manipulation/transformations/redshift/
---

* TOC
{:toc}
 
AWS Redshift is based on PostgreSQL 8.0 where AWS added powerful scaling and made it available in cloud. You can have your own dedicated cluster in Keboola Connection or "bring your own cluster" (soon). 
 
 - You get your own dedicated cluster, all the power is at your hands.
 - If your source data is on Redshift, there is no data transfer. 
 - Redshift is a columnar database - no more indexing, nest JOINs without worries.
 - Redshift is a bit bitchy about data types (eg. invalid characters).
 - If a query gets slow, dive into [sort keys](http://docs.aws.amazon.com/redshift/latest/dg/c_best-practices-sort-key.html), [distribution styles](http://docs.aws.amazon.com/redshift/latest/dg/c_best-practices-best-dist-key.html) and [column compression](http://docs.aws.amazon.com/redshift/latest/dg/c_best-practices-use-auto-compression.html). 

## Migration from MySQL

For transformations migrating from MySQL to Redshift this [hint sheet](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/redshift/redshift-hints) is handy.   

## Limits

There are basic constrains set to keep your Redshift cluster healthy. By upgrading your Redshift cluster to a larger size these limits can be increased.

### Time

Redshift queries are limited to 3600 seconds by default.

### Resources

All Redshift queries are performed on the cluster assigned to the project. By default there is a limit of 5 concurrent queries. Additional queries will be queued.

## Best practices

### Quoting

 Use double quote (`"`) to encapsulate table and column names.
 
### Case sensitivity 

Redshift is case insensitive and stores all column and table names in lower case, but Storage is case sensitive (be careful when migrating transformations to Redshift, letter case could cause problems in output mapping)

### COPY options

The default COPY command looks like this

{% highlight sql %}
COPY "table FROM 's3://bucket/file'
CREDENTIALS 'aws_access_key_id=key;aws_secret_access_key=secret'"
NULL AS 'NULL' ACCEPTANYDATE TRUNCATECOLUMNS
DELIMITER ',' CSV QUOTE '"'
GZIP IGNOREHEADER 1;
{% endhighlight %}

If you do not specify any COPY options in the input mapping, `NULL AS 'NULL' ACCEPTANYDATE TRUNCATECOLUMNS` will be used as default. Specifying COPY options will overwrite the defaults.
