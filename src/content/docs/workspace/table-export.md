---
title: Exporting Workspace Tables to Files
slug: 'workspace/table-export'
---



You can export a table that lives in a Snowflake or BigQuery workspace schema to [File Storage](/storage/files/)
via the Storage API. The export runs as an asynchronous storage job, and the job result contains the file ID of the
exported file, which can then be downloaded like any other Keboola file.

This is useful when you build data in a workspace (for example, via the [SQL Editor](/workspace/sql-editor/) or a
custom integration) and need to move the resulting table outside of the workspace without going through Storage
output mapping.

Currently supported backends:

- **Snowflake**
- **BigQuery**

## Endpoint

```
POST https://connection.keboola.com/v2/storage/workspaces/{workspace_id}/table-export
X-StorageApi-Token: your_token
Content-Type: application/json

{
    "tableName": "my_table",
    "fileName": "custom_export",
    "fileType": "csv",
    "gzip": true
}
```

### Request Body

| Field       | Type    | Required | Description                                                                                |
|-------------|---------|----------|--------------------------------------------------------------------------------------------|
| `tableName` | string  | yes      | Name of the table (or view) to export from the workspace schema.                           |
| `fileName`  | string  | yes      | Name that will be used for the resulting file in File Storage.                             |
| `fileType`  | string  | no       | Output format: `csv` (default) or `parquet`.                                               |
| `gzip`      | boolean | no       | When `true`, the exported file is gzip-compressed. Default `false`. Ignored for Parquet.   |

### Response

The endpoint returns a standard asynchronous [storage job](/overview/#storage-jobs) with HTTP 202. When the job
finishes, its `results` contain the ID of the exported file:

```json
{
    "file": {
        "id": 12345678
    }
}
```

Download the file with the standard [file download](/storage/api/importer/#download-a-file) flow.

## Backend-Specific Notes

### Snowflake

- Supports **CSV** and **Parquet**.
- Works with all project file storage providers (AWS S3, Azure Blob Storage, Google Cloud Storage).

### BigQuery

- Supports **CSV** and **Parquet**.
- Available for BigQuery projects only; the exported file always lands in the project's GCS file storage.

## Limitations

- The workspace must be a **table workspace**. File/Python/R workspaces are not supported.
- **Reader account** workspaces cannot export data through this endpoint.
- The workspace must use a supported backend (Snowflake or BigQuery).

## API Reference

See the full request/response specification in the
[Storage API reference](https://keboolastorageapi.docs.apiary.io/#reference/workspaces/export-table-from-workspace/export-table-from-workspace).
