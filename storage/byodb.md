---
title: Bring Your Own DB (BYODB)
permalink: /storage/byodb/
---

The KBC Storage component manages [three kinds of data](/storage/#storage-data). Each uses a different
backend storage technology ([Amazon S3 Storage](https://aws.amazon.com/s3/) and
[Amazon Redshift](https://aws.amazon.com/redshift/) or [Snowflake](https://www.snowflake.net/product/)). 
Normally we will provision all of the backend technologies for your project so that you don't have to 
worry about anything.

However, if you already use a Redshift or a Snowflake database or you want to use them for other purposes 
as well, or you want to customize them somehow, then you might want to use your own database with KBC. 

If you decide to do so, you may also consider using your own S3 Storage as a backend for KBC Files Storage. 
Using your own S3 Storage makes sense in case you use it anyway or you want to have your database in
other region then our standard region `us-east-1` (US East (N. Virginia)). Because of substantial traffic 
between the Table and 
File Storage, it is advisable to have them both in the same Amazon region. Traffic across regions is also
less efficient and more expensive. 

If you want to create a new project on your own database, follow these steps:
- For Redshift:
    - Setup a [Redshift cluster](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html) (If you have no preference over he region, use `us-east-1`).
    - Create a Redshift [Superuser](http://docs.aws.amazon.com/redshift/latest/dg/r_superusers.html).
    - Make sure the Redshift DB has public IP.
    - Set [Allow Version Upgrade](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#working-with-clusters-overview) to true.
- For Snowflake:
    - Create a Warehouse.
    - Create a user according to [our API instructions](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend)
- Optionally Setup [Amazon S3](https://aws.amazon.com/s3/) based on our [CloudFormation](https://aws.amazon.com/cloudformation/aws-cloudformation-templates/) 
[template](https://github.com/keboola/connection/blob/master/provisioning/services-region-file-storage.json)
- Collect the credentials to be shared with Keboola Support:
    - for Redshift --- `host`, `username`, `password` and `region` [is required](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
    - for Snowflake --- `user`, `warehouse` and `password` [is required](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
    - for S3 --- `AWSKey`, `Secret` and name of the bucket for storage [is required] (http://docs.keboolamanagementapi.apiary.io/#reference/super-file-storage-management/file-storage-collection/create-new-storage).
- Contact your [Maintainer](/management/support/) or [Support](mailto:support@keboola.com) and request new project (or project migration). Provide us with the credentials and in case of project migration also the project ID (or URL) and preferred maintenance window.
