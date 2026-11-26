---
title: Files in Storage
lastUpdated: 2026-11-27
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

Files also keeps the CSV files behind table imports and exports, so it holds a history of the data loaded into your
tables. How tables pass through Files is explained in the [Storage overview](/storage/#how-tables-pass-through-file-storage).

## Before you start

- **A project role that can change data in Storage**, to upload or delete files. The ReadOnly role can't; see [User roles](/management/project/users/#user-roles).
- **A file of up to 2 GB** to upload. Larger files need a sliced upload; see [Limits](#limits).
- **A table in Storage**, to export it as one file.

## Upload a file

**Goal:** an arbitrary file stored in your project, with the tags and the retention you choose.

1. Select the **Files** tab in Storage and then click **Upload Files** in the top right corner.
   <!-- Checked 2026-11-20: button "Upload Files", dialog "Upload new files", checkbox "Store permanently", button "Start upload" (active once a file is selected), read from the Aug 2024 screenshots files.png and files-detail.png. -->

   ![Screenshot - File uploads](/storage/files/files.png)

2. In the following dialog, select a file to upload along with other options:

   ![Screenshot - File upload detail](/storage/files/files-detail.png)

   For each uploaded file, you can enter an arbitrary number of tags in the `Tags` field, 
   separating individual tags by pressing Enter. The tags can be used for filtering files later.

   To avoid files being automatically deleted after 15 days (by default) and to keep them permanently,
   tick **Store permanently**.

3. Click **Start upload**. It is active once a file is selected.

**Result:** the file is listed in Files under the ID it got on upload.

**Check:** the file is in the Files list. If you tagged it, searching for `tags:<your tag>` in the box above the list finds it.

**Important:** The name of an uploaded file does not have to be unique because
files are identified by their ID assigned on upload.

Also by default, uploaded files are marked as *non-public*. They are available only to the project
administrators (those listed in the *Users* section)
and users with Storage [tokens](/management/project/tokens/) who have the permission to *Read all file uploads*.
Users with restricted *Files* permission can access only their own files and the files
they uploaded themselves.

## Copy a file link, download or delete a file

**Goal:** download a file from Files, get a link to it that you can pass on, or delete it.

1. Select the **Files** tab in Storage and find the file in the list. The search box above the list filters it; its placeholder, `tags:tag`, shows how to search by tag.
   <!-- Checked 2026-11-20: search box "Search: tags:tag" above the Files list, Aug 2024 screenshot files.png. -->
2. For each file in Files, you can

   - *copy* its download link with the copy icon next to the file name,
   - *download* the file with the download icon at the right end of its row, and
   - *delete* the file with the bin icon beside it.

   The download and bin icons appear when you point at the row.

   <!-- Checked 2026-11-20: copy icon by the file name, download and bin icons at the row end on hover, Aug 2024 screenshot files-download-file.png; tooltip names not read. -->

   ![Screenshot - File upload detail](/storage/files/files-download-file.png)

**Result:** the file is downloaded or deleted, or its link is copied. What the link looks like and how long it works depends on whether the file is public.

**Check:** paste a copied link into a browser: it downloads the file (for a sliced file, its JSON manifest). A link to a non-public file works for one hour from the moment the list was shown.

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
Merging a sliced file requires a [substantial effort](/storage/api/import-export/#working-with-sliced-files).

## Export a table as one file

**Goal:** a table downloaded from Storage as one merged CSV file, not as slices.

An exported table may be **sliced** and require [substantial effort to reconstruct](/storage/api/import-export/#working-with-sliced-files).
The [Storage overview](/storage/#how-tables-pass-through-file-storage) explains how exports pass through Files.

1. Open the [table detail](/storage/tables/#what-a-table-is) of the table.
2. Click **⋮** (**More actions**, top right) and select **Export table**. To make sure your tables are exported as
   merged files, always export them this way.
3. In the **Export table** dialog, choose the **File Format**: **GZIP (CSV)** (the default), **CSV** or **XLSX**, and
   click **Export**.
   <!-- Checked 2026-11-20 in the UI of project 264: ⋮ (More actions) → Export table → dialog Export table with File Format GZIP (CSV) / CSV / XLSX → Export. The table list also has a bulk Export button. -->

   ![Screenshot - Export table](/storage/tables/table-export.png)
   <!-- TODO(human-review, Nikita): this screenshot shows the older UI with an "Actions" menu; replace it with the current ⋮ → Export table dialog. -->
4. Wait while the table header shows **Preparing export**. When the toast "Table … is ready to download." appears,
   click **Download Now**.

**Result:** one merged file with the table data, downloaded in the format you chose.

**Check:** **Storage → Files** also lists the export as a `.csv.gz` file tagged `table-export`.
<!-- Checked 2026-11-20 in the UI of project 264: after Export the header shows Preparing export, then the toast "Table … is ready to download." with Download Now / Dismiss. Storage → Files then lists two .csv.gz files: one tagged table-export (expires in 1 day) and one storage-merged-export (expires in 14 days). Earlier API check: a table export through the Storage API creates a file in Files, sliced on Snowflake even for a 3-row table. -->

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
