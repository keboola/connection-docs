---
title: Data Quality
permalink: /templates/data-quality/
---

* TOC
{:toc}

This flow brings you a set of Snowflake SQL procedures for data quality testing and monitoring.

**The flow, in a nutshell:**

- First we will create a set of Shared Codes – Snowflake SQL procedures for data quality tests and test result logging.

- A Python transformation will then create dummy datasets.

- Snowflake SQL transformations will use the generated dummy datasets to demonstrate how to use the SQL procedures in your Snowflake SQL transformations.

- Finally, data quality tests will produce a result log output table to be used for continuous monitoring of the results.

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
You will find the newly added shared codes under the **Shared Codes** tab. The key shared code is the *Data Quality Core*.

You will find a new transformation *Data Quality Core - Full Example* which shows how the Shared Codes can be used. 

{: .image-popup}
![Data Quality Core Full Example](/templates/data-quality/dq-core-full-example.png)

The transformation creates new table in your Storage named DQ_RESULTS_LOG.

**Important:** Add the DQ_RESULT_LOG table to output mappings of each transformation where you use the Data Quality Core shared code.   

You will also find a transformation named *Data Quality Core - ABORT/FAIL Example* which demonstrates how to use the FAIL level of tests to ABORT a transformation 
in case such test fails. It also uses the write_always parameter of output mapping in order to write the output even on Transformation error.

{: .image-popup}
![Data Quality Core Full Example](/templates/data-quality/dq-core-abort-example.png)
