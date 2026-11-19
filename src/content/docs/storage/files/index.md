---
title: Files in Storage
slug: 'storage/files'
sidebar:
  label: Files
description: 'Upload a file to File Storage, tag it and keep it, share it with a link, and export a table as one file. Also file size and retention limits.'
search_keywords: [files, file storage, upload file, file link, download file, sliced file, file tags, export table]
redirect_from:
    - /storage/file-uploads/
    - /storage/tables/uploads/
---

The *File Storage* is available in the **Files** section of Storage and contains all raw files uploaded to your project. This page shows how to upload a file, pass it on with a link and export a table as one file, and lists the limits.

<!-- How-to-type page. Source: the former Files and Table import and export pages on main; text carried over and checked against them 2026-11-19. -->

It also contains files with data exported from tables. These are created when you request to export a table from *Table Storage*. The *File Storage* serves two main purposes:

1. Files can be used to store an arbitrary file.
2. Every data table file is stored in Files before it is processed and pushed into a table.

:::note[Table imports and exports pass through Files]
All tables imported to and exported from Storage go through Files.

When a table is **imported** into Storage by any means (manually, through a data source connector, or as a result of running an application),
the CSV file is first stored in *Files* and only then imported to an actual table. 
This means that the Storage Files contain a history of data uploaded to the Storage Tables. 
It is useful mainly in the two following cases:

1. [Reverting table](/storage/tables/) content to a particular imported version
2. Analyzing how something got into a table (useful mainly for incremental loads)

To find the file behind an import, open the import job in [Storage jobs](/storage/jobs/#find-the-file-a-job-loaded) and click its **File ID**.
:::

## Upload a file

**Goal:** an arbitrary file stored in your project, with the tags and the retention you choose.

1. To store an arbitrary file, select the Files tab in Storage and then click **Upload File** in the top right corner.
   <!-- VERIFY(Nikita): the screenshot below shows the button as "Upload files". Check the current label. -->

   ![Screenshot - File uploads](/storage/files/files.png)

2. In the following dialog, select a file to upload along with other options:

   ![Screenshot - File upload detail](/storage/files/files-detail.png)

   For each uploaded file, you can enter an arbitrary number of tags in the `Tags` field, 
   separating individual tags by pressing Enter. The tags can be used for filtering files later.

   To avoid files being automatically deleted after 15 days (by default) and to keep them permanently,
   do not forget to tick the respective checkbox.

3. Click **Start upload**.

**Result:** the file is listed in Files under the ID it got on upload.

**Important:** The name of an uploaded file does not have to be unique because
files are identified by their ID assigned on upload.

Also by default, uploaded files are marked as *non-public*. They are available only to the project
administrators (those listed in the *Users* section)
and users with Storage [tokens](/management/project/tokens/) who have the permission to *Read all file uploads*.
Users with restricted *Files* permission can access only their own files and the files
they uploaded themselves.

## Copy a file link, download or delete a file

**Goal:** download a file from Files, get a link to it that you can pass on, or delete it.

1. Select the Files tab in Storage and find the file.
2. For each file in Files, you can

   - *copy* its download link,
   - *download* the file, and
   - *delete* the file.

   ![Screenshot - File upload detail](/storage/files/files-download-file.png)

**Result:** the file is downloaded or deleted, or its link is copied. What the link looks like and how long it works depends on whether the file is public.

### File links

If you copy a link of a non-public file, you will obtain a URL in the following format:

    https://s3.amazonaws.com/kbc-sapi-files/exp-15/1134/files/2016/06/12/191341241.private.csv?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJ2N244XSWYVVYVLQ%2F20160617%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20160617T174909Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=30007ae706388816aaf3bd9ad585d9a30df6ab50dcc126881efbe6423ef57909

Such a URL is valid for only one hour from the time of its generation — the time when the File upload list 
was shown to you, not when you clicked the link.

**Important:** The URL itself does not require any other authorization.
That is, you can send a link to non-public files to people without access to your Keboola project and they
will be able to download that file via the direct link. However, they will not be able to generate 
or guess the link themselves.

If you copy a link to a public file, you will obtain a URL in the following format:

    https://s3.amazonaws.com/kbc-sapi-files/exp-15/1134/files/2016/06/17/192119408.public.csv

Such a URL is valid for the entire validity of the file itself (either 15 days or forever).

In some cases, the file may be **sliced**. When you encounter a *sliced file*, you will 
obtain a [JSON](https://en.wikipedia.org/wiki/JSON) manifest file instead of the actual file. 
This can happen for some [exported or imported tables](#export-a-table-as-one-file) from Storage or files which are particularly large.
Merging a sliced file requires a [substantial effort](https://developers.keboola.com/integrate/storage/api/import-export/#working-with-sliced-files).

## Export a table as one file

**Goal:** a table downloaded from Storage as one merged CSV file, not as slices.

Every time a table is **exported** from Storage, the process is reversed: first, a file is
created in *Files* and then it is actually downloaded from there. This does not apply when exporting
Storage tables manually though.
Beware, however, that due to the nature of database exports, the exported table may be **sliced** and require
[substantial effort to reconstruct](https://developers.keboola.com/integrate/storage/api/import-export/#working-with-sliced-files).

1. Open the [table detail](/storage/tables/#what-a-table-is) of the table.
2. To make sure your tables are exported as merged files, always use the **Export** feature in
   the **Action** tab of the table detail:
   <!-- VERIFY(Nikita): the screenshot below shows an older UI with an "Actions" menu. Check where Export is in the current table detail. -->

   ![Screenshot - Export table](/storage/tables/table-export.png)

**Result:** one merged CSV file with the table data.

## Limits

The maximum allowed size of an uploaded file is currently 2 GB (2,048,000,000 bytes exactly). 
This applies to both file and table uploads. 
The actual table size may be bigger, because the table is uploaded as a compressed file. 
If you need to upload a larger file, you need to use 
sliced upload. 
In that case, the limit applies to the chunk size.

As stated above, unless marked as permanent, each file will be automatically deleted 15 days after its creation. 
This also applies to automatically generated files as a result of table imports and exports. 
In addition, because the majority of Keboola File Storage contains duplicates of your table data, 
the whole Files storage does not count towards your project quota.

**Next:** [Storage jobs →](/storage/jobs/)
