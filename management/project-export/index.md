---
title: Data Takeout
permalink: /management/project-export/
---

* TOC
{:toc}

Using the **Data Takeout** feature, it is possible to export the entire contents of your project. 
It can come in handy when 

- making a snapshot of your entire project for any purpose, 
- terminating the project without loosing any data,
- doing project POCs and keeping them for reference after they have ended, or 
- leaving us.

**Important**: Do not confuse this feature with the project backup. 
Takeout data *cannot* be automatically imported into KBC (recovering a project must be done by KBC Support).

Things to have before you start:

- Amazon S3 bucket in any region, and
- Amazon IAM user's API keys with proper access to the S3 bucket.

## Prepare Project
We strongly recommend that you create a dedicated user with a dedicated bucket to
prevent an accidental leak of credentials or your project management.  

- **Create an S3 Bucket** following the [Amazon documentation](http://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).
Name it *keboola-data-takeout*, for example, and choose the region suitable with your Amazon subscription.
If unsure, choose *US Standard (N. Virginia)*.  

- **Create an IAM User** (Identity and Access Management) following the [Amazon documentation](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console). 
You get an *Access Key ID* and *Secret Access Key* with the new user. You can always regenerate them in the IAM Management Console:

{: .image-popup}
![Screenshot - AWS IAM Management Console](/management/project-export/aws-user-credentials.png)


- **Create and Assign a User Policy** -- In Amazon IAM, select *Users* and user *data-takeout*. 
Then create a new *Inline policy* in the *Permissions* tab:

{: .image-popup}
![Screenshot - AWS Create User Policy](/management/project-export/aws-create-policy-intro.png)

In the next dialog, select *Custom Policy*:

{: .image-popup}
![Screenshot - AWS Create Custom Policy](/management/project-export/aws-create-custom-policy.png)

Name the policy and paste the following definition in JSON format as the *policy document*:

{% highlight json %}
{
    "Statement": [
        {
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::keboola-data-takeout/*",
                "arn:aws:s3:::keboola-data-takeout"
            ]
        }
    ]
}
{% endhighlight %}

Make sure to replace *keboola-data-takeout* in the above document with the true name of your S3 bucket.

{: .image-popup}
![Screenshot - AWS Create Custom Policy Document](/management/project-export/aws-create-custom-policy-document.png)

Now you have 

- name of S3 bucket (keboola-data-takeout)
- region of the S3 bucket (US Standard)
- *Access Key ID* of the IAM user
- *Secret Access Key* of the IAM user

## Export Project
Go to KBC and select **Users & Settings**. In the **Settings** tab, click the *Data Takeout* button:

{: .image-popup}
![Screenshot - Data Takeout](/management/project-export/data-takeout-project-settings.png)

Now fill the *Access Key ID*, *Secret Access Key*, *S3 Bucket Region* and *S3 Bucket name*:

{: .image-popup}
![Screenshot - Data Takeout](/management/project-export/data-takeout-settings.png)

Optionally, you can configure Path inside the S3 bucket. For instance, you can set the path to `my-take/`
and the data will be stored in `s3://keboola-data-takeout/my-take/`. Leave the path empty to store
the export in the bucket root. 

**Important**: The existing files will be overwritten. 
Optionally, you can select to export project structure only; it means that
no actual data will be exported.  

{: .image-popup}
![Screenshot - Data Takeout](/overview/tutorial/management/data-takeout.png)

When ready, click the *Run Export* button:

{: .image-popup}
![Screenshot - Data Takeout Run](/management/project-export/data-takeout-project-export.png)

To monitor the progress of the data export, click the *Export started* link. 
The data takeout may take a considerable amount of time if your project is large.

## Exported Data  
The exported project has the following general structure:

- `buckets.json` -- all buckets in the project and their metadata 
- `tables.json` -- all tables in the project and their metadata (bucket, columns, description, etc.).
Table aliases are not exported.
- `configurations.json` -- all components used in the project and *main properties* of their configurations
- `/in/`, `/out/` and `/sys/` folders -- all project tables in the CSV format (compressed with
[gzip](http://www.gzip.org/)). **Important**: `sys` tables contain only configuration of older components and may not be present in your project.
- /configurations/ -- all configurations created in the project organized by component names into folder.
Each configuration lists *all properties* (including configuration rows) and *all versions* of each configuration.
These also contain definitions of all your transformation queries.

{: .image-popup}
![Screenshot - Sample Folder Structure](/management/project-export/folder-structure.png)

If you tick the `Export project structure only` checkbox when exporting, no actual data will be exported. 
Only configurations and `sys` tables which are configurations of legacy components will be exported.

## Security Considerations
Once the files are written to your S3 bucket, you must ensure that they are kept safely and only authorized
persons can access them. You should also deactivate the AWS Key once the export is finished.

The *Data Takeout* tool will **overwrite** existing files in your S3 bucket (no files will be deleted though), 
so make sure that your S3 bucket is empty, or use an appropriate S3 path.

If your configurations contain some encrypted values (such as password to database server), these
value will be exported encrypted, and there is no way to decrypt them.  
