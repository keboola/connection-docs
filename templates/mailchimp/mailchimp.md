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

## Data Sources
These data sources are available in Public Beta:

[MailChimp]()

## Data Destinations
These data destinations are available in Public Beta:

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)
