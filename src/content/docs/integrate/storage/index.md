---
title: Storage
slug: 'integrate/storage'
---


As the central Keboola component, Storage

- Keeps all data in [**buckets** and **tables**](/storage/);
- Controls access to the data using **tokens**;
- Logs all data manipulations as **events**;
- Maintains the index of all other Keboola **components** and stores their **configurations**.

All this (and a few other things) is available through [Storage API (SAPI)](https://api.keboola.com/?service=storage).
To authorize access to a specific project, most calls to Storage API require
a [Storage API Token](/storage/tokens/) along with your request.
It is required regardless of whether you use the bare API or any of the clients.

## Storage API Clients
Although you can work directly with the API, we recommend using one of our Storage API clients, as they simplify some tasks.
There are four Storage clients with different feature sets available:

1. [PHP client library](https://github.com/keboola/storage-api-php-client) --- a PHP library supporting most of the Storage API features;
use it programmatically in PHP.
2. [R client library](/storage/api/clients/r-client/) --- an R library supporting most data manipulation features of the Storage API;
use it programmatically in R.
3. [Python client library](/storage/api/clients/python-client/) --- a Python library supporting most data manipulation features and
workspace manipulation features of the Storage API; use it programmatically in Python.
4. [Docker CLI client](https://github.com/keboola/storage-api-cli) --- a CLI (command line interface) application supporting
basic data manipulation features of the Storage API; use it from the command line provided that you have Docker available.

Additional tools:

- [Storage API Console](https://storage-api-console.keboola.com/) --- a UI to work with Keboola Storage;
this is accessible to anyone with a Storage Token (not necessarily a Keboola project administrator)
- [Table Importer Service](/storage/api/importer/) --- a service designed for simplified table loads

The client choice is purely up to you, but it is best to use the most straightforward solution.

## Table Imports and Exports
Tables are imported to and exported from Storage via asynchronous (background) jobs.

- When importing a table, the actual data is first transported to an Amazon S3 storage,
and then bulk is loaded into the internal database in Storage. Similarly,
- When exporting a table, the data is first offloaded to an Amazon S3 storage and downloaded from there.

While this process is much more complicated than a simple file upload or download,
it offers better **manageability** and **traceability** features.
Use one of the above mentioned clients to import and export your data. The client will handle the entire process
without you worrying about the technical details.

If all you need is to import data into Storage (for example, for project prototyping), you may
also use the [Storage Importer Service](/storage/api/importer/).

Still interested in handling the file uploads/downloads manually?
[Read on](/storage/api/import-export/).
