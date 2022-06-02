---
title: Bring Your Own Database (BYODB)
permalink: /storage/backends/byodb/
---

## Snowflake

In certain cases you are able to use your own Snowflake account to host the data from Keboola Connection. The underlying database is only accessed using the [Storage API](https://keboola.docs.apiary.io/). This allows Keboola to perform better audit logging, assert access control and generally implement features that the backend itself does not provide.

For the integration to work, your Snowflake account needs to be accessible from a subset of [our IP addresses](/components/ip-addresses/).   

### When it's a good idea to connect your own Snowflake

Very good reason to do this is economy. If you already use Snowflake in your business, you already pay for the account. Connecting your own Snowflake decouples Snowflake payments from your Keboola usage. Your queries run on your account, so they are never influenced by queries ran by other clients. 

Another good reason is preventing vendor lock-in. We'll never lock you out of your data and offer robust [Data Takeout](/management/project/export/) functionality. Still you might rather have your data in your own account. That is fine as long as you don't want to access the data from outside while still using Keboola Connection. 

### When it's not a good idea to connect your own Snowflake

Having direct access to the data stored in Snowflake from outside Keboola is not a good reason to have your own Snowflake. As mentioned earlier, the underlying database is accessed only through Storage API. The API also enriches the backend tables and buckets with metadata. Storing metadata outside the storage backend allows us faster access, features like automatic incremental loading, renaming in metadata (instead of renaming the actual tables and refactoring all the queries where they are used) and others. 

Writing data to Snowflake directly to be accessed from within Keboola is also not a good reason. As mentioned the table metadata needs to be in sync to allow for advanced functions to work.

Generally, directly accessing projects Storage is not a good idea, because there are a lot of assumptions in the API that depend on the fact that the Storage is only accessed via Storage API and is never in inconsistent state. Also, seemingly harmless activities, like giving some role read only access to a bucket by granting future grants on tables in schema may have unintended consequences.   

#### Granting access to data managed by Keboola

The access control model set by Keboola in Snowflake is somewhat intricate and offers Snowflake-level isolation of data access. The model is set up in a way that one project or workspace cannot access other projects data even if there is a bug in Keboola Connection code. Those are different users in Snowflake altogether. This level of data security comes at a price though - it's complex and hard to work with manually.

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
