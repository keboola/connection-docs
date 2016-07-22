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
Note: All characters appearing in this data are fictitious.
Any resemblance to real persons, living or dead or undead or unborn or otherwise semi-existent is purely coincidental.

In the
[*Storage Console*](/storage/), there is a tab called *Tables* listing all database tables stored in your project.
The tables are grouped together into *Buckets*.
There are two buckets, `in.c-main` and `out.c-main`, ready for you.
However, for the purposes of this tutorial, let's create new ones.
Click the plus button to create your first bucket.

{: .image-popup}
![Screenshot -- Create Bucket](/overview/tutorial/load/create-bucket.png)

Name your bucket *tutorial*; entering a description is optional.
Then select the *in*put *Stage* which is used for loading outside data into KBC.
The distinction between the input and output stage is purely conventional differentiation between raw and processed data.
Finish by selecting *Backend* that refers to the [backend](/storage/) database storing your data.
For now, let's use MySQL.

After that prepare your second tutorial bucket, this time in the *out*put stage; it is used for data ready to be written into external systems.
Now you have two buckets: `in.c-tutorial` and `out.c-tutorial`.

*Please note that creating a bucket beforehand is not required. You can load a CSV file into a bucket and table that do not yet exist.* 

To manually load data, go to the **Extractors** section and find **CSV Import**:

{: .image-popup}
![Screenshot -- CSV Import](/overview/tutorial/load/intro-screen.png)

Click on the More button and you'll see **CSV Import** details. Here you can store predefined import configurations. 
Each configuration will point to a different table and will allow you to reuse it quickly later.

{: .image-popup}
![Screenshot -- CSV Import](/overview/tutorial/load/csv-import-empty-list.png)

Now you need a CSV file. For our tutorial, we have prepared four sample tables:

- opportunity (business opportunities) -- [https://help.keboola.com/overview/tutorial/opportunity.csv](/overview/tutorial/opportunity.csv)
- account (associated accounts) -- [https://help.keboola.com/overview/tutorial/account.csv](/overview/tutorial/account.csv)
- user (associated users) -- [https://help.keboola.com/overview/tutorial/user.csv](/overview/tutorial/user.csv)
- level (company levels) -- [https://help.keboola.com/overview/tutorial/level.csv](/overview/tutorial/level.csv)

Download the files to your computer (they are very small) and you're ready to start loading data.

{: .image-popup}
![Screenshot -- CSV Import Configuration](/overview/tutorial/load/csv-import-default-configuration.png)


To create a configuration click on the *Create New Configuration* button. You will be asked to name the configuration, 
we'll be creating configuration for each file, so let's name the first one `Opportunity`. You'll be immediately redirected to the configuration detail. 

{: .image-popup}
![Screenshot -- Change upload settings](/overview/tutorial/load/csv-import-change-settings.png)

You could start uploading right now, but we want to use a different bucket than the default provided. 
Click on the *Change Settings* link and type `in.c-tutorial.opportunity` in the *Destination* field (you need to click add option below the text input after typing). 
Click on *Save Settings* to confirm the change.

{: .image-popup}
![Screenshot -- Upload CSV file](/overview/tutorial/load/csv-import-upload.png)


Now you can start uploading. Select the downloaded `opportunity.csv` file from your computer and hit the *Upload* button. Once this is finished (you'll get a notification) repeat the process for the other 3 tables.

That's it. You should now have four tables with sample data stored in your KBC project.

You can now take

- the next step -- [Data Manipulation](/overview/tutorial/manipulate/), or
- a brief side step to [Loading data with GoogleDrive Extractor](/overview/tutorial/load/googledrive/), or
- a brief side step to [Loading data with Database Extractor](/overview/tutorial/load/database/).
