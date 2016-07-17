---
title: File Uploads
permalink: /storage/file-uploads/
---

* TOC
{:toc}


The File uploads section of Storage contains all raw files uploaded to your project.
This serves two main purposes:

- file uploads can be used to store an arbitrary file
- every data table file is stored in File uploads before it is processed and pushed into a table

## File uploads
To store an arbitrary file, go to file uploads:

{: .image-popup}
![Screenshot - File uploads](/storage/file-uploads/file-uploads.png)

In the following dialog, you can select a file to upload along with other options:

{: .image-popup}
![Screenshot - File upload detail](/storage/file-uploads/file-upload-detail.png)

To each uploaded file, you can enter an arbitrary number of tags. When uploading a file, enter tags in the
`Tags` field (separate individual tags by pressing enter). The tags can be used to later filter files. Note that the
file name of the uploaded file does not have to be unique. Files are identified by their ID which is assigned
on upload.

By default, every file will be automatically deleted after 180 days. If you wish to keep a file permanently,
do not forget to tick the respective checkbox.

Also by default, the file will be available only to project
administrators (those listed in the *Users & Settings* section) and users with Storage
[tokens](/storage/tokens/) who have the permission to *Read all file uploads*.
For each file in File uploads, you can *copy its download link*, *download the file* and *delete the file*.

{: .image-popup}
![Screenshot - File upload detail](/storage/file-uploads/file-uploads-download-file.png)

If you copy a link of a non-public file, you will obtain an URL in the following format:

    https://s3.amazonaws.com/kbc-sapi-files/exp-180/1134/files/2016/06/12/191341241.private.csv?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJ2N244XSWYVVYVLQ%2F20160617%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20160617T174909Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=30007ae706388816aaf3bd9ad585d9a30df6ab50dcc126881efbe6423ef57909

Such a URL is valid only one hour from the time of its generation - the time when the File upload list was shown to you,
not when you clicked the link. Also note that the URL itself does not require any other authorization.
That is, you can send a link to non-public files to people without access to your KBC project, and they
will be able to download that file via the direct link. However, they will not be able to generate or guess the link
themselves.

If you copy a link to a public file, you will obtain a URL in the following format:

    https://s3.amazonaws.com/kbc-sapi-files/exp-180/1134/files/2016/06/17/192119408.public.csv

Such a URL is valid for the entire validity of the file itself (either 180 days or forever).

## Table Uploads
All tables imported to and exported from Storage go through file uploads.

When a table is imported into Storage by any means (manually, through an extractor, as a result of running an application),
the CSV file is first stored in File uploads and only then imported to an actual table. This is useful mainly in two
cases:

- you need to [revert table](/storage/tables/#events) content to a particular imported version
- analyze how something got into a table (useful mainly for incremental loads)

Every time a table is exported from Storage, the process is reversed - i.e., first a file is
created in file uploads and then you actually download it from there. Beware however that due to the
nature of database exports, an exported table may be sliced and require
[substantial effort to reconstruct](http://developers.keboola.com/integrate/storage/api/import-export/#working-with-sliced-files). For
exporting tables, you should always use the feature in [table detail](/storage/tables/#export) which
produces merged files.

Unless marked as permanent, each file will be automatically deleted 180 days after it has been created. This
also applies to automatically generated files as a result of table imports and exports. Also, because the
majority of KBC File Storage contains duplicates of your table data, the whole storage does not
count towards your project quota.

