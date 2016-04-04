---
title: Part 1 - Manually Loading Data 
permalink: /overview/tutorial/load/
---

There are multiple ways to load data into KBC. When you are starting with a project or doing any kind of 
[POC](https://en.wikipedia.org/wiki/Proof_of_concept), it is usually the fastest to load data manually. 
If everything goes well and the project goes to production, you will later switch to automatic 
data loading using extractors. In this tutorial, you will load four tables into KBC Storage.

To manully load data go to **Storage** section:

{: .image-popup}
![Screenshot - Storage Console](/overview/tutorial/load/intro-screen.png)

In the 
[*Storage Console*](/storage/) there is a tab *Tables* which lists database tables stored in your project. Tables are 
grouped together into *Buckets*. There are two buckets ready for you `in.c-main` and `out.c-main` but let's create 
a new one especially for this tutorial. Click the plus button to create a new bucket.

{: .image-popup}
![Screenshot - Create Bucket](/overview/tutorial/load/create-bucket.png)

Create a bucket and name it *tutorial* (optionally you can also add a description). When creating a bucket, you need 
to select a *Stage* and *Backend*. *Stage* is used
to further organize buckets. The *in*put stage should be generally used for data loaded from outside into KBC. The *out*put 
stage should be used for data ready to be written into external systems. This is a purely formal differentiation between raw 
and processed data. *Backend* refers to database [backend](/storage/) used for storing your data, let's use 
MySQL for now.

When you are done with the *tutorial* bucket in the *input* stage, creat another *tutorial* bucket in the *output* stage. 
You should therefore end up with buckets `in.c-tutorial` and `out.c-tutorial`.

{: .image-popup}
![Screenshot - Create a table](/overview/tutorial/load/create-table.png) 

To manually create a table in Storage, you need a CSV file. You can either upload a CSV file from your computer, or
directly refer to an URL. For this tutorial we have prepared four sample tables:

- opportunity - [http://help.keboola.com/overview/tutorial/opportunity.csv](/overview/tutorial/opportunity.csv)
- account - [http://help.keboola.com/overview/tutorial/account.csv](/overview/tutorial/account.csv)
- user - [http://help.keboola.com/overview/tutorial/user.csv](/overview/tutorial/user.csv)
- usergoals - [http://help.keboola.com/overview/tutorial/level.csv](/overview/tutorial/level.csv)

{: .image-popup}
![Screenshot - Create a table](/overview/tutorial/load/create-table-2.png) 

You can either load them directly from the URLs above, or download them to your computer (they are very small)
and load them by file upload. When you upload a table, you can check its contents in the 
*Data sample* tab.

{: .image-popup}
![Screenshot - Data sample](/overview/tutorial/load/data-sample.png)

That's it. You should now have four tables with sample data stored in your KBC project. The tables represent 
business opportunities (*opportunity*), their associated users (*user*) and accounts (*account*). Additionally 
company levels for each user are specified (*level*). Note: All characters 
appearing in this data are fictitious. Any resemblance to real persons, living or dead or undead or unborn or 
otherwise semi-existent is purely coincidental.
. You can now go to:

- the next step [Data Manipulation](/overview/tutorial/manipulate/)
- or you can take a brief side step to [Loading data with GoogleDrive Extractor](/overview/tutorial/load/googledrive/)
- or you can take a brief side step to [Loading data with Database Extractor](/overview/tutorial/load/database/)
