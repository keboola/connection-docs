---
title: Simple AWS S3
permalink: /extractors/storage/simple-aws-s3/
redirect_from:
    - /extractors/other/simple-aws-s3/
---

* TOC
{:toc}

This extractor loads a single or multiple CSV files from AWS S3 and stores them in a **single table** in Storage.
After creating a new configuration, select the files you want to extract from S3 and determine the way how
you save them to KBC Storage. You also need to set up the proper permissions in [AWS](#aws-credentials).

For a more complex AWS S3 extractor allowing you to use multiple S3 buckets and multiple tables in Storage, please
see the [AWS S3 extractor](/extractors/storage/aws-s3).

## Create New Configuration
Find the Simple AWS S3 extractor in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/storage/simple-aws-s3/ui1.png)

## Specify Source and Destination

In the **General** tab, specify the S3 files you want to import and the resulting destination tables in Storage.

{: .image-popup}
![Screenshot - General configuration](/extractors/storage/simple-aws-s3/ui2.png)

### Specify Source Files

Specify the files you want to import from S3.

- **Bucket and Key**: In the first part of the configuration, specify the AWS S3 bucket and the filename (key).
The S3 bucket can be in any AWS region, and the key must point to a single file unless you check the **Wildcard** checkbox.

  All files stored in [AWS Glacier](https://aws.amazon.com/glacier/) are ignored.

- **Wildcard**: If the option is turned on, all files in S3 with the defined key prefix will be downloaded.
They must have the same header. The subfolders matching the prefix will be ignored.

  To give an **example**, the following folder and file structure is stored in the AWS S3 bucket:

  ```
  /file1.csv
  /file2.csv
  /file-folder/file1.csv
  /folder/file1.csv
  ```

  If you set the **Key** to `file` and check the **Wildcard** checkbox, the following files will be downloaded:

  ```
  /file1.csv
  /file2.csv
  ```

### Save Files to Storage

Now configure how the files will be saved to KBC Storage:

- **Destination**: The table names are predefined. However, they can be modified or replaced entirely.
You can also select an already existing table.

- **Incremental Load**: This option allows you to add new data to a table without truncating it.
The files extracted from S3 stay the same. The only thing that changes is the way the data is loaded into Storage.

- **Primary Key**: The primary key of an existing table cannot be modified; only new tables can set their primary keys.
To change the primary key of an existing table, go to the table detail in Storage.

## AWS Credentials

{: .image-popup}
![Screenshot - AWS Credentials configuration](/extractors/storage/simple-aws-s3/ui3.png)


Use the AWS Access Key Id and Secret Access Key with read permissions to the desired S3 bucket and file(s).
Make sure that this AWS Access Key ID has the correct permissions:

 - `s3:GetObject` for the given key/wildcard
 - `s3:ListBucket` to access all wildcard files
 - `s3:GetBucketLocation` to determine the S3 bucket region

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
            "Resource": "arn:aws:s3:::mybucket/folder/file.csv"
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

### Set Up New AWS S3 Bucket

Alternatively, you can use our [AWS CloudFormation template](https://github.com/keboola/s3-extractor/blob/master/aws-services.json)
to create a new S3 bucket and a pair of users one of which has write permissions and the other only read-only permissions.
Give the write permissions to the application storing files in CSV and the read-only permissions to the S3 extractor.

## Advanced Options

{: .image-popup}
![Screenshot - Advanced configuration](/extractors/storage/simple-aws-s3/ui4.png)

In this section, you can modify the delimiter and enclosure of the CSV file.
The default values are based on [RFC 4180](https://tools.ietf.org/html/rfc4180).
