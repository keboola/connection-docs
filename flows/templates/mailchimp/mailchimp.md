---
title: Mailchimp
permalink: /flows/templates/mailchimp/
redirect_from:
    - /templates/mailchimp/
---

* TOC
{:toc}

With this end-to-end flow, you can extract data from Mailchimp and transform it into visualizations in any BI tool of your choice.

**The flow, in a nutshell:**

- First, the Mailchimp data source connector will collect data from your account: lists of campaigns, members, and lists. 

- Then we prepare five tables (campaign, campaign-event, customer, list, list-member) that can be used to visualize results. 

- The data is then written to a database of your choice.

- Finally, you will schedule and run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). The survey data source connector, all data manipulations, and the destination connector, will be processed.

## Table Description

| Name | Description |
|---|---|
| CAMPAIGN | the list of campaigns (campaign is any distributed content, that's created and measured in Mailchimp) and metrics |
| CAMPAIGN-EVENT | information about campaign events such as type or created date |
| CUSTOMER | the list of customers and their email addresses |
| LIST | the list of lists of contacts |
| LIST-MEMBER | The table provides information on marketing contacts and their rating |

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the data destination connector.

First decide which data source and which data destination you want to use. Then select the corresponding template 
from the **Templates** tab in your Keboola project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/flows/templates/mailchimp/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add Mailchimp to Snowflake](/flows/templates/mailchimp/add-mailchimp-to-snowflake.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![Mailchimp to Snowflake - Template Name](/flows/templates/mailchimp/mailchimp-to-snowflake-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Data Destinations](/flows/templates/mailchimp/#authorizing-data-destinations) below.

Follow the steps one by one and authorize at least one data source from the list. Finally, the destination must be authorized as well.

{: .image-popup}
![Mailchimp to Snowflake](/flows/templates/mailchimp/mailchimp-to-snowflake-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
once it's done, you will be redirected to the Template Catalog where you can see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![Mailchimp - Flows](/flows/templates/mailchimp/mailchimp-to-snowflake-flow.png)


## Data Sources
These data source connectors are available in Public Beta:

[Mailchimp](https://mailchimp.com/)

## Data Destinations
These data destination connectors are available in Public Beta:

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

## Authorizing Data Sources
To use a selected data source connector, you must first authorize the data source. 

### Mailchimp

{: .image-popup}
![Mailchimp Data Source](/flows/templates/mailchimp/mailchimp-data-source.png)

Insert your Mailchimp API token and data center (the last part of the API key after the dash). Then fill in your account user name.

## Authorizing Data Destinations
To create a working flow, you must select at least one data destination.

### BigQuery Database

{: .image-popup}
![BigQuery Destination](/flows/templates/marketing-platforms/bigquery-destination.png)

To configure the data destination connector, you need to set up a [Google Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new JSON key.

A detailed guide is available [here](https://help.keboola.com/components/writers/database/bigquery/).

### Google Sheets

{: .image-popup}
![Google Sheets Destination](/flows/templates/marketing-platforms/google-sheets-destination.png)

Authorize your Google account.

Duplicate the sheet in your Google Drive and paste the file ID back to Keboola. It is needed for correct mapping 
in your duplicated Google sheet. 

<!-- 
*Note: We are working on automatization. In the future, you won't have to duplicate the sheet by yourself, we will do that for you.*
 -->

### Snowflake Database Provided by Keboola

If you do not have your own data warehouse, follow the instructions and we will create a database for you: 

1. After clicking **Save**, the template will be applied to your project, and you will see a flow. 
2. Go there and click **Snowflake Data Destination** to configure it. You will be redirected to the data destination configuration and asked to set up credentials. 
3. Select **Keboola Snowflake database**. 
4. Then go back to the flow and click **Run**. 

{: .image-popup}
![DWH Provided by Keboola](/flows/templates/marketing-platforms/keboola-dwh-instructions1.png)
![DWH Provided by Keboola](/flows/templates/marketing-platforms/keboola-dwh-instructions2.png)
![DWH Provided by Keboola](/flows/templates/marketing-platforms/keboola-dwh-instructions3.png)
![DWH Provided by Keboola](/flows/templates/marketing-platforms/keboola-dwh-instructions4.png)

Everything is set up.

### Snowflake Database

If you want to use your own Snowflake database, you must provide the host name (account name), user name, password, database name, 
schema, and a [warehouse](https://docs.snowflake.com/en/user-guide/warehouses).

{: .image-popup}
![Snowflake Destination](/flows/templates/marketing-platforms/snowflake-destination.png)

We highly recommend that you create a dedicated user for the data destination connector in your Snowflake database. Then you must provide 
the user with access to the Snowflake [Warehouse](https://docs.snowflake.com/en/user-guide/warehouses). 

**Warning:** Keep in mind that Snowflake is **case sensitive** and if identifiers are not quoted, they are converted to upper case. 
So if you run, for example,  a query CREATE SCHEMA john.doe;, you must enter the schema name as DOE in the data destination connector configuration.

More info [here](https://help.keboola.com/components/writers/database/snowflake/).

## Most Common Errors
Before turning to the Keboola support team for help, make sure your error is not a common problem that can be solved without our help.

Click on the text under Configuration in the top left corner. This will redirect you to the Snowflake Database connector.
Now, follow the **Snowflake Database provided by Keboola** on the page **Authorizations/destinations**. 

Then go to the **Flows** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/flows/templates/marketing-platforms/snowflake-job.png)

