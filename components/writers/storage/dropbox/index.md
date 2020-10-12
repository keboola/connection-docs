---
title: Dropbox
permalink: /components/writers/storage/dropbox/
redirect_from:
    - /writers/storage/dropbox/
---

* TOC
{:toc}

This writer sends tables as CSV or other files into a single [Dropbox](https://www.dropbox.com/) account.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Dropbox** writer.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

You may specify Storage [tables](/storage/tables/) or [files](/storage/files/) to be written to the target Dropbox account. 

- To specify tables, click the **New Table Input** button, and select the table you want to send to Dropbox. 
*Filename* is the name of the destination file, the directory `/data/in/tables/` is ignored.
- To specify files, click **New File Input** and specify a file tag or [Elastic Query string](https://www.elastic.co/guide/en/elasticsearch/reference/6.6/query-dsl-query-string-query.html#query-string-syntax).

{: .image-popup}
![Screenshot - Specify input](/components/writers/storage/dropbox/dropbox-1.png)

The written files will be available in the **Apps/Keboola Connection Writer V2** folder in Dropbox. You can optionally specify 
an additional subfolder in this folder in the `Destination folder` setting. In the above screenshot, the files would be saved 
in the folder `Apps/Keboola Connection Writer V2/samples/monthly`. The configuration can write as many tables and files as you wish.