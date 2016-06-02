---
title: Part 1c - Loading Data with Database Extractor
permalink: /overview/tutorial/load/database/
---

So far, you have learned to load data into KBC either [manually](/overview/tutorial/load/), or
via a [GoogleDrive extractor](/overview/tutorial/load/googledrive/).
Let's load data from an external database with the help of the Database extractor now.

We will use our own sample MySQL database, so don't worry about getting database credentials from anyone.

## Configure the Database Extractor
Start by going into the **Extractors** section of KBC and create a new extractor.

{: .image-popup}
![Screenshot - Create a new Extractor](/overview/tutorial/load/extractor-intro-2.png) 

Select **MySQL Extractor** (use the search feature to find it quickly).

{: .image-popup}
![Screenshot - Create a new Database Extractor](/overview/tutorial/load/extractor-intro-3.png) 

Similarly to the [GoogleDrive extractor](/overview/tutorial/load/googledrive/), the database extractor can
have multiple configurations. As each configuration represents a single database connection, we'll only
need one configuration. Continue with **Create New Configuration**.

{: .image-popup}
![Screenshot - New Database Extractor Configuration](/overview/tutorial/load/extractor-db-new.png) 

Name the configuration.

{: .image-popup}
![Screenshot - Create a new Database Extractor Configuration](/overview/tutorial/load/extractor-db-create.png) 

Now, set up credentials to the source database. Set

- **Host** to `datagirls.keboola.com`,
- **Port** to `3306`, and
- **Username**, **Password** and **Database** to `datagirls`. 
[_Curious who are Datagirls?_](https://www.facebook.com/datagirls/) 

Test that the credentials work and save them.

{: .image-popup}
![Screenshot - Database Extractor Credentials](/overview/tutorial/load/extractor-db-credentials.png)

For extracting tables from the database, add SQL queries. Each query produces a single table in Storage. 
 
{: .image-popup}
![Screenshot - Database Extractor Introduction](/overview/tutorial/load/extractor-db-intro-3.png)

Each database query needs to have a name, SQL command and a target table in Storage. 

{: .image-popup}
![Screenshot - Add database query](/overview/tutorial/load/extractor-db-query-edit.png)

One by one, create and save the following three queries:

- `SELECT * FROM sfdc_account;` with output table `in.c-tutorial.account`
- `SELECT * FROM sfdc_user;` with output table `in.c-tutorial.user`
- `SELECT * FROM sfdc_opportunity;` with output table `in.c-tutorial.opportunity`

You will obtain the following configuration. Click on **Run Extraction** to load the data
from the database into your tables in Storage.

{: .image-popup}
![Screenshot - Add database query](/overview/tutorial/load/extractor-db-queries.png)

Running the Extractor creates a background job that 

- connects to the database, 
- executes the queries, and
- stores results of the queries in specified tables in Storage. 

When a job is running, a small orange circle appears under *Last runs*, along with RunId and other info on the job. 
Green is for success, red for failure. Click on the indicator, or the info next to it, for more details.

Once the job is finished, click on the names of the tables to inspect their contents. In case you had loaded the 
[tables manually](/overview/tutorial/load/) before, their contents will not change at all. 
The extractor overwrites the table contents, and the manually loaded CSV files match the contents of the sample database.

Now when you know how to use the database extractor, continue with the [rest of the tutorial](/overview/tutorial/manipulate/).

