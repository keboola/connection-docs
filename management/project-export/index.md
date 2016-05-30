---
title: Data Takeout
permalink: /management/project-export/
---

* TOC
{:toc}

Using the **Data Takeout** feature, it is possible to export the entire contents of your project. 
Data takeout is useful if you want to make a snapshost of your entire project
for any purpose or if you want to terminate the project and don't want to loose any data.
This feature is especially usefull for project POCs, which are supposed to end after a certain time period, but
you still want to keep them for reference. This feature can also be used 
if get fed up and want to leave us, which we certainly don't like, but we are never blocking you from doing so.

Though you can use it at any time, please do not confuse this feature with project backup. 
The data from takeout *cannot* be automatically imported into KBC 
(recovering a project must be done by KBC Support).

Before you start, you will need:

- Amazon S3 bucket in any region
- Amazon IAM user's API keys with proper access to S3 bucket

## Prepare 
We strongly recommend that you create a dedicated user with a dedicated bucket to
prevent accidental leak of the credentials or your project management.  

### Create the S3 bucket
Create a S3 bucket
[following the Amazon documentation](http://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)
Name it e.g. *keboola-data-takeout* and choose the region suitable with your Amazon subscription,
if unsure, chose *US Standard (N. Virgina)*.  

### Create a IAM User
Create a new User using IAM (Identity and Access Management) following the
[Amazon documentation](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console).
When you create the user, you will get *Access Key ID* and *Secret Access Key*.

### Create and Assign user policy
In Amazon IAM, select *Users* and user *data-takeout* and then create a new *Inline policy* in the 
*Permissions* tab:

{: .image-popup}
![Screenshot - AWS Create User Policy](/management/project-export/aws-create-policy-intro.png)

In the next dialog, select *Custom Policy*:

{: .image-popup}
![Screenshot - AWS Create Custom Policy](/management/project-export/aws-create-custom-policy.png)

Name the policy and as the *policy document* paste the following definition in JSON format:

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

You should now have:

- name of the S3 bucket (keboola-data-takeout)
- region of the S3 bucket (US Standard)
- *Access Key ID* of the IAM user
- *Secret Access Key* of the IAM user

If you don't have the Key Id and Access Key, you can always generate another set in IAM Managment Console:

{: .image-popup}
![Screenshot - AWS IAM Management Console](/management/project-export/aws-user-credentials.png)

## Export project
You can now, go to KBC and select **Users & Settings** and on the **Settings** 
there is *Data Takeout* button:

{: .image-popup}
![Screenshot - Data Takeout](/overview/tutorial/management/data-takeout-project-settings.png)

Now fill the *Access Key ID*, *Secret Access Key*, *S3 Bucket Region* and *S3 Bucket name*:  
{: .image-popup}
![Screenshot - Data Takeout](/overview/tutorial/management/data-takeout-settings.png)

Optionally, you can configure Path inside the S3 bucket, e. g, you can set the path to `my-take/`
and the data will be stored in `s3://keboola-data-takeout/my-take/`. Leave the path empty, to store
the export in bucket root. Note that the existing files will be overwritten. 
Optionally you can select to export project strcucture only, which means that
no actual data will be exported.  

{: .image-popup}
![Screenshot - Data Takeout](/overview/tutorial/management/data-takeout.png)

When you are ready, click the *Run Export* button:
{: .image-popup}
![Screenshot - Data Takeout Run](/overview/tutorial/management/data-takeout-project-export.png)

You can monitor the progress of the data export by clicking the *Export started* link. 
The data takout may take a considerable amount of time if your project is large.

## Exported data  
The exported project has the following general structure:

- `buckets.json` - contains a list of all buckets in the project and their metadata 
- `tables.json` - contains a list of all tables in the project and their metadata (bucket, columns, description, etc.).
Table aliases are not exported.
- `configurations.json` - contains a list of all components used in the project and *main properties* of their configurations
- `/in/`, `/out/` and `/sys/` folders contain all project tables in CSV format (compressed with
[gzip](http://www.gzip.org/)). Note that the `sys` tables contain only configuration of some older components and 
may not be present in your project.
- /configurations/ - contains all configurations created in the project organized by component names into folder.
Each configuration lists *all properties* (including configuration rows) and *all versions* of each configuration.
These also contain definitions of all your transformation queries.

{: .image-popup}
![Screenshot - Sample Folder Structure](/overview/tutorial/management/folder-structure.png)

If you have ticked the `Export project structure only` checkbox when exporting. Then noactual data were. Only 
configurations and `sys` tables which are configurations of legacy components were exported.

## Security Considerations
Once the files are written to your S3 bucket, you must ensure that they are kept safely and only authorized
persons can access them. You should also deactivate the AWS Key once the export is finished.

The *Data Takout* tool will **overwrite** existing files in your S3 bucket (no files will be deleted though), 
so make sure that your S3 bucket is empty, or use an apropriate S3 path.

If your configurations contain some encrypted values (such as password to database server), these
value will be exported encrpyted, and there is no way to decrpyt them.  
