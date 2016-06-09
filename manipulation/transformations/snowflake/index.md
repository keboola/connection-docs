---
title: Snowflake Transformation
permalink: /manipulation/transformations/snowflake/
---

[Snowflake](http://www.snowflake.net/) has many advantages:

- No database administration stuff
- No indexes, sort keys, distribution styles, or column compressions
- Easy scaling 
- Simple data types 
- Amazing processing power and data throughput

We are currently betatesting Snowflake. [Let us know](mailto:support@keboola.com) if you want to give it a try! 

### Migration from Redshift to Snowflake

Please [share your migration tips](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/snowflake/redshift-snowflake) with us.

### Limits
Snowflake queries are **limited** to 3,600 seconds by default.

### Best Practices

Snowflake is case sensitive. All unquoted table/column names are converted to upper case, while quoted names keep their case. 
So if you want to create this table,

{% highlight sql %}
-- created as LOWERCASETABLE
CREATE TABLE lowercasetable (...);
{% endhighlight %}

all of the following commands will work,

{% highlight sql %}
SELECT * FROM LOWERCASETABLE;
SELECT * FROM "LOWERCASETABLE";
SELECT * FROM lowercasetable;
{% endhighlight %}

while this one will not: 

{% highlight sql %}
-- table lowercasetable not found!
SELECT * FROM "lowercasetable";
{% endhighlight %}
 
Be especially careful in the output mappings. Table names specified in the output mapping are always quoted.
