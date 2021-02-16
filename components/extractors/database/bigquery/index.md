---
title: Google BigQuery
permalink: /components/extractors/database/bigquery/
redirect_from:
    - /extractors/database/bigquery/
---

* TOC
{:toc}

The BigQuery extractor loads data from [BigQuery](https://cloud.google.com/bigquery/) and brings it into Keboola Connection. 
Running the extractor creates a background job that

- executes the queries in Google BigQuery.
- saves the results to Google Cloud Storage.
- exports the results from Google Cloud Storage and stores them in specified tables in Keboola Connection Storage.
- removes the results from Google Cloud Storage.

*Note: Using the Google BigQuery extractor is also described in our [Getting Started Tutorial](/tutorial/ad-hoc/#using-bigquery-extractor).*

## Initial Setup

### Service Account
To access and extract data from your BigQuery dataset, you need to set up a Google Service Account. Go 
to [**Google Cloud Platform Console > IAM & admin > Service accounts**](https://console.cloud.google.com/iam-admin/serviceaccounts)
and select the project you want the extractor to have access to. Click **Create Service Account**
and enter a **Service account name** (e.g., `Keboola Connection BigQuery Extractor`).

{: .image-popup}
![Screenshot - Create service account](/components/extractors/database/bigquery/googlecloud-1.png)

Then add the `BigQuery Data Editor`, `BigQuery Job User` and `Storage Object Admin` roles.

{: .image-popup}
![Screenshot - Set admin roles](/components/extractors/database/bigquery/googlecloud-2.png)

Finally, create a new JSON key (click **+ Create key**) and download it to your computer (click **Create**).

{: .image-popup}
![Screenshot - Create JSON key](/components/extractors/database/bigquery/googlecloud-3.png)

### Bucket
The extractor uses Google Storage Bucket as a temporary storage for off-loading the data from BigQuery.
Go to the [**Google Cloud Platform Console > Storage > Browser**](https://console.cloud.google.com/storage/browser)
and click **Create Bucket**. Enter the **Name** of your bucket and select its **Location** (must be the same as of your dataset).

{: .image-popup}
![Screenshot - Google Cloud Platform](/components/extractors/database/bigquery/googlecloud-4.png)

Do not set a Retention Policy on the bucket. The bucket contains only temporary data and no retention is needed.

## Configure Extraction
[Create a new configuration](/components/#creating-component-configuration) of the BigQuery extractor.
Click the **Set Service Account Key** button.

{: .image-popup}
![Screenshot - Set Service Account Key](/components/extractors/database/bigquery/bigquery-1.png)

- Open the downloaded key in a text editor, copy & paste it in the input field, click **Submit**. 

{: .image-popup}
![Screenshot - Copy & Paste Service Account Key](/components/extractors/database/bigquery/bigquery-2.png)

Click on the **Save** button to store the credentials.
**Important:** The private key is stored in an **encrypted** form and only the non-sensitive parts are visible in the UI for your verification. 
The key can be deleted or replaced by a new one at any time.

{: .image-popup}
![Screenshot - Save Service Account Key](/components/extractors/database/bigquery/bigquery-3.png)

In the **Unload Configuration** section, fill **Cloud Storage Bucket Name** as the name of the bucket 
you [have created earlier](#bucket), and select the correct **Dataset Location**. Click **Save**.

{: .image-popup}
![Screenshot - Configure Bucket](/components/extractors/database/bigquery/bigquery-4.png)

### Configure Queries
Start by clicking the **Add Query** button.

{: .image-popup}
![Screenshot - Add Query](/components/extractors/database/bigquery/bigquery-5.png)

Name the query and click **Create**.  

{: .image-popup}
![Screenshot - Name Query](/components/extractors/database/bigquery/bigquery-6.png)

How to modify your configuration you can read in the [SQL databases section](/components/extractors/database/sqldb/#modify-configuration).
