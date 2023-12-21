---
title: Loading Data
permalink: /tutorial/load/
---

* TOC
{:toc}

Keboola offers various methods to load data, providing flexibility to suit different project stages. When initiating a project or conducting a Proof of Concept 
(POC), the quickest approach is typically **manual data loading**. As the project advances to production, you may transition to **automatic data loading** using 
data sources connectors. 

In our tutorial, we demonstrate manual loading, and as you progress, we delve into automated data loading using connectors, specifically the Google Sheets 
and Database data source connectors.

## Manual Data Loading
### Get Ready
In this section of the tutorial, you will load four tables into the Keboola Storage. These tables represent business opportunities, associated users and accounts, and specified company levels for each user. The tables are available as CSV files for download:

- [Opportunity (business opportunities)](/tutorial/opportunity.csv)
- [Account (associated accounts)](/tutorial/account.csv)
- [User (associated users)](/tutorial/user.csv)
- [Level (company levels)](/tutorial/level.csv)

Download these small files to your computer and proceed with loading the data.

***Note:** All characters in this data are fictitious, and any resemblance to real persons, living, dead, undead, unborn, or otherwise semi-existent 
is purely coincidental.*

### Steps to Follow
1. Before proceeding, ensure you are logged into your Keboola project (refer to the tutorial [Prerequisites](/tutorial/#prerequisites) 
if you need to acquire a project).
2. Navigate to the **Components** section and use the search box to find **'CSV Import'**.
3. 
{: .image-popup}
![Screenshot -- Extractors](/tutorial/load/picture1.png)

{: .image-popup}
![Screenshot -- CSV Import Intro](/tutorial/load/picture2.png)

{: .image-popup}
![Screenshot -- CSV New Configuration](/tutorial/load/picture3.png)

{: .image-popup}
![Screenshot -- CSV Import Configuration](/tutorial/load/picture4.png)

{: .image-popup}
![Screenshot -- Change upload settings](/tutorial/load/picture5.png)

{: .image-popup}
![Screenshot -- Upload CSV file progress](/tutorial/load/picture6.png)
	
That's it. You should now have four tables containing sample data stored in your Keboola Storage:

- `in.c-csv-import.opportunity`
- `in.c-csv-import.account`
- `in.c-csv-import.user`
- `in.c-csv-import.level`

{: .image-popup}
![Screenshot -- Storage preview](/tutorial/load/picture7.png)

{: .image-popup}
![Screenshot -- Storage preview](/tutorial/load/picture8.png)

## What’s next
Proceed to [Data Manipulation](/tutorial/manipulate/) for the next step in the tutorial. Alternatively, take a brief side step to explore 
[Loading data with Google Sheets data source connectore](/tutorial/load/googledrive/) 
and/or [Loading data with Database data source connector](/tutorial/load/database/). 

## If You Need Help
Feel free to reach out to our Support team [LINK] if there’s anything we can help with.
You can now take

- the next step --- [Data Manipulation](/tutorial/manipulate/), or
- a brief side step to [Loading data with GoogleDrive Extractor](/tutorial/load/googledrive/), or
- a brief side step to [Loading data with Database Extractor](/tutorial/load/database/).
