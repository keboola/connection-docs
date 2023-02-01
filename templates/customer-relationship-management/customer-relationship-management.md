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
 


Tables Description
ACTIVITY

the data about activities of employees

COMPANY

the list of companies and their websites

CONTACT

the list of contacts

EMPLOYEE

the list of employees and their position

OPPORTUNITY

the data about companies and employees that are associated with a deal

OPPORTUNITY CONTACT

the table combines data about opportunities and contacts

OPPORTUNITY SNAPSHOT

this table records the history of the opportunity table and its changes

Data Sources
These are the data sources that are available in Public Beta:

HubSpot

Pipedrive

Salesforce

Data Destinations
These data destinations are available in Public Beta:

Snowflake database provided by Keboola

Snowflake database

Google BigQuery database

Google Sheets

How to use this template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which Data Source and which Data Destination you want to use. Then select the corresponding template from the Templates tab in your Keboola Connection project. When you are done, click + Use Template.


 

This page contains information about the template. Click + Use Template again.


 

Now enter a name for the template instance that you are about to create. This allows you to use the template as many times as you want. It is important to keep things organized.


 

After clicking Next Step, you will see the template builder. Fill in all needed credentials and perform the required OAuth authorizations.

Important: Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user authorization problems. If you are struggling with this part, go to the section Authorizing Destinations below.

Follow the steps one by one and authorize your data source. A CRM data source is required.

Finally, the destination must be authorized as well.


 

When you are finished, click Save in the top right corner. The template builder will create your new configuration and when it is done, you will be redirected to the Template Catalogue where you can see the newly created flow.

Click Run Template and start building your vizualisations a few minutes later.


 

Authorizing Data Sources
To use a selected data source component, you must first authorize the data source.

Hubspot

 

Insert Hubspot Private App Token and then select period from date you want to extract data.

Salesforce

 

Fill your Salesforce login name, password and security token.

Pipedrive

 

Fill your company domain and API token that you can find here: Settings > Personal preferences > API.

Authorizing Destinations
Authorizing Destinations
