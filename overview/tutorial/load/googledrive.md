---
title: Part 1b - Loading Data with GoogleDrive Extractor
permalink: /overview/tutorial/load/googledrive/
---

In the [previous step](/overview/tutorial/load/), you learned how to quickly load data into KBC using manual import.
In real production projects, this is seldom used as most of the data is obtained automatically using *extractors*.
In this part of the tutorial, you will use a Google Drive extractor to load data from an external data sheet.

Google Drive is a common method for sharing small reference tables between different organizations.
For our purposes, create a Google spreadsheet from the [level.csv](/overview/tutorial/level.csv) file.
Let's pretend someone shared the *level* table with you through Google Drive.

## Prepare
Go to [Google Spreadsheets](https://docs.google.com/spreadsheets/) and *Start a new Blank Spreadsheet*. Then go to
*File* - *Open* and Upload the [level.csv](/overview/tutorial/level.csv) file.

{: .image-popup}
![Google Spreadsheets Screenshot](/overview/tutorial/load/google-drive-spreadsheet.png)


## Configure the GoogleDrive Extractor

Go to *Extractors* in KBC and use the search box to find the *Google Drive* extractor. If your favorite app is not listed, it
certainly does **not** mean that we can't extract data from it.

{: .image-popup}
![Extractors Overview Screenshot](/overview/tutorial/load/extractor-intro.png)

Each KBC extractor can have multiple *configurations*. This concept allows you to extract data from, for example,
multiple Google accounts. So far, there are no configurations of the Google Drive Extractor.
Click on *Create New Configuration* and name the new configuration *User Levels*; the file we
want to extract contains seniority level of each user.

{: .image-popup}
![Create Google Drive Configuration](/overview/tutorial/load/extractor-google-drive-create.png)

Then authorize the extractor to access the spreadsheet by clicking the *Authorize Google Account* button.

{: .image-popup}
![Google Drive Configuration Start](/overview/tutorial/load/extractor-google-drive-intro.png)

There are two basic authorization options: *Instant Authorization* and *External Authorization*. The latter is
useful when someone wants to share their document with you without sharing their account directly.
Use *Instant Authorization* now.

{: .image-popup}
![Google Drive Authorization Start](/overview/tutorial/load/extractor-google-drive-authorize.png)

On the following screen, click *Allow*.

{: .image-popup}
![Google Drive Authorization End](/overview/tutorial/load/extractor-google-drive-authorize-2.png)

Now select the files you want to import into the authorized extractor.

{: .image-popup}
![Google Drive Select Documents](/overview/tutorial/load/extractor-google-drive-select.png)

Find and select your spreadsheet document named *level*.

{: .image-popup}
![Google Drive Selected Document](/overview/tutorial/load/extractor-google-drive-selected.png)

Then select the individual sheet. Click on the 'level' bar below the sheet search box.
Our 'level' document contains only one 'level' sheet, so select that one.
It will appear on the right side of the screen as one of the *Sheets to Be Added to Project*.

{: .image-popup}
![Google Drive Selected Documents](/overview/tutorial/load/extractor-google-drive-select-sheets.png)

Save the configuration by clicking the *Save* button in the upper right corner of the screen.
You should obtain a result like the one below. Then, click on the *Run Extraction* command on the right.
This will create a background job extracting the selected sheet from the Google Drive document
and loading it into Storage. 

When a job is running, a small orange circle appears under *Last runs*, along with RunId and other info on the job. 
Green is for success, red for failure. Click on the indicator, or the info next to it for more details.

{: .image-popup}
![Google Drive Results](/overview/tutorial/load/extractor-google-drive-result.png)

The Extractor automatically creates an output bucket and table - here it is
`in.c-ex-google-drive-userlevels.0-level`. Click on the name of the output table to check its contents.

{: .image-popup}
![Google Drive Result Table Detail](/overview/tutorial/load/extractor-google-drive-table-detail.png)


To be consistent with the rest of this tutorial and with what
you have done in its [previous step](/overview/tutorial/load/),
we would like the result table of the extractor to be `in.c-tutorial.level`.


This concludes our example setup of a Google Drive Extractor. To be consistent with the rest of this tutorial and with what
you have done in its [previous step](/overview/tutorial/load/),
we would like the result table of the extractor to be `in.c-tutorial.level`.

This step is not at all technically necessary, you can replace `in.c-tutorial.level` with
`in.c-ex-google-drive-userlevels.0-level` in the following examples, or you can go
to Storage and delete the table `in.c-tutorial.level`

## Aftermath

This concludes our example setup of a Google Drive Extractor.

If you want to use the table created in this side-step in the rest of the tutorial, you have two options:

1. Replace `in.c-tutorial.level` with `in.c-ex-google-drive-userlevels.0-level` in the following steps.
2. Ensure this table is accessible under the `in.c-tutorial.level` name using an alias table, as described below.

#### Creating an Alias Table

First, go to Storage and delete the table `in.c-tutorial.level` you manually loaded in the first part of the tutorial.

{: .image-popup}
![Storage Delete Table Screenshot](/overview/tutorial/load/storage-delete-table.png)

Then create a new *Alias Table*. It behaves like a [Database View](https://en.wikipedia.org/wiki/View_(SQL))
as it does not contain any data. It is simply a link to already existing data.

{: .image-popup}
![Storage Delete Table Create Alias Screenshot](/overview/tutorial/load/storage-create-alias.png)

In the configuration popup, select the `in.c-ex-google-drive-userlevels.0-level` table as
the *Source Table* and write `level` as the alias *Name*.

{: .image-popup}
![Storage Delete Table Create Alias configuration Screenshot](/overview/tutorial/load/storage-create-alias-2.png)

Continue with the [rest of the tutorial](/overview/tutorial/manipulate/), or take a side step
to configure a [database extractor](/overview/tutorial/load/database/).

