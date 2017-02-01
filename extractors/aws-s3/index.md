---
title: AWS S3
permalink: /extractors/other/aws-s3/
redirect_from:
  - /extractors/s3/
  - /extractors/aws-s3/
---

* TOC
{:toc}

This extractor loads a single or multiple CSV files from AWS S3 and stores them in a table in Storage.

## Create New Configuration
Find AWS S3 Extractor in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/aws-s3/ui1.png)

## Selecting Files from S3

{: .image-popup}
![Screenshot - General configuration](/extractors/aws-s3/ui2.png)


### Bucket and Key

In the first part of the configuration you need to specify the AWS S3 bucket and the filename (key). 
The bucket can be in any AWS region and the key must point to a single file, unless you check the **Wildcard** checkbox.

### Wildcard

If the wildcard is turned on, all files in S3 with the defined Key prefix will be downloaded. 
All files need to have the same header. Subfolders matching the prefix will be ignored. 

## Saving to Storage

A table name is predefined, but you can modify it and use any other name or select an existing table.  

### Incremental Load

Incremental Load allows you to add new data to the table without truncating it. 
It does not affect which files are extracted from S3, only how the data is loaded into Storage.

### Primary Key

The primary key of an existing table cannot be modified, only new tables can set their primary keys. 
To change the primary key of an existing table, go to the table detail in Storage.  

## AWS Credentials

{: .image-popup}
![Screenshot - AWS Credentials configuration](/extractors/aws-s3/ui3.png)


Use the AWS Access Key Id and Secret Access Key with read permissions to the desired bucket and file(s). 
Make sure that this AWS Access Key ID has the correct permissions. The required permissions are
 
 - `s3:GetObject` for the given key/wildcard
 - `s3:ListBucket` to access all wildcard files
 - `s3:GetBucketLocation` to determine the bucket region
 
You can add the following Policy Document as an Inline Policy to an AWS user

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

### Setting Up a New AWS S3 Bucket

Alternatively you can use our [AWS CloudFormation template](https://github.com/keboola/s3-extractor/blob/master/aws-services.json) 
to create a new S3 bucket and a pair of users, one of which has write permissions and the other only read-only permissions. 
You will give the write permissions to the application storing files in CSV and the read-only permissions to the S3 extractor.  

## Advanced

{: .image-popup}
![Screenshot - Advanced configuration](/extractors/aws-s3/ui4.png)


In this section you can modify the delimiter and enclosure of the CSV file. 
The default values are based on [RFC 4180](https://tools.ietf.org/html/rfc4180).

