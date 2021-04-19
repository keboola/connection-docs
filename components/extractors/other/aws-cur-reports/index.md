---
title: AWS CUR Reports
permalink: /components/extractors/other/aws-cur-reports/
---

* TOC
{:toc}

This extractor downloads [AWS CUR reports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) exported to S3 in CSV format.

## Configuration

### AWS Setup

First, the CUR report exports need to be set up in the AWS account to be exported to S3 bucket in the selected granularity and CSV format. Follow this guide to set up the export.

Export Setup:

- Setup S3 bucket
- Set the report prefix
- Select granularity
- Select report versioning (overwrite recommended)
- Choose GZIP compression type

{: .image-popup}
![AWS configuration](/components/extractors/other/aws-cur-reports/aws_screen.png)


### Component setup

[Create a new configuration](/components/#creating-component-configuration) of the **AWS Cost and Usage reports** extractor.  


Fill in the **AWS config** containing your S3 bucket details and credentials as set up in the AWS console

{: .image-popup}
![AWS configuration](/components/extractors/other/aws-cur-reports/aws_setup.png)


**Loading options**

- **Load type** - If set to Incremental update, the result tables will be updated based on primary key. Full load overwrites the destination table each time. 
**NOTE:** The primary key should be set on Incremental load.
- **Primary key** - Set the required primary key. **NOTE** that primary key columns vary depending on the granularity you choose for your report. 
Please refer to the [data dictionary](https://docs.aws.amazon.com/cur/latest/userguide/data-dictionary.html) documentation to choose the proper combination.

Now fill in the extraction configuration parameters: 
- **New files only** -- when checked, only latest reports are downloaded each run. You may use the `Reset state` button to reset the previous timestamp. 
**Note** that when checked the `Maximum date` parameter is ignored.
- **Minimum date** -- Lowest report date to download. When New files only is checked, this applies only on first run, reset the state to backfill. 
Date in `YYYY-MM-DD` format or a string i.e. `5 days ago`, `1 month ago`, `yesterday`, etc. If left empty, all records are downloaded. 
- **Maximum date** -- Lowest report date to download. When New files only is checked, this applies only on first run, reset the state to backfill. 
Date in `YYYY-MM-DD` format or a string i.e. `5 days ago`, `1 month ago`, `yesterday`, etc. If left empty, all records are downloaded. 
- **Report prefix** -- The prefix as you set up in the AWS CUR config. 
In S3 bucket this is path to your report. E.g. `my-report` or `some/long/prefix/my_report`. 
In most cases this would be the prefix you've chosen. If unsure, refer to the S3 bucket containing the report
 and copy the path of the report folder.


{: .image-popup}
![AWS configuration](/components/extractors/other/aws-cur-reports/report_config.png)


If the [**Incremental Load**](/storage/tables/#incremental-loading) is set to true, the new data will be appended to the old ones. 
This way you can import new data, e.g., from today, without deleting the data imported before.

## Output table

The output schema is described [here](https://docs.aws.amazon.com/cur/latest/userguide/data-dictionary.html)


**IMPORTANT NOTE** The result column names are modified to match the KBC Storage column name requirements:

- Categories are separated by `__`. e.g.`bill/BillingPeriodEndDate` is converted to `bill__billingPeriodEndDate`
- Any characters that are not alphanumeric or `_` underscores are replaced by underscore. 
E.g. `resourceTags/user:owner` is converted to `resourceTags__user_owner`
- The KBC Storage is case insesitive so the above may lead to duplicate names. In such case the names are deduplicated by adding an index. 
e.g `resourceTags/user:name` and `resourceTags/user:Name` lead to `resourceTags__user_Name` and `resourcetags__user_name_1` 
columns respectively

**Note** That the output schema changes often and may be also affected by the tags and custom columns you define.
