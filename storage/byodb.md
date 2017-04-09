---
title: Bring Your Own DB (BYODB)
permalink: /storage/byodb/
---

If choose use to Redshift database as a backend, normally we will provision a 
[Redshift Cluster](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html) for your project.
You may decide to use your own Redshift database as a backend for KBC Table Storage.
You may also use your own [Amazon S3 Storage](https://aws.amazon.com/s3/) as your on 
[File Storage](https://help.keboola.com/storage/file-uploads/) backend. It is upon you to decide whether you want
to use both your own Redshift and S3 or only your own Redshift.

In order to deploy a new KBC project onto an already existing Redshift data storage we need some preparation 
to be done by as well as access privileges to be able to deploy. The following step by step instructions will 
help your administrators to prepare and supply everything required.

- Setup [Amazon S3](https://aws.amazon.com/s3/) based on on our [CloudFormation](https://aws.amazon.com/cloudformation/aws-cloudformation-templates/) template: [https://github.com/keboola/connection/blob/master/provisioning/services-region-file-storage.json](https://github.com/keboola/connection/blob/master/provisioning/services-region-file-storage.json)
- Setup both S3 and Redshift DB cluster in the same region, ideally `us-east-1`
- Make sure the Redshift DB has public IP.
- Create a Redshift [Superuser](http://docs.aws.amazon.com/redshift/latest/dg/r_superusers.html).
- Set [Allow Version Upgrade](http://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html#working-with-clusters-overview) to true.
- Collect the credentials to be shared with Keboola Support:
    - for Redshift --- `host`, `username`, `password` and `region` [is required](http://docs.keboolamanagementapi.apiary.io/#reference/super-storage-backends-management/storage-backend-collection/create-new-backend).
    - for S3 --- `AWSKey`, `Secret` and name of the bucket for storage [is required] (http://docs.keboolamanagementapi.apiary.io/#reference/super-file-storage-management/file-storage-collection/create-new-storage).
- Contact your [Maintainer](/management/support/) or [Support](mailto:support@keboola.com) and request new project (or project migration). Provide us with the credentials and in case of migration also project ID or URL and preferred maintenance window.
