---
title: 'Ad-Hoc Data Analysis'
slug: 'getting-started/ad-hoc'
description: "Explore arbitrary data in a Python workspace: bring in a public BigQuery dataset, plot it in a Jupyter notebook, and install your own libraries."
redirect_from:
  - /tutorial/ad-hoc/
---


After you have loaded your tables, either [from a URL](/getting-started/load/) or
[using a data source connector](/getting-started/load/database/), [manipulated the data](/getting-started/transform/) in SQL,
written it [into Google Sheets](/getting-started/write/), and
set everything to run [automatically](/getting-started/automate/), let's take a look at some additional Keboola 
features related to doing ad-hoc analysis.

This part of the tutorial shows how to work with arbitrary data in Python
in a completely unrestricted way. Although our examples use the Python language,
the very same can be achieved using R.

Before you start, you should have a basic understanding of the [Python language](https://www.python.org/).



## Introduction
Let's say you want to experiment with the US unemployment data. It is provided by the
[U.S. Bureau of Labor Statistics](https://www.bls.gov/cps/tables.htm) (BLS), and the dataset [A-10](https://www.bls.gov/web/empsit/cpseea10.htm)
contains unemployment rates by month.

<!-- Both bls.gov links opened in a real browser on 2026-08-19 and are live: /cps/tables.htm serves
"CPS Tables", /web/empsit/cpseea10.htm serves "A-10. Unemployment rates by age, sex, and marital
status, seasonally adjusted". They answer 403 to curl from the same host even with full browser
headers, so BLS filters on request fingerprint, not on IP — a 403 on these two from any link
checker running here is a false positive, not a dead link. -->

The easiest way to access the data is via
[Google Public Data](https://cloud.google.com/bigquery/public-data/), which contains a dataset called
[Bureau of Labor Statistics](https://console.cloud.google.com/marketplace/product/bls-public-data/bureau-of-labor-statistics)
data — the `bigquery-public-data.bls` dataset.

Google Public Data can be queried using [BigQuery](https://cloud.google.com/bigquery/) and brought into Keboola
with the help of our BigQuery data source connector. Open the table in
[Google BigQuery](https://console.cloud.google.com/bigquery?p=bigquery-public-data&d=bls&t=unemployment_cps&page=table)
and use the **Preview** tab to see the rows.

## Using BigQuery Connector
To work with Google BigQuery, create an account. Querying public data is
[free up to 1 TB a month](https://cloud.google.com/bigquery/public-data) without enabling billing;
past that you need to [enable billing](https://cloud.google.com/billing/docs/how-to/modify-project).

Then create a [service account](https://cloud.google.com/iam/docs/service-accounts-create) for authentication 
of the Google BigQuery data source connector, and create a Google Storage bucket as a temporary storage for off-loading the data from BigQuery.

***Note:** If setting up the Google BigQuery connector seems too complicated to you, export the query results to Google Sheets and
[load them from Google Sheets](/getting-started/load/googlesheets/). Or, export them to a CSV file, publish it, and [load it over HTTP](/getting-started/load/).*

### Prepare
Before you start, have a Google service account and a Google Storage bucket ready.

#### Service account
To create a Google service account, go to the 
[**Google Cloud Platform Console > IAM & admin > Service accounts**](https://console.cloud.google.com/iam-admin/serviceaccounts)
and create a new service account:

![Screenshot - Google Service Account](/getting-started/ad-hoc/cloud-platform-service-account-1.png)

Name the service account:

![Screenshot - Google Service Account Detail](/getting-started/ad-hoc/cloud-platform-service-account-3.png)

Grant the roles **BigQuery Data Editor**, **BigQuery Job User** and **Storage Object Admin** to your service account:

![Screenshot - Google Service Account Permissions](/getting-started/ad-hoc/cloud-platform-service-account-4.png)

Finally, create a new JSON key and download it to your computer:

![Screenshot - Google Service Account Download](/getting-started/ad-hoc/cloud-platform-service-account-5.png)

#### Google Storage bucket
To create a Google Storage bucket, go to the [**Google Cloud Platform console > Storage**](https://console.cloud.google.com/storage/browser)
and create a new bucket:

![Screenshot - Google Cloud Platform](/getting-started/ad-hoc/cloud-platform-storage-1.png)

Enter the bucket's name and choose where to store your data (the location type *Region* is okay for our purpose):

![Screenshot - Create Bucket](/getting-started/ad-hoc/cloud-platform-storage-3.png)

Do not set a retention policy on the bucket. The bucket contains only temporary data and no retention is needed.

### Extract Data
Now you're ready to load the data into Keboola. Go to the section **Components**, 
and click the green button **Add Component**:

![Screenshot - Extractors](/getting-started/ad-hoc/ex-bigquery-1.png)

Use the search to find the Google BigQuery data source:

![Screenshot - BigQuery Extractor](/getting-started/ad-hoc/ex-bigquery-2.png)

Click **+ Add Component** and then **Connect to My Data**: 

![Screenshot - New Configuration](/getting-started/ad-hoc/ex-bigquery-3.png)

Name the configuration (e.g., 'Bls Unemployment') and describe it if you want. Then, click **Create Configuration**:

![Screenshot - New Configuration Name](/getting-started/ad-hoc/ex-bigquery-4.png)

Then set the service account key:

![Screenshot - Big Query Authorization](/getting-started/ad-hoc/ex-bigquery-5.png)

Open the downloaded key you have created above in a text editor, copy & paste it in the input field, click **Submit** and then **Save**.

![Screenshot - Service Account Copy](/getting-started/ad-hoc/ex-bigquery-6.png)

Fill the bucket you have created above:

![Screenshot - Big Query Unload](/getting-started/ad-hoc/ex-bigquery-7.png)

After that configure the actual extraction queries by clicking the **Add Query** button:

![Screenshot - Big Query Configured](/getting-started/ad-hoc/ex-bigquery-8.png)

Name the query, e.g., `Unemployment rates`:

![Screenshot - New Query Name](/getting-started/ad-hoc/ex-bigquery-9.png)

Check *Create your own query using an SQL editor*, uncheck the *Use Legacy SQL* setting, and paste the following code in the *SQL Query* field:


```sql
SELECT * FROM
  `bigquery-public-data.bls.unemployment_cps`
WHERE
  series_id = "LNS14000000"
ORDER BY date
```

The `LNS14000000` series will pick the unemployment rates only.

Then **Save** the query configuration.

![Screenshot - Query Configuration](/getting-started/ad-hoc/ex-bigquery-10.png)

Now run the configuration to bring the data to Keboola:

![Screenshot - Finished Configuration](/getting-started/ad-hoc/ex-bigquery-11.png)

Running the data source connector creates a background job that

- executes the queries in Google BigQuery.
- saves the results to Google Cloud Storage.
- exports the results from Google Cloud Storage and stores them in specified tables in Keboola Storage.
- removes the results from Google Cloud Storage.

When a job is running, a small orange circle appears under *Last runs*, along with RunId and other info on the job.
Green is for success, red for failure. Click on the indicator, or the info next to it, for more details.
Once the job is finished, click on the names of the tables to inspect their contents.

## Exploring Data

:::caution
**Important:** The following part of the tutorial will be updated soon. Please be aware that sandboxes now exist only in their legacy form and have been replaced by workspaces.
:::

To explore the data, go to [**Workspaces**](/workspace/).
Provided for each user and project automatically, it is an isolated environment in which you can experiment without
interfering with any production code.

![Screenshot - Transformations](/getting-started/ad-hoc/transformation-1.png)

Click on **New Sandbox** next to Python (Jupyter):

![Screenshot - Create Sandbox](/getting-started/ad-hoc/transformation-2.png)

Select the unemployment rates table (`in.c-keboola-ex-google-bigquery-v2-548939034.unemployment-rates` in this case), 
click on **Create Sandbox**. Wait for the process to finish:

![Screenshot - Sandbox Configuration](/getting-started/ad-hoc/transformation-3.png)

When finished, connect to the web version of the [Jupyter Notebook](https://jupyter.org/).
It allows you to run arbitrary code by clicking the **Connect** button:

![Screenshot - Sandbox Credentials](/getting-started/ad-hoc/transformation-4.png)

When prompted, enter the password from the Sandbox screen:

![Screenshot - Sandbox Login](/getting-started/ad-hoc/sandbox-1.png)

You can now run arbitrary code in Python, using common data scientist tools like
[Pandas](https://pandas.pydata.org/) or [Matplotlib](https://matplotlib.org/).
For instance, to load the file, use (make sure to use the correct filename):

```python
import pandas
df = pandas.read_csv("/data/in/tables/in.c-keboola-ex-google-bigquery-v2-548939034.unemployment-rates.csv",sep=',')
df.head()
```

The path `/data/in/tables/` is the location for
[loaded tables](/transformations/python-plain/#file-locations); they
are loaded as simple CSV files. Once your table is loaded, you can play with it:

```python
import matplotlib.pyplot as plt
years = df.groupby(df['year'])['value'].mean()
years.plot(kind='line', color = 'orange')
plt.xlabel("Year")
plt.ylabel("Average %")
plt.suptitle('US Unemployment Rate', size=15)
plt.show()
```

![Screenshot - Sandbox Result](/getting-started/ad-hoc/sandbox-2.png)

## Adding Libraries
Now that you can experiment with the U.S. unemployment data extracted from Google BigQuery (or any other data extracted in any other way),
you can do the same with the EU unemployment data. Available at [Eurostat](https://ec.europa.eu/eurostat/), the unemployment
dataset is called
[`tgs00010`](https://ec.europa.eu/eurostat/databrowser/product/view/tgs00010?lang=en).

There are a number of ways how to get the data from Eurostat -- e.g., you can download it in TSV
or XLS format. To avoid downloading the (possibly) lengthy data set to your hard drive, Eurostat provides a
[REST API](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-migrating/json)
for downloading the data. This could be processed using the
[Generic Extractor](/components/extractors/other/generic/). However, the data is provided in
[JSON-stat](https://json-stat.org/) format, which contains tables encoded using the
[row-major](https://en.wikipedia.org/wiki/Row-_and_column-major_order) method. Even though it is possible
to import them to Keboola, it would be necessary to do additional processing to obtain plain tables.

To save time, use a tool designed for that -- [pyjstat](https://pypi.org/project/pyjstat/). It is a Python library which can read
JSON-stat data directly into a [Pandas data frame](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html).
Although this library is not installed by default in the Jupyter Sandbox environment, nothing prevents you from installing it.

### Working with Custom Libraries
Use the following code to download the desired data from Eurostat:

```python
import subprocess
import sys
subprocess.call([sys.executable, '-m', 'pip', 'install', '--disable-pip-version-check', '-q', 'pyjstat'])
from pyjstat import pyjstat
dataset = pyjstat.Dataset.read('https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tgs00010?format=JSON&unit=PC&isced11=ED0-2&isced11=ED3_4&isced11=ED5-8&isced11=NRP&isced11=TOTAL&isced11=UNK&sex=F&sex=M&sex=T&age=Y15-74&lang=EN')
df = dataset.write('dataframe')
df.head()
```

The URL was built using the Eurostat [Query Builder](https://ec.europa.eu/eurostat/web/query-builder/tool).
Also note that installing a library from within the Python code must be done using `pip install`. Now that you have the data, 
feel free to play with it:

```python
years = df.groupby(df['time'])['value'].mean()
years.plot(kind='line', color = 'orange')
plt.xlabel("Year")
plt.ylabel("Average %")
plt.suptitle('EU Unemployment Rate', size=15)
plt.show()
```

![Screenshot - Sandbox Result](/getting-started/ad-hoc/sandbox-3.png)

## Wrap Up
You have just learnt to do a completely ad-hoc analysis of various data sets. If you need to run the above code regularly,
simply copy&paste it into a [Transformation](/getting-started/transform/).

The above tutorial is done in the [Python language](https://www.python.org/) using the
[Jupyter Notebook](https://jupyter.org/). The same can be done in the
[R language](https://www.r-project.org/) using [RStudio](https://posit.co/products/open-source/rstudio/).
For more information about workspaces (including disk and memory limits), see the
[corresponding documentation](/workspace/).

## Final Note
This is the end of our stroll around Keboola. On our walk, we missed quite a few things:
Applications, Python and R transformations, Snowflake features, to name a few.
However, teaching you everything was not really the point of this tutorial.
We wanted to show you how Keboola can help in connecting different systems together.

[Return to the beginning](/getting-started/) or [contact us](/).
