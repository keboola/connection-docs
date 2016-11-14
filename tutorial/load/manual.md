---
title: Loading Data
permalink: /tutorial/load/
---
There are multiple ways to load data into KBC. When you are starting with a project or doing any kind of 
[POC](https://en.wikipedia.org/wiki/Proof_of_concept), it is usually fastest to **load data manually**. 
If everything goes well and the project goes to production, you will later switch to **automatic
data loading** using [extractors](/extractors/); in our tutorial, you can load data with 
the [GoogleDrive](/tutorial/load/googledrive/) and [Database extractors](/tutorial/load/database/).

## Manually Loading Data
In this part of our tutorial, you will load four tables into KBC Storage.
The tables represent business opportunities, their associated users and accounts.
Additionally, company levels for each user are specified.
For our tutorial, we have prepared the tables as CSV files:

- opportunity (business opportunities) --- [https://help.keboola.com/tutorial/opportunity.csv](/tutorial/opportunity.csv)
- account (associated accounts) --- [https://help.keboola.com/tutorial/account.csv](/tutorial/account.csv)
- user (associated users) --- [https://help.keboola.com/tutorial/user.csv](/tutorial/user.csv)
- level (company levels) --- [https://help.keboola.com/tutorial/level.csv](/tutorial/level.csv)

Download the files to your computer (they are very small) and start loading data.

**Important**: All characters appearing in this data are fictitious.
Any resemblance to real persons, living or dead or undead or unborn or otherwise semi-existent is purely coincidental.

To manually load data, go to the **Extractors** section and use the search box to find **CSV Import**:

{: .image-popup}
![Screenshot -- Extractors](/tutorial/load/extractor-intro-1.png)

Click on the *More* button to see **CSV Import** details. Here you can store predefined import configurations.
Each KBC extractor can have multiple *configurations*. This concept allows you to extract data from multiple sources
of the same type. Each configuration of **CSV Import** will point to a different table and will allow you to reuse it quickly later.

{: .image-popup}
![Screenshot -- CSV Import Intro](/tutorial/load/csv-import-empty-list.png)

Click on *Create new Configuration* to continue.

{: .image-popup}
![Screenshot -- CSV New Configuration](/tutorial/load/csv-import-create-new-configuration.png)

You will be creating configuration for each table, so let's name the first one *Opportunity* and click on *Create*. 
Each created configuration is filled with defaults; for example, *CSV format* and *destination* name of the table in
[KBC Storage](/storage/). For this tutorial, change only the *Destination* setting by clicking on *Change settings*.

{: .image-popup}
![Screenshot -- CSV Import Configuration](/tutorial/load/csv-import-default-configuration.png)

Now type `in.c-tutorial.opportunity` in the *Destination* field and click on *Save Settings*.

{: .image-popup}
![Screenshot -- Change upload settings](/tutorial/load/csv-import-change-settings.png)

Now you can start uploading. Select the downloaded `opportunity.csv` file from your computer and hit the *Upload* button.

{: .image-popup}
![Screenshot -- Upload CSV file](/tutorial/load/csv-import-upload-before.png)

Once the upload is finished (you will get a notification), go back to the *CSV import* (you can use navigation on the top) and
repeat the process for the other three tables (create configuration, change destination, upload file).

{: .image-popup}
![Screenshot -- Upload CSV file progress](/tutorial/load/csv-import-upload.png)
	
That's it. You should now have four tables with sample data stored in your KBC project:

- `in.c-tutorial.opportunity`
- `in.c-tutorial.account`
- `in.c-tutorial.user`
- `in.c-tutorial.level`

To verify that you have loaded all the tables and to peek at the data, go to [*Storage Console*](/storage/).
All database tables stored in your project are listed in the *Tables* tab. 
They are grouped together into *Buckets*, and the newly loaded tables can be found in the `in.c-tutorial` bucket. 
To see all tables in a bucket, click the arrow next to its name.
Click a table name to see table details including *Data Sample*.

{: .image-popup}
![Screenshot -- Storage preview](/tutorial/load/csv-import-storage.png)

You can now take

- the next step --- [Data Manipulation](/tutorial/manipulate/), or
- a brief side step to [Loading data with GoogleDrive Extractor](/tutorial/load/googledrive/), or
- a brief side step to [Loading data with Database Extractor](/tutorial/load/database/).
