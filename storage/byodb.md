---
title: Bring Your Own DB (BYODB)
permalink: /storage/byodb/
---

The KBC Storage component manages [different kinds of data](/storage/#storage-data). 
Normally, we provide all of the backend technologies for your project, so that you do not have to 
worry about anything. However, you might want to use your own database with KBC in the following situations:

- You already use a Redshift or a Snowflake database.
- You want to use them for other purposes as well. 
- You want to customize them somehow.

If you decide to use your own database, consider using your own S3 Storage as a backend for KBC 
[File Storage](/storage/file-uploads/) as well. 
It makes sense in case you use it anyway, or if you want to have your database in
another region than our standard [AWS region](http://docs.aws.amazon.com/general/latest/gr/rande.html) 
`us-east-1` (US East (N. Virginia)). 

Because of substantial traffic between [Table Storage](/storage/tables/) 
and [File Storage](/storage/file-uploads/), it is advisable to have both S3 and the database in the same AWS 
region. Traffic across regions is less efficient and more expensive. 

If you want to **create a new project** on your own database, follow these steps:

1. For Redshift:
    1. Set up a [Redshift cluster](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html). 
	If you have no preference over the region, use `us-east-1`.
    2. Create a Redshift [Superuser](http://docs.aws.amazon.com/redshift/latest/dg/r_superusers.html).
    3. Make sure the Redshift DB has a public IP address.
    4. Set [Allow Version Upgrade](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#working-with-clusters-overview) to true.
2. For Snowflake:
    1. Create a Warehouse.
    2. Create a user according to [our API instructions](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
3. Optionally, set up [Amazon S3](https://aws.amazon.com/s3/) based on our [CloudFormation template](https://github.com/keboola/connection/blob/master/provisioning/services-region-file-storage.json).
4. Collect the credentials to be shared with Keboola Support:
    - For Redshift --- `host`, `username`, `password` and `region` are [required](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
    - For Snowflake --- `user`, `warehouse` and `password` are [required](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
    - For S3 --- `AWSKey`, `Secret` and `name` of the bucket for storage are [required](http://docs.keboolamanagementapi.apiary.io/#reference/super-file-storage-management/file-storage-collection/create-new-storage).
5. Contact your [Maintainer](/management/support/) or [Support](mailto:support@keboola.com), and request a new 
project (or project migration). Provide us with the credentials and, in case of project migration, also with the 
project ID (or URL) and preferred maintenance window.
