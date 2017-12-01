---
title: Loading Data with Google Drive Extractor
permalink: /tutorial/load/googledrive/
---

In the [previous step](/tutorial/load/), you learned how to quickly load data into KBC using [manual import](/tutorial/load/).
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

Click on *New Configuration* and name the new configuration *User Levels*; the file we
want to extract contains the seniority level of each user.

{: .image-popup}
![Create Google Drive Configuration](/tutorial/load/extractor-google-drive-create.png)

Then authorize the extractor to access the spreadsheet by clicking the *Authorize Account* button.

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

First, you need to select a spreadsheet.

{: .image-popup}
![Screenshot - Google Drive Start Select](/tutorial/load/extractor-google-drive-select-2.png)

Find and select your spreadsheet document named *level*.

{: .image-popup}
![Google Drive Selected Document](/tutorial/load/extractor-google-drive-selected.png)

Then select the individual sheet. Our 'level' document contains only one 'level' sheet, so select that one.
It will appear on the right side of the screen as one of the *Selected sheets to be added to the project*.

{: .image-popup}
![Google Drive Selected Documents](/tutorial/load/extractor-google-drive-select-sheets.png)

When you *Create Sheet*, you should obtain a result like the one below. Then, click on the *Run Extraction* command on the right.
This will create a background job extracting the selected sheet from the Google Drive document
and loading it into Storage.

When a job is running, a small orange circle appears under *Last runs*, along with RunId and other info on the job.
Green is for success, red for failure. Click on the indicator, or the info next to it for more details.

{: .image-popup}
![Google Drive Results](/tutorial/load/extractor-google-drive-result.png)

The extractor automatically creates an output bucket and a table; here it is
`in.c-keboola-ex-google-drive-334272278.level-level`. Click on the name of the output table to check its contents.

{: .image-popup}
![Google Drive Result Table Detail](/tutorial/load/extractor-google-drive-table-detail.png)

Continue with the [rest of the tutorial](/tutorial/manipulate/), or take a side step
to configure a [database extractor](/tutorial/load/database/).
