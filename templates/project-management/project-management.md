---
title: Project Management
permalink: /templates/project-management/
---

* TOC
{:toc}


With this end-to-end flow you can extract your updated data from your project management tool and bring it into Keboola. 
After all the necessary tasks are performed on the data, you can transform the results into visualizations in any BI tool of your choice.
By using our project management template, you will get an overview across all projects, their epics, tasks, users, and their actions.

**The flow, in a nutshell:**

- First, the Project Management data source connector will collect data from your account about projects and tasks.

- We then create the output tables and snapshots.

- The data will be written into a selected data destination via one of the following data destination connectors: BigQuery, Snowflake, and Google Sheets.

- Finally, you will schedule and run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). The data source connector, all data manipulations, and the data destination connector, will be processed.

## Entity Relationship Diagram
An entity-relationship diagram is a specialized graphic that illustrates the relationships between entities in a data destination.

{: .image-popup}
![Business Data Model](/templates/project-management/business-data-model.png)
 
## Table Description

| Name | Description |
|---|---|
| PROJECT | data about each project, its owner and due date |
| PROJECT SNAPSHOT | history of the project table and its changes |
| PROJECT USER | tables PROJECT and USER combined |
| TASK | list of tasks and information such as the date of creation, due date, assignee; each task can be linked to a project |
| TASK CUSTOM FIELD | custom fields value |
| TASK EVENT | changes made to tasks |
| TASK SNAPSHOT | history of the tasks table and its changes |
| TASK TAG | list of tasks and their tags |
| TASK USER | tables TASK and USER combined |
| USER | list of users |

## Data Sources
These data sources are available in Public Beta:

- [Asana](https://asana.com/)
- [Jira](https://www.atlassian.com/software/jira)

## Data Destinations
These data destinations are available in Public Beta:

- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)
- [PostgreSQL](https://www.postgresql.org/)
- [Snowflake database](https://www.snowflake.com/)
- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the data destination connector.

First decide which data source and which data destination you want to use. Then select the corresponding template from the **Templates** tab in your Keboola project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/project-management/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add PM to Snowflake](/templates/project-management/add-pm-to-snowflake.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![PM to Snowflake - Template Name](/templates/project-management/pm-to-snowflake-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Data Destinations](/templates/project-management/#authorizing-data-destinations) below.

Follow the steps one by one and authorize at least one data source from the list. Finally, the destination must be authorized as well.

{: .image-popup}
![PM to Snowflake](/templates/project-management/pm-to-snowflake-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![PM to Google Sheets - Flows](/templates/project-management/pm-to-snowflake-flow.png)

## Authorizing Data Sources
To use a selected data source connector, you must first authorize the data source.

### Asana
Insert the Asana API Key. You can generate a personal access token from the Asana developer console.

{: .image-popup}
![Asana Data Source](/templates/project-management/asana-data-source.png)

### Jira
To authorize the Jira data source, enter the following information:

- A username to Atlassian Cloud; usually an email
- An API token to Atlassian Cloud. The token can be generated in the Manage Your Account section.
- The ID of the organization for which the data will be downloaded. It can be found in the first part of the URL, i.e., https://<organization_id>.atlassian.net.
- The URL that will be used to download data from your organization.

{: .image-popup}
![Jira Data Source](/templates/project-management/jira-data-source.png)

## Authorizing Data Destinations
To create a working flow, you must select at least one data destination.

### BigQuery Database

{: .image-popup}
![BigQuery Destination](/templates/marketing-platforms/bigquery-destination.png)

To configure the data destination connector, you need to set up a [Google Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new JSON key.

A detailed guide is available [here](https://help.keboola.com/components/writers/database/bigquery/).

### Google Sheets

{: .image-popup}
![Google Sheets Destination](/templates/marketing-platforms/google-sheets-destination.png)

Authorize your Google account.

Duplicate the sheet into your Google Drive and paste the file ID back to Keboola. It is needed for correct mapping 
in your duplicated Google sheet. 

### PostgreSQL Database
If you want to use your own PostgreSQL database, you must provide the host name (account name), user name, password, database name, and a schema.

{: .image-popup}
![PostgreSQL Data Destination](/templates/project-management/postgresql-data-destination.png)

### Snowflake Database

If you want to use your own Snowflake database, you must provide the host name (account name), user name, password, database name, 
schema, and a [warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html).

{: .image-popup}
![Snowflake Destination](/templates/marketing-platforms/snowflake-destination.png)

We highly recommend that you create a dedicated user for the data destination connector in your Snowflake database. Then you must provide 
the user with access to the Snowflake [Warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html). 

**Warning:** Keep in mind that Snowflake is **case sensitive** and if identifiers are not quoted, they are converted to upper case. 
So if you run, for example,  a query CREATE SCHEMA john.doe;, you must enter the schema name as DOE in the data destination connector configuration.

More info [here](https://help.keboola.com/components/writers/database/snowflake/).

### Snowflake Database Provided by Keboola

If you do not have your own data warehouse, follow the instructions and we will create a database for you: 

1. After clicking **Save**, the template will be used in your project. You will see a flow. 
2. Go there and click on **Snowflake Data Destination** to configure it. You will be redirected to the data destination configuration and asked to set up credentials. 
3. Select **Keboola Snowflake database**. 
4. Then go back to the flow and click **Run**. 

{: .image-popup}
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions1.png)
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions2.png)
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions3.png)
![DWH Provided by Keboola](/templates/marketing-platforms/keboola-dwh-instructions4.png)

Everything is set up.

## Most Common Errors
Before turning to the Keboola support team for help, make sure your error is not a common problem that can be solved without our help.

### Missing Credentials to Snowflake Database 
If you see the error pictured below, you have probably forgotten to set up the Snowflake database. 

Click on the highlighted text under Configuration in the top left corner. This will redirect you to the Snowflake Database connector. Now follow the **Snowflake Database provided by Keboola** on the page Authorizations/destinations. 

Then go to the **Jobs** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/templates/ecommerce/snowflake-job.png)
