---
title: Storage Extractors
permalink: /components/extractors/storage/
redirect_from:
    - /extractors/storage/

---

Extractors import data from external sources and integrate it to the Keboola Connection (KBC) environment.
The following extractors allow access to data from generic storage services:

- [Simple AWS S3](/components/extractors/storage/simple-aws-s3) --- imports CSV files from a AWS S3 bucket into a single table.
- [AWS S3](/components/extractors/storage/aws-s3) --- imports CSV files from multiple AWS S3 buckets into multiple tables with additional postprocessing.
- [GoogleDrive](/components/extractors/storage/google-drive/) --- imports data from external data sheets (also part of the [Tutorial](/tutorial/load/googledrive/)).
- [FTP](/components/extractors/storage/ftp) --- imports CSV files from the FTP, FTPS, and SFTP servers.
- [HTTP](/components/extractors/storage/http/) --- imports CSV files stored on HTTP or HTTPS.
- [Keboola Connection Storage](/components/extractors/storage/storage-api/) --- loads single or multiple tables from a Keboola Connection project and
stores them in a bucket in your current project; can be used where [Share Buckets](/storage/buckets/sharing/) cannot.
- and [others](https://components.keboola.com/components)
