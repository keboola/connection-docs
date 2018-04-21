---
title: Part 5 - Ad-hoc Data Analysis
permalink: /tutorial/ad-hoc/
---

After you have loaded your tables, either [manually](/tutorial/load/) or
[using an extractor](/tutorial/load/database/), [manipulated the data](/tutorial/manipulate/) in SQL,
written it [into Tableau BI](/tutorial/write/) or [into GoodData BI](/tutorial/write/gooddata/), and
set everything to run [automatically](/tutorial/automate/), let's take a look at some additional KBC features related to doing ad-hoc analysis.

This part of the tutorial shows how to work with arbitrary data in Python
in a completely unrestricted way. Although our examples use the Python language,
the very same can be achieved using the R language.

Before you start, you should have a basic understanding of the [Python language](https://www.python.org/).

* TOC
{:toc}

## Introduction
Let's say you want to experiment with the US unemployment data. It is provided by the
[U.S. Bureau of Labor Statistics](https://www.bls.gov/cps/tables.htm) (BLS), and the dataset [A-10](https://www.bls.gov/web/empsit/cpseea10.htm)
contains unemployment rates by month. The easiest way to access the data is via
[Google Public Data](https://cloud.google.com/bigquery/public-data/), which contains a dataset called
[Bureau of Labor Statistics Data](https://cloud.google.com/bigquery/public-data/bureau-of-labor-statistics).

Google Public Data can be queried using [BigQuery](https://cloud.google.com/bigquery/) and brought into Keboola
Connection (KBC) with the help of our BigQuery extractor. Preview the table data in
[Google BigQuery](https://bigquery.cloud.google.com/table/bigquery-public-data:bls.unemployment_cps?tab=preview).

## Using BigQuery Extractor
To work with Google BigQuery, create an account, and [enable billing](https://cloud.google.com/bigquery/public-data/). Remember,
querying public data is only [free up to 1TB a month](https://cloud.google.com/bigquery/public-data/). Then create a Google Storage Bucket as a temporary storage for off-loading the data from BigQuery.

*Note: If setting up the BigQuery extractor seems too complicated to you, export the query results to Google Sheets and
[load them from Google Drive](/tutorial/load/googledrive/). Or, export them to a CSV file and [load them from local files](/tutorial/load/#manually-loading-data).*

### Preparing
To create a Google Storage Bucket, go to the [Google Cloud Platform console](https://console.cloud.google.com/home/dashboard)
and select **Storage**.

{: .image-popup}
![Screenshot - Google Cloud Platform](/tutorial/ad-hoc/cloud-platform-1.png)

Create a new bucket:

{: .image-popup}
![Screenshot - Google Cloud Storage](/tutorial/ad-hoc/cloud-platform-2.png)

Enter the bucket's name and Storage Class (Regional is okay for our use):

{: .image-popup}
![Screenshot - Create Bucket](/tutorial/ad-hoc/cloud-platform-3.png)

### Extracting Data
Now you're ready to load the data into KBC. Go to the extractor section, and click **New Extractor**:

{: .image-popup}
![Screenshot - Extractors](/tutorial/ad-hoc/bigquery-extractor-1.png)

Use the search and find the BigQuery extractor:

{: .image-popup}
![Screenshot - BigQuery Extractor](/tutorial/ad-hoc/bigquery-extractor-2.png)

Create a new configuration and name it, e.g., `bls-unemployment`:

{: .image-popup}
![Screenshot - New Configuration](/tutorial/ad-hoc/bigquery-extractor-3.png)

Then authorize the account:

{: .image-popup}
![Screenshot - Big Query Configuration](/tutorial/ad-hoc/bigquery-extractor-4.png)

Name the authorization, and follow the on-screen instructions:

{: .image-popup}
![Screenshot - Big Query Authorization](/tutorial/ad-hoc/bigquery-extractor-5.png)

If the authorization is successful, configure the extraction:

{: .image-popup}
![Screenshot - Big Query Authorized](/tutorial/ad-hoc/bigquery-extractor-6.png)

Select your Google Project and the bucket you have created (`bls-tutorial`) above:

{: .image-popup}
![Screenshot - Big Query Configuration Detail](/tutorial/ad-hoc/bigquery-extractor-7.png)

After that configure the actual extraction queries by clicking the **New Query** button:

{: .image-popup}
![Screenshot - Big Query Bucket Configured](/tutorial/ad-hoc/bigquery-extractor-8.png)

Name the query, e.g., `unemployment rates` and paste the following in the `SQL query` field:

{% highlight sql %}
SELECT * FROM
  `bigquery-public-data.bls.unemployment_cps`
WHERE
  series_id = "LNS14000000"
ORDER BY date
{% endhighlight %}

The `LNS14000000` series will pick the unemployment rates only. Uncheck the `Use Legacy SQL` setting, and
**Save** the query configuration:

{: .image-popup}
![Screenshot - Query Configuration](/tutorial/ad-hoc/bigquery-extractor-9.png)

Now run the configuration to bring the data to KBC:

{: .image-popup}
![Screenshot - Finished Configuration](/tutorial/ad-hoc/bigquery-extractor-10.png)

Running the extractor creates a background job that

- executes the queries in Google BigQuery.
- saves the results to Google Cloud Storage.
- exports the results from Google Cloud Storage and stores them in specified tables in Keboola Connection Storage.
- removes the results from Google Cloud Storage.

When a job is running, a small orange circle appears under *Last runs*, along with RunId and other info on the job.
Green is for success, red for failure. Click on the indicator, or the info next to it, for more details.
Once the job is finished, click on the names of the tables to inspect their contents.

## Exploring Data
To explore the data, go to **Transformations**, and click on [**Sandbox**](/manipulation/transformations/sandbox/).
Provided for each user and project automatically, it is an isolated environment in which you can experiment without
interfering with any production code.

{: .image-popup}
![Screenshot - Transformations](/tutorial/ad-hoc/transformation-1.png)

Click on **New Sandbox** next to Jupyter:

{: .image-popup}
![Screenshot - Create Sandbox](/tutorial/ad-hoc/transformation-2.png)

Select the unemployment rates table (`in.c-keboola-ex-google-bigquery.unemployment-rates`), click on **Create Sandbox**. Wait for the process to finish:

{: .image-popup}
![Screenshot - Sandbox Configuration](/tutorial/ad-hoc/transformation-3.png)

When finished, connect to the web version of the [Jupyter Notebook](http://jupyter.org/).
It allows you to run arbitrary code by clicking the **Connect** button:

{: .image-popup}
![Screenshot - Sandbox Credentials](/tutorial/ad-hoc/transformation-4.png)

When prompted, enter the password from the Sandbox screen:

{: .image-popup}
![Screenshot - Sandbox Login](/tutorial/ad-hoc/sandbox-1.png)

You can now run arbitrary code in Python, using common data scientist tools like
[Pandas](https://pandas.pydata.org/) or [Matplotlib](https://matplotlib.org/).
For instance, to load the file, use:

{% highlight python %}
import pandas
df = pandas.read_csv("/data/in/tables/in.c-keboola-ex-google-bigquery.unemployment-rates.csv",sep=',')
df.head()
{% endhighlight %}

The path `/data/in/tables/` is the location for
[loaded tables](/manipulation/transformations/python/#file-locations); they
are loaded as simple CSV files. Once your table is loaded, you can play with it:

{% highlight python %}
import matplotlib.pyplot as plt
years = df.groupby(df['year'])['value'].mean()
years.plot(kind='line', color = 'orange')
plt.xlabel("Year")
plt.ylabel("Average %")
plt.suptitle('US Unemployment Rate', size=15)
plt.show()
{% endhighlight %}

{: .image-popup}
![Screenshot - Sandbox Result](/tutorial/ad-hoc/sandbox-2.png)

## Adding libraries
Now that you can experiment with the U.S. unemployment data extracted from Google BigQuery (or any other data extracted in any other way),
you can do the same with the EU unemployment data. Available at [Eurostat](http://ec.europa.eu/eurostat), the unemployment
dataset is called
[`tgs00010`](http://ec.europa.eu/eurostat/tgm/table.do?tab=table&init=1&language=en&pcode=tgs00010&plugin=1).

There are a number of ways how to get the data from Eurostat -- e.g., you can download it in TSV
or XLS format. To avoid downloading the (possibly) lengthy data set to your hard drive, Eurostat provides a
[REST API](http://ec.europa.eu/eurostat/web/json-and-unicode-web-services/about-this-service)
for downloading the data. This could be processed using the
[Generic Extractor](/extractors/other/generic/). However, the data is provided in
[JSON-stat](https://json-stat.org/) format, which contains tables encoded using the
[row-major](https://en.wikipedia.org/wiki/Row-_and_column-major_order) method. Even though it is possible
to import them to KBC, it would be necessary to do additional processing to obtain plain tables.

To save time, use a tool designed for that -- [pyjstat](https://pypi.python.org/pypi/pyjstat/). It is a python library which can read
JSON-stat data directly into a [Pandas data frame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html).
Although this library is not installed by default in the Jupyter Sandbox environment, nothing prevents you from installing it.

### Working with Custom Libraries
Use the following code to download the desired data from Eurostat:

{% highlight python %}
import subprocess
import sys
subprocess.call([sys.executable, '-m', 'pip', 'install', '--disable-pip-version-check', '-q', 'pyjstat'])
from pyjstat import pyjstat
dataset = pyjstat.Dataset.read('http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/tgs00010?sex=T&precision=1&unit=PC&age=Y_GE15')
df = dataset.write('dataframe')
df.head()
{% endhighlight %}

The URL was built using the Eurostat [Query Builder](http://ec.europa.eu/eurostat/web/json-and-unicode-web-services/getting-started/query-builder).
Also note that installing a library from within the python code must be done using `pip install`. Now that you have the data, feel free to play with it:

{% highlight python %}
years = df.groupby(df['time'])['value'].mean()
years.plot(kind='line', color = 'orange')
plt.xlabel("Year")
plt.ylabel("Average %")
plt.suptitle('EU Unemployment Rate', size=15)
plt.show()
{% endhighlight %}

{: .image-popup}
![Screenshot - Sandbox Result](/tutorial/ad-hoc/sandbox-3.png)

## Wrap-up
You have just learnt to do a completely ad-hoc analysis of various data sets. If you need to run the above code regularly,
simply copy&paste it into a [Transformation](http://localhost:4000/tutorial/manipulate/).

The above tutorial is done in the [Python language](https://www.python.org/) using the
[Jupyter Notebook](http://jupyter.org/). The same can be done in the
[R language](https://www.r-project.org/) using [RStudio](https://www.rstudio.com/).
For more information about sandboxes (including disk and memory limits), see the
[corresponding documentation](/manipulation/transformations/sandbox/#rstudio-sandbox).

## Final Note
This is the end of our stroll around Keboola Connection. On our walk, we missed quite a few things:
Applications, Python and R transformations, Redshift and Snowflake features, to name a few.
However, teaching you everything was not really the point of this tutorial.
We wanted to show you how Keboola Connection can help in connecting different systems together.

[Return to the beginning](/tutorial/) or [contact us](/).