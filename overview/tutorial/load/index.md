---
title: Part 1 -- Manually Loading Data 
permalink: /overview/tutorial/load/
---

There are multiple ways to load data into KBC. When you are starting with a project or doing any kind of 
[POC](https://en.wikipedia.org/wiki/Proof_of_concept), it is usually fastest to load data manually. 
If everything goes well and the project goes to production, you will later switch to automatic 
data loading using extractors. 

In this tutorial, you will load four tables into KBC Storage. 
The tables represent business opportunities, their associated users and accounts. 
Additionally, company levels for each user are specified. 
Note: All characters appearing in this data are fictitious. 
Any resemblance to real persons, living or dead or undead or unborn or otherwise semi-existent is purely coincidental.

To manually load data, go to the **Storage** section:

{: .image-popup}
![Screenshot -- Storage Console](/overview/tutorial/load/intro-screen.png)

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

To create the four tables in your input tutorial bucket, hover over its name and click the plus button that appears.

{: .image-popup}
![Screenshot -- Create a table](/overview/tutorial/load/create-table.png) 

To manually create a table in Storage, you need a CSV file. For our tutorial, we have prepared four sample tables:

- opportunity (business opportunities) -- [http://help.keboola.com/overview/tutorial/opportunity.csv](/overview/tutorial/opportunity.csv) 
- account (associated accounts) -- [http://help.keboola.com/overview/tutorial/account.csv](/overview/tutorial/account.csv) 
- user (associated users) -- [http://help.keboola.com/overview/tutorial/user.csv](/overview/tutorial/user.csv)
- level (company levels) -- [http://help.keboola.com/overview/tutorial/level.csv](/overview/tutorial/level.csv) 

Either refer directly to the URLs above, 
or download the files to your computer (they are very small) and load them by file upload. 

{: .image-popup}
![Screenshot -- Create a table](/overview/tutorial/load/create-table-2.png) 

When you upload a table, you can check its contents in the *Data sample* tab.

{: .image-popup}
![Screenshot -- Data sample](/overview/tutorial/load/data-sample.png)

That's it. You should now have four tables with sample data stored in your KBC project.

You can now take

- the next step -- [Data Manipulation](/overview/tutorial/manipulate/), or
- a brief side step to [Loading data with GoogleDrive Extractor](/overview/tutorial/load/googledrive/), or
- a brief side step to [Loading data with Database Extractor](/overview/tutorial/load/database/).
