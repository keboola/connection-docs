---
title: AWS S3
permalink: /writers/storage/aws-s3/
---

* TOC
{:toc}

This writer allows you to write CSV files into a single AWS S3 bucket. After creating a new configuration, select the files
you want to write to AWS S3. You also need to set up the proper permissions on AWS.
The writer supports additional [processor configuration](https://developers.keboola.com/extend/component/processors/) via the JSON editor.

## Create New Configuration
Find the AWS S3 writer in the list of writer and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/storage/aws-s3/ui1.png)

In the next step, you need to provide the target S3 bucket and AWS credentials with write permissions to it.
We strongly recommend that you create a dedicated user for the writer. To do so, create a new user in [AWS IAM](https://aws.amazon.com/iam/)
and enable programmatic access:

{: .image-popup}
![Screenshot - New user](/writers/storage/aws-s3/aws-ui-1.png)

Create a new permission policy, with `s3:PutObject` and `s3:GetBucketLocation` permissions to the target bucket.

{: .image-popup}
![Screenshot - Permission settings](/writers/storage/aws-s3/aws-ui-2.png)

Or, if you prefer configuration via JSON:

{%highlight json %}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BucketWrite",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:s3:::writer-sample/*",
                "arn:aws:s3:::writer-sample"
            ]
        }
    ]
}
{% endhighlight %}

When you finish creating the user, you'll obtain the **Access key ID** and **Secret access key**. Enter them
to the extractor configuration, together with the destination bucket name:

{: .image-popup}
![Screenshot - Configure credentials](/writers/storage/aws-s3/ui2.png)

**Save** the credentials.

## Configure Tables
To configure tables, click the **Add Table** button and search for the table, you want to upload:

{: .image-popup}
![Screenshot - Select table](/writers/storage/aws-s3/ui3.png)

Then you can modify the table destination path, write the table or go back to the configuration to add additional tables to the writer.
The configuration can write as many tables as you wish. The list is fully searchable, and you can delete or disable each table. In addition, you can explicitly write one table only. The write order of the tables can be changed.
