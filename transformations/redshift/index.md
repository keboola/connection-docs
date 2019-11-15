---
title: Redshift Transformation
permalink: /transformations/redshift/
redirect_from:
    - /manipulation/transformations/redshift/

---

AWS Redshift is based on PostgreSQL 8.0 where AWS added powerful scaling and made it available in cloud. Transformations run on
your own dedicated cluster in Keboola Connection.

 - If your source data is on Redshift, there is no data transfer.
 - Redshift is a columnar database -- no more indexing, nest JOINs without worries.
 - Redshift is not very friendly when it come to data types, for instance, invalid characters.
 - If a query gets slow, dive into [sort keys](https://docs.aws.amazon.com/redshift/latest/dg/c_best-practices-sort-key.html),
 [distribution styles](https://docs.aws.amazon.com/redshift/latest/dg/c_best-practices-best-dist-key.html) and
 [column compression](https://docs.aws.amazon.com/redshift/latest/dg/c_best-practices-use-auto-compression.html).

### Limits
Redshift in KBC does not support functions or stored procedures.

There are basic constrains set to keep your Redshift cluster healthy. By upgrading your Redshift cluster to a
larger size, these limits can be increased.

- Redshift queries are limited to 3,600 seconds by default.
- All Redshift queries are performed on the cluster assigned to your project. By default, there is a limit of five
concurrent queries. Additional queries will be queued.
- Queries containing comments longer than 8,192 characters will segfault.

### Best Practices

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

If you do not specify any COPY options in the input mapping, `NULL AS 'NULL' ACCEPTANYDATE TRUNCATECOLUMNS` will
be used as default. Specifying the COPY options will overwrite the defaults.
