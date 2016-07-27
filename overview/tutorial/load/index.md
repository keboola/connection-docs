---
title: Part 1 - Manually Loading Data
permalink: /overview/tutorial/load/
---

There are multiple ways to load data into KBC. When you are starting with a project or doing any kind of
[POC](https://en.wikipedia.org/wiki/Proof_of_concept), it is usually fastest to load data manually.
If everything goes well and the project goes to production, you will later switch to automatic
data loading using extractors.

In this part of our tutorial, you will load four tables into KBC Storage.
The tables represent business opportunities, their associated users and accounts.
Additionally, company levels for each user are specified.
For our tutorial, we have prepared the tables as CSV files:

- opportunity (business opportunities) -- [https://help.keboola.com/overview/tutorial/opportunity.csv](/overview/tutorial/opportunity.csv)
- account (associated accounts) -- [https://help.keboola.com/overview/tutorial/account.csv](/overview/tutorial/account.csv)
- user (associated users) -- [https://help.keboola.com/overview/tutorial/user.csv](/overview/tutorial/user.csv)
- level (company levels) -- [https://help.keboola.com/overview/tutorial/level.csv](/overview/tutorial/level.csv)

Download the files to your computer (they are very small) and you're ready to start loading data.

Note: All characters appearing in this data are fictitious.
Any resemblance to real persons, living or dead or undead or unborn or otherwise semi-existent is purely coincidental.

To manually load data, go to the **Extractors** section and use the search box to find **CSV Import**:

{: .image-popup}
![Screenshot -- Extractors](/overview/tutorial/load/extractor-intro-1.png)

Click on the More button and you'll see **CSV Import** details. Here you can store predefined import configurations.
Each KBC extractor can have multiple *configurations*. This concept allows you to extract data from multiple sources
of the same type. Each configuration of **CSV Import** will point to a different table and will allow you to reuse it quickly later.

{: .image-popup}
![Screenshot -- CSV Import Intro](/overview/tutorial/load/csv-import-empty-list.png)

Click on *Create new Configuration* to continue.

{: .image-popup}
![Screenshot -- CSV New Configuration](/overview/tutorial/load/csv-import-create-new-configuration.png)

You need to name the configuration, you'll be creating configuration for each table, so let's name the first one *Opportunity*
and click on *Create*. When the configuration is created, it is filled with defaults - e.g. *CSV format* and *destination* name of the table in
[KBC Storage](/storage/). For this tutorial, you need to change the *Destination* setting. To change it, click on *Change settings*.

{: .image-popup}
![Screenshot -- CSV Import Configuration](/overview/tutorial/load/csv-import-default-configuration.png)

Now type `in.c-tutorial.opportunity` in the *Destination* field and click on *Save Settings* to confirm the change.
You don't need to change any other setting.

{: .image-popup}
![Screenshot -- Change upload settings](/overview/tutorial/load/csv-import-change-settings.png)

Now you can start uploading. Select the downloaded `opportunity.csv` file from your computer and hit the *Upload* button.

{: .image-popup}
![Screenshot -- Upload CSV file](/overview/tutorial/load/csv-import-upload-before.png)

Once the upload is finished (you'll get a notification) go back to the *CSV import* (you can use navigation on the top) and
repeat the process for the other 3 tables (create configuration, change destination, upload file).

{: .image-popup}
![Screenshot -- Upload CSV file progress](/overview/tutorial/load/csv-import-upload.png)

That's it. You should now have four tables with sample data stored in your KBC project:

- `in.c-tutorial.opportunity`
- `in.c-tutorial.account`
- `in.c-tutorial.user`
- `in.c-tutorial.level`

To verify that you loaded all the tables, and peek at the data, you can go to
[*Storage Console*](/storage/), there is a tab called *Tables* listing all database tables stored in your project.
The tables are grouped together into *Buckets*. The tables you just loaded are
contained in the bucket `in.c-tutorial`. Click the arrow next to bucket name to show tables in bucket.
Click a table name to see table details including *Data Sample*.

{: .image-popup}
![Screenshot -- Storage preview](/overview/tutorial/load/csv-import-storage.png)

You can now take

- the next step -- [Data Manipulation](/overview/tutorial/manipulate/), or
- a brief side step to [Loading data with GoogleDrive Extractor](/overview/tutorial/load/googledrive/), or
- a brief side step to [Loading data with Database Extractor](/overview/tutorial/load/database/).
