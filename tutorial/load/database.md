---
title: Loading Data with Database Extractor
permalink: /tutorial/load/database/
---

So far, you have learned to load data into KBC [manually](/tutorial/load/) and
via a [GoogleDrive extractor](/tutorial/load/googledrive/).
Let's now load data from an external database with the help of the [Snowflake Database](https://www.snowflake.net/) extractor
(the procedure is same for all our [database extractors](/extractors/database/).

We will use our own sample Snowflake database, so do not worry about having to get database credentials from anyone.

## Configure Snowflake Extractor
Start by going into the **Extractors** section of KBC and create a new extractor.

{: .image-popup}
![Screenshot - Create a new Extractor](/tutorial/load/extractor-intro-2.png)

Find **Snowflake**. You can use the search feature to find it quickly.

{: .image-popup}
![Screenshot - Create a new Database Extractor](/tutorial/load/extractor-intro-3.png)

Similarly to the [GoogleDrive extractor](/tutorial/load/googledrive/), the Snowflake extractor can
have multiple configurations. As each configuration represents a single database connection, we only
need one configuration. Continue with **New Configuration**.

{: .image-popup}
![Screenshot - New Database Extractor Configuration](/tutorial/load/extractor-db-new.png)

Name the configuration.

{: .image-popup}
![Screenshot - Create a new Database Extractor Configuration](/tutorial/load/extractor-db-create.png)

Now, set up credentials to the source database. Set

- **Host** to `kebooladev.snowflakecomputing.com`,
- **Port** to `443`, and
- **Username**, **Password**, **Database** and **Schema** to `HELP_TUTORIAL`.
- **Warehouse** to `DEV`.

Test the credentials and save them.

{: .image-popup}
![Screenshot - Database Extractor Credentials](/tutorial/load/extractor-db-credentials.png)

Now select the tables to import from the dropdown. Each selected table corresponds to a single table in Storage.

{: .image-popup}
![Screenshot - Quickstart](/tutorial/load/extractor-db-tableSelector.png)

Select the `ACCOUNTS`, `USER`, and `OPPORTUNITY` tables and press "Create".

{: .image-popup}
![Screenshot - Database Tables Selected](/tutorial/load/extractor-db-tablesSelected.png)

You will get the following configurations. Now let's click on **Run Extraction** to load the data
from the database into your tables in Storage.

{: .image-popup}
![Screenshot - Run the extraction](/tutorial/load/extractor-db-index-2.png)


Running the extractor creates a background job that

- connects to the database,
- executes the queries, and
- stores results in the specified tables in Storage.

When a job is running, a small orange circle appears under *Last runs*, along with RunId and other info on the job.
Green is for success, red for failure. Click on the indicator, or the info next to it, for more details.
Once the job is finished, click on the names of the tables to inspect their contents. 

Now when you know how to use a database extractor, continue with the [rest of the tutorial](/tutorial/manipulate/).
