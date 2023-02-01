---
title: Customer Relationship Management
permalink: /templates/customer-relationship-management/
---

* TOC
{:toc}


With this end-to-end flow you can extract your updated data from your CRM tool (Hubspot, Salesforce, PipeDrive) and bring it into Keboola Connection. 
After all the necessary tasks are performed on the data, you can transform the results into visualizations in any BI tool of your choice.
By using our CRM template, you will get an overview about your customers, activities, and opportunities for potential sales across the pipeline.

**The flow, in a nutshell:**

- First, the CRM source component will collect data from your account (companies, deals, activities, lists, owners, contacts, and pipelines).

- We then add NULL values if any columns are missing, and create an output CRM data model (a set of output tables).

- The data will be written into a Snowflake database via the Snowflake destination component.

- Finally, you will schedule and run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). The CRM source component, all data manipulations, and the Snowflake destination component, will be processed.

## Entity Relationship Diagram
An entity-relationship diagram is a specialized graphic that illustrates the relationships between entities in a data destination.

{: .image-popup}
![Business Data Model](/templates/customer-relationship-management/business-data-model.png)
 
## Table Description

| Name | Description |
|---|---|
| ACTIVITY | contains data about activities of employees |
| COMPANY | contains the list of companies and their websites |
| CONTACT| contains the list of contacts |
| EMPLOYEE | contains the list of employees that are associated with a deal |
| OPPORTUNITY | contains data about companies and employees that are associated with a deal |
| OPPORTUNITY CONTACT | contains combined data about opportunities and contacts |
| OPPORTUNITY SNAPSHOT | contains the history of the opportunity table and its changes |

## Data Sources
These data sources are available in Public Beta:

- [HubSpot](https://www.hubspot.com/)
- [Pipedrive](https://www.pipedrive.com/)
- [Salesforce](https://www.salesforce.com/eu/?ir=1)

## Data Destinations
These data destinations are available in Public Beta:

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template from the **Templates** tab in your Keboola Connection project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/customer-relationship-management/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add CRMcustomer-relationship-managementtemplatescrmrelationship-management/add-crm-to-snowflake.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![CRM to Snowflake - Template Name](/templates/customer-relationship-management/crm-to-snowflake-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Destinations](/templates/customer-relationship-management/authorizing-destinations/) below.

Follow the steps one by one and authorize at least one data source from the list. Finally, the destination must be authorized as well.

{: .image-popup}
![CRM to Snowflake](/templates/customer-relationship-management/crm-to-snowflake-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![CRM to Google Sheets - Flows](/templates/customer-relationship-management/crm-to-snowflake-flow.png)

## Authorizing Data Sources
To use a selected data source component, you must first authorize the data source.

Hubspot

 

Insert Hubspot Private App Token and then select period from date you want to extract data.

Salesforce

 

Fill your Salesforce login name, password and security token.

Pipedrive

 

Fill your company domain and API token that you can find here: Settings > Personal preferences > API.

## Authorizing Data Destinations
To create a working flow, you must select at least one data destination.

### BigQuery Database

{: .image-popup}
![BigQuery Destination](/templates/marketing-platforms/bigquery-destination.png)

To configure the destination component, you need to set up a [Google Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new JSON key.

A detailed guide is available [here](https://help.keboola.com/components/writers/database/bigquery/).

### Google Sheets

{: .image-popup}
![Google Sheets Destination](/templates/marketing-platforms/google-sheets-destination.png)

Authorize your Google account.

Duplicate the sheet into your Google Drive and paste the file ID back to Keboola Connection. It is needed for correct mapping 
in your duplicated Google sheet. 

<!-- 
*Note: We are working on automatization. In the future, you won't have to duplicate the sheet by yourself, we will do that for you.*
 -->

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

### Snowflake Database

If you want to use your own Snowflake database, you must provide the host name (account name), user name, password, database name, 
schema, and a [warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html).

{: .image-popup}
![Snowflake Destination](/templates/marketing-platforms/snowflake-destination.png)

We highly recommend that you create a dedicated user for the destination component in your Snowflake database. Then you must provide 
the user with access to the Snowflake [Warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html). 

**Warning:** Keep in mind that Snowflake is **case sensitive** and if identifiers are not quoted, they are converted to upper case. 
So if you run, for example,  a query CREATE SCHEMA john.doe;, you must enter the schema name as DOE in the destination component configuration.

More info [here](https://help.keboola.com/components/writers/database/snowflake/).
