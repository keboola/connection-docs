---
title: Google BigQuery
permalink: /extractors/storage/bigquery/
---

* TOC
{:toc}

The BigQuery extractor loads data from [BigQuery](https://cloud.google.com/bigquery/) and brings it into Keboola Connection (KBC). 

To work with Google BigQuery, create an account and [enable billing](https://cloud.google.com/billing/docs/how-to/modify-project). 
Then create a Google Storage Bucket as a temporary storage for off-loading the data from BigQuery.

## Create Bucket
To create a Google Storage Bucket, go to the [Google Cloud Platform console](https://console.cloud.google.com/home/dashboard)
and select **Storage**.

{: .image-popup}
![Screenshot - Google Cloud Platform](/extractors/storage/bigquery/cloud-platform-1.png)

Create a new bucket:

{: .image-popup}
![Screenshot - Google Cloud Storage](/extractors/storage/bigquery/cloud-platform-2.png)

Enter the bucket's name and Storage Class:

{: .image-popup}
![Screenshot - Create Bucket](/extractors/storage/bigquery/cloud-platform-3.png)

## Create New Configuration 
Find Google Analytics in the list of extractors. Create a new configuration and name it. 

{: .image-popup}
![Screenshot - Big Query Authorization](/extractors/storage/bigquery/bigquery-extractor-1.png)

Then authorize the account. 

Select one of the two authorization methods:

- **Instant** – Use this if you have access to a Google account; the authorization will be done immediately.
- **External** – If you need to authorize access to the service from someone who does not have an account in KBC, you can generate an external link, which will guide them through this process.

{: .image-popup}
![Screenshot - Big Query Authorization](/extractors/storage/bigquery/bigquery-extractor-3.png)

Name the authorization, and follow the on-screen instructions. 

## Configure Extraction

Start by clicking the green **Configure** button.

{: .image-popup}
![Screenshot - Big Query Bucket Configured](/extractors/storage/bigquery/bigquery-extractor-4.png)

Select your Google Project and the bucket you created at the beginning. 

{: .image-popup}
![Screenshot - Big Query Configuration Detail](/extractors/storage/bigquery/bigquery-extractor-5.png)

Then configure the actual extraction queries by clicking the **New Query** button. 

{: .image-popup}
![Screenshot - Query Configuration](/extractors/storage/bigquery/bigquery-extractor-6.png)

Name the query, and specify your requirements in the `SQL query` field. Save the query configuration.

{: .image-popup}
![Screenshot - Finished Configuration](/extractors/storage/bigquery/bigquery-extractor-7.png)

Now run the configuration to bring the data to KBC.

{: .image-popup}
![Screenshot - Query Configuration](/extractors/storage/bigquery/bigquery-extractor-8.png)

Running the extractor creates a background job that

- executes the queries in Google BigQuery.
- saves the results to Google Cloud Storage.
- exports the results from Google Cloud Storage and stores them in specified tables in Keboola Connection Storage.
- removes the results from Google Cloud Storage.

*Note: Using Google BigQuery extractor is also described in our [Getting Started Tutorial](https://help.keboola.com/tutorial/ad-hoc/#using-bigquery-extractor).*
