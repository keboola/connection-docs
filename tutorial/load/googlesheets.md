---
title: Loading Data with Google Sheets Data Source Connector
permalink: /tutorial/load/googlesheets/
---

In the [previous step](/tutorial/load/), you learned how to quickly load data into Keboola using [manual import](/tutorial/load/).
However, in real production projects, this is seldom used as most data is obtained automatically using data source connectors.
In this part of the tutorial, you will use a Google Sheets data source connector to load data from an external spreadsheet.

* TOC
{:toc}

Google Drive is a common method for sharing small reference tables between different organizations.
For our purposes, create a Google spreadsheet from the [level.csv](/tutorial/level.csv) file.
Imagine someone shared the *level* table with you through Google Drive.

## Prepare
Go to [Google Spreadsheets](https://www.google.com/sheets/about/) and start a new blank spreadsheet. Then go to
*File* – *Import* and upload the [level.csv](/tutorial/level.csv) file.

{: .image-popup}
![Google Spreadsheets Screenshot](/tutorial/load/google-sheets-spreadsheet.png)

## Configure Google Sheets Data Source Connector
1. Navigate to **Components** section in Keboola and click the **Add Component** button:

{: .image-popup}
![Data Source Overview Screenshot](/tutorial/load/source-intro-0.png)

2. Utilize the search box to locate the *Google Sheets data source connector*. Once found, click on it.

{: .image-popup}
![Data Source Overview Screenshot](/tutorial/load/source-intro.png)

3. Click **Connect To My Data**. The 'Use With Demo Data' option will extract datasets prepared by Keboola for your experimentation outside of this tutorial, and it can be found across all commonly used connectors.
4. Enter a name and description and click **Create Configuration**. 

{: .image-popup}
![Create Google Sheets Configuration](/tutorial/load/google-sheets-create.png)

Each Keboola component (data source, data destination, or application) can support multiple [*configurations*](/components/).
This concept enables you to, for instance, extract data from multiple Google accounts.

5. Authorize the connector to access the spreadsheet by clicking the **Sign in with Google** button.
  
{: .image-popup}
![Sign in with Google](/tutorial/load/sign-in-with-google.png)
  
6. On the following screen, click **Allow**.

{: .image-popup}
![Access Google Account](/tutorial/load/allow.png)

 7. Now you want to select the Google Drive files to import.

{: .image-popup}
![Select Google Drive Files](/tutorial/load/select-files.png)

8. In step 5, you authorized Keboola to use your account to access the Drive. In this step, you will be asked to grant access specifically to spreadsheets.
Click **'Select all'** and then proceed by clicking **'Continue'** on the following screen.

{: .image-popup}
![Get Access to Spreadsheets](/tutorial/load/access-to-spreadsheets.png)

9. Use the search box to find your **Level** spreadsheet. Select it and click the **Select** button.

{: .image-popup}
![Find Spreadsheet](/tutorial/load/find-spreadsheet.png)

10. Keboola has automatically detected all sheets from within your spreadsheet and will now allow you to select the one you want to load.
11. Select the sheet and click **Save and Run Configuration**. A job will be executed, and once completed, you will see a new table created. 

{: .image-popup}
![Save and Run Configuration](/tutorial/load/save-and-run.png)

12. The Google Sheets data source automatically generates an output bucket and table. Click on the name of the output table to check its contents,
or navigate directly to the **Storage** section to explore the data.

{: .image-popup}
![Go to Storage](/tutorial/load/storage.png)

## What’s Next
Proceed to [Data Manipulation](/tutorial/manipulate/) for the next step in the tutorial. 
Alternatively, take another brief side step to explore loading data with the [Database data source connector](/tutorial/load/database/).

## If You Need Help
Feel free to reach out to our Support team [LINK] if there’s anything we can help with.
