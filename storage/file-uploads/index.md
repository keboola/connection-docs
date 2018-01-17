---
title: Files
permalink: /storage/file-uploads/
---

* TOC
{:toc}

The *File Storage* is available in the **Files** section of Storage and contains all raw files uploaded to your project.
It also contains files with data exported from tables. These are created when you request to export a table from *Table Storage*. The *Files Storage* serves two main purposes:

1. Files can be used to store an arbitrary file.
2. Every data table file is stored in Files before it is processed and pushed into a table.

## Uploading File
To store an arbitrary file, select the Files tab in Storage and then click **Upload** in the top right corner.

{: .image-popup}
![Screenshot - File uploads](/storage/file-uploads/file-uploads.png)

In the following dialog, select a file to upload along with other options:

{: .image-popup}
![Screenshot - File upload detail](/storage/file-uploads/file-upload-detail.png)

For each uploaded file, you can enter an arbitrary number of tags in the `Tags` field, 
separating individual tags by pressing Enter. The tags can be used for filtering files later.

**Important:** The name of an uploaded file does not have to be unique because
files are identified by their ID assigned on upload.

To avoid files being automatically deleted after 180 days (by default) and to keep them permanently,
do not forget to tick the respective checkbox.

Also by default, uploaded files are marked as *non-public*. They are available only to the project
administrators (those listed in the *Users & Settings* section)
and users with Storage [tokens](/management/project/tokens/) who have the permission to *Read all file uploads*.
Users without the *Read all file uploads* permission can access only their own files and the files
they uploaded themselves.
For each file in Files, you can

- *copy* its download link,
- *download* the file, and
- *delete* the file.

{: .image-popup}
![Screenshot - File upload detail](/storage/file-uploads/file-uploads-download-file.png)

## File Links
If you copy a link of a non-public file, you will obtain a URL in the following format:

    https://s3.amazonaws.com/kbc-sapi-files/exp-180/1134/files/2016/06/12/191341241.private.csv?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJ2N244XSWYVVYVLQ%2F20160617%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20160617T174909Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=30007ae706388816aaf3bd9ad585d9a30df6ab50dcc126881efbe6423ef57909

Such a URL is valid for only one hour from the time of its generation --- the time when the File upload list 
was shown to you, not when you clicked the link.

**Important:** The URL itself does not require any other authorization.
That is, you can send a link to non-public files to people without access to your KBC project and they
will be able to download that file via the direct link. However, they will not be able to generate 
or guess the link themselves.

If you copy a link to a public file, you will obtain a URL in the following format:

    https://s3.amazonaws.com/kbc-sapi-files/exp-180/1134/files/2016/06/17/192119408.public.csv

Such a URL is valid for the entire validity of the file itself (either 180 days or forever).

In some cases, the file may be **sliced**. When you encounter a *sliced file*, you will 
obtain a [JSON](https://en.wikipedia.org/wiki/JSON) manifest file instead of the actual file. 
This can happen for some [exported or imported tables](/storage/tables/uploads/) from Storage or files which are particularly large.
Merging a sliced file requires a [substantial effort](https://developers.keboola.com/integrate/storage/api/import-export/#working-with-sliced-files).

## Limits
The maximum allowed size of an uploaded file is currently 5GB (5,368,709,120 bytes exactly). 
This applies to both file and table uploads. 
The actual table size may be bigger, because it is uploaded as a compressed file. 
If you need to upload a larger file, you need to use 
[sliced upload](https://docs.keboola.apiary.io/#reference/files/upload-file). 
In that case, the limit applies to the chunk size.

As stated above, unless marked as permanent, each file is automatically deleted 180 days after it has been created. 
This also applies to automatically generated files as a result of table imports and exports. 
Also, because the majority of KBC File Storage contains duplicates of your table data, 
the whole Files storage does not count towards your project quota.
