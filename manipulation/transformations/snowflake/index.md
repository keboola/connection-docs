---
title: Snowflake Transformation
permalink: /manipulation/transformations/snowflake/
---

* TOC
{:toc}

[Snowflake](http://www.snowflake.net/) has many advantages:

- No database administration
- No indexes, sort keys, distribution styles, or column compressions
- Easy scaling
- Simple data types
- Amazing processing power and data throughput

## Migration from Redshift to Snowflake

Please [share your migration tips](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/snowflake/redshift-snowflake) with us.

## Limits

- Snowflake queries are **limited** to 3,600 seconds by default.
- Queries containing comments longer than 8192 characters will segfault.

## Best Practices

### Case Sensitivity
Unlike Redshift or MySQL, Snowflake is case sensitive. All unquoted table/column names are converted to upper case
while quoted names keep their case.

So if you want to create the following table,

{% highlight sql %}
-- creates table FOOTABLE
CREATE TABLE footable (...);
{% endhighlight %}

all of these commands will work

{% highlight sql %}
SELECT * FROM FOOTABLE;
SELECT * FROM "FOOTABLE";
SELECT * FROM footable;
{% endhighlight %}

while this one will not:

{% highlight sql %}
-- table footable not found!
SELECT * FROM "footable";
{% endhighlight %}

Be especially careful when setting up [input and output mappings](/manipulation/transformations/mappings/).
In the KBC UI, it is necessary to enter all table names using the exact casing
because all table names referenced by mappings are automatically quoted by KBC.

When writing your transformation script, we recommend quoting all table names as well.

### Timestamp Columns
By default, Snowflake uses the
[`DY, DD MON YYYY HH24:MI:SS TZHTZM` format](https://docs.snowflake.net/manuals/sql-reference/functions-conversion.html#label-date-time-format-conversion)
when converting the timestamp column to a character string.

This means that if you create a table in a transformation which uses a `timestamp` column,

{% highlight sql %}
CREATE TABLE "ts_test" AS (SELECT CURRENT_TIMESTAMP AS "ts");
{% endhighlight %}

the table value will come out as `Wed, 19 Oct 2016 01:24:21 -0700` in Storage. If you
want to output it in a different format, you have to cast the column to a string first, for example:

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

**Important:** Snowflake works with time zones (and [Daylight Savings Time](https://en.wikipedia.org/wiki/Daylight_saving_time)),
requiring you to distinguish between various conversion functions:

{% highlight sql %}
SELECT
    TO_TIMESTAMP_NTZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'), -- yields 2013-03-10 02:12:00.000 +0000
    TO_TIMESTAMP_TZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'),  -- yields 2013-03-10 03:12:00.000 -0700
    TO_TIMESTAMP('10.3.2013 2:12', 'DD.MM.YYYY HH:MI');     -- yields 2013-03-10 03:12:00.000 -0700

{% endhighlight %}
