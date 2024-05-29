---
title: Snowflake Transformation
permalink: /transformations/snowflake-plain/
---

* TOC
{:toc}

[Snowflake](https://www.snowflake.com/) has many advantages:

- No database administration
- No indexes, sort keys, distribution styles, or column compressions
- Easy scaling
- Simple data types
- Amazing processing power and data throughput

## Limits
- Snowflake queries are **limited** to 7,200 seconds by default.
- Queries containing comments longer than 8,192 characters will segfault.
- Constraints (like PRIMARY KEY or UNIQUE) are defined but [not enforced](https://docs.snowflake.net/manuals/sql-reference/constraints-overview.html).

Snowflake is a cloud database and, as such, brings continuous updates and behavioral changes. If you are 
interested in those changes, please follow the official [Snowflake change log](https://community.snowflake.com/s/article/Pending-Behavior-Change-Log).

When loading data to a Snowflake transformation, beware that there are two different
methods: [copy and clone](/transformations/mappings/#snowflake-loading-type).

## Aborting Transformation Execution
In some cases, you may need to abort the transformation execution and exit with an error message. 
To abort the execution, set the `ABORT_TRANSFORMATION` variable to any nonempty string value. 

{% highlight sql %}
SET ABORT_TRANSFORMATION = (
  SELECT 
      CASE
          WHEN COUNT = 0 THEN ''
          ELSE 'Integrity check failed'
      END
  FROM (
    SELECT COUNT(*) AS COUNT FROM INTEGRITY_CHECK WHERE RESULT = 'failed'
  )   
);
{% endhighlight %}

This example will set the `ABORT_TRANSFORMATION` variable value to `'Integrity check failed'` if the `INTEGRITY_CHECK` table
contains one or more records with the `RESULT` column equal to the value `'failed'`.

The transformation engine checks the `ABORT_TRANSFORMATION` after each successfully executed query and returns the value
of the variable as a user error, `Transformation aborted: Integrity check failed.` in this case.

{: .image-popup}
![Screenshot - Transformation aborted](/transformations/snowflake-plain/abort.png)

## Dynamic Backends
If you have a large amount of data in databases and complex queries, your transformation might run for a couple of hours.
To speed it up, you can change the backend size in the configuration. Snowflake transformations suport the following sizes:
- XSmall
- Small _(default)_
- Medium
- Large

{: .image-popup}
![Screenshot - Backend size configuration](/transformations/snowflake-plain/backend-size.png)

Scaling up the backend size allocates more resources to speed up your transformation.

***Note:** This feature is currently in public beta. Please bear with us and provide feedback
at [https://ideas.keboola.com](https://ideas.keboola.com).
Also, dynamic backends are not available to you if you are on the [Free Plan (Pay As You Go)](/management/payg-project/).*

## Example
To create a simple Snowflake transformation, follow these steps:

- Create a table in Storage by uploading the [sample CSV file](/transformations/source.csv).
- Create an input mapping from that table, setting its destination to `source` (as expected by the Snowflake script).
- Create an output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.

{% highlight sql %}
CREATE OR REPLACE TABLE "result" AS
	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/snowflake-plain/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).

## Best Practices

### Case Sensitivity
Snowflake is [case sensitive](https://docs.snowflake.com/en/sql-reference/identifiers-syntax.html#label-identifier-casing). 
All unquoted table/column names are converted to upper case while quoted names keep their case.

So, if you want to create the following table,

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

Be especially careful when setting up [input and output mappings](/transformations/mappings/).

When writing your transformation script, quoting all table and column names is highly recommended. 
Snowflake converts all unquoted table/column identifiers to uppercase, which won't match table/column 
identifiers created by Keboola (unless they happen to be all uppercase).

{% highlight sql %}
SELECT "barcolumn" FROM "footable";
{% endhighlight %}

### Working With Data Types
Storage [tables](/storage/tables/) store data in character types. When you create a table used on output mapping,
you can rely on implicit casting to char:

{% highlight sql %}
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM TIMESTAMP, NUM NUMERIC);

INSERT INTO "test" (ID, TM, NUM)
SELECT 'first', CURRENT_TIMESTAMP, 12.5;
{% endhighlight %}

Or, you can create the table directly with character columns (and rely on implicit casting to char):

{% highlight sql %}
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM VARCHAR, NUM VARCHAR);

INSERT INTO "test" (ID, TM, NUM)
SELECT 'first', CURRENT_TIMESTAMP, 12.5;
{% endhighlight %}

You can also explicitly cast the columns to char:

{% highlight sql %}
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM VARCHAR, NUM VARCHAR);

INSERT INTO "test" (ID, TM, NUM)
SELECT 
    TO_CHAR('first'), 
    TO_CHAR(CURRENT_TIMESTAMP), 
    TO_CHAR(12.5)
;
{% endhighlight %}

When using an [unstructured data type](https://docs.snowflake.com/en/sql-reference/data-types-semistructured.html), 
you always **have to** use the explicit cast:

{% highlight sql %}
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM VARCHAR, NUM VARCHAR, OBJ VARCHAR);

INSERT INTO "test" (ID, TM, NUM, OBJ)
SELECT
    'first',
    CURRENT_TIMESTAMP,
    12.5,
    TO_CHAR( --  <- required!
        OBJECT_CONSTRUCT( 
            'NAME','name',
            'CIN','123'
        )
    )
;
{% endhighlight %}

The implicit cast does not work for the `ARRAY`, `OBJECT` and `VARIANT` types, so the following code:

{% highlight sql %}
CREATE OR REPLACE TABLE "test" (ID VARCHAR, TM TIMESTAMP, NUM NUMERIC, OBJ OBJECT);

INSERT INTO "test" (ID, TM, NUM, OBJ)
SELECT
    'first',
    CURRENT_TIMESTAMP,
    12.5,
    OBJECT_CONSTRUCT(
        'NAME','name',
        'CIN','123'
    )
;
{% endhighlight %}

will lead to an error:

```
Expression type does not match column data type, expecting VARCHAR(16777216) but got OBJECT for column OBJ, SQL state 22000
```

### Timestamp Columns
By default, Snowflake uses the
`YYYY-MM-DD HH24:MI:SS.FF3` [format](https://docs.snowflake.net/manuals/sql-reference/functions-conversion.html#label-date-time-format-conversion)
when converting the `timestamp` column to a character string.

This means that if you create a table in a transformation that uses a `timestamp` column,

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

**Important:** In the AWS US Keboola [region](https://developers.keboola.com/overview/api/#regions-and-endpoints) 
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

## Bucket Objects for Read-Only Input Mapping

For more information on how a **read-only input mapping** works, visit the [link](/transformations/mappings/#read-only-input-mapping).
Buckets in Snowflake are represented by schemas. You can find all available schemas for your account by calling `SHOW SCHEMAS IN ACCOUNT;`. Each schema represents a bucket.
However, a **read-only input mapping** cannot access alias tables, because technically it is just a reference to an existing schema.
For a linked bucket, the schema is available in another database. That is, to access this linked bucket you have to include the database name of the project from which the bucket is linked. 
For example, say your bucket `in.c-customers` is linked from bucket `in.c-crm-extractor` in project 123. You then need to reference the tables in the transformation like this: `"KEBOOLA_123"."in.c-crm-extractor"."my-table"`. 
When developing the transformation code, it's easiest to create a workspace with **read-only input mappings** enabled and look directly in the database to find the correct database and schema names. 
