---
title: Snowflake
permalink: /manipulation/transformations/snowflake/
---

* TOC
{:toc}

We're currently betatesting [Snowflake](http://www.snowflake.net/). It takes all database administration stuff out. No indexes, sort keys, distribution styles, column compressions. Easy scaling, simple data types. Amazing processing power and data throughput. [Let us know](mailto:support@keboola.com) if you want to try! 

## Migration from Redshift

We're collecting tips for [migration from Redshift to Snowflake](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/snowflake/redshift-snowflake).

## Limits

### Time

Snowflake queries are limited to 3600 seconds by default.

## Best practices

### Case sensitivity 

Snowflake is case case sensitive. All unquoted table/column names are converted to upper case, quoted names keep their case. So this won't work:

{% highlight sql %}
-- created as LOWERCASETABLE
CREATE TABLE lowercasetable (...);

-- table lowercasetable not found!
SELECT * FROM "lowercasetable";

-- both work
SELECT * FROM LOWERCASETABLE;
SELECT * FROM "LOWERCASETABLE";
{% endhighlight %}
 
Be especially careful in output mappings, table names specifined in output mapping are always quoted.
