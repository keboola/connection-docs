---
title: eCommerce Insights
permalink: /flows/templates/ecommerce/
redirect_from:
    - /templates/ecommerce/
---

* TOC
{:toc}

With this end-to-end flow you can extract your updated data from an eCommerce platform and bring it into Keboola. 
After all the necessary tasks are performed on the data, you can transform the results into visualizations in any BI tool of your choice.

**The flow, in a nutshell:**
- First, the eCommerce data source connector will collect data from your account (data about orders, products, inventory, and customers). 

- We then create the output tables. We add NULL values if any columns are missing. We also check the data, and perform an [RFM analysis](https://clevertap.com/blog/rfm-analysis/).

- The data is then written into your selected destination, for example to Snowflake database via the Snowflake data destination connector.

- Finally, you will run the entire flow (i.e., the sequence of all the prepared, above-mentioned steps, in the correct order). 
The eCommerce data source connector, all data manipulations and analyses, and the data destination connector of your choice will be processed.

## Entity Relationship Diagram
An entity-relationship diagram is a specialized graphic that illustrates the relationships between entities in a data destination.

{: .image-popup}
![Business Data Model](/flows/templates/ecommerce/ecommerce-bdm-model.png)

## Table Description

| Name | Description |
|---|---|
| ORDERS | contains list of customer orders including order date, purchase, price and taxes |
| ORDER LINES | contains individual items to orders, incl. order date, amount of bought items, item prices, and item average margin |
| CUSTOMERS | contains list of customers, incl. email, customer billing and shipping information, total orders count and total orders value, as well as the actual RFM segment and score of each customer |
| PRODUCTS | contains list of products including product type, product manufacturer, product price, stock amount, number of units sold in the last 30 days, and information about stock refill |

## Data Sources

These are the data sources that are available in Public Beta: 

- [Shopify](https://www.shopify.com/)
- [WooCommerce](https://woocommerce.com/)
- [BigCommerce](https://www.bigcommerce.com/)

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
- [PostgreSQL](https://www.postgresql.org/)

<!-- 
The following data destinations will be coming soon: 
- [GoodData](https://www.gooddata.com/)
- [Tableau](https://www.tableau.com/)
- [Redshift database](https://aws.amazon.com/redshift/)
- [Google Drive](https://www.google.com/drive/) 
- [Amazon S3](https://www.aws.amazon.com/)
 -->
 
## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the data destination connector.

Select the template from the **Templates** tab in your Keboola project. When you are done, click **+ Use Template**. 

{: .image-popup}
![Add New Use Case](/flows/templates/ecommerce/ecommerce-add-new-template.png)

This page contains information about the template. Click **+ Set Up Template**.

{: .image-popup}
![Add New Use Case - Shopify to Keboola DWH](/flows/templates/ecommerce/ecommerce-set-up-template.png)

Now enter a name for the template instance that you are about to create. This allows you to use the template as many times as you want. It is important to keep things organized. 

{: .image-popup}
![Shopify to Keboola DWH - Template Name](/flows/templates/ecommerce/ecommerce-template-name.png)

After clicking **Set Up Template**, you will see the template builder. Select exactly one of three eCommerce data sources. Fill in all needed credentials and perform the required OAuth authorizations. 

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user authorization problems. 
If you are struggling with this part, go to the section [Authorizing Data Destinations](/flows/templates/ecommerce/#authorizing-data-destinations) below.

Follow the steps one by one and authorize your data sources. An eCommerce data source is required. In this case, Shopify is selected.

Finally, the destination must be authorized as well. 

{: .image-popup}
![Shopify Analytics to Keboola Provided Snowflake Database](/flows/templates/ecommerce/ecommerce-template-flow.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration and when it is done, you will be redirected to the Template Catalogue where you can see the newly created flow. 

Click **Run Template** and start building your visualizations a few minutes later. 

{: .image-popup}
![Shopify Analytics to Keboola Provided Snowflake Database - Flows](/flows/templates/ecommerce/ecommerce-all-runs.png)

## Authorizing eCommerce Data Sources
To use a selected data source connector, you must first authorize the data source. 

At least one data source must be used in order to create a working flow.

### Shopify Analytics

{: .image-popup}
![Shopify Source](/flows/templates/ecommerce/shopify-source.png)

To enable this application, you must:

- [Enable private app development](https://help.shopify.com/en/manual/apps/private-apps#enable-private-app-development-from-the-shopify-admin) for your store.
- Create a private application.
- Enable `Read access` ADMIN API PERMISSIONS for the following objects:
    - `Orders`
    - `Products`
    - `Inventory`
    - `Customers`

Additional documentation is available [here](https://bitbucket.org/kds_consulting_team/kds-team.ex-shopify/src/master/README.md).

### WooCommerce Analytics

{: .image-popup}
![WooCommerce Source](/flows/templates/ecommerce/woocommerce-source.png)

To download data from [WooCommerce](https://bitbucket.org/kds_consulting_team/kds-team.ex-woocommerce/src/master/README.md) we need to configure:

- Store_url: Website Domain name where WooCommerce is hosted. e.g. https://myshop.com

- consumer_key: [Rest API Consumer Key](https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication) from WooCommerce Admin panel

- consumer_secret: [Rest API Consumer Secret](https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication) from WooCommerce Admin panel

- date_from: Inclusive Date in YYYY-MM-DD format or a string, i.e. 5 days ago, 1 month ago, yesterday, etc.

- date_to: Exclusive Date in YYYY-MM-DD format or a string, i.e. 5 days ago, 1 month ago, yesterday, etc.

### BigCommerce Analytics

{: .image-popup}
![BigCommerce Source](/flows/templates/ecommerce/bigcommerce-source.png)

To authorize the BigCommerce data source, enter the following information:

- Access Token - V2/V3 API access token with read-only OAuth scope
  
- API Path
  
Both can be accomplished by following [this guide](https://support.bigcommerce.com/s/article/Store-API-Accounts?language=en_US#creating).

Additional documentation is available [here](https://bitbucket.org/kds_consulting_team/kds-team.ex-bigcommerce/src/master/).

## Authorizing Data Destinations
When creating a working flow, you can select one or more data destinations.

### BigQuery Database

{: .image-popup}
![BigQuery Destination](/flows/templates/ecommerce/bigquery-destination.png)

To configure the data destination connector, you need to set up a [Google Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new JSON key.

A detailed guide is available [here](https://help.keboola.com/components/writers/database/bigquery/).

### Google Sheets

{: .image-popup}
![Google Sheets Destination](/flows/templates/ecommerce/google-sheets-destination.png)

Authorize your Google account.

Duplicate the sheet into your Google Drive and paste the file ID back into Keboola. This is needed to achieve correct mapping in your duplicated Google sheet. 

<!-- *Note: We are working on automatization. In the future, you won't have to duplicate the sheet by yourself---we will do that for you.* -->

### Snowflake Database Provided by Keboola

If you do not have your own data warehouse, follow the instructions and we will create a database for you: 

1. Configure the Snowflake destination and click **Save Configuration**.
2. After clicking **Save**, the template will be used in your project. You will see a flow. 
3. Go there and click on **Snowflake Data Destination** to configure it. You will be redirected to the data destination configuration and asked to set up credentials. 
4. Select **Keboola Snowflake database**. 
5. Then go back to the flow and click **Run**. 

{: .image-popup}
![DWH Provided by Keboola](/flows/templates/ecommerce/keboola-dwh-instructions1.png)
![DWH Provided by Keboola](/flows/templates/ecommerce/keboola-dwh-instructions2.png)
![DWH Provided by Keboola](/flows/templates/ecommerce/keboola-dwh-instructions3.png)
![DWH Provided by Keboola](/flows/templates/ecommerce/keboola-dwh-instructions4.png)

Everything is set up.

### Snowflake Database

If you want to use your own Snowflake database, you must provide the host name (account name), user name, password, database name, schema, and a [warehouse](https://docs.snowflake.com/en/user-guide/warehouses).

{: .image-popup}
![Snowflake Destination](/flows/templates/ecommerce/snowflake-destination.png)

We highly recommend that you create a dedicated user for the data destination connector in your Snowflake database. Then you must provide the user with access 
to the Snowflake [Warehouse](https://docs.snowflake.com/en/user-guide/warehouses). 

**Warning:** Keep in mind that Snowflake is **case sensitive** and if identifiers are not quoted, they are converted to upper case. So if you run, for example, 
a query CREATE SCHEMA john.doe;, you must enter the schema name as DOE in the data destination connector configuration.

More info [here](https://help.keboola.com/components/writers/database/snowflake/).

## Most Common Errors
Before turning to the Keboola support team for help, make sure your error is not a common problem that can be solved without our help.

### Missing Credentials to Snowflake Database 
If you see the error pictured below, you have probably forgotten to set up the Snowflake database. 

Click on the highlighted text under Configuration in the top left corner. This will redirect you to the Snowflake Database connector. Now follow the **Snowflake Database provided by Keboola** on the page Authorizations/destinations. 

Then go to the **Jobs** tab and **Run** the flow again.  

{: .image-popup}
![Job - Snowflake](/flows/templates/ecommerce/snowflake-job.png)
