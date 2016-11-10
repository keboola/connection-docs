---
title: Loading Data with GoogleDrive Extractor
permalink: /tutorial/load/googledrive/
---

In the [previous step](/tutorial/load/), you learned how to quickly load data into KBC using manual import.
In real production projects, this is seldom used as most of the data is obtained automatically using *extractors*.
In this part of the tutorial, you will use a Google Drive extractor to load data from an external data sheet.

* TOC
{:toc}

Google Drive is a common method for sharing small reference tables between different organizations.
For our purposes, create a Google spreadsheet from the [level.csv](/tutorial/level.csv) file.
Let's pretend someone shared the *level* table with you through Google Drive.

## Prepare
Go to [Google Spreadsheets](https://docs.google.com/spreadsheets/) and *Start a new Blank Spreadsheet*. Then go to
*File* - *Open* and Upload the [level.csv](/tutorial/level.csv) file.

{: .image-popup}
![Google Spreadsheets Screenshot](/tutorial/load/google-drive-spreadsheet.png)


## Configure Google Drive Extractor

Go to *Extractors* in KBC and click the *New extractor* button:

{: .image-popup}
![Extractors Overview Screenshot](/tutorial/load/extractor-intro-0.png)

Use the search box to find the *Google Drive* extractor. 

{: .image-popup}
![Extractors Overview Screenshot](/tutorial/load/extractor-intro.png)

Each KBC extractor can have multiple *configurations*. This concept allows you to extract data from, for example,
multiple Google accounts. So far, there are no configurations of the Google Drive Extractor.

Click on *Create New Configuration* and name the new configuration *User Levels*; the file we
want to extract contains the seniority level of each user.

{: .image-popup}
![Create Google Drive Configuration](/tutorial/load/extractor-google-drive-create.png)

Then authorize the extractor to access the spreadsheet by clicking the *Authorize Google Account* button.

{: .image-popup}
![Google Drive Configuration Start](/tutorial/load/extractor-google-drive-intro.png)

There are two basic authorization options: *Instant Authorization* and *External Authorization*. The latter is
useful when someone wants to share their document with you without sharing their account directly.
Use *Instant Authorization* now.

{: .image-popup}
![Google Drive Authorization Start](/tutorial/load/extractor-google-drive-authorize.png)

On the following screen, click *Allow*.

{: .image-popup}
![Google Drive Authorization End](/tutorial/load/extractor-google-drive-authorize-2.png)

Now you want to select the Google Drive files to import.

{: .image-popup}
![Screenshot - Google Drive Start Select](/tutorial/load/extractor-google-drive-select.png)

To select the files you want to import into the authorized extractor, you need to temporarily elevate the
authorization so that the extractor can access your sheets.

{: .image-popup}
![Screenshot - Google Drive Start Select](/tutorial/load/extractor-google-drive-select-2.png)

On the following screen, click *Allow*.

{: .image-popup}
![Screenshot - Google Drive Authorize](/tutorial/load/extractor-google-drive-select-3.png)

Find and select your spreadsheet document named *level*.

{: .image-popup}
![Google Drive Selected Document](/tutorial/load/extractor-google-drive-selected.png)

Then select the individual sheet. Our 'level' document contains only one 'level' sheet, so select that one.
It will appear on the right side of the screen as one of the *Sheets to Be Added to Project*.

{: .image-popup}
![Google Drive Selected Documents](/tutorial/load/extractor-google-drive-select-sheets.png)

When you *Save changes*, you should obtain a result like the one below. Then, click on the *Run Extraction* command on the right.
This will create a background job extracting the selected sheet from the Google Drive document
and loading it into Storage.

When a job is running, a small orange circle appears under *Last runs*, along with RunId and other info on the job.
Green is for success, red for failure. Click on the indicator, or the info next to it for more details.

{: .image-popup}
![Google Drive Results](/tutorial/load/extractor-google-drive-result.png)

The extractor automatically creates an output bucket and a table; here it is
`in.c-keboola-ex-google-drive-user-levels-11.level-level`. Click on the name of the output table to check its contents.

{: .image-popup}
![Google Drive Result Table Detail](/tutorial/load/extractor-google-drive-table-detail.png)

## Aftermath

This concludes our example setup of the Google Drive extractor.

If you want to use the table created in this side-step in the rest of the tutorial, you have two options:

1. Replace `in.c-tutorial.level` with `in.c-ex-google-drive-userlevels.0-level` in the following steps of the tutorial.
2. Ensure this table is accessible under the `in.c-tutorial.level` name using an alias table, as described below.

### Creating an Alias Table

First, go to Storage and delete the table `in.c-tutorial.level` you manually loaded in the first part of the tutorial.

{: .image-popup}
![Storage Delete Table Screenshot](/tutorial/load/storage-delete-table.png)

Then create a new *Alias Table*. It behaves like a [Database View](https://en.wikipedia.org/wiki/View_(SQL))
as it does not contain any data. It is simply a link to already existing data.

{: .image-popup}
![Storage Delete Table Create Alias Screenshot](/tutorial/load/storage-create-alias.png)

In the configuration popup, select the `in.c-keboola-ex-google-drive-user-level-11.level-level` table as
the *Source Table* and write `level` as the alias *Name*.

{: .image-popup}
![Storage Delete Table Create Alias configuration Screenshot](/tutorial/load/storage-create-alias-2.png)

Continue with the [rest of the tutorial](/tutorial/manipulate/), or take a side step
to configure a [database extractor](/tutorial/load/database/).

