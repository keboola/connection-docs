---
title: eCommerce
permalink: /components/use-cases/ecommerce/
---

* TOC
{:toc}

With this end-to-end flow you can extract your updated data from an eCommerce platform and bring it into Keboola Connection. 
After all the necessary tasks are performed on the data, you can transform the results into visualizations in any BI tool of your choice.

**The flow, in a nutshell:**
- First, the eCommerce source component will collect data from your account (data about orders, products, inventory, and customers). 
You can also bring in marketing data from your marketing channels like Facebook Ads, Google Ads, and/or Sklik accounts.

- We then create the output tables. We add NULL values if any columns are missing. We also check the data, and perform an RFM analysis.

- The data is then written into your selected destination, for example to Snowflake database via the Snowflake destination component.

- Finally, you will run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). 
The ecommerce source component, all data manipulations and analyses, and the destination component of your choice, will be processed.

## Business Data Model

{: .image-popup}
![Business Data Model](/components/use-cases/ecommerce/business_data_model.png){: .img-responsive}

## Tables Description

| | |
|---|---|
| PRODUCTS | contains list of products including product type, product manufacturer and product price |
| ORDERS | contains list of customer orders including order date, purchase, price and taxes |
| CUSTOMERS | contains list of customers including email, customer billing and shipping information and orders count |
| SHOP | contains informations about your shop such as url and name |
| BILLING TYPE | enumeration for billing types |
| SHIPPING TYPE | enumeration for shipping types |
| ORDER LINES | contains individual items to the orders including order date, amount of bought items and item prices |
| PRODUCT MARGIN OVER TIME | it’s a separate table, contains product margin over time, used for check how margin on each product is changing in time |
| CAMPAIGN COSTS | it’s a separate table, contains daily marketing campaign costs and clicks |
| | |
CAMPAIGN COSTS MONTHLY
it’s a separate table 

contains monthly marketing campaign costs and clicks
|||
RFM
describes analysis of customer value (RFM)

showing actual group of a customer as well as prediction for moving from loyal customer to frozen customer
|||
ANALYZE CLV BY TIME FROM PREVIOUS ORDER
contains analysis of customer lifetime value by time
|||
ANALYZE CLV BY ORDER COUNT
contains analysis of customer lifetime value by number of orders
|||

## Data Sources

Available in Public Beta

Coming soon

## Data Destinations
Available in Public Beta

Coming soon

## How to use this template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First of all, you have to decide which Data Source and Data Destination you want to use. Based on your decision, select such template from Use Case tab in your Keboola connection project. 
Then click on + USE TEMPLATE. 


You’ll appear on template’s page with some information about the template. Look at the page and then click on + USE TEMPLATE again.


You’ll be asked to write a name for the template instance you are about to create. Why? You can use a template as many times as you want so it’s important to have it organized. 


After clicking on :arrow_right: NEXT STEP, you’ll see template’s builder, which will ask you to insert all needed credentials and make required OAuth authorizations. 

It’s important to do all those steps properly so the newly created flow won’t fail on some user’s authorizations problems. 
If you are struggling with this. Check out section “Authorization of sources” below.

Go step by step and authorize Data Sources. Ecommerce Data Source is required. In this case it’s Shopify.

The other marketing source are optional. You can, but you don’t have to enrich your ecommerce data with marketing statistics like costs, impressions and clicks. 

Finally, the destination has to be authorized as well. 

Please, read carefully the instructions within this step. 
If you are struggling with this. Check out section “Authorization of destinations” below.


After authorizations, click on SAVE in the right corner on the top. 

The template builder will create your new configuration

s and when it’s done, you’ll be redirected to Use Case Catalogue and you’ll see the newly created flow. 

Click on :arrow_forward: RUN USE CASE and start building your visualizations a few minutes after. 


Authorizations
Ecommerce Data Sources
exactly 1 source is required

Shopify Analytics

To enable this application you need to:

enable private app development for your store.

Create a private application

Enable Read access ADMIN API PERMISSIONS for following following objects:

Orders

Products

Inventory

Customers

Additional documentation is available here.

 

Shoptet Analytics

This extractor allows you to download data from Shoptet permalinks. Find all links in your Shoptet account. 

Example: Go to customers and click on Export. On the bottom you’ll see a link looking like this: https://www.yourshopaddress.domain/export/customers.xml?ip=11.111.111.1111&hash=somehash

Set the shop name.

Set the Base URL of the store.

Set the Orders URL so that it contains the pattern ID and hash in the URL.

Set the Products URL so that it contains the pattern ID and hash in the URL.

Set the Customers URL so that it contains the hash in the URL.

Set the Stock URL so that it contains the hash in the URL.

 

 

 

 

WooCommerce
Marketing Data Sources
optional sources

Facebook Ads

Log into facebook with redirection from this step and allow Keboola to see the data. 

Then list of accounts will appear, so select those accounts you want to download the data from.

 

 

 

 

 

 

Google Ads

Authorize google Account and then select the account you want to get the data from. The list will automatically appear after authorization. 

 

 

 

 

 

 

Sklik

The component uses the Sklik API to import data from Sklik. It downloads configured reports for all specified accounts.

To configure this extractor, you need to have a working

Sklik account, and an

Sklik API token.

The current listing limit supported by the Sklik API is 100.

 

 

 

 

Destinations
exactly 1 source is required

Big Query Database

To configure the writer, you need to set up a Google Service Account and create a new JSON key.

Detailed guide is here.

 

 

 

 

 

 

 

 

 

Google Sheet

Authorize your google account.

Duplicate the sheet into your Google Drive and paste the file ID back to the Keboola. It’s needed for correct mapping in your duplicated google sheet. 

Don’t worry, we are working on automatization. In the future, you want have to duplicate the sheet by yourself, but we will do that for you. 

 

Snowflake Database provided by Keboola

Don’t have your own data warehouse? Don’t worry, we got you covered. 

Just follow the instruction and we will create a database for you. 

After clicking on SAVE, the template will be used in your project. You’ll see a flow. Go there and click on Snowflake Data Destination. 

You’ll be redirected to data destination configuration and you’ll be asked to set up the database. 

Select Keboola Snowflake Database. 

Then go back to flow and RUN the flow. 

Everything is set up.

 

 

 

 

Snowflake Database

You need to provide a host name (account name), user name, password, database name, schema, and warehouse.

We highly recommend that you create a dedicated user for the writer in your Snowflake database.

You need to provide the user with access to a Snowflake Warehouse. Keep in mind that Snowflake is case sensitive and if identifiers are not quoted, they are converted to upper case. So if you run, for example, a query CREATE SCHEMA john.doe;, you need to enter the schema name as DOE in the writer configuration.

More info here.

 

 

 

 

 

Most common errors
check if your error is a common problem and can be solved without Keboola support

Credentials to Snowflake Database are missing
Do you see this error below?

You probably forgot to set up Snowflake database. Click on the text under Configuration in the left corner. 

It will redirect you to Snowflake Database component. Now follow the “Snowflake Database provided by Keboola” on this page Authorizations/destinations. 

Then RUN the flow again. You’ll find it in Jobs tab. 


 
