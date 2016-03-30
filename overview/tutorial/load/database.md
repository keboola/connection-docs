---
title: Part 1c - Loading data with Database Extractor
permalink: /overview/tutorial/load/database/
---

In the [previous step](/overview/tutorial/load/) you learned, how to quickly load data into
KBC using manual import. In real production projects, this is seldom used as most of the data are 
obtained automatically using *extractors*. 
In the next part we showed how to [use GoogleDrive extactor](/overview/tutorial/load/googledrive/).
In this part of the tutorial, you will use a Database extractor to load data from an external database.

We will use our own sample database, so you don't need to worry about getting database credentials from someone.

## Configure the Database Extractor
Start by going into the **Extractors** section of KBC and creat a new extractor:

{: .image-popup}
![Screenshot - Create a new Extractor](/overview/tutorial/load/extractor-intro-2.png) 

Select **Database Extractor** (use the search feature to find it quickly):

{: .image-popup}
![Screenshot - Create a new Database Extractor](/overview/tutorial/load/extractor-intro-3.png) 

The same as [GoogleDrive extractor](/overview/tutorial/load/googledrive/), the database extractor can
have multiple configurations. Each configuration represents a single database connection, so we'll only
need one configuration. Continue with **Create New Configuration**:

{: .image-popup}
![Screenshot - New Database Extractor Configuration](/overview/tutorial/load/extractor-db-new.png) 

Name the configuration:

{: .image-popup}
![Screenshot - Create a new Database Extractor Configuration](/overview/tutorial/load/extractor-db-create.png) 

Now you need to setup credentials to the source database. Set:

- **Driver** to `MySQL`
- **Host** to `datagirls.keboola.com`
- **Port** to `3306`
- and **Username**, **Password** and **Database** to `datagirls` 
([curious who are Datagirls?](https://www.facebook.com/datagirls/)) 

Test that the crenditals work and save them:

{: .image-popup}
![Screenshot - Database Extractor Credentials](/overview/tutorial/load/extractor-db-credentials.png)

Once the Database Extractor credentials are set up, you can add SQL queries, which extract tables from
the database. Each query produces a single table in the Storage. 
 
{: .image-popup}
![Screenshot - Database Extractor Introduction](/overview/tutorial/load/extractor-db-intro-3.png)

Each database query needs to have a name, SQL command and a target table in the Storage. 

{: .image-popup}
![Screenshot - Add database query](/overview/tutorial/load/extractor-db-query-edit.png)

Create three queries:

- `SELECT * FROM sfdc_account;` with output table `in.c-tutorial.account`
- `SELECT * FROM sfdc_user;` with output table `in.c-tutorial.user`
- `SELECT * FROM sfdc_opportunity;` with output table `in.c-tutorial.opportunity`

And you should obtain the following configuration. Click on **Run Extraction** to load the data
from the database into your tables in Storage.

{: .image-popup}
![Screenshot - Add database query](/overview/tutorial/load/extractor-db-queries.png)

Running the Extractor will create a background job, which connects to the database, executes the queries, and
then stores their results in the specified tables in Storage. Once the job is finished, you can than inspect 
the contents of each table by clicking on the table name. In case you loaded the 
[tables manually](/overview/tutorial/load/) before, their contents will not change at all. This is because the
extractor overwrites the table contents and the CSV files, you loaded manually are exactly same as the contents
of the sample database.

This is the end of the tutorial on database extractor, you can now continue with 
the [rest of the tutorial](/overview/tutorial/manipulate/)

