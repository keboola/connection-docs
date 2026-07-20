---
title: Storage API
slug: 'integrate/storage/api'
---


If you are new to Keboola, you should make yourself familiar with
the [Storage component](/storage/) before you start using it.
For a general introduction to working with Keboola APIs, see the [API Introduction](/overview/api/).
[Storage API](https://api.keboola.com/?service=storage) provides a number of functions. These are the most important ones:

- [Component configurations](https://api.keboola.com/?service=storage#tag--Component-Configurations)
- [Storage tables](https://api.keboola.com/?service=storage#tag--Tables)
- [File uploads](https://api.keboola.com/?service=storage#tag--Files)
- [Storage buckets](https://api.keboola.com/?service=storage#tag--Buckets)

Virtually, all API calls require a [Storage API token](/storage/tokens/) to
be passed as the `X-StorageApi-Token` header.
Please note that the Storage API calls require the request to be sent
as `form-data` (unlike the rest of Keboola API, which is sent as `application/json`).

For exporting tables from and importing tables to Storage, we highly recommend that you use one of the
[available clients](/integrate/storage/) or the [Storage API Importer service](/integrate/storage/api/importer/).
All imports and exports are done using CSV files. See
the [RFC4180 Specification](https://tools.ietf.org/html/rfc4180) for the format
and encoding specification, and
[User documentation](/storage/tables/csv-files/) for help on how to create such files.

Continue reading the following sections for guidance on how to get started:

- [Storage importer service for the easiest upload of data via API](/integrate/storage/api/importer/)
- [Getting started with component configurations](/integrate/storage/api/configurations/)
- [Importing and exporting data](/integrate/storage/api/import-export/)
- [TDE exporter for exporting data to Tableau Data Extracts](/integrate/storage/api/tde-exporter/)
