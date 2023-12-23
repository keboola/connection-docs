---
title: Loading Data
permalink: /tutorial/load/
---

* TOC
{:toc}

Keboola offers various methods to load data, providing flexibility to suit different project stages. When initiating a project or conducting a Proof of Concept 
(POC), the quickest approach is typically **manual data loading**. As the project advances to production, you may transition to **automatic data loading** using 
data sources connectors. 

In our tutorial, we demonstrate manual loading, and as you progress, we delve into automated data loading using connectors, specifically the Google Sheets 
and Database data source connectors.

## Manual Data Loading
### Get Ready
In this section of the tutorial, you will load four tables into the Keboola Storage. These tables represent business opportunities, associated users and accounts, and specified company levels for each user. The tables are available as CSV files for download:

- [Opportunity (business opportunities)](/tutorial/opportunity.csv)
- [Account (associated accounts)](/tutorial/account.csv)
- [User (associated users)](/tutorial/user.csv)
- [Level (company levels)](/tutorial/level.csv)

Download these small files to your computer and proceed with loading the data.

***Note:** All characters in this data are fictitious, and any resemblance to real persons, living, dead, undead, unborn, or otherwise semi-existent 
is purely coincidental.*

### Steps to Follow
1. Before proceeding, ensure you are logged into your Keboola project (refer to the tutorial [Prerequisites](/tutorial/#prerequisites) 
if you need to acquire a project).

2. Navigate to the **Components** section and use the search box to find **CSV Import**.

   {: .image-popup}
   ![Screenshot -- Extractors](/tutorial/load/picture1.png)

3. Click the**Add Component** button, then select **Connect To My Data**.

   {: .image-popup}
   ![Screenshot -- Extractors](/tutorial/load/picture2.png)

4. Enter a **name and description** for your configuration, and click **Create Configuration**.
   
   {: .image-popup}
   ![Screenshot -- CSV Import Intro](/tutorial/load/picture3.png)

   ***Note:** You can create multiple configurations for each connector, and maintaining clear naming conventions contributes to a clean and organized project. 
   Check our [best practices guide](/tutorial/onboarding/cheat-sheet/) for suggestions on this topic.*

   Adding a description is a beneficial practice for both you and your colleagues, aiding in understanding the purpose of your configuration."

   In this tutorial, we will create four configurations for this data source connector, dedicating one configuration to each source CSV file.

   Name the first configuration **[TUTORIAL] Opportunity**.

5. In the **CSV File** section, click **Select file** and choose the [opportunity.csv](/tutorial/opportunity.csv) file you downloaded.
   
   {: .image-popup}
   ![Screenshot -- CSV New Configuration](/tutorial/load/picture4.png)

6. In the **Upload Settings** section, modify the *Destination* setting by clicking the **pen icon** next to the *Destination* name. Set the name of the table that will be created in your Keboola Storage to `in.c-csv-import.opportunity` and click **Save**.

   {: .image-popup}
   ![Screenshot -- CSV Import Configuration](/tutorial/load/picture5.png)

7. Click **Upload**.

   {: .image-popup}
   ![Screenshot -- Change upload settings](/tutorial/load/picture6.png)

After the upload is complete, repeat the process for the remaining three tables—create a configuration, change the destination, 
and upload the respective file as requested.

That's it. You should now have four tables containing sample data stored in your Keboola Storage:

- `in.c-csv-import.opportunity`
- `in.c-csv-import.account`
- `in.c-csv-import.user`
- `in.c-csv-import.level`

To confirm the successful loading of all tables and review the data, navigate to the [Storage](/storage/) section. Data is organized into **buckets**, 
and each bucket can contain multiple **tables**.

Expand each bucket to view its tables, and click a table name to access details, including the 'Data Sample' for that table.

{: .image-popup}
![Screenshot -- Upload CSV file progress](/tutorial/load/picture7.png)

{: .image-popup}
![Screenshot -- Storage preview](/tutorial/load/picture8.png)

## What’s Next
Proceed to [Data Manipulation](/tutorial/manipulate/) for the next step in the tutorial. Alternatively, take a brief side step to explore 
[Loading Data with Google Sheets Data Source Connector](/tutorial/load/googlesheets/) 
and/or [Loading Data with Database Data Source Connector](/tutorial/load/database/). 

## If You Need Help
Feel free to reach out to our [support team](support@keboola.com) if there’s anything we can help with.
