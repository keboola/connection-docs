---
title: Bring Your Own DB (BYODB)
permalink: /storage/byodb/
---

The KBC Storage component manages [different kinds of data](/storage/#storage-data). 
Normally we will provision all of the backend technologies for your project so that you don't have to 
worry about anything. However, if you already use a Redshift or a Snowflake database or you want to 
use them for other purposes as well, or you want to customize them somehow, then you might want to 
use your own database with KBC. 

If you decide to do so, you may also consider using your own S3 Storage as a backend for KBC 
[Files Storage](/storage/file-uploads/). 
Using your own S3 Storage makes sense in case you use it anyway or you want to have your database in
other region then our standard [AWS region](http://docs.aws.amazon.com/general/latest/gr/rande.html) 
`us-east-1` (US East (N. Virginia)). Because of substantial traffic 
between the [Table Storage](/storage/tables/) and 
[File Storage](/storage/file-uploads/), it is advisable to have both S3 and the database in the same AWS region. Traffic across regions is less efficient and more expensive. 

If you want to create a new project on your own database, follow these steps:

1. For Redshift:
    1. Setup a [Redshift cluster](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html) (If you have no preference over the region, use `us-east-1`).
    2. Create a Redshift [Superuser](http://docs.aws.amazon.com/redshift/latest/dg/r_superusers.html).
    3. Make sure the Redshift DB has public IP.
    4. Set [Allow Version Upgrade](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#working-with-clusters-overview) to true.
2. For Snowflake:
    1. Create a Warehouse.
    2. Create a user according to [our API instructions](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend)
3. Optionally Setup [Amazon S3](https://aws.amazon.com/s3/) based on our [CloudFormation template](https://github.com/keboola/connection/blob/master/provisioning/services-region-file-storage.json)
4. Collect the credentials to be shared with Keboola Support:
    1. for Redshift --- `host`, `username`, `password` and `region` [is required](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
    2. for Snowflake --- `user`, `warehouse` and `password` [is required](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
    3. for S3 --- `AWSKey`, `Secret` and `name` of the bucket for storage [is required](http://docs.keboolamanagementapi.apiary.io/#reference/super-file-storage-management/file-storage-collection/create-new-storage).
5. Contact your [Maintainer](/management/support/) or [Support](mailto:support@keboola.com) and request new project (or project migration). Provide us with the credentials and in case of project migration also the project ID (or URL) and preferred maintenance window.
