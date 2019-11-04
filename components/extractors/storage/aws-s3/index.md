---
title: AWS S3
permalink: /extractors/storage/aws-s3/
redirect_from:
    - /extractors/other/aws-s3/
---

* TOC
{:toc}

This extractor loads a single or multiple CSV files from a single or multiple AWS S3 buckets and stores them in multiple tables 
in Keboola Connection (KBC) Storage.
Compared to the [Simple AWS S3 extractor](/extractors/storage/simple-aws-s3), it offers extensive CSV postprocessing
and its UI gives you more flexibility.

After creating a new configuration, select the files you want to extract from AWS S3 and determine the way how
you save them to KBC Storage. You also need to set up the proper permissions on AWS.

## Create New Configuration

Find the AWS S3 extractor in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/storage/aws-s3/ui1.png)

## Set AWS Credentials

In order to access the files in S3, you need to set up AWS credentials.

{: .image-popup}
![Screenshot - AWS Credentials](/extractors/storage/aws-s3/ui2.png)

Use the AWS Access Key ID and the Secret Access Key with read permissions to the desired S3 bucket(s) and file(s).
Make sure this AWS Access Key ID has the correct permissions:

 - `s3:GetObject` for the given key/wildcard
 - `s3:ListBucket` to access all wildcard files
 - `s3:GetBucketLocation` to determine the region of the S3 bucket(s)

You can add the following policy document as an inline policy to an AWS user:

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

## Add Tables

{: .image-popup}
![Screenshot - Create table](/extractors/storage/aws-s3/ui3.png)

To create a new table, click the **New Table** button and assign a name.
It will be used to create the destination table name in Storage and can be modified.

## List Tables

{: .image-popup}
![Screenshot - List tables](/extractors/storage/aws-s3/ui9.png)

The configuration can extract as many tables as you wish.
The list is fully searchable, and you can delete or disable each table. In addition, you can explicitly run extraction of only one table.
The extraction order of the tables can be changed.

## Modify Table

Each table has different settings (key, load type, etc.) but they all share the same AWS credentials.

### Source

{: .image-popup}
![Screenshot - S3 Settings](/extractors/storage/aws-s3/ui4.png)

For each table you have to specify an AWS **S3 Bucket** and a **Search Key**.
The **Search Key** can be a path to a single file or a prefix to multiple files
(omit the wildcard character and use the **Wildcard** checkbox instead).

The **additional source settings** section allows you to set up the following:

 - **New Files Only**: The extractor will keep track of the downloaded files and will continue with the unprocessed files
 on the next run. To reset the state which keeps track of the progress and enables to continue with new files, 
 use the **Reset State** button or uncheck the **New Files Only** option and run the extractor again. 
 - **Wildcard**: **Search Key** is used as a prefix, and all available files matching the prefix will be downloaded.
 - **Subfolders**: Available only with **Wildcard** turned on. The extractor will also process all subfolders.
 

### CSV Settings

{: .image-popup}
![Screenshot - CSV Settings](/extractors/storage/aws-s3/ui5.png)

- **Delimiter** and **Enclosure** specify the CSV format settings.
- **Header** specifies how the destination table column names are obtained:
  - **CSV file(s) contain(s) a header row**: All downloaded files contain a row with the CSV header. The extractor obtains 
  the header from a randomly selected downloaded file. 
  - **Set column names manually**: None of the downloaded files does contain a header row and you will use the **Column Names**
  input to specify the headers manually.
  - **Generate column names as col_1, col_2, etc.**: None of the downloaded files contains a header row, and 
  the extractor will generate the column names automatically as a sequential number with the `col_` prefix.
                 
### Destination

{: .image-popup}
![Screenshot - Destination](/extractors/storage/aws-s3/ui6.png)

- The initial value in **Storage Table Name** is derived from the configuration table name. You can change it at any time; however,
the [Storage bucket](/storage/buckets/) where the table will be saved cannot be changed.
- **Incremental Load** will turn on [incremental loading to Storage](/storage/tables/#incremental-loading). The result of the
incremental load depends on other settings (mainly **Primary Key**).
- **Primary Key** can be used to specify the primary key in Storage; it can be used with **Incremental Load**
and **New Files Only** to create a configuration that incrementally loads all new files into a table in Storage.

## Processing Settings

{: .image-popup}
![Screenshot - Processing Settings](/extractors/storage/aws-s3/ui7.png)

 - **Decompress**: All downloaded files will be decompressed (currently supporting ZIP and GZIP). All files in all archives
 will be imported into a single Storage table.
 - **Add Filename Column**: A new column `s3_filename` is added to the table and will contain the original filename 
 including the relative path to the **Search Key**.
 - **Add Row Number Column**: A new column `s3_row_filename` is added to the table and will contain the row number in each 
 of the downloaded files.

## Advanced Mode

{: .image-popup}
![Screenshot - Advanced](/extractors/storage/aws-s3/ui10.png)

For more features, switch the configuration of each table to the **Power User Mode** by clicking the *Open JSON editor* link.
Through editing the full JSON configuration you can set up the component (all options are
described in the [GitHub repository](https://github.com/keboola/aws-s3-extractor)) and also the
processors (to learn more about processors, see the [Developers Docs](https://developers.keboola.com/extend/docker-runner/processors/)).

Changing the JSON configuration may render the visual form unable to represent the configuration, and switching back may
be disabled. Reverting such changes will re-enable the visual form. But whenever possible, the JSON will translate back
to the visual form and vice versa.

## Limitations

All files stored in [AWS Glacier](https://aws.amazon.com/glacier/) are ignored.
