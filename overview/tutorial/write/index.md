---
title: Part 3 - Writing data
permalink: /overview/tutorial/write/
---

In the [previous step](/overview/tutorial/manipulate/) you learned, how to quickly manipulate data in
KBC using SQL. We have prepared a denormalized table `opportunity_denorm` in Storage bucket
`out.c-tutorial`. This table is suitable to be loaded into [Tableau Analytics](http://www.tableau.com/). 
**Before you proceed, you should have [Tableu Desktop](http://www.tableau.com/products/desktop) installed**, 
and if you want to try connection to Tableu Server, you should have also credentials for that server. 
Alternativelly, you can signup for [Tableu Online](http://www.tableau.com/products/cloud-bi) (free trial) to test it out.

Note: It is a common use case to write data from KBC into a bussiness intelligence analytics such as Tableau. 
In a [side step](/overview/tutorial/write/gooddata/) we show how to write data to GoodData BI. But it is important
to emphasize, that you may use the processed data in any way you wish really.   

To load the table `opportunity_denorm` into Tableau, there are basically two options:

- you can generate a [Tableau Data Extract (TDE)](http://www.tableau.com/about/blog/2014/7/understanding-tableau-data-extracts-part1) 
and load that manually into Tableau Desktop
- or you can generate a TDE and load it (manually or automatically) into Tableau Server

In both cases, you need a Tableau Writer in the **Writers** section of KBC: 

{: .image-popup}
![Screenshot - Writers](/overview/tutorial/write/writers-intro.png)

Each writer can have multiple **configurations**. Each configuration represents a combination of 
data and destination. For example, you only need a single configuration to write multiple tables into a single
Tableau Server, but you need to two configuration when you want to write some data to two servers, or have a 
set of data loaded manually and a different set loaded automatically. Continue with **Create New Configuration**:

{: .image-popup}
![Screenshot - Tableau Writer](/overview/tutorial/write/tableau-intro.png)

Name and create the configuration:

{: .image-popup}
![Screenshot - Create Tableau Writer Configuration](/overview/tutorial/write/tableau-create-config.png)

Now continue by adding tables that you want to send to Tableau:

{: .image-popup}
![Screenshot - Start configuration](/overview/tutorial/write/tableau-config.png)

Select the table `out.c-tutorial.opportunity_denorm`:

{: .image-popup}
![Screenshot - Select table](/overview/tutorial/write/tableau-select-table.png)

Now, you need to specify data type for each column of the loaded table. The 
[data types](https://onlinehelp.tableau.com/current/pro/online/mac/en-us/datafields_typesandroles_datatypes.html)
represent the type of values stored in the column. Additionally, you can `IGNORE` a column and it won't be loaded
into Tableau at all.

Since most columns ins the `opportunity_denorm` table are strings (characters), you can start 
with `Set All Types to` and select `string` to quickly set them. Then use the **Preview** to peek at
the contents of each column and set its type accordingly.

{: .image-popup}
![Screenshot - Table configuration](/overview/tutorial/write/tableau-table-config-1.png)

If you are not sure, how to set up the data types, consult the following screenshots:
 
{: .image-popup}
![Screenshot - Table configuration - Column types Part 1](/overview/tutorial/write/tableau-table-config-2.png)

{: .image-popup}
![Screenshot - Table configuration - Column types Part 2](/overview/tutorial/write/tableau-table-config-3.png)

## Loading the data into Tableau Desktop 

When you save the configuration, you can now export the data set (so far it is one table) into a TDE file by
clicking on **Export tables to TDE**:

{: .image-popup}
![Screenshot - Tableau Writer - TDE](/overview/tutorial/write/tableau-intro-2.png)

This will create a background job, which generates the TDE file, you can then download the latest version
of the Tableau Data Export by clicking on the `out.c_tutorial.opportunity_denorm.tde` link. This will offer you to
download the TDE file to your local computer, where you can load it into Tableau Desktop.

{: .image-popup}
![Screenshot - Tableau Desktop Load](/overview/tutorial/write/tableau-desktop-intro.png)

You will then get the data table loaded:

{: .image-popup}
![Screenshot - Tableau Desktop Loaded Data](/overview/tutorial/write/tableau-desktop-data.png)

You can then create reports to your liking - e.g. use the precomputed opportunity probability class:

{: .image-popup}
![Screenshot - Tableau Desktop Sample Chart](/overview/tutorial/write/tableau-desktop-sample.png)

## Loading data into Tableau Server

Better approach for multiple users and for automated processing is to load your data into tableau server.
You can do this both with your own server instance as 
with [Tableau Online server](http://www.tableau.com/products/cloud-bi). To connect to a Tableau Server, you
need to **Setup Upload**:

{: .image-popup}
![Screenshot - Tableau Setup Upload](/overview/tutorial/write/tableau-intro-3.png)

Set a new destination: 

{: .image-popup}
![Screenshot - Tableau Set Destination](/overview/tutorial/write/tableau-destination.png)

Select **Tableau Server**:

{: .image-popup}
![Screenshot - Tableau Use Server](/overview/tutorial/write/tableau-destination-server.png)

You can now proceed to set server credentials:

{: .image-popup}
![Screenshot - Tableau Set Credentials](/overview/tutorial/write/tableau-destination-intro.png)

If you are connecting to you own Tableau instance, you should know the connection properties or
ask your server administrator. If you are connecting to Tableau Online, you can find all the necesary 
information in the intro page URL:

{: .image-popup}
![Screenshot - Tableau Server Credentials](/overview/tutorial/write/tableau-online-intro.png)

From the above Tableau Online page, we can extract the **Server URL** being `https://10ay.online.tableau.com/`,
and the **Site** being `odinovo`. You can use and existing Tableu project, or create a new one.   

{: .image-popup}
![Screenshot - Tableau Use Server](/overview/tutorial/write/tableau-credentials.png)

When you have set the credentials, click on **Enable instant Upload** so that the TDE files are automatically
pushed to the Tableau Server, every time they are generated. 

{: .image-popup}
![Screenshot - Tableau Set Instant Upload](/overview/tutorial/write/tableau-destination-final.png)

You can then go back to the **Write to Server** configuration and click on **Export Tables to TDE** once again.
 
{: .image-popup}
![Screenshot - Tableau Load Data to Server](/overview/tutorial/write/tableau-intro-4.png)

This will again create a background job, which will take the table `out.c-tutorial.opportunity_denorm` from Storage,
convert it to a TDE file, and load that file to your server. If the job finishes successfully, you will see a new 
data source added to the project:
 
{: .image-popup}
![Screenshot - Tableau Online DataSource](/overview/tutorial/write/tableau-online-datasource.png)

You (and everyone else in your organization) can then use that data source from Tableu 
Desktop by connecting to your server:

{: .image-popup}
![Screenshot - Tableau Desktop Connect to Server](/overview/tutorial/write/tableau-desktop-server.png)

You will then see your datasource:

{: .image-popup}
![Screenshot - Tableau Desktop Datasource](/overview/tutorial/write/tableau-desktop-datasource.png)

You can then create charts and reports as you are used to, and publish them to other people. This concludes the
main steps of KBC tutorial, you now know how to use KBC to load data into **Storage**, manipulate them using
**Transformations** and load them into the target system using **Writers**. 

## Semi-final note
This is the end of short path of tutorial around Keboola Connection. This represents the basic steps in 
operating KBC. You can:

- [return to the tutorial index](/overview/tutorial/) to see for additional steps 
- or take a brief sidestep showing how to setup [writer to GoodData BI](/overview/tutorial/write/gooddata/)
- or continue to [Setting up Automation](/overview/tutorial/automate/) 
- or [talk to us](/)
