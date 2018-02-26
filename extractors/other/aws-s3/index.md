---
title: AWS S3
permalink: /extractors/other/aws-s3/
---

* TOC
{:toc}

This extractor loads a single or multiple CSV files from a single or multiple AWS S3 buckets and stores them in multiple tables in Storage. 
Compared to [Simple AWS S3 extractor](/extractors/other/simple-aws-s3) this extractor offers extensive CSV postprocessing and the UI offers more flexibility.

After creating a new configuration, select the files you want to extract from AWS S3 and determine the way how 
you save them to KBC Storage. You also need to set up the proper permissions on AWS.

## Create New Configuration

Find the AWS S3 Extractor in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/other/aws-s3/ui1.png)

## Setting AWS Credentials

In order to access files in S3 you need to set up AWS credentials. 

{: .image-popup}
![Screenshot - AWS Credentials](/extractors/other/aws-s3/ui2.png)

Use the AWS Access Key Id and Secret Access Key with read permissions to the desired bucket(s) and file(s). 
Make sure that this AWS Access Key ID has the correct permissions:
 
 - `s3:GetObject` for the given key/wildcard
 - `s3:ListBucket` to access all wildcard files
 - `s3:GetBucketLocation` to determine the bucket(s) region
 
You can add the following Policy Document as an Inline Policy to an AWS user:

{% highlight json %}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::mybucket/folder/*"
        },
        {
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:s3:::mybucket"
        }
    ]
}
{% endhighlight %}

## Listing Tables

{: .image-popup}
![Screenshot - List tables](/extractors/other/aws-s3/ui9.png)

The configuration can extract as many tables as you wish. 
Each table has different settings (key, load type, etc.), but they all share the same credentials. 
The list is fully searchable and you can delete or disable each table,
or you can explicitly run extraction of only one table. Also the extraction order of the tables can be changed.  

## Adding Tables

{: .image-popup}
![Screenshot - Create table](/extractors/other/aws-s3/ui3.png)

To create a new table click the **New Table** button and assign a name. 
This name will be used to create the destination table name in Storage and can be modified.
 

### Specifying Files to Download

{: .image-popup}
![Screenshot - S3 Settings](/extractors/other/aws-s3/ui4.png)

For each table you have to specify the AWS S3 bucket and a search key. 
The search key can be a path to a single file or a prefix to multiple files 
(omit the wildcard character and use the **Wildcard** checkbox instead).

### Download Settings

{: .image-popup}
![Screenshot - Download Settings](/extractors/other/aws-s3/ui5.png)

This section allows you to set up 

 - **Wildcard** - S3 key is used as a prefix and all available files with the prefix will be downloaded
 - **Subfolders** - Available only with **Wildcard** turned on. The extractor will also process all subfolders.
 - **New Files Only** - The extractor will keep track of downloaded files and will continue with the unprocessed files 
 on the next run.
 - **Decompress** - All downloaded files will be decompressed (currently supporting ZIP and GZIP). 
 Please note, ZIP files can contain multiple files, which can lead to ambiguity. We recommend using GZIP only.

### Save Settings

{: .image-popup}
![Screenshot - Save Settings](/extractors/other/aws-s3/ui6.png)

 - The initial value in **Table Name** is derived from the configuration table name. You can change it any time, but the bucket, 
where the table will be saved to, cannot be changed.
 - **Incremental Load** will turn on incremental loading to Storage. Result of the incremental load depends on other settings 
(mainly **Primary Key**).
 - **Delimiter** and **Enclosure** specify the CSV settings.

### Header & Primary Key

{: .image-popup}
![Screenshot - Header & Primary Key](/extractors/other/aws-s3/ui7.png)

The table columns 

 - **Set manually** - This option enables the **Set Headers** input to manually specify all columns in the table.
 - **Read from the file(s) header** - This option assumes that each file has a header on the first line. 
 A random file will be chosen to extract the header and the first line in all files will be removed.
 - **Generated automatically** - The columns will be named sequentially as `col_1`, `col_2` and so on.

**Primary Key** can be used to specify Primary key in storage, which can be used with **Incremental Load** 
and **New Files Only** to create a configuration, that incrementally loads all new files into a table in Storage. 


### Audit

{: .image-popup}
![Screenshot - Audit](/extractors/other/aws-s3/ui8.png)

The extractor can optionally add audit columns to the table. `s3_filename` adds processed file name and `s3_row_number` 
adds row number in the source file. 

## Advanced

{: .image-popup}
![Screenshot - Header & Primary Key](/extractors/other/aws-s3/ui10.png)

For more features you can switch configuration of each table to *Power User Mode* (use the **Open JSON editor** link).
This opens an editor with the full configuration in JSON. This includes configuration of the component (all options 
described in the [GitHub repository](https://github.com/keboola/aws-s3-extractor)) and also the 
processors (to learn more about processors see the [Developers Docs](https://developers.keboola.com/extend/docker-runner/processors/)).

Changing the JSON configuration may render the visual form unable to represent the configuration and switching back may 
be disabled. Reverting such changes will re-enable the visual form. But whenever possible, the JSON will translate back 
to the visual form and vice versa. 

## Limitations

 - The extractor can only download 1000 files at once. For downloading more files please use **New Files Only** feature 
 and run the configuration multiple times.

