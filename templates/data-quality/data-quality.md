---
title: Data Quality
permalink: /templates/data-quality/
---

* TOC
{:toc}

This data flow template brings you a set of Snowflake SQL procedures for **data quality testing and monitoring**.

Data Quality tests [Shared Codes](https://help.keboola.com/transformations/variables/#shared-code) represent a set of Snowflake SQL procedures that can be used in Snowflake SQL Transformation to process various **data tests** and to **log the test results** into a unified table named `DQ_RESULTS_LOG`.

The set of procedures includes one that can conditionally [ABORT](https://help.keboola.com/transformations/snowflake-plain/#aborting-transformation-execution) transformation processing. That is useful in case you want to stop the processing after a specific test fails in order **not to spend unnecessary credits** or to **prevent loading corrupted data** into your transformation outputs.

**The flow, in a nutshell:**

- First we will create a set of Shared Codes – Snowflake SQL procedures for data quality tests and test result logging.

- We will then create dummy datasets using a Python transformation.

- Snowflake SQL transformations will use the generated dummy datasets to demonstrate how to use the SQL procedures in your Snowflake SQL transformations.

- Finally, data quality tests will produce a result log output table to be used for continuous monitoring of the results.

## Available tests
|ID|DESCRIPTION|
|:---|---:|
|TEST_COLUMN_NULL_OR_EMPTY|Tests for presence of Null (or empty string) values in a given column in given table. Fails when there is more than 0 null values.|
|TEST_COLUMN_NULL|Tests for presence of Null values in a given column in given table. Fails when there is more than 0 null values.|
|TEST_COLUMN_UNIQUE|Tests whether all records within given set of columns in given table are unique. Fails when there is more than 0 duplicate records.|
|TEST_TIME_SERIES_COMPLETE|Tests whether there are more than X records in table for each datepart (day, hour, …) in time series defined by date column. Fails when there are dates with less records than expected.|
|TEST_TIME_SERIES_COMPLETE_RANGE|Tests whether there are more than X records in table for each datepart (day, hour, …) in time series defined by date column in provided range. Fails when there are dates with less records than expected.|
|TEST_COLUMN_FOREIGN_REF|Tests whether each record’s reference key in table matched a reference record in given reference table. Fails when there is more than 0 records with no match.|
|TEST_SUM_IN_GROUPS_EQUAL|Tests whether sum of values in given column in a group (optional) in a table is equal in two tables (groups in both tables can differ). Fails when sum differs by more than 0.|
|TEST_ANOMALY_NUMERIC|Tests anomalies in numeric columns based on formula (mean() - value) > 2.5 * std())| |In words - if value in column differs from “average” value by more than a standard deviation then it’s an anomaly|
|TEST_COLUMN_DATA_TYPE|Tests whether data type of given column in a given table is of a expected data type|
|TEST_COLUMN_VALUE_DATA_TYPE|Tests whether values in given column in given table is of expected data type. Returns values which don’t match the expected data type.|Useful for tables without defined data types.|
|TEST_VALUE_CONTAIN|Tests whether value in given column in given table contains provided string. Fails when value doesn’t contain given string.|
|TEST_VALUE_NOT_CONTAIN|Opposite of test_value_cointains. Fails when value DOES contain the provided string.|
|TEST_VALUE_BEGIN|Tests whether value in given column in given table begins with provided string. Fails when value doesn’t begin with the provided string.|
|TEST_VALUE_NOT_BEGIN|Opposite of test_value_not_begins. Fails when value DOES begin with the provided string.|
|TEST_VALUE_END|Tests whether value in given column in given table ends with provided string. Fails when value doesn’t end with the provided string.|
|TEST_VALUE_NOT_ENDS|Opposite of test_value_not_ends. Fails when value DOES end with the provided string.|
|TEST_VALUE_REGEXP|Tests whether value in given column in given table matches provided regular expression. Fails when value doesn’t match with the provided regexp.|
|TEST_VALUE_NOT_REGEXP|Opposite of test_value_not_regexp. Fails when value DOES match with the provided regexp.|
|TEST_TABLE_COMPARE_STRUCTURE|Tests structure of two tables. Compares list of Column names (and data types) in both tables and fails if it differs.|
|TEST_TABLE_COMPARE_RECORDS|Tests records in two tables. Compares all records and fails if it differs. Outputs the diff.|
|TEST_TABLE_EMPTY|Test if table is empty (contains zero records). If there are zero records the test fails.|
|TEST_VALUE_EQUAL|Tests that each value in given column in given table equals provided value. Fails when value is not equal to provided value.|
|TEST_VALUE_NOT_EQUAL|Opposite of test_value_equals. Fails when value IS equal to provided value.|
|TEST_VALUE_GREATER_THAN|Tests that each value in given column in given table is greater than provided value. Fails when value is NOT greater than the provided value.|
|TEST_VALUE_LOWER_THAN|Tests that each value in given column in given table is lower than provided value. Fails when value is NOT lower than the provided value.|
|TEST_VALUE_IN_RANGE|Tests that each value in given column in given table is between two provided values. Fails when value is NOT in given range.|
|TEST_VALUE_IN_SET|Tests whether all values in given column in given table are in provided set of values. Fails when value is not in provided set of values.|

## Table Description: DQ RESULT LOG

| Column Name | Description | Sample Value | 
|---|---|---|
| ID | Unique identifier of performed test | 1d8fb4e8c486829db3387e429e0cb8a0 |
| EXECUTION_TIME | Timestamp of executed test | Mon, 23 Jan 2023 13:58:34 +0100 |
| COMPONENT_ID | Component identifier | keboola.snowflake-transformation |
| CONFIGURATION_ID | Unique identifier of component configuration | 943845068 |
| RUN_ID | Run ID (from job log) | 943845595 |
| JOB_URL | Job URL | https://connection.keboola.com/admin/projects/9389/queue/943845595 |
| TEST_ID | Identifier of the test | TEST_COLUMN_FOREIGN_REF |
| TEST_QUERY | Particular test query showing which attributes were used for test | TEST_COLUMN_FOREIGN_REF('orders', 'customers', 'order_id', 'pk');.... |
| TEST_NAME | Name of the test | TEST_COLUMN_FOREIGN_REF |
| TEST_RESULT_VALUE | Result value - present if test fails. Shows what values offended test. | [{"OCCURENCES":0,"OFFENDER":"61"} |
| TEST_PARAMETERS | Detail of TEST_QUERY parameters | {"TABLE_NAME_MAIN" :"orders", "COLUMN_NAME": "order_id", "TABLE_NAME_REF": "customers", "COLUMN_NAME_REF": "pk"} |
| TEST_RESULT | Result of test (success/error) |  error |
| TEST_LEVEL | Level of test (WARNING/FAIL). Fail test level should be used for aborting a transformation/flow right after such error fails. | WARNING |


## How to Use Template
The process is simple. You don't need to configure anything. Just add the template to your project and then run it. Shared codes will be added to your project, and all steps of the flow will be executed to generate sample SQL transformation, using the data tests and generating the result log table. 

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

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Template**. 

{: .image-popup}
![Data Quality to Google Sheets - Flows](/templates/data-quality/dq-to-snowflake-flow.png)

## Navigate to Transformations
Go to the tab **Transformations**. You will find the newly added shared codes under the **Shared Codes** tab. The key shared code is the *Data Quality Core*.

You will also find a new transformation *Data Quality Core - Full Example*, which shows how the Shared Codes can be used. 

{: .image-popup}
![Data Quality Core Full Example](/templates/data-quality/dq-core-full-example.png)

The transformation creates a new table in your Storage named DQ_RESULTS_LOG.

**Important:** Add the DQ_RESULT_LOG table to output mappings of each transformation where you use the Data Quality Core shared code.   

You will also find a transformation named *Data Quality Core - ABORT/FAIL Example*, which demonstrates how to use the FAIL level of tests to ABORT a transformation 
in case such a test fails. It also uses the write_always parameter of output mapping in order to write the output even on transformation error.

{: .image-popup}
![Data Quality Core Full Example](/templates/data-quality/dq-core-abort-example.png)
