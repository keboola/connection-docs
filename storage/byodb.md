---
title: Bring Your Own Database (BYODB)
permalink: /storage/byodb/
---

In certain cases you are able to use your own Snowflake account to host the data from Keboola Connection. Currently, we only support this for Snowflake backend.  

## Snowflake

For the integration to work, your Snowflake account needs to be accessible from a subset of [our IP addresses](/components/ip-addresses/).

We don't support [SCIM](https://docs.snowflake.com/en/user-guide/scim.html) authentication (AAD, Okta). 

### Accessing data in Keboola Connection from outside

Because Keboola Connection manages access to the data, you need to only use the provided roles and not grant any grants on Keboola-managed resources. 

#### Read-only access to project storage

If the project has Read-only Input Mapping feature enabled, you are provided with a role `KEBOOLA_$PROJECTID_RO` for each project. This role has read-only access to all the schemas and tables in the project. You can grant this role to any of your own roles or users to give it access to the project's storage.

##### Read-only access without granting roles in snowflake

You can use the in-built functionality of [transformation workspaces](/transformations/workspace/). The user created for the workspace has the abovementioned role granted automatically. This workflow works even if you *don't* use your own SNFLK account.

### Dynamic backends size for BYODB Snowflake

  Dynamic backends feature requires you to have one Snowflake warehouse for each backend size. The actual sizes of warehouses are independent of the representation in Keboola (Small, Medium, Large). You can have XSmall, Small and XLarge. We recommend that the warehouses are set up with [aggressive AUTO_SUSPEND value](https://docs.snowflake.com/en/user-guide/warehouses-considerations.html#automating-warehouse-suspension), even as low as [1 second](https://docs.snowflake.com/en/sql-reference/sql/alter-warehouse.html). 

### Rules of accessing Snowflake objects created by Keboola Connection

* do not modify grants of any resource that is prefixed by `KEBOOLA_` prefix (`SAPI_` for `https://connection.keboola.com` stack) unless explicitly approved on case-by-case basis by Keboola 
* do not modify the root role created when registering the backend
* do not modify the warehouse created when registering the backend
* do not modify the user created when registering the backend
* do not modify the project databases (`KEBOOLA_$PROJECTID`)
  * especially, do not change ownership of the database
  * * especially do not grant future grants on objects in the database
* do not modify the schemas that in project database
  * especially do not change ownership of the schemas
  * especially do not grant future grants on objects on those schemas
* do not modify the tables in schemas 
  * do not grant future grants on tables
* if you have Dynamic Backends feature enabled
  * do not change the backends created when enabling the feature
* if you have Read Only Input Mapping feature enabled
  * role name is `KEBOOLA_$PROJECTID_RO`
  * you can grant this role to any of your roles or users - those will get read-only access to the data stored in project's storage  
  * granting of new tables and schemas and even linked buckets is handled automatically by Storage API

### Schema of objects in Snowflake account used as Keboola Connection backend

{: .image-popup}
![Snowflake account schema](schema.png)
