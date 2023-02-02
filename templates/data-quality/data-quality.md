---
title: Data Quality
permalink: /templates/data-quality/
---

* TOC
{:toc}

This flow brings you a set of Snowflake SQL procedures for data quality testing and monitoring.

**The flow, in a nutshell:**

- Flow creates set of Shared Codes - Snowflake SQL procedures for data quality tests and test result logging

- Python transformation creates dummy datasets

- Finally, Snowflake SQL transformations use the generated dummy datasets to demonstrate how to use the SQL procedures in your Snowflake SQL transformations.

- Data quality tests produce a result log output table intended to be used for continuous monitoring of the results.

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
....

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template from the **Templates** tab in your Keboola Connection project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/data-quality/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add Data Quality to Snowflake](/templates/data-quality/add-typeform-to-snowflake.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![Data Quality to Snowflake - Template Name](/templates/data-quality/dq-to-snowflake-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Data Destinations](/templates/data-quality/#authorizing-data-destinations/) below.

Follow the steps one by one and authorize at least one data source from the list. Finally, the destination must be authorized as well.

{: .image-popup}
![Data Quality to Snowflake](/templates/data-quality/dq-to-snowflake-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![Data Quality to Google Sheets - Flows](/templates/surveys/typeform-to-snowflake-flow.png)

