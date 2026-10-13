---
title: Google BigQuery
slug: 'components/extractors/database/bigquery'
redirect_from:
    - /extractors/database/bigquery/
description: Run queries in Google BigQuery and load the results into Storage tables, or as Avro files with the files variant.
---



The BigQuery data source connector loads data from [BigQuery](https://cloud.google.com/bigquery/) and brings it into Keboola. 
Running the connector creates a background job that

- executes the queries in Google BigQuery.
- saves the results to Google Cloud Storage.
- exports the results from Google Cloud Storage and stores them in specified tables in Keboola Storage.
- removes the results from Google Cloud Storage.

<!-- Reference-type page. Avro files section added 2026-10-12 and corrected 2026-10-13 from Jiří Soukup's code-checked review of PR #1183; the rest is the legacy page. -->

***Note:** Using the Google BigQuery connector is also described in our [Getting Started Tutorial](/tutorial/ad-hoc/#using-bigquery-connector).*

## Initial Setup

### Service Account
To access and extract data from your BigQuery dataset, you need to set up a Google service account. Go 
to [**Google Cloud Platform Console > IAM & admin > Service accounts**](https://console.cloud.google.com/iam-admin/serviceaccounts)
and select the project you want the data source connector to have access to. Click **Create Service Account**
and enter a *Service account name* (e.g., `Keboola BigQuery connector`).

![Screenshot - Create service account](/components/extractors/database/bigquery/googlecloud-1.png)

Then add the roles `BigQuery Data Editor`, `BigQuery Job User` and `Storage Object Admin`.

![Screenshot - Set admin roles](/components/extractors/database/bigquery/googlecloud-2.png)

Finally, click **+ Create Key** to create a new JSON key, and then click **Create** to download it to your computer.

![Screenshot - Create JSON key](/components/extractors/database/bigquery/googlecloud-3.png)

### Bucket
The data source connector uses a Google Storage bucket as a temporary storage for off-loading the data from BigQuery.
Go to the [**Google Cloud Platform Console > Storage >  Cloud Storage > Browser**](https://console.cloud.google.com/storage/browser)
and click **Create Bucket**. **Name** the bucket and select its **location** (must be the same as of your dataset).

![Screenshot - Google Cloud Platform](/components/extractors/database/bigquery/googlecloud-4.png)

Do not set a retention policy on the bucket. The bucket contains only temporary data and no retention is needed.

## Configure Extraction
[Create a new configuration](/components/#creating-component-configuration) of the BigQuery connector.
Click **Set Service Account Key**.

![Screenshot - Set Service Account Key](/components/extractors/database/bigquery/bigquery-1.png)

Open the downloaded key in a text editor, copy & paste it in the input field, and click **Submit**. 

![Screenshot - Copy & Paste Service Account Key](/components/extractors/database/bigquery/bigquery-2.png)

Click **Save** to store the credentials.

**Important:** The private key is stored in an **encrypted** form and only the non-sensitive parts are visible in the UI
for your verification. The key can be deleted or replaced by a new one at any time.

![Screenshot - Save Service Account Key](/components/extractors/database/bigquery/bigquery-3.png)

In the section **Unload Configuration**, enter `Cloud Storage Bucket Name` as the name of the bucket 
you [have created earlier](#bucket), and select the correct *Dataset Location*. Click **Save**.

![Screenshot - Configure Bucket](/components/extractors/database/bigquery/bigquery-4.png)

### Configure Queries
Start by clicking the button **Add Query**.

![Screenshot - Add Query](/components/extractors/database/bigquery/bigquery-5.png)

Name the query and click **Create**.  

![Screenshot - Name Query](/components/extractors/database/bigquery/bigquery-6.png)

To learn how to modify your configuration, go to the [SQL databases section](/components/extractors/database/sqldb/#modify-configuration).

## Avro files variant

The **Google BigQuery avro files** connector (`keboola.ex-google-bigquery-v2-avro-files`) is configured the same way, with the service account, the bucket and the queries, but it does not write the query results into Storage tables. Each query's result is exported to one Avro file in [Storage Files](/storage/files/) instead. Use it when the next step of your pipeline works with files, for example a transformation or a [processor](/extend/component/processors/) that reads Avro.

Because each result goes to a single file, it is bound by BigQuery's limit of [1 GB per exported file](https://cloud.google.com/bigquery/docs/exporting-data); a larger result fails. The main connector unloads its results into several files through a wildcard, so this limit does not apply to it.

<!-- Source for this section: Jiří Soukup's review of PR #1183 (13 Oct 2026), checked against the developer portal and the component code: name and id as above, one query = one file with no wildcard. The component is not listed in /v2/storage on the five multi-tenant stacks; whether it should stay documented is an open product question. -->
