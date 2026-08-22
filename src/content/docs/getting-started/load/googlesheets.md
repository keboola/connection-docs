---
title: 'Load from Google Sheets'
slug: 'getting-started/load/googlesheets'
description: 'Load a table from an external spreadsheet using the Google Sheets data source connector, with an authorized account rather than a public URL.'
redirect_from:
  - /tutorial/load/googlesheets/
---

A side trip from [Get Your Data In](/getting-started/load/): the same kind of load, but from a spreadsheet you own — so the connector needs an authorized Google account instead of a public URL.



Google Drive is commonly used for sharing small reference tables between different organizations.
For our purposes, create a Google spreadsheet from the [level.csv](/getting-started/level.csv) file.
Imagine someone shared the *level* table with you through Google Drive.

:::tip[Do it with Kai — after you authorize]
Kai can create the configuration
([Integration Setup](/kai/use-cases/#integration-setup)). Open **Kai Agent** in the top bar:

```text
Create a Google Sheets data source configuration called "[TUTORIAL] Level from Sheets".
```

Then do **steps 5–9 yourself** — both happen inside Google, not Keboola: the authorization consent
screen, and the Drive picker where you choose the *spreadsheet* you made above. After step 9, hand
it back:

```text
In "[TUTORIAL] Level from Sheets", select the sheet inside that spreadsheet, run the
configuration, and tell me what table it created and how many rows it has.
```

**Check:** a new table with 28 rows, as in [step 12](#configure-google-sheets-data-source-connector).
Watch the wording — the *spreadsheet* is the file in Drive (step 9), the *sheet* is the tab inside
it (step 10).
:::

## Prepare
Go to [Google Spreadsheets](https://www.google.com/sheets/about/) and start a new blank spreadsheet. Then go to
*File* – *Import* and upload the [level.csv](/getting-started/level.csv) file.

![Google Spreadsheets Screenshot](/getting-started/load/google-sheets-spreadsheet.png)

## Configure Google Sheets Data Source Connector
1. Navigate to **Components** section in Keboola and click the **Add Component** button:

![Data Source Overview Screenshot](/getting-started/load/source-intro-0.png)

2. Utilize the search box to locate the *Google Sheets data source connector*. Once found, click on it.

![Data Source Overview Screenshot](/getting-started/load/source-intro.png)

3. Click **Connect To My Data**. The 'Use With Demo Data' option will extract datasets prepared by Keboola for your experimentation outside of this guide, and it can be found across all commonly used connectors.

4. Enter a name and description and click **Create Configuration**. 

![Create Google Sheets Configuration](/getting-started/load/google-sheets-create.png)

   Each Keboola component (data source, data destination, or application) can support multiple [*configurations*](/components/).
   This concept enables you to, for instance, extract data from multiple Google accounts.

5. Authorize the connector to access the spreadsheet by clicking the **Sign in with Google** button.
  
![Sign in with Google](/getting-started/load/sign-in-with-google.png)
  
6. On the following screen, click **Allow**.

![Access Google Account](/getting-started/load/allow.png)

7. Now you want to select the Google Drive files to import.

![Select Google Drive Files](/getting-started/load/select-files.png)

8. In step 5, you authorized Keboola to use your account to access the Drive. In this step, you will be asked to grant access specifically to spreadsheets.
Click **'Select all'** and then proceed by clicking **'Continue'** on the following screen.

![Get Access to Spreadsheets](/getting-started/load/access-to-spreadsheets.png)

9. Use the search box to find your **Level** spreadsheet. Select it and click the **Select** button.

![Find Spreadsheet](/getting-started/load/find-spreadsheet.png)

10. Keboola has automatically detected all sheets from within your spreadsheet and will now allow you to select the one you want to load.
11. Select the sheet and click **Save and Run Configuration**. A job will be executed, and once completed, you will see a new table created. 

![Save and Run Configuration](/getting-started/load/save-and-run.png)

12. The Google Sheets data source automatically generates an output bucket and table. Click on the name of the output table to check its contents,
or navigate directly to the **Storage** section to explore the data.

![Go to Storage](/getting-started/load/storage.png)

## Going further

Another side trip: load the same kind of data with the
[database data source connector](/getting-started/load/database/).

**Next:** [Transform your data →](/getting-started/transform/)
