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

## Migration from Redshift to Snowflake

Please [share your migration tips](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/snowflake/redshift-snowflake) with us.

## Limits
Snowflake queries are **limited** to 3,600 seconds by default.

## Best Practices

### Case Sensitivity
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

### Timestamp Columns
By default, snowflake uses the
[`DY, DD MON YYYY HH24:MI:SS TZHTZM` format](https://docs.snowflake.net/manuals/sql-reference/functions-conversion.html#label-date-time-format-conversion)
when converting timestamp column to character string.

This means that if you create a table in transformation which uses a `timestamp` column

{% highlight sql %}
CREATE TABLE "ts_test" AS (SELECT CURRENT_TIMESTAMP AS "ts");
{% endhighlight %}

The table value will come out as `Wed, 19 Oct 2016 01:24:21 -0700` in Storage. If you
want to output it in different format, you have to cast the column to string first, e.g.:

{% highlight sql %}
CREATE TABLE "out" AS
    (SELECT TO_CHAR("ts", 'YYYY-MM-DD HH:MI:SS') AS "ts" FROM "ts_test");
{% endhighlight %}

Alternatively, you can set the [output format](https://docs.snowflake.net/manuals/sql-reference/parameters.html#timestamp-output-format):

{% highlight sql %}
ALTER SESSION SET TIMESTAMP_OUTPUT_FORMAT = 'YYYY-MM-DD HH24:MI:SS';
CREATE TABLE "out" AS
    (SELECT "ts"::varchar AS "ts" FROM "ts_test");
{% endhighlight %}

Also you should be aware that Snowflake works with timezones (and [DST](https://en.wikipedia.org/wiki/Daylight_saving_time)), which means that you need to
distinguish between various conversion functions:

{% highlight sql %}
SELECT
    TO_TIMESTAMP_NTZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'), -- yields 2013-03-10 02:12
    TO_TIMESTAMP_TZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'),  -- yields 2013-03-10 03:12
    TO_TIMESTAMP('10.3.2013 2:12', 'DD.MM.YYYY HH:MI');     -- yields 2013-03-10 03:12
{% endhighlight %}
