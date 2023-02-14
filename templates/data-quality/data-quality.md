---
title: Data Quality
permalink: /templates/data-quality/
---

* TOC
{:toc}

This data flow template provides you with a set of Snowflake SQL procedures for the **testing and monitoring of data quality**.

[Shared codes](https://help.keboola.com/transformations/variables/#shared-code) for data quality testing represent a set of Snowflake SQL procedures 
that can be used in a Snowflake SQL transformation to process various **data tests** and to **log the test results** into a unified table named `DQ_RESULTS_LOG`.

This set of procedures includes one that can conditionally [ABORT](https://help.keboola.com/transformations/snowflake-plain/#aborting-transformation-execution) transformation processing. 
This is useful when you want the processing to stop following a failed test, **avoiding the spending of unnecessary credits** and **preventing the loading of corrupted data** into your transformation outputs.

**The flow, in a nutshell:**

- First we will create a set of shared codes – Snowflake SQL procedures for data quality tests and the logging of test results.

- We will then create dummy datasets using a Python transformation.

- Snowflake SQL transformations will use the generated dummy datasets to demonstrate how you can use the SQL procedures in your Snowflake SQL transformations.

- Finally, data quality tests will produce a result log output table to be used for continuous monitoring of the results.

## Tests
{: .image-popup}
![Data Quality Shared Codes](/templates/data-quality/shared_code_1.png)

These are the available tests:

| ID | DESCRIPTION |
|---|---|
| TEST_COLUMN_NULL_OR_EMPTY | Tests for presence of Null (or empty string) values in a given column in a given table. Fails when there are more than 0 null values. |
| TEST_COLUMN_NULL | Tests for presence of Null values in a given column in a given table. Fails when there are more than 0 null values. |
| TEST_COLUMN_UNIQUE | Tests whether all records within a given set of columns in a given table are unique. Fails when there are more than 0 duplicate records. |
| TEST_TIME_SERIES_COMPLETE | Tests whether there are more than X records in a table for each datepart (day, hour, …) in time series defined by date column. Fails when there are dates with fewer records than expected. |
| TEST_TIME_SERIES_COMPLETE_RANGE | Tests whether there are more than X records in a table for each datepart (day, hour, …) in time series defined by date column in a  provided range. Fails when there are dates with fewer records than expected. |
| TEST_COLUMN_FOREIGN_REF | Tests whether each record’s reference key in a table matched a reference record in a given reference table. Fails when there are more than 0 records with no match. |
| TEST_SUM_IN_GROUPS_EQUAL | Tests whether the sum of values in a given column in a group (optional) in a table is the same in two tables (groups in both tables can differ). Fails when the sum differs by more than 0. |
| TEST_ANOMALY_NUMERIC | Tests anomalies in numeric columns based on a formula (mean() - value) > 2.5 * std())| |In words - if a value in a column differs from the “average” value by more than a standard deviation, it’s an anomaly. |
| TEST_COLUMN_DATA_TYPE | Tests whether a data type of a given column in a given table is of an expected data type |
| TEST_COLUMN_VALUE_DATA_TYPE | Tests whether values in a given column in a given table are of an expected data type. Returns values that don’t match an expected data type. Useful for tables without defined data types. |
| TEST_VALUE_CONTAIN | Tests whether a value in a given column in a given table contains a given string. Fails when a value doesn’t contain a given string. |
| TEST_VALUE_NOT_CONTAIN | Opposite of test_value_contain. Fails when a value DOES contain a given string. |
| TEST_VALUE_BEGIN | Tests whether a value in a given column in a given table begins with a given string. Fails when a value doesn’t begin with a given string. |
| TEST_VALUE_NOT_BEGIN | Opposite of test_value_begin. Fails when a value DOES begin with a given string. |
| TEST_VALUE_END | Tests whether a value in a given column in a given table ends with a given string. Fails when a value doesn’t end with a given string. |
| TEST_VALUE_NOT_ENDS | Opposite of test_value_end. Fails when a value DOES end with a given string. |
| TEST_VALUE_REGEXP | Tests whether a value in a given column in a given table matches a given regular expression. Fails when a value doesn’t match with a given regexp. |
| TEST_VALUE_NOT_REGEXP | Opposite of test_value_regexp. Fails when a value DOES match with a given regexp. |
| TEST_TABLE_COMPARE_STRUCTURE | Tests the structure of two tables. Compares a list of Column names (and data types) in both tables and fails if they differ. |
| TEST_TABLE_COMPARE_RECORDS | Tests records in two tables. Compares all records and fails if they differ. Outputs the diff. |
| TEST_TABLE_EMPTY | Test if a table is empty (contains zero records). If there are zero records, test fails. |
| TEST_VALUE_EQUAL | Tests that each value in a given column in a given table equals a given value. Fails when a value is not equal to a given value. |
| TEST_VALUE_NOT_EQUAL | Opposite of test_value_equal. Fails when a value IS equal to a given value. |
| TEST_VALUE_GREATER_THAN | Tests that each value in a given column in a given table is greater than a given value. Fails when a value is NOT greater than a given value. |
| TEST_VALUE_LOWER_THAN | Tests that each value in a given column in a given table is lower than a given value. Fails when a value is NOT lower than a given value. |
| TEST_VALUE_IN_RANGE | Tests that each value in a given column in a given table is between two given values. Fails when a value is NOT in a given range. |
| TEST_VALUE_IN_SET | Tests whether all values in a given column in a given table are in a given set of values. Fails when a value is not in a given set of values. |

## Table Description: DQ RESULT LOG

| Column Name | Description | Sample Value | 
|---|---|---|
| ID | Unique identifier of a performed test | 1d8fb4e8c486829db3387e429e0cb8a0 |
| EXECUTION_TIME | Timestamp of an executed test | Mon, 23 Jan 2023 13:58:34 +0100 |
| COMPONENT_ID | Component identifier | keboola.snowflake-transformation |
| CONFIGURATION_ID | Unique identifier of a component configuration | 943845068 |
| RUN_ID | Run ID (from job log) | 943845595 |
| JOB_URL | Job URL | https://connection.keboola.com/admin/projects/9389/queue/943845595 |
| TEST_ID | Identifier of a test | TEST_COLUMN_FOREIGN_REF |
| TEST_QUERY | Particular test query showing which attributes were used for a test | TEST_COLUMN_FOREIGN_REF('orders', 'customers', 'order_id', 'pk');.... |
| TEST_NAME | Name of a test | TEST_COLUMN_FOREIGN_REF |
| TEST_RESULT_VALUE | Result value - present if a test fails. Shows what values caused the test to fail. | [{"OCCURENCES":0,"OFFENDER":"61"} |
| TEST_PARAMETERS | Detail of TEST_QUERY parameters | {"TABLE_NAME_MAIN" :"orders", "COLUMN_NAME": "order_id", "TABLE_NAME_REF": "customers", "COLUMN_NAME_REF": "pk"} |
| TEST_RESULT | Result of a test (success/error) |  error |
| TEST_LEVEL | Level of a test (WARNING/FAIL). Fail test level should be used for aborting a transformation/flow right after such error fails. | WARNING |

## How to Use Template
The process is simple. You don't need to configure anything. Just add the template to your project and then run it. Shared codes will be added to your project, and all steps of the flow will be executed in order to generate a sample SQL transformation, using the data tests and generating the result log table. 

Select the corresponding template from the **Templates** tab in your Keboola Connection project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/data-quality/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add Data Quality to Snowflake](/templates/data-quality/add-dq-to-snowflake.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![Data Quality to Snowflake - Template Name](/templates/data-quality/dq-to-snowflake-name.png)

After clicking **Next Step**, you will see the template builder. You do not need to edit any configuration.

{: .image-popup}
![Data Quality to Snowflake](/templates/data-quality/dq-to-snowflake-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration and 
when it is done you will see the newly created flow. 

Click **Run Template**. 

{: .image-popup}
![Data Quality to Google Sheets - Flows](/templates/data-quality/dq-to-snowflake-flow.png)

## Navigate to Transformations
Go to **Transformations**. You will find the newly added shared codes under the **Shared Codes** tab. The key shared code is the *Data Quality Core*.
You will also find a new transformation *Data Quality Core - Full Example*, which shows how the shared codes can be used. 

{: .image-popup}
![Data Quality Core Full Example](/templates/data-quality/dq-core-full-example.png)

The transformation creates a new table in your Storage named DQ_RESULTS_LOG.

**Important:** Add the DQ_RESULT_LOG table to output mappings of each transformation for which you use the Data Quality Core shared code.   

You will also find a transformation named *Data Quality Core - ABORT/FAIL Example* that demonstrates how to use the FAIL level of tests to ABORT a transformation 
in case such a test fails. It also uses the write_always parameter of output mapping in order to write the output even on a transformation error.

{: .image-popup}
![Data Quality Core Full Example](/templates/data-quality/dq-core-abort-example.png)
