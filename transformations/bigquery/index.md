---
title: Google BigQuery Transformation
permalink: /transformations/bigquery/
---

* TOC
{:toc}

[BigQuery](https://cloud.google.com/bigquery) offers a range of features:

- Fully managed, serverless data warehouse
- Automatic scaling of compute resources
- Storage and analysis of multi-terabyte datasets
- High-speed streaming insertion of data
- Integrates with Google's data analytics ecosystem

## Limits
- By default, individual queries have a [maximum run time](https://cloud.google.com/bigquery/quotas#query_jobs) of 2 hours, but you can adjust this using the *Query timeout* parameter.
- There is a [limit on the number of tables](https://cloud.google.com/bigquery/quotas#tables) referenced by a single query.
- While table updates are possible, BigQuery favors an append-only model where mutations are [generally discouraged](https://cloud.google.com/bigquery/docs/best-practices-costs#avoid_using_dml).

BigQuery is designed for flexibility and ease of use. Its integration with other Google Cloud services provides a robust platform for analytics at scale. To keep up with the latest improvements and updates, it's a good idea to monitor the [BigQuery release notes](https://cloud.google.com/bigquery/docs/release-notes).

For information on BigQuery limitations within Keboola, refer to the [BigQuery Limitations](/storage/byodb/#bigquery-limitations) section.

## Aborting Transformation Execution
In some cases, you may need to abort the transformation execution and exit with an error message. 
To abort the execution, set the `ABORT_TRANSFORMATION` variable to any nonempty string value. The variable is already declared internally, so you only need to set its value.

{% highlight sql %}
SET ABORT_TRANSFORMATION = (
    SELECT IF(COUNT(*) = 0, '', 'Integrity check failed')
    FROM INTEGRITY_CHECK
    WHERE RESULT = 'failed'
);
{% endhighlight %}

This example will set the `ABORT_TRANSFORMATION` variable value to `'Integrity check failed'` if the `INTEGRITY_CHECK` table
contains one or more records with the `RESULT` column equal to the value `'failed'`.

The transformation engine checks `ABORT_TRANSFORMATION` after each successfully executed query and returns the variable's value
as a user error, `Transformation aborted: Integrity check failed.` in this case.

{: .image-popup}
![Screenshot - Transformation aborted](/transformations/bigquery/abort.png)

## Example
To create a simple BigQuery transformation, follow these steps:

- Create a table in Storage by uploading the [sample CSV file](/transformations/source.csv).
- Create an input mapping from that table, setting its destination to `source` (as expected by the BigQuery script).
- Create an output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.

{% highlight sql %}
CREATE OR REPLACE TABLE `result` AS
SELECT `first`, CAST(`second` AS INT64) * 42 AS `larger_second`
FROM `source`;
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/bigquery/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).

## Best Practices

### Working With Data Types
Keboola Storage tables store data in character types. When creating a table for output mapping in BigQuery, you can rely on implicit casting to STRING:

{% highlight sql %}
CREATE OR REPLACE TABLE test (ID STRING, TM TIMESTAMP, NUM FLOAT64);

INSERT INTO test (ID, TM, NUM)
SELECT 'first', CURRENT_TIMESTAMP(), 12.5;
{% endhighlight %}

Alternatively, you can create the table with all columns as STRING and rely on implicit casting:

{% highlight sql %}
CREATE OR REPLACE TABLE test (ID STRING, TM STRING, NUM STRING);

INSERT INTO test (ID, TM, NUM)
SELECT 'first', FORMAT_TIMESTAMP('%F %T', CURRENT_TIMESTAMP()), CAST(12.5 AS STRING);
{% endhighlight %}

Explicit casting of columns to STRING is also an option:

{% highlight sql %}
CREATE OR REPLACE TABLE test (ID STRING, TM STRING, NUM STRING);

INSERT INTO test (ID, TM, NUM)
SELECT
    CAST('first' AS STRING),
    CAST(FORMAT_TIMESTAMP('%F %T', CURRENT_TIMESTAMP()) AS STRING),
    CAST(12.5 AS STRING)
;
{% endhighlight %}

For unstructured data types in BigQuery, explicit casting is often necessary:

{% highlight sql %}
CREATE OR REPLACE TABLE test (ID STRING, TM STRING, NUM STRING, OBJ STRING);

INSERT INTO test (ID, TM, NUM, OBJ)
SELECT
    'first',
    FORMAT_TIMESTAMP('%F %T', CURRENT_TIMESTAMP()),
    CAST(12.5 AS STRING),
    TO_JSON_STRING(STRUCT('name' AS NAME, '123' AS CIN))
;
{% endhighlight %}
