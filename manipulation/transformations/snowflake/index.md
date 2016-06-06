---
title: Snowflake
permalink: /manipulation/transformations/snowflake/
---

[Snowflake](http://www.snowflake.net/) has many advantages:

- no database administration stuff
- no indexes, sort keys, distribution styles, or column compressions
- easy scaling 
- simple data types 
- amazing processing power and data throughput

We are currently betatesting it. [Let us know](mailto:support@keboola.com) if you want to give it a try! 

### Migration from Redshift to Snowflake

Please share your [migration tips](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/snowflake/redshift-snowflake) with us.

### Limits
Snowflake queries are **limited** to 3,600 seconds by default.

### Best Practices

Snowflake is case sensitive. All unquoted table/column names are converted to upper case, quoted names keep their case. So this will not work:

{% highlight sql %}
-- created as LOWERCASETABLE
CREATE TABLE lowercasetable (...);

-- table lowercasetable not found!
SELECT * FROM "lowercasetable";

-- both work
SELECT * FROM LOWERCASETABLE;
SELECT * FROM "LOWERCASETABLE";
{% endhighlight %}
 
Be especially careful in the output mappings. Table names specified in the output mapping are always quoted.
