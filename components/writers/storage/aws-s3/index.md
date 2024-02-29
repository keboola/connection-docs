---
title: AWS S3
permalink: /components/writers/storage/aws-s3/
redirect_from:
    - /writers/storage/aws-s3/
---

* TOC
{:toc}

This data destination connector allows you to write CSV files into a single AWS S3 bucket. After creating a new configuration, select the files
you want to write to AWS S3. You also need to set up the proper permissions on AWS.
The connector supports additional [processor configuration](https://developers.keboola.com/extend/component/processors/) via the JSON editor.

## Obtain AWS Credentials
We strongly recommend that you create a dedicated user for the connector. To do so, create a new user in [AWS IAM](https://aws.amazon.com/iam/)
and enable programmatic access:

{: .image-popup}
![Screenshot - New user](/components/writers/storage/aws-s3/aws-ui-1.png)

Create a new permission policy with the `s3:PutObject` and `s3:GetBucketLocation` permissions to the target bucket.

{: .image-popup}
![Screenshot - Permission settings](/components/writers/storage/aws-s3/aws-ui-2.png)

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

When you finish creating the user, you'll obtain the **Access key ID** and **Secret access key**. 

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **AWS S3** connector.
In the next step, provide the target S3 bucket and [AWS credentials](#obtain-aws-credentials) with write permissions to it.

{: .image-popup}
![Screenshot - Configure credentials](/components/writers/storage/aws-s3/aws-s3-1.png)

**Save** the credentials and configure tables by clicking the **Add Table** button and search for the table you want to upload:

{: .image-popup}
![Screenshot - Select table](/components/writers/storage/aws-s3/aws-s3-2.png)

Then you can modify the table destination path, write the table, or go back to the configuration to add additional tables to the connector.
Configured tables are stored as [configuration rows](/components/#configuration-rows).
