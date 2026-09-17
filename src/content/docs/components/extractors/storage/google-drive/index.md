---
title: 'Google Sheets'
slug: 'components/extractors/storage/google-drive'
description: 'Load tables from Google Sheets spreadsheets you own, using an authorized Google account.'
redirect_from:
    - /extractors/storage/google-drive/
    - /tutorial/load/googlesheets/
    - /getting-started/load/googlesheets/
---

This data source connector loads sheets from Google Sheets spreadsheets and stores them as tables
in your project's Storage. The component is `keboola.ex-google-drive`, and the UI lists it as
**Google Sheets — Data Source**. Unlike the
[HTTP connector](/components/extractors/storage/http/), which downloads from a public URL, this one
reads spreadsheets you own, so it needs an authorized Google account.

Spreadsheets are commonly used for sharing small reference tables between organizations. The
walkthrough below uses a sample table so you can try the connector end to end: create a Google
spreadsheet from the [level.csv](/getting-started/level.csv) file, then imagine someone shared that
*level* table with you.

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

**Check:** a new table with 28 rows, as in [step 12](#configuration).
Watch the wording — the *spreadsheet* is the file in Drive (step 9), the *sheet* is the tab inside
it (step 10).
:::

## Prepare
Go to [Google Spreadsheets](https://www.google.com/sheets/about/) and start a new blank spreadsheet. Then go to
*File* – *Import* and upload the [level.csv](/getting-started/level.csv) file.

![Google Spreadsheets Screenshot](/components/extractors/storage/google-drive/google-sheets-spreadsheet.png)

## Configuration
1. Navigate to **Components** section in Keboola and click the **Add Component** button:

![Data Source Overview Screenshot](/components/extractors/storage/google-drive/source-intro-0.png)

2. Utilize the search box to locate the *Google Sheets data source connector*. Once found, click on it.

![Data Source Overview Screenshot](/components/extractors/storage/google-drive/source-intro.png)

3. Click **Connect To My Data**. The 'Use With Demo Data' option will extract datasets prepared by Keboola for your experimentation outside of this guide, and it can be found across all commonly used connectors.

4. Enter a name and description and click **Create Configuration**. 

![Create Google Sheets Configuration](/components/extractors/storage/google-drive/google-sheets-create.png)

   Each Keboola component (data source, data destination, or application) can support multiple [*configurations*](/components/).
   This concept enables you to, for instance, extract data from multiple Google accounts.

5. Authorize the connector to access the spreadsheet by clicking the **Sign in with Google** button.
  
![Sign in with Google](/components/extractors/storage/google-drive/sign-in-with-google.png)
  
6. On the following screen, click **Allow**.

![Access Google Account](/components/extractors/storage/google-drive/allow.png)

7. Now you want to select the Google Drive files to import.

![Select Google Drive Files](/components/extractors/storage/google-drive/select-files.png)

8. In step 5, you authorized Keboola to use your account to access the Drive. In this step, you will be asked to grant access specifically to spreadsheets.
Click **'Select all'** and then proceed by clicking **'Continue'** on the following screen.

![Get Access to Spreadsheets](/components/extractors/storage/google-drive/access-to-spreadsheets.png)

9. Use the search box to find your **Level** spreadsheet. Select it and click the **Select** button.

![Find Spreadsheet](/components/extractors/storage/google-drive/find-spreadsheet.png)

10. Keboola has automatically detected all sheets from within your spreadsheet and will now allow you to select the one you want to load.
11. Select the sheet and click **Save and Run Configuration**. A job will be executed, and once completed, you will see a new table created. 

![Save and Run Configuration](/components/extractors/storage/google-drive/save-and-run.png)

12. The Google Sheets data source automatically generates an output bucket and table. Click on the name of the output table to check its contents,
or navigate directly to the **Storage** section to explore the data.

![Go to Storage](/components/extractors/storage/google-drive/storage.png)

## Modify Configuration
When a sheet is added to the connector, it is displayed in the list of extracted sheets:

![Screenshot - Sheet list](/components/extractors/storage/google-drive/google-drive-4.png)

Configured tables are stored as [configuration rows](/components/#configuration-rows).
The list shows the name (and the link) of the imported document and sheet, and also the name of the destination
table in [Storage](/storage/). You can modify the destination table name by editing the sheet extraction.

## Going further

- [Google Sheets data destination connector](/components/writers/storage/google-sheets/) — writing
  a Storage table back out into a spreadsheet.
- [Get Your Data In](/getting-started/load/) — the Getting Started step this walkthrough used to be
  a side trip from.
