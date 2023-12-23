---
title: Loading Data with Database Data Source Connector
permalink: /tutorial/load/database/
---

So far, you have learned to load data into Keboola [manually](/tutorial/load/) and
via a [Google Sheets data source connector](/tutorial/load/googlesheets/).

Now, let's explore loading data from an external database using the Snowflake Database data source (the procedure is the same for all our database data sources).
We will use our own sample Snowflake database, so do not worry about having to get database credentials from anyone.

## Configure Snowflake Data Source Connector
1. Start by going into the **Components** section and click **Add Component**.

   {: .image-popup}
   ![Add Data Source](/tutorial/load/db-picture1.png)

2. Use the search box to find the **Snowflake data source**.

   {: .image-popup}
   ![Find Snowflake Data Source](/tutorial/load/db-picture2.png)

3. Click **Add Component** and select **Connect To My Data**.

   {: .image-popup}
   ![Connect to Data](/tutorial/load/db-picture3.png)

4. Enter a name and a description and click **Create Configuration**.

   {: .image-popup}
   ![Create New Configuration](/tutorial/load/db-picture4.png)

   Similarly to other components, the Snowflake data source connector can have multiple configurations. 
   As each configuration represents a single database connection, we only need one configuration. 

5. Enter the following credentials:
  - **Host Name** to `kebooladev.snowflakecomputing.com`.
  - **Username**, **Password**, **Database**, and **Schema** to `HELP_TUTORIAL`.
  - **Warehouse** to `DEV`.

6. Click **Test Connection and Load Available Sources**.

   {: .image-popup}
   ![Database Data Source Credentials](/tutorial/load/db-picture5.png)

7. Under **Select sources**, use the dropdown menu to select the `OPPORTUNITY`, `ACCOUNT`, and `USER` tables. 

   {: .image-popup}
   ![Select Sources](/tutorial/load/db-picture6.png)

8. After selecting all the required tables, click **Save and Run Configuration**.
This action will execute the data extraction, generating three new tables in your Storage.

   {: .image-popup}
   ![Database Tables Selected](/tutorial/load/db-picture7.png)

   Running the component creates a background job that
      - connects to the database,
      - executes the queries, and
      - stores results in the specified tables in Storage.

For more advanced configuration options, such as incremental fetch, incremental load, or advanced SQL query mode, 
please navigate to Advanced Mode. Note that we will not cover the advanced mode options in this tutorial.

{: .image-popup}
![Advanced Mode](/tutorial/load/db-picture8.png)

## What's Next
Proceed to [Data Manipulation](/tutorial/manipulate/).

## If You Need Help
Feel free to reach out to our [support team](support@keboola.com) if there’s anything we can help with.
