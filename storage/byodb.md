---
title: Bring Your Own Database (BYODB)
permalink: /storage/byodb/
---

In some instances, you can use your own Snowflake/BigQuery account to host data from Keboola. Currently, this option is only supported for the Snowflake and BigQuery backends.  

## Snowflake
For the integration to work, your Snowflake account must be accessible from a subset of [our IP addresses](/components/ip-addresses/).

***Note:** [SCIM](https://docs.snowflake.com/en/user-guide/scim.html) authentication (AAD, Okta) is not supported.* 

### Accessing Data in Keboola from Outside
To access Keboola-managed data, you should use only the provided roles and avoid granting permissions on Keboola-managed resources.

#### Read-only access to project storage
If your project has the [read-only input mapping](/transformations/mappings/#read-only-input-mapping) feature enabled, then a role `KEBOOLA_<PROJECT_ID>_RO` (for example `KEBOOLA_5762_RO`) is provided for each project. 
This role grants read-only access to all the schemas and tables in the project. You can assign this role to any of your roles or users to allow access to the project's storage.

#### Read-only access without granting roles in Snowflake
To access data without granting roles in Snowflake, use the [transformation workspaces](/transformations/workspace/) feature. The user created for each workspace is automatically assigned the role mentioned above.
This method is effective even if you *do not* use your own Snowflake account.

### Dynamic Backends Size for BYODB Snowflake
For dynamic backends, you must have one Snowflake warehouse for each backend size. The sizes of these warehouses (small, medium, and large in Keboola) are independent and 
can vary (XSmall, Small, and XLarge). Setting up the warehouses with an [aggressive AUTO_SUSPEND value](https://docs.snowflake.com/en/user-guide/warehouses-considerations.html#automating-warehouse-suspension), 
possibly as low as [1 second](https://docs.snowflake.com/en/sql-reference/sql/alter-warehouse.html), is recommended. 

### Rules for Accessing Snowflake Objects Created by Keboola
* Do not modify grants of any resource prefixed with `KEBOOLA_` (`SAPI_` for `https://connection.keboola.com` stack), unless explicitly approved by Keboola on a case-by-case basis. 
* Do not modify the root role created when registering the backend.
* Do not modify the warehouse created when registering the backend.
* Do not modify the user created when registering the backend.
* Do not modify the project databases (`KEBOOLA_<PROJECT_ID>`).
  * Particularly, do not change ownership of the database or grant future permissions on objects in the database.
* Do not modify the schemas in a project database.
  * Particularly, do not change ownership of the schemas or grant future permissions on objects in those schemas.
* Do not modify the tables in schemas. 
* Do not grant future permissions on tables.
* If the dynamic backends feature is enabled, do not change the backends created when enabling the feature.
* If the read-only input mapping feature is enabled, the role name is `KEBOOLA_<PROJECT_ID>_RO`.
  * You can grant this role to any of your roles or users. They will get read-only access to the data stored in a project's storage.
  * Granting new tables and schemas and even linked buckets is handled automatically by Storage API.

### Schema of Objects in Snowflake Account Used as Keboola Backend

{: .image-popup}
![Snowflake account schema](/storage/byodb/schema.png)

## BigQuery Limitations
Google Cloud Computing services, including BigQuery, have introduced several limitations on their services, impacting Keboola, especially for customers using their own BigQuery or
Google Cloud Storage as storage backends. These limitations require careful management.

Some limits are flexible (soft limits) and may be adjusted based on your contract with Google.

### Number of Projects
When you reach **20** projects, a ticket must be submitted to Google Support. They will then decide whether to increase the project limit or deny the request.

Keboola generates one GCP project per Keboola project, plus one main project for oversight, allowing up to 19 Keboola projects (+1 for management).

### Number of Service Accounts
Service accounts serve various purposes. Each project contains at least one service user. 

Each project typically has at least one service user, limiting the number of workspaces/sandboxes to 99 at a time. [Workspaces](https://help.keboola.com/transformations/workspace/), 
essential for tasks like transformations in Keboola, are created and then deleted post-use, impacting the service account limit only during the transformation job runtime.

By default, you can have up to **100** service accounts per project to control resource access. You may request an increase in this quota if needed. For more information, see 
[Create service accounts  |  IAM Documentation  |  Google Cloud](https://cloud.google.com/iam/docs/service-accounts-create#:~:text=By%20default%2C%20each%20project%20can,a%20quota%20increase%20if%20necessary.).

----

Additional BigQuery backend limits can be found here: [BigQuery API Quotas and Limits](https://cloud.google.com/bigquery/quotas#api_request_quotas).
