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
- Constraints (like PRIMARY KEY or UNIQUE) are defined but [not enforced](https://docs.snowflake.net/manuals/sql-reference/constraints-overview.html).

## Load Type

There are two types of loading tables into your workspace. You can select either *Copy Table* or *Clone Table*.

{: .image-popup}
![Load Type](/manipulation/transformations/snowflake/load-type.png)
 
*Copy Table* is the default option, and it physically copies the table from our Storage to your workspace. 
Using *Copy Table* allows you to refine the input mapping using various filters.

*Clone Table* avoids physical transfer of the data and clones the table from Storage without any processing. 

### Clone Table

By switching Load Type to *Clone Table* the input mapping will utilize the Snowflake 
[`CLONE` command](https://docs.snowflake.net/manuals/sql-reference/sql/create-clone.html). 

As the `CLONE` command has no further options, all other input mapping options will be disabled 
(except for *Source* and *Destination* of course). 
 
`Clone Table` is useful when 

 - your table is very large and the *Copy Table* load type is slow.
 - you need more complex input mapping filters (e.g. filtering using a range).

#### Performance

The `CLONE` command will execute the input mapping almost instantly for a table of any size (typically under 10 seconds) 
as it physically does not move any data. 

#### `_timestamp` system column

A table loaded using *Clone Table* will contain all columns of the original table plus a new `_timestamp` column.
This column is used internally by Keboola Connection for comparison with the value of the *Changed in last* filter. 

The value in the column contains a unix timestamp of the last change of the row, which is

 - when the row was added to the table, or
 - when any of the cells was modified using an incremental load.

You can use this column to set up [incremental processing](https://help.keboola.com/storage/tables/#incremental-processing).

## Validation
Snowflake transformations have built-in validation of the transformation code. The transformation validation checks:

- syntax correctness of the SQL code,
- transformation script data lineage,
- input and output mapping data lineage.

Data lineage validation means that each query in the SQL code is analyzed and the origin of each column is checked. It is
particularly helpful in detecting typos and incomplete table structure changes as it can detect when a column is missing from
the source table. This validation is also applied to input and output mapping, with one exception -- tables defined in
the output mapping that do not exist yet in the Storage are not validated.

Validation is performed when you visit the configuration page, save the SQL code, change Input or Output Mapping, or
edit Required dependencies. You will only be notified when there are errors in the configuration.

{: .image-popup}
![Screenshot - Transformation validation](/manipulation/transformations/snowflake/validation-errors.png)

## Best Practices

### Case Sensitivity
Unlike Redshift or MySQL, Snowflake is case sensitive. All unquoted table/column names are converted to uppercase
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
when converting the `timestamp` column to a character string.

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

Do not use `ALTER SESSION` queries to modify the default timestamp format, as the loading and unloading sessions are separate 
from your transformation/sandbox session and the format may change unexpectedly.

**Important:** In the default US KBC [region](https://developers.keboola.com/overview/api/#regions-and-endpoints) 
(connection.keboola.com), the following [Snowflake default](https://docs.snowflake.net/manuals/sql-reference/parameters.html#) 
parameters are overridden:

- [TIMESTAMP_OUTPUT_FORMAT](https://docs.snowflake.net/manuals/sql-reference/parameters.html#timestamp-output-format) -- `DY, DD MON YYYY HH24:MI:SS TZHTZM`
- [TIMESTAMP_TYPE_MAPPING](https://docs.snowflake.net/manuals/sql-reference/parameters.html#timestamp-type-mapping) -- `TIMESTAMP_LTZ`
- [TIMESTAMP_DAY_IS_ALWAYS_24H](https://docs.snowflake.net/manuals/sql-reference/parameters.html#timestamp-day-is-always-24h) -- `yes`

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
