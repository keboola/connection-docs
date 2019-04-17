---
title: Google BigQuery
permalink: /extractors/database/bigquery/
redirect_from:
    - /extractors/storage/bigquery/
---

* TOC
{:toc}

The BigQuery extractor loads data from [BigQuery](https://cloud.google.com/bigquery/) and brings it into Keboola Connection (KBC). 

## Create New Configuration 
Find Google Analytics in the list of extractors. Create a new configuration and name it. 

{: .image-popup}
![Screenshot - Big Query Authorization](/extractors/database/bigquery/ui1.png)

## Initial Setup

### Service Account

To access and extract data from your BigQuery dataset, you need to set up a Google Service Account. 

- Go to [**Google Cloud Platform Console > IAM & admin > Service accounts**](https://console.cloud.google.com/iam-admin/serviceaccounts)
- Select the project you want the extractor to have access to
- Click **+ Create Service Account**
- Select an appropriate **Service account name** (e.g. `Keboola Connection BigQuery Extractor`)

{: .image-popup}
![Screenshot - Create service account](/extractors/database/bigquery/serviceaccount1.png)

- Then add the `BigQuery Data Editor`, `BigQuery Job User` adn `Storage Object Admin` roles.

{: .image-popup}
![Screenshot - Create service account](/extractors/database/bigquery/serviceaccount2.png)

- Finally, create a new JSON key (click **+ Create key**) and download it to your computer (click **Create**).

{: .image-popup}
![Screenshot - Create service account](/extractors/database/bigquery/serviceaccount3.png)

- Go back to your BigQuery extractor configuration.
- In the **Google Service Account Key** section click **Set Service Account Key**.

{: .image-popup}
![Screenshot - Set Service Account Key](/extractors/database/bigquery/ui2.png)

- Open the downloaded key in a text editor, copy & paste it in the input field, click **Submit** and then **Save**. 

{: .image-popup}
![Screenshot - Copy & Paste Service Account Key](/extractors/database/bigquery/ui3.png)

**Important:** The private key is stored in an **encrypted** form and only the non-sensitive parts are visible in the UI for your verification. 
The key can be deleted or replaced by a new one at any time.

{: .image-popup}
![Screenshot - Copy & Paste Service Account Key](/extractors/database/bigquery/ui4.png)

### Bucket

Extractor uses Google Storage Bucket as a temporary storage for off-loading the data from BigQuery.

- Go to the [**Google Cloud Platform Console > Storage > Browser**](https://console.cloud.google.com/storage/browser)
- Click **+ Create Bucket**.
- **Name** your bucket and select **Location**. (The location must be the same as of your dataset.)

{: .image-popup}
![Screenshot - Google Cloud Platform](/extractors/database/bigquery/ui5.png)

- Go back to your BigQuery extractor configuration.
- In the **Unload Configuration** section fill **Cloud Storage Bucket Name** you have created and select the correct **Dataset Location**.
- Click **Save**.

{: .image-popup}
![Screenshot - Google Cloud Platform](/extractors/database/bigquery/ui6.png)

## Configure Extraction

Start by clicking the green **+ Add Query** button.

{: .image-popup}
![Screenshot - Big Query Bucket Configured](/extractors/database/bigquery/ui7.png)

Name the query and click Create  

{: .image-popup}
![Screenshot - Big Query Bucket Configured](/extractors/database/bigquery/ui8.png)

Specify your requirements in the `SQL Query` field and **Save** the query configuration.

{: .image-popup}
![Screenshot - Finished Configuration](/extractors/database/bigquery/ui9.png)

Now run the configuration to bring the data to KBC.

{: .image-popup}
![Screenshot - Finished Configuration](/extractors/database/bigquery/ui10.png)

Running the extractor creates a background job that

- Executes the queries in Google BigQuery.
- Saves the results to Google Cloud Storage.
- Exports the results from Google Cloud Storage and stores them in specified tables in Keboola Connection Storage.
- Removes the results from Google Cloud Storage.

*Note: Using Google BigQuery extractor is also described in our [Getting Started Tutorial](https://help.keboola.com/tutorial/ad-hoc/#using-bigquery-extractor).*
