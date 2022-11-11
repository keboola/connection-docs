---
title: eCommerce
permalink: /use-cases/ecommerce/
---

* TOC
{:toc}

With this end-to-end template you can extract your updated data from an eCommerce platform and bring it into Keboola Connection. 
After all the necessary tasks are performed on the data, you can transform the results into visualizations in any BI tool of your choice.

**The flow, in a nutshell:**
- First, the eCommerce source component will collect data from your account (data about orders, products, inventory, and customers). 
You can also bring in marketing data from your marketing channels like [Facebook Ads](https://www.facebook.com/business/tools/ads-manager/), 
[Google Ads](https://ads.google.com/), and/or [Sklik](https://www.sklik.cz/) accounts.

- We then create the output tables. We add NULL values if any columns are missing. We also check the data, and perform an RFM analysis.

- The data is then written into your selected destination, for example to Snowflake database via the Snowflake destination component.

- Finally, you will run the entire flow (i.e., the sequence of all the prepared, above mentioned steps, in the correct order). 
The ecommerce source component, all data manipulations and analyses, and the destination component of your choice, will be processed.

## Business Data Model

{: .image-popup}
![Business Data Model](/use-cases/ecommerce/business-data-model.png)

## Table Description

| Name | Description |
|---|---|
| PRODUCTS | contains list of products including product type, product manufacturer and product price |
| ORDERS | contains list of customer orders including order date, purchase, price and taxes |
| CUSTOMERS | contains list of customers, incl. email, customer billing and shipping information, and orders count |
| SHOP | contains information about your shop such as url and name |
| BILLING TYPE | enumeration for billing types |
| SHIPPING TYPE | enumeration for shipping types |
| ORDER LINES | contains individual items to orders, incl. order date, amount of bought items and item prices |
| PRODUCT MARGIN OVER TIME | contains product margin over time, used to check how margin on each product changes in time |
| CAMPAIGN COSTS | contains daily marketing campaign costs and clicks |
| CAMPAIGN COSTS MONTHLY | contains monthly marketing campaign costs and clicks |
| RFM | describes analysis of customer value (RFM), showing actual group of customer as well as prediction for moving from loyal customer to frozen customer |
| ANALYZE CLV BY TIME FROM PREVIOUS ORDER | contains analysis of customer lifetime value by time |
| ANALYZE CLV BY ORDER COUNT | contains analysis of customer lifetime value by number of orders |

## Data Sources

These are the data sources that are available in Public Beta: 

- [Shopify](https://www.shopify.com/)

<!-- 
The following data sources will be coming soon: 

- [WooCommerce Analytics](https://woocommerce.com/) 
- [Shoptet Analytics](https://www.shoptet.cz/)
 -->

## Data Destinations

These data destinations are available in Public Beta: 

- [Snowflake database provided by Keboola](https://help.keboola.com/components/writers/database/snowflake/)
- [Snowflake database](https://www.snowflake.com/)
- [Google BigQuery database](https://cloud.google.com/bigquery/) 
- [Google Sheets](https://www.google.com/sheets/about/)

<!-- 
The following data destinations will be coming soon: 
- [GoodData](https://www.gooddata.com/)
- [Tableau](https://www.tableau.com/)
- [Redshift database](https://aws.amazon.com/redshift/)
- [Google Drive](https://www.google.com/drive/) 
- [Amazon S3](https://www.aws.amazon.com/)
 -->
 
## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which Data Source and which Data Destination you want to use. Then select the corresponding template from the **Use Case** tab in your Keboola Connection project. When you are done, click **+ Use Template**. 

{: .image-popup}
![Add New Use Case](/use-cases/ecommerce/add-new-use-case.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Add New Use Case - Shopify to Keboola DWH](/use-cases/ecommerce/add-shopify-to-keboola-dwh.png)

Now enter a name for the template instance that you are about to create. This way you can use the template as many times as you want. It is important to keep things organized. 

{: .image-popup}
![Shopify to Keboola DWH - Template Name](/use-cases/ecommerce/shopify-to-keboola-dwh-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow failing because of any user authorization problems. 
If you are struggling with this part, go to the section [Authorizing Destinations](/components/use-cases/ecommerce/authorizing-destinations/) below.

Follow the steps one by one and authorize your data sources. An Ecommerce data source is required. In this case, it is Shopify.

*Note: Using additional marketing sources is optional. You can (but you do not have to) enrich your eCommerce data with marketing statistics like costs, impressions, and clicks.*

Finally, the destination must be authorized as well. 

> Please, read carefully the instructions within this step. If you encounter any difficulties, go to the section [Authorizing Destinations](/use-cases/ecommerce/authorizing-destinations/) below.

{: .image-popup}
![Shopify Analytics to Keboola Provided Snowflake Database](/use-cases/ecommerce/shopify-to-keboola-snowflake.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration and when it is done, you will be redirected to Use Case Catalogue and see the newly created flow. 

Click **Run Use Case** and start building your visualizations a few minutes after. 

{: .image-popup}
![Shopify Analytics to Keboola Provided Snowflake Database - Flows](/use-cases/ecommerce/shopify-to-keboola-provided-snowflake-database-flows.png)

## Authorizing eCommerce Data Sources
To use a selected data source component, you must first authorize the data source. 

At least one data source must be used in order to create a working flow.

### Shopify Analytics

{: .image-popup}
![Shopify Source](/use-cases/ecommerce/shopify-source.png)

To enable this application, you must:

- [Enable private app development](https://help.shopify.com/en/manual/apps/private-apps#enable-private-app-development-from-the-shopify-admin) for your store.
- Create a private application.
- Enable `Read access` ADMIN API PERMISSIONS for the following following objects:
    - `Orders`
    - `Products`
    - `Inventory`
    - `Customers`

Additional documentation is available [here](https://bitbucket.org/kds_consulting_team/kds-team.ex-shopify/src/master/README.md).

### Shoptet Analytics

This extractor allows you to download data from Shoptet permalinks. 

{: .image-popup}
![Shoptet Data Source](/use-cases/ecommerce/shoptet-source.png)

Find all links in your Shoptet account. 

Example: Go to Customers and click **Export**. At the bottom you will see a link looking like this: https://www.yourshopaddress.domain/export/customers.xml?ip=11.111.111.1111&hash=somehash

- Set the shop name.
- Set the Base URL of the store.
- Set the Orders URL so that it contains the pattern ID and hash in the URL.
- Set the Products URL so that it contains the pattern ID and hash in the URL.
- Set the Customers URL so that it contains the hash in the URL.
- Set the Stock URL so that it contains the hash in the URL.

<!-- 
### WooCommerce

To download data from [WooCommerce](https://bitbucket.org/kds_consulting_team/kds-team.ex-woocommerce/src/master/README.md) we need to configure:

- Store_url: Website Domain name where WooCommerce is hosted. e.g. https://myshop.com

- consumer_key: Rest API Consumer Key from WooCommerce Admin panel

- consumer_secret: Rest API Consumer Secret from WooCommerce Admin panel

- date_from: Inclusive Date in YYYY-MM-DD format or a string i.e. 5 days ago, 1 month ago, yesterday, etc.

- date_to: Exclusive Date in YYYY-MM-DD format or a string i.e. 5 days ago, 1 month ago, yesterday, etc.
 -->

## Authorizing Marketing Data Sources

Using the following marketing data sources is optional. Select the ones you wish to use.

### Facebook Ads

{: .image-popup}
![Facebook Ads Data Source](/use-cases/ecommerce/facebook-ads-data-source.png)

Log in into Facebook with redirection from this step and allow Keboola Connection to access the data. 

From the list of accounts select the accounts from which you want to download data.

### Google Ads

{: .image-popup}
![Google Ads Data Source](/use-cases/ecommerce/google-ads-data-source.png)

Authorize your Google Account and then select the account from which you want to get data. The list will automatically appear after authorization. 

### Sklik

{: .image-popup}
![Sklik Data Source](/use-cases/ecommerce/sklik-data-source.png)

The component uses the [Sklik API](https://api.sklik.cz/drak/) to import data from [Sklik](https://www.sklik.cz/). It downloads configured reports for all specified accounts.

To configure this source component, you need to have a working

- [Sklik](https://www.sklik.cz/) account, and an
- Sklik API [token](https://www.sklik.cz/generateToken).

The current listing limit supported by the Sklik API is 100.

## Authorizing Destinations
To create a working flow, you must select at least one data destination.

### BigQuery Database

{: .image-popup}
![BigQuery Destination](/use-cases/ecommerce/bigquery-destination.png)

To configure the destination component, you need to set up a [Google Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new JSON key.

A detailed guide is available [here](https://help.keboola.com/components/writers/database/bigquery/).

### Google Sheets

{: .image-popup}
![Google Sheets Destination](/use-cases/ecommerce/google-sheets-destination.png)

Authorize your Google account.

Duplicate the sheet into your Google Drive and paste the file ID back to Keboola Connection. It is needed for correct mapping in your duplicated Google sheet. 

*Note: We are working on automatization. In the future, you won't have to duplicate the sheet by yourself, we will do that for you.*

### Snowflake Database Provided by Keboola

If you do not have your own data warehouse, follow the instructions and we will create a database for you: 

1. After clicking **Save**, the template will be used in your project. You will see a flow. 
2. Go there and click on **Snowflake Data Destination**. You will be redirected to the data destination configuration and asked to set up the database. 
3. Select **Keboola Snowflake database**. 
4. Then go back to the flow and click **Run**. 

![DWH Provided by Keboola](/use-cases/ecommerce/dwh-provided-by-keboola.png)

Everything is set up.

### Snowflake Database

If you want to use your own Snowflake database, you must provide the host name (account name), user name, password, database name, schema, and a [warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html).

{: .image-popup}
![Snowflake Destination](/use-cases/ecommerce/snowflake-destination.png)

We highly recommend that you create a dedicated user for the destination component in your Snowflake database. Then you must provide the user with access 
to the Snowflake [Warehouse](https://docs.snowflake.net/manuals/user-guide/warehouses.html). 

**Warning:** Keep in mind that Snowflake is **case sensitive** and if identifiers are not quoted, they are converted to upper case. So if you run, for example, 
a query CREATE SCHEMA john.doe;, you must enter the schema name as DOE in the destination component configuration.

More info [here](https://help.keboola.com/components/writers/database/snowflake/).

## Most Common Errors
Before turning to the Keboola support team for help, make sure your error is not a common problem that can be solved without our help.

### Missing Credentials to Snowflake Database 
If you see the error pictured below, you have probably forgotten to set up the Snowflake database. 

Click on the highlighted text under Configuration in the top left corner. This will redirect you to the Snowflake Database component. Now follow the **Snowflake Database provided by Keboola** on the page Authorizations/destinations. 

Then go to the **Jobs** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/use-cases/ecommerce/snowflake-job.png)

 
