---
title: AWS S3
permalink: /components/extractors/storage/aws-s3/
redirect_from:
    - /extractors/other/aws-s3/
---

* TOC
{:toc}

This data source connector loads a single or multiple CSV files from a single or multiple AWS S3 buckets and stores them in multiple tables 
in Keboola Storage.

After creating a new configuration, select the files you want to extract from AWS S3 and determine how
you save them to Keboola Storage. You also need to set up proper permissions on AWS.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **AWS S3** connector.

In order to access the files in S3, you need to set up AWS credentials or create an AWS role.

### Authentication with AWS credentials

{: .image-popup}
![Screenshot - AWS Credentials](/components/extractors/storage/aws-s3/aws-s3-1.png)

Select `Credentials` as the **Login Type**. Use the AWS Access Key ID and the Secret Access Key with read permissions to the desired S3 bucket(s) and file(s).
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

### Authentication with AWS role

{: .image-popup}
![Screenshot - AWS Credentials](/components/extractors/storage/aws-s3/aws-s3-2.png)

Select `Role` as the **Login Type**. Create a role in your AWS account using the following steps:

 - Go to the [IAM Console](https://console.aws.amazon.com/iam/home?#/roles) and click **Create role**. Then click **Another AWS account**.
 - For **Account ID**
   - use `147946154733` for stacks `connection.keboola.com`, `connection.eu-central-1.keboola.com`, `https://connection.north-europe.azure.keboola.com/`.
   - use `206948715642` for all other stacks.
 - For **External ID**, enter the value from your project.
 - **Do not enable the setting to Require MFA (multi-factor authentication)**.
 - On the next page, attach the policy:
    - `s3:GetObject` for the given key/wildcard
    - `s3:ListBucket` to access all wildcard files
    - `s3:GetBucketLocation` to determine the region of the S3 bucket(s)
 - Or, you can create a new inline policy:
 
{% highlight json %}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::mybucket/*"
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
 - On the last page, set the **Role name** and click **Create role**.
 
In your project, fill in your **Account ID** and **Role Name**.

## Add Tables
To create a new table, click the **New Table** button and assign it a name.
It will be used to create the destination table name in Storage and can be modified.

{: .image-popup}
![Screenshot - Create table](/components/extractors/storage/aws-s3/aws-s3-3.png)

Configured tables are stored as [configuration rows](/components/#configuration-rows).
Each table has different settings (key, load type, etc.) but they all share the same AWS credentials.

### Source

{: .image-popup}
![Screenshot - S3 Settings](/components/extractors/storage/aws-s3/aws-s3-4.png)

For each table you have to specify an AWS **S3 Bucket** and a **Search Key**.
The **Search Key** can be a path to a single file or a prefix to multiple files
(omit the wildcard character and use the **Wildcard** checkbox instead).

The **additional source settings** section allows you to set up the following:

 - **New Files Only**: The connector will keep track of the downloaded files and will continue with the unprocessed files
 on the next run. To reset the state which keeps track of the progress and enables to continue with new files, 
 use the **Reset State** button or uncheck the **New Files Only** option and run the connector again. 
 - **Wildcard**: **Search Key** is used as a prefix, and all available files matching the prefix will be downloaded.
 - **Subfolders**: Available only with **Wildcard** turned on. The connector will also process all subfolders.
 

### CSV Settings

{: .image-popup}
![Screenshot - CSV Settings](/components/extractors/storage/aws-s3/aws-s3-5.png)

- **Delimiter** and **Enclosure** specify the CSV format settings.
- **Header** specifies how the destination table column names are obtained:
  - **CSV file(s) contain(s) a header row**: All downloaded files contain a row with the CSV header. The connector obtains 
  the header from a randomly selected downloaded file. 
  - **Set column names manually**: None of the downloaded files does contain a header row and you will use the **Column Names**
  input to specify the headers manually.
  - **Generate column names as col_1, col_2, etc.**: None of the downloaded files contains a header row, and 
  the connector will generate the column names automatically as a sequential number with the `col_` prefix.
                 
### Destination

{: .image-popup}
![Screenshot - Destination](/components/extractors/storage/aws-s3/aws-s3-6.png)

- The initial value in **Storage Table Name** is derived from the configuration table name. You can change it at any time; however,
the [Storage bucket](/storage/buckets/) where the table will be saved cannot be changed.
- **Incremental Load** will turn on [incremental loading to Storage](/storage/tables/#incremental-loading). The result of the
incremental load depends on other settings (mainly **Primary Key**).
- **Primary Key** can be used to specify the primary key in Storage; it can be used with **Incremental Load**
and **New Files Only** to create a configuration that incrementally loads all new files into a table in Storage.

## Processing Settings

{: .image-popup}
![Screenshot - Processing Settings](/components/extractors/storage/aws-s3/aws-s3-7.png)

 - **Decompress**: All downloaded files will be decompressed (currently supporting ZIP and GZIP). All files in all archives
 will be imported into a single Storage table.
 - **Add Filename Column**: A new column `s3_filename` is added to the table and will contain the original filename 
 including the relative path to the **Search Key**.
 - **Add Row Number Column**: A new column `s3_row_filename` is added to the table and will contain the row number in each 
 of the downloaded files.

The data source connector also supports [Advanced mode](/components/#advanced-mode), all supported
parameters are described in the [GitHub repository](https://github.com/keboola/aws-s3-extractor).

## Limitations
All files stored in [AWS Glacier](https://aws.amazon.com/glacier/) are ignored.
