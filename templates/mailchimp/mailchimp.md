---
title: MailChimp
permalink: /templates/mailchimp/
---

* TOC
{:toc}

By using this end-to-end flow you can extract data from MailChimp and transform it into visualizations in your BI tool or anywhere else you prefer.

**The flow, in a nutshell:**

- First, the Mailchimp source component will collect data from your account: lists of campaigns, members and lists. 

- Then we prepare five tables (campaign, campaign-event, customer, list, list-member) that can be used to visualize results. 

- The data is then written into a database of your choice.

- Finally, you will schedule and run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). The survey source component, all data manipulations, and the destination component, will be processed.

## Table Description

| Name | Description |
|---|---|
| CAMPAIGN | the list of campaigns (campaign is any distributed content, that's created and measured in Mailchimp) and metrics |
| CAMPAIGN-EVENT | information about campaign events such as type or created date |
| CUSTOMER | the list of customers and theirs email addresses |
| LIST | the list of lists of contacts |
| LIST-MEMBER | The table provides information on marketing contacts and their rating |

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template 
from the **Templates** tab in your Keboola Connection project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/mailchimp/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add MailChimp to Snowflake](/templates/mailchimp/add-mailchimp-to-snowflake.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want 
and still keep everything organized.

{: .image-popup}
![MailChimp to Snowflake - Template Name](/templates/mailchimp/mailchimp-to-snowflake-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and 
perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user 
authorization problems. If you are struggling with this part, go to the section [Authorizing Destinations](/templates/mailchimp/authorizing-destinations/) below.

Follow the steps one by one and authorize at least one data source from the list. Finally, the destination must be authorized as well.

{: .image-popup}
![MailChimp to Snowflake](/templates/maillchimp/mailchimp-to-snowflake-steps.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and 
when it is done, you will be redirected to the Template Catalogue where you can see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![MailChimp - Flows](/templates/mailchimp/mailchimp-to-snowflake-flow.png)


## Data Sources
These data sources are available in Public Beta:

[MailChimp](https://mailchimp.com/)

## Data Destinations
These data destinations are available in Public Beta:

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

## Authorizing Data Sources
To use a selected data source component, you must first authorize the data source. 

### MailChimp

{: .image-popup}
![MailChimp Data Source](/templates/mailchimp/mailchimp-data-source.png)

Insert your MailChimp API Token and data center (the last part of the API key after the dash. Then fill in your account user name.
