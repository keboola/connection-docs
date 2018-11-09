---
title: Storage Extractors
permalink: /extractors/storage/
---

Extractors import data from external sources and integrate it to the Keboola Connection (KBC) environment.
The following extractors allow access to data from generic storage services:

- [Simple AWS S3](/extractors/storage/simple-aws-s3) --- imports CSV files from a AWS S3 bucket into a single table.
- [AWS S3](/extractors/storage/aws-s3) --- imports CSV files from multiple AWS S3 buckets into multiple tables with additional postprocessing.
- [Google BigQuery](/extractors/storage/bigquery) --- imports data from a Google Storage Bucket to Keboola Connection (also part of 
the [Tutorial](/tutorial/ad-hoc/#using-bigquery-extractor)).
- [GoogleDrive](/extractors/storage/google-drive/) --- imports data from external data sheets (also part of the [Tutorial](/tutorial/load/googledrive/)).
- [HTTP](/extractors/storage/http/) --- imports a CSV file stored on HTTP or HTTPS.
- [Keboola Connection Storage](/extractors/storage/storage-api/) --- loads single or multiple tables from a Keboola Connection project and
stores them in a bucket in your current project; can be used where [Share Buckets](/storage/buckets/sharing/) cannot.
- and others
