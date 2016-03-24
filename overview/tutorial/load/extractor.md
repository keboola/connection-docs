---
title: Part 1b - Loading data with Extractor
permalink: /overview/tutorial/load/extractor/
---

In the [previous step](/overview/tutorial/load/) you learned, how to quickly load data into
KBC using manual import. In real production projects, this is seldom used as most of the data are 
obtained automatically using *extractors*. In this tutorial, you will use a Google Drive extractor to 
load data from an external data sheet.

Google Drive is a common method for sharing small reference tables between different organizations. Lets 
assume that someone shared a *usergoals* table with you through Google Drive. Well, because no one actually did
you have to pretend it and create a Google spreadsheet from [usergoal.csv](/overview/tutorial/usergoal.csv) file.

## Prepare
Go to [Google Spreadsheets](https://docs.google.com/spreadsheets) and *Start a new Blank Spreadsheet*. Then go to
*File* - *Open* and Upload the [usergoal.csv](/overview/tutorial/usergoal.csv) file.

{: .image-popup}
![Google Spreadsheets Screenshot](/overview/tutorial/load/google-drive-spreadsheet.png)


## Configure the KBC Extractor

Go to *Extractors* in KBC and find *Google Drive* extractor. You can see that there are plenty of prepared 
extractors, so it's a good idea to use the search box. Also note that if your favorite app is not listed, it
certainly does **not** mean that we can't extract data from it.

{: .image-popup}
![Extractors Overview Screenshot](/overview/tutorial/load/extractor-intro.png)

Each KBC extractor can have multiple *configurations*. This concept allows you to extract data from e.g. 
multiple Google accounts. So far, there are no configurations of the Google Drive Extractor, so click
on *Create New Configuration*. Lets name the configuration *Social media followers* because the the file we 
want to extract contains goals for number of followers for each user.

{: .image-popup}
![Create Google Drive Configuration](/overview/tutorial/load/extractor-google-drive-create.png)

Once the configuration is created, you can't do much unless you authorize the extractor to access the 
spreadsheet. 

{: .image-popup}
![Google Drive Configuration Start](/overview/tutorial/load/extractor-google-drive-intro.png)

Click the *Authorize Google Account* button.

{: .image-popup}
![Google Drive Authorization Start](/overview/tutorial/load/extractor-google-drive-authorize.png)

There are two basic options *Instant Authorization* and *External Authorization*. The latter is
useful when someone wants to share his document with you, but does not want to share his account with
you directly. At this moment, you can use *Instant Authorization*:

{: .image-popup}
![Google Drive Authorization End](/overview/tutorial/load/extractor-google-drive-authorize-2.png)

When the extractor is authorized, you can proceed with selecting the files you want to import.

{: .image-popup}
![Google Drive Select Documents](/overview/tutorial/load/extractor-google-drive-select.png)

Find the spreadsheet named *usergoal* (or whatever you named it)

{: .image-popup}
![Google Drive Selected Document](/overview/tutorial/load/extractor-google-drive-selected.png)
 
Once the spreadsheet documents are selected, you need to select individual spreadsheets.  
Our document 'usergoal' contains only a single sheet 'usergoal', so select that one.

{: .image-popup}
![Google Drive Selected Documents](/overview/tutorial/load/extractor-google-drive-select-sheets.png) 

Save the configuration and you should obtain a result like the one below. You can then *Run Extraction*.
This will create an asynchronous job which will extract the selected sheet from the Google Drive document
and then it will load it into the Storage.

{: .image-popup}
![Google Drive Results](/overview/tutorial/load/extractor-google-drive-result.png) 

The Extractor automatically creates the output bucket and table - here it is 
`in.c-ex-google-drive-socialmediafollowers.0-usergoal`. You can check the contents of the table 
by clicking on its name (after the job has been finished).

{: .image-popup}
![Google Drive Result Table Detail](/overview/tutorial/load/extractor-google-drive-table-detail.png) 

## Aftermath
This concludes an example setup of a Google Drive Extractor. To be consistent with the rest of this tutorial, we
would like the result table of the extractor be `in.c-tutorial.usergoal` so as to be consistent with what 
you have done in the [previous step](/overview/tutorial/load/) of this tutorial.

This step is not at all necessary, you can replace `in.c-tutorial.usergoal` with
`in.c-ex-google-drive-socialmediafollowers.0-usergoal` in the following examples, or you can go
to Storage and delete the table `in.c-tutorial.usergoal`

{: .image-popup}
![Storage Delete Table Screenshot](/overview/tutorial/load/extractor-delete-table.png) 

Then create a new *Alias Table*. An alias table behaves like a [Database View](https://en.wikipedia.org/wiki/View_(SQL))
- it does not contain any data, it is simply a link to some existing data.

{: .image-popup}
![Storage Delete Table Create Alias Screenshot](/overview/tutorial/load/storage-create-alias.png) 

In the configuration popup, select the table `in.c-ex-google-drive-socialmediafollowers.0-usergoal` as 
a *Source Table* and write `usergoal` as the alias *Name*. 

{: .image-popup}
![Storage Delete Table Create Alias configuration Screenshot](/overview/tutorial/load/storage-create-alias-2.png) 

You can now continue with the [rest of the tutorial](/overview/tutorial/manipulate/)

