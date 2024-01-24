---
title: Bring Your Own Database (BYODB)
permalink: /storage/byodb/
---

In certain cases you are able to use your own Snowflake/BigQuery account to host the data from Keboola Connection. Currently, we only support this for the Snowflake and BigQuery backend.  

## Snowflake

For the integration to work, your Snowflake account needs to be accessible from a subset of [our IP addresses](/components/ip-addresses/).

We don't support [SCIM](https://docs.snowflake.com/en/user-guide/scim.html) authentication (AAD, Okta). 

### Accessing Data in Keboola Connection from Outside

Because Keboola Connection manages access to the data, you need to only use the provided roles and not grant any grants on Keboola-managed resources. 

#### Read-only access to project storage

If the project has the [read-only input mapping](/transformations/mappings/#read-only-input-mapping) feature enabled, then you have a role `KEBOOLA_$PROJECTID_RO` for each project. This role has read-only access to all the schemas and tables in the project. You can grant this role to any of your own roles or users to give them access to the project's storage.

##### Read-only access without granting roles in snowflake

You can use the in-built functionality of [transformation workspaces](/transformations/workspace/). The user created for the workspace has the abovementioned role granted automatically. This workflow works even if you *don't* use your own Snowflake account.

### Dynamic Backends Size for BYODB Snowflake

The dynamic backends feature requires you to have one Snowflake warehouse for each backend size. The actual sizes of warehouses are independent of the representation in Keboola (small, medium, and large). You can have XSmall, Small and XLarge. We recommend that the warehouses are set up with an [aggressive AUTO_SUSPEND value](https://docs.snowflake.com/en/user-guide/warehouses-considerations.html#automating-warehouse-suspension), even as low as [1 second](https://docs.snowflake.com/en/sql-reference/sql/alter-warehouse.html). 

### Rules of Accessing Snowflake Objects Created by Keboola Connection

* do not modify grants of any resource that is prefixed by `KEBOOLA_` prefix (`SAPI_` for `https://connection.keboola.com` stack) unless explicitly approved on case-by-case basis by Keboola 
* do not modify the root role created when registering the backend
* do not modify the warehouse created when registering the backend
* do not modify the user created when registering the backend
* do not modify the project databases (`KEBOOLA_$PROJECTID`)
  * especially, do not change ownership of the database
  * * especially, do not grant future grants on objects in the database
* do not modify the schemas in a project database
  * especially, do not change ownership of the schemas
  * especially, do not grant future grants on objects in those schemas
* do not modify the tables in schemas 
  * do not grant future grants on tables
* if you have the dynamic backends feature enabled
  * do not change the backends created when enabling the feature
* if you have the read-only input mapping feature enabled
  * the role name is `KEBOOLA_$PROJECTID_RO`
  * you can grant this role to any of your roles or users – they will get read-only access to the data stored in a project's storage  
  * granting new tables and schemas and even linked buckets is handled automatically by Storage API

### Schema of Objects in Snowflake Account Used as Keboola Connection Backend

{: .image-popup}
![Snowflake account schema](schema.png)

## BigQuery


## BigQuery limitations

Google Cloud Computing services, which include BigQuery, have introduced several limitations on their services. The following limitations are significant from the perspective of Keboola, particularly for owners of Keboola storage accounts. These limitations directly impact Keboola services and require management.

Some of these limits are flexible (soft limits), depending on your contract with Google. This determines if the limit can be adjusted and by how much.

**Number of Projects**

Upon reaching **20** projects, you need to submit a ticket to Google Support. Based on this submission, the number of projects can either be increased or they may choose to deny the request.

The Keboola application generates one project in GCP for each project within Keboola. Additionally, there is one main project overseeing all others. Therefore, you can have 19 projects in the Keboola application (+1 reserved for management).

**Number of Service Accounts**

Service accounts serve various purposes. Each project contains at least one service user. For instance, each user is created per workspace/sandbox, which technically limits the creation of more than 99 workspaces simultaneously. [Workspaces](https://help.keboola.com/transformations/workspace/) are employed for numerous tasks in Keboola, such as requiring a dedicated workspace for each transformation.

By default, each project can have up to **100** service accounts to control access to resources. You may request an increase in this quota if needed. For more information, see: Create service accounts  |  IAM Documentation  |  Google Cloud.

----

Additional BigQuery backend limits can be found here: Quotas and Limits  |  BigQuery  |  Google Cloud 

