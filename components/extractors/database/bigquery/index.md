---
title: Google BigQuery
permalink: /components/extractors/database/bigquery/
redirect_from:
    - /extractors/database/bigquery/
---

* TOC
{:toc}

The BigQuery extractor loads data from [BigQuery](https://cloud.google.com/bigquery/) and brings it into Keboola. 
Running the extractor creates a background job that

- executes the queries in Google BigQuery.
- saves the results to Google Cloud Storage.
- exports the results from Google Cloud Storage and stores them in specified tables in Keboola Storage.
- removes the results from Google Cloud Storage.

***Note:** Using the Google BigQuery extractor is also described in our [Getting Started Tutorial](/tutorial/ad-hoc/#using-bigquery-extractor).*

## Initial Setup

### Service Account
To access and extract data from your BigQuery dataset, you need to set up a Google service account. Go 
to [**Google Cloud Platform Console > IAM & admin > Service accounts**](https://console.cloud.google.com/iam-admin/serviceaccounts)
and select the project you want the extractor to have access to. Click **Create Service Account**
and enter a *Service account name* (e.g., `Keboola BigQuery extractor`).

{: .image-popup}
![Screenshot - Create service account](/components/extractors/database/bigquery/googlecloud-1.png)

Then add the roles `BigQuery Data Editor`, `BigQuery Job User` and `Storage Object Admin`.

{: .image-popup}
![Screenshot - Set admin roles](/components/extractors/database/bigquery/googlecloud-2.png)

Finally, click **+ Create Key** to create a new JSON key, and then click **Create** to download it to your computer.

{: .image-popup}
![Screenshot - Create JSON key](/components/extractors/database/bigquery/googlecloud-3.png)

### Bucket
The extractor uses a Google Storage bucket as a temporary storage for off-loading the data from BigQuery.
Go to the [**Google Cloud Platform Console > Storage >  Cloud Storage > Browser**](https://console.cloud.google.com/storage/browser)
and click **Create Bucket**. **Name** the bucket and select its **location** (must be the same as of your dataset).

{: .image-popup}
![Screenshot - Google Cloud Platform](/components/extractors/database/bigquery/googlecloud-4.png)

Do not set a retention policy on the bucket. The bucket contains only temporary data and no retention is needed.

## Configure Extraction
[Create a new configuration](/components/#creating-component-configuration) of the BigQuery extractor.
Click **Set Service Account Key**.

{: .image-popup}
![Screenshot - Set Service Account Key](/components/extractors/database/bigquery/bigquery-1.png)

Open the downloaded key in a text editor, copy & paste it in the input field, and click **Submit**. 

{: .image-popup}
![Screenshot - Copy & Paste Service Account Key](/components/extractors/database/bigquery/bigquery-2.png)

Click **Save** to store the credentials.

**Important:** The private key is stored in an **encrypted** form and only the non-sensitive parts are visible in the UI
for your verification. The key can be deleted or replaced by a new one at any time.

{: .image-popup}
![Screenshot - Save Service Account Key](/components/extractors/database/bigquery/bigquery-3.png)

In the section **Unload Configuration**, enter `Cloud Storage Bucket Name` as the name of the bucket 
you [have created earlier](#bucket), and select the correct *Dataset Location*. Click **Save**.

{: .image-popup}
![Screenshot - Configure Bucket](/components/extractors/database/bigquery/bigquery-4.png)

### Configure Queries
Start by clicking the button **Add Query**.

{: .image-popup}
![Screenshot - Add Query](/components/extractors/database/bigquery/bigquery-5.png)

Name the query and click **Create**.  

{: .image-popup}
![Screenshot - Name Query](/components/extractors/database/bigquery/bigquery-6.png)

To learn how to modify your configuration, go to the [SQL databases section](/components/extractors/database/sqldb/#modify-configuration).
