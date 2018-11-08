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

Please [share your migration tips](http://wiki.keboola.com/home/transformations/snowflake/redshift-snowflake) with us.

## Limits

- Snowflake queries are **limited** to 900 seconds by default.
- Queries containing comments longer than 8,192 characters will segfault.
- Constraints (like PRIMARY KEY or UNIQUE) are defined, but [not enforced](https://docs.snowflake.net/manuals/sql-reference/constraints-overview.html).

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

When writing your transformation script, quoting all table and column names is required. Snowflake converts all
unquoted table/column identifiers to uppercase, which won't match table/column identifiers created by Keboola Connection.

{% highlight sql %}
SELECT "barcolumn" FROM "footable";
{% endhighlight %}

### Timestamp Columns
By default, Snowflake uses the
`YYYY-MM-DD HH24:MI:SS.FF3` [format](https://docs.snowflake.net/manuals/sql-reference/functions-conversion.html#label-date-time-format-conversion)
when converting the timestamp column to a character string.

This means that if you create a table in a transformation which uses a `timestamp` column,

{% highlight sql %}
CREATE TABLE "ts_test" AS (SELECT CURRENT_TIMESTAMP AS "ts");
{% endhighlight %}

the table value will come out as `2018-04-09 06:43:57.866 -0700` in Storage. If you
want to output it in a different format, you have to cast the column to a string first, for example:

{% highlight sql %}
CREATE TABLE "out" AS
    (SELECT TO_CHAR("ts", 'YYYY-MM-DD HH:MI:SS') AS "ts" FROM "ts_test");
{% endhighlight %}

Do not use `ALTER SESSION` queries to modify the default timestamp format, as the loading and unloading sessions are separate from your transformation/sandbox session and the format may change unexpectedly.

**Important:**
In the default US KBC [region](https://developers.keboola.com/overview/api/#regions-and-endpoints) (connection.keboola.com) the following
[Snowflake default](https://docs.snowflake.net/manuals/sql-reference/parameters.html#) parameters are overridden:

- [TIMESTAMP_OUTPUT_FORMAT](https://docs.snowflake.net/manuals/sql-reference/parameters.html#timestamp-output-format) - `DY, DD MON YYYY HH24:MI:SS TZHTZM`
- [TIMESTAMP_TYPE_MAPPING](https://docs.snowflake.net/manuals/sql-reference/parameters.html#timestamp-type-mapping) - `TIMESTAMP_LTZ`
- [TIMESTAMP_DAY_IS_ALWAYS_24H](https://docs.snowflake.net/manuals/sql-reference/parameters.html#timestamp-day-is-always-24h) - `yes`

**Important:** Snowflake works with time zones (and [Daylight Savings Time](https://en.wikipedia.org/wiki/Daylight_saving_time)),
requiring you to distinguish between various conversion functions:

{% highlight sql %}
SELECT
    -- yields 2013-03-10 02:12:00.000 +0000
    TO_TIMESTAMP_NTZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'),
    -- yields 2013-03-10 03:12:00.000 -0700
    TO_TIMESTAMP_TZ('10.3.2013 2:12', 'DD.MM.YYYY HH:MI'),
    -- yields 2013-03-10 03:12:00.000 -0700
    TO_TIMESTAMP('10.3.2013 2:12', 'DD.MM.YYYY HH:MI');

{% endhighlight %}

## SQL Validation
Snowflake Transformations has built-in validation. You will only be notified when there are errors in the configuration.
Validation will run everytime you visit the configuration page, save a Query, save a Input / Output Mappings or edit Required dependencies.
Tables defined in Output Mapping that does not yet exist in Storage are not validated.