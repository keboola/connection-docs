---
title: Table Uploads
permalink: /storage/tables/uploads/
---

All tables imported to and exported from Storage go through [File uploads](/storage/file-uploads/).

When a table is **imported** into Storage by any means (manually, through an extractor, or as a result of running an application),
the CSV file is first stored in *Files* and only then imported to an actual table. This means that the Storage Files contain a 
history of data uploaded to the Storage Tables. This is useful mainly in the two following cases:

1. [reverting table](/storage/tables/#events) content to a particular imported version
2. analyzing how something got into a table (useful mainly for incremental loads)

Every time a table is **exported** from Storage, the process is reversed: first a file is
created in *Files* and then it is actually downloaded from there. This does not apply when exporting
Storage tables manually though.
Beware, however, that due to the nature of database exports, the exported table may be *sliced* and require
[substantial effort to reconstruct](http://developers.keboola.com/integrate/storage/api/import-export/#working-with-sliced-files).
To make sure your tables are exported as merged files, always use the **Export** feature in 
the **Action** tab of the table detail:

{: .image-popup}
![Screenshot - Export table](/storage/tables/table-export.png)
