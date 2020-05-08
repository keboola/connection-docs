---
title: Part 3 - Writing Data
permalink: /tutorial/write/
---

* TOC
{:toc}

This part of our tutorial will guide you through the process of writing data from Keboola Connection. 
You have learned to [manipulate data](/tutorial/manipulate/) in Keboola Connection using SQL, 
and have a denormalized table called `opportunity_denorm` ready in the `out.c-tutorial` storage bucket. 
This table is suitable to be loaded into [Tableau Analytics](https://www.tableau.com/). 

## Getting Started

**Before you proceed, have [Tableau Desktop](https://www.tableau.com/products/desktop) installed**.
If you want to try connection to Tableau Server, have credentials for that server as well. 
As an alternative, sign up for a free trial of [Tableau Online](https://www.tableau.com/products/cloud-bi) to test it out.

Writing data from Keboola Connection into a business intelligence and analytics tool such as Tableau is very common. 
Writing data to GoodData BI is covered in the following [side step](/tutorial/write/gooddata/). 
However, keep in mind you can use the processed data in any way you wish.   

There are three options how to load the `opportunity_denorm` table into Tableau:

- Writing data to a provisioned Snowflake/Redshift database
- Generating a [Tableau Data Extract (TDE)](https://www.tableau.com/about/blog/2014/7/understanding-tableau-data-extracts-part1) 
and loading it manually into Tableau Desktop
- Generating a TDE and loading it into Tableau Server, either manually or automatically

In either case, you need a writer component from the **Components -- Writers** menu. 

{: .image-popup}
![Screenshot - Writers](/tutorial/write/writers-intro.png)

In this tutorial, we'll go with the first option -- configuring the **Snowflake writer** as it is the easiest and fastest to use. 
The description of the [Tableau TDE writer](/components/writers/bi-tools/tableau/) is part of the [writers](/components/writers/) 
documentation. Click **Add New Writer**, find the Snowflake writer and click it.

{: .image-popup}
![Screenshot - Snowflake Writer](/tutorial/write/writers-intro-2.png)

Each writer can have multiple **configurations**. Each configuration represents a combination of data and destination. 
To give an example, you only need a single configuration to write multiple tables into a single Tableau server. 
However, two configurations are needed when you want to write data to two servers, or 
have a set of data loaded manually and a different set automatically. 
Continue with **New Configuration**.

{: .image-popup}
![Screenshot - Snowflake Writer](/tutorial/write/snowflake-intro.png)

Name the configuration and click **Create Configuration**.

{: .image-popup}
![Screenshot - Create Snowflake Writer Configuration](/tutorial/write/snowflake-create-config.png)

At this moment, you're probably wondering why we are using the Snowflake database and where and how you are going to
get credentials to it. The answer is near -- click the **Set up credentials** button:

{: .image-popup}
![Screenshot - Snowflake Configuration Intro](/tutorial/write/snowflake-config.png)

As part of the Keboola Connection platform we offer a 
[dedicated database workspace](/components/writers/database/snowflake/#keboola-snowflake-database) that you can use to connect
[external tools](/components/writers/database/snowflake/#using-keboola-provisioned-database). Simply click
on **Keboola Snowflake Database**:

{: .image-popup}
![Screenshot - Snowflake Credentials](/tutorial/write/snowflake-credentials.png)

You will obtain a dedicated database and credentials to it. Use the lock icon to display 
the password if you wish. Go back to the Snowflake writer configuration.

{: .image-popup}
![Screenshot - Snowflake Credentials](/tutorial/write/snowflake-credentials-2.png)

The next step is to add tables -- click the **Add Table** button.

{: .image-popup}
![Screenshot - Select table](/tutorial/write/tableau-select-table.png)

Select the table `out.c-opportunity.opportunity_denorm` and click **Add Table**:

{: .image-popup}
![Screenshot - Select table](/tutorial/write/tableau-select-table-2.png)

In the next step, you can specify properties of the columns in the target database, like `Name` and `Data Type`.
Use the preview column to peek at the column data. Most columns in the `opportunity_denorm` table are strings (characters).
Start with `Set All Columns to:` and select `string` to set them quickly. 
Then **Preview** the content of each column and set its type accordingly.
For the purpose of this tutorial, it is enough to set the *Amount* column to the type `number`.
Don't forget to **Save** the settings.

{: .image-popup}
![Screenshot - Snowflake Edit Columns](/tutorial/write/snowflake-columns.png)

When done, go back to the configuration and click on **Run Component** to write the 
data to the provisioned database.

{: .image-popup}
![Screenshot - Snowflake Run Configuration](/tutorial/write/snowflake-run.png)

## Connecting with Tableau
Now that you have prepared the data source, you can connect to it from Tableau. Login to Tableau online
and **Create Workbook**:

{: .image-popup}
![Screenshot - Tableau Intro](/tutorial/write/tableau-1.png)

A connection to a datasource will be requested. Choose *Connectors* and *Snowflake*:

{: .image-popup}
![Screenshot - Tableau Connectors](/tutorial/write/tableau-2.png)

Enter the credentials from the Snowflake writer configuration (you can always review them by
clicking on the **Database Credentials** button in the right menu).

{: .image-popup}
![Screenshot - Tableau Credentials](/tutorial/write/tableau-3.png)

Select *Warehouse*, *Database* and *Schema* -- there is only one option because the database is completely
isolated and created just for the purpose of your writer configuration. If in doubt, however, you can 
always check the database credentials in the Snowflake writer configuration.
You will see the *opportunity_denorm* table.

{: .image-popup}
![Screenshot - Tableau Database](/tutorial/write/tableau-4.png)

You can now work with the data in Tableau. 
You can also check that the *amount* column was converted to numeric.

{: .image-popup}
![Screenshot - Tableau Table](/tutorial/write/tableau-5.png)

Create charts and reports as usual, and publish them to other people. 

{: .image-popup}
![Screenshot - Tableau Report](/tutorial/write/tableau-6.png)

## Semi-final Note
This concludes the main steps of the Keboola Connection tutorial. You have learned to load data into **Storage**, 
manipulate it using **Transformations**, and load it into the target system using **Writers**. 

At this point, you can

- [return to the tutorial index](/tutorial/) for additional steps, 
- take a brief side-step on how to set up a [writer to GoodData BI](/tutorial/write/gooddata/),
- continue to [Setting up Automation](/tutorial/automate/), or just
- [talk to us](/).
