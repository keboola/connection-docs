---
title: 'Load from a database'
slug: 'getting-started/load/database'
description: 'Load tables from an external database using the Snowflake data source connector — the same pattern applies to every database connector Keboola supports.'
redirect_from:
  - /tutorial/load/database/
---

So far, you have learned to load data into Keboola [from a URL](/getting-started/load/) and
via a [Google Sheets data source connector](/getting-started/load/googlesheets/).

Now, let's explore loading data from an external database using the Snowflake Database data source (the procedure is the same for all our database data sources).
We will use our own sample Snowflake database, so do not worry about having to get database credentials from anyone.

:::tip[Do it with Kai]
Database connectors are configured the same way as any other data source
([Integration Setup](/kai/use-cases/#integration-setup)). Open **Kai Agent** in the top bar and
say what you want connected, not what your credentials are:

```text
Set up a Snowflake data source connector against our sample database and load the OPPORTUNITY,
ACCOUNT and USER tables into Storage.
```

**Never paste a password into the chat.** Kai prompts you for credentials through a secure form
instead — that is its documented behavior, and
[Kai's own guidance](/kai/getting-started/#tips-for-new-users) says the same. The values to type into
that form are the sample ones under [Configure Snowflake data source connector](#configure-snowflake-data-source-connector) below.

The pattern is identical for every database connector Keboola supports, which is the reason to
walk it once by hand.
:::

## Configure Snowflake Data Source Connector
1. Start by going into the **Components** section and click **Add Component**.

![Add Data Source](/getting-started/load/db-picture1.png)

2. Use the search box to find the **Snowflake data source**.

![Find Snowflake Data Source](/getting-started/load/db-picture2.png)

3. Click **Add Component** and select **Connect To My Data**.

![Connect to Data](/getting-started/load/db-picture3.png)

4. Enter a name and a description and click **Create Configuration**.

![Create New Configuration](/getting-started/load/db-picture4.png)

   Similarly to other components, the Snowflake data source connector can have multiple configurations. 
   As each configuration represents a single database connection, we only need one configuration. 

5. Enter the following credentials:
  - **Host Name** to `kebooladev.snowflakecomputing.com`.
  - **Username**, **Password**, **Database**, and **Schema** to `HELP_TUTORIAL`.
  - **Warehouse** to `DEV`.

6. Click **Test Connection and Load Available Sources**.

![Database Data Source Credentials](/getting-started/load/db-picture5.png)

7. Under **Select sources**, use the dropdown menu to select the `OPPORTUNITY`, `ACCOUNT`, and `USER` tables. 

![Select Sources](/getting-started/load/db-picture6.png)

8. After selecting all the required tables, click **Save and Run Configuration**.
This action will execute the data extraction, generating three new tables in your Storage.

![Database Tables Selected](/getting-started/load/db-picture7.png)

   Running the component creates a background job that
      - connects to the database,
      - executes the queries, and
      - stores results in the specified tables in Storage.

For more advanced configuration options, such as incremental fetch, incremental load, or advanced SQL query mode, 
please navigate to Advanced Mode. Note that we do not cover the advanced mode options here.

![Advanced Mode](/getting-started/load/db-picture8.png)

