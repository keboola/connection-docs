---
title: External Buckets
permalink: /storage/byodb/external-buckets/
---

* TOC
{:toc}

If you operate Keboola in Bring Your Own Database (BYODB)  mode on top of your own data warehouse, the data residing in the warehouse is not automatically visible or accessible from inside Keboola. We're addressing this by providing the **External Buckets** feature.

The exact implementation of external buckets depends on the database backend you use. It can be database, schema, or some other concept. Unless stated otherwise, we'll describe the implementation for Snowflake.

## What is an external bucket

Storage in Keboola Connection is organized in [buckets](/storage/buckets/). **External bucket** is a special type of bucket where contents of the bucket is not managed by Keboola Connection. It can be located anywhere in your data warehouse. It is a virtual bucket that is created on top of a Snowflake schema. All table-like objects (tables, view, external tables) inside the schema are mapped to tables in the bucket. Access to the bucket is read-only, you can't write to the bucket from Keboola Connection. One such schema can be registered with multiple projects in Keboola at once.

## How to create an external bucket

External bucket can be created in the Storage section of the project. 

{: .image-popup}
![Register external data button](/storage/byodb/external-buckets/figures/1.png)

Click on the **Register External Data** button. The dialog differs based on backend you are using. 

### Snowflake

Fill in the name of the new bucket, database name and schema name. 

{: .image-popup}
![Register external data popup - Snowflake](/storage/byodb/external-buckets/figures/2-snflk.png)

Then continue to the next step, where we'll provide you with a guide on how to correctly grant Keboola access to the schema in Snowflake.

{: .image-popup}
![Register external data popup step 2 - Snowflake](/storage/byodb/external-buckets/figures/3-snflk.png)

Once you grant the access, click **Register bucket** and you can start using it.

### BigQuery

Fill in the name of the new bucket and dataset name. 

{: .image-popup}
![Register external data popup - BigQuery](/storage/byodb/external-buckets/figures/2-bq.png)

Then continue to the next step, where we'll provide you with a guide on how to correctly grant Keboola access to the dataset in BigQuery.

{: .image-popup}
![Register external data popup step 2 - BigQuery](/storage/byodb/external-buckets/figures/3-bq.png)

Once you are done, click **Register bucket** and you can start using it.

### Considerations

When you register an external bucket we analyse the metadata of objects in it and register all tables and views as tables in the bucket in Keboola Connection. If you later add additional tables or views, you need to manually refresh the external bucket using the **Refresh** action in bucket detail to make them visible in Keboola Connection. 

{: .image-popup}
![Bucket refresh](/storage/byodb/external-buckets/figures/4.png)

## How to use an external bucket

External buckets are not part of normal [Input Mapping](transformations/mappings/#input-mapping). They're accessible via [Read-only input mapping](/transformations/mappings/#read-only-input-mapping). Keep in mind that external buckets can't be used in [Output Mapping](transformations/mappings/#output-mapping) as they are not writable.

### Using external bucket in Snowflake SQL transformation

Because external buckets are not part of normal [Input Mapping](transformations/mappings/#input-mapping), they are not copied into your transformation workspace. You need to refrence them in you transformation using fully-qualified name.

In the following example, you created an external bucket called `emea_sales`, that references schema `sales_emea` in database `REPORTING`. The schema contains table `users`. You want to create a new table `MQL_USERS` that contains only users sourced from marketing qualified leads. You can do that using the following SQL:

```sql
CREATE TABLE "MQL_USERS" AS SELECT * 
FROM "REPORTING"."sales_emea"."users"
WHERE "source" = 'mql';
```
Note, how the query uses the **fully-qualified name** of the table in the `FROM` clause.

### Using external bucket in BigQuery SQL transformation

In BigQuery the external bucket is mapped to an actual dataset `emea_sales` (name you filled in the dialog) in your project - in this case project `sapi-9752`. You can reference the contents of the dataset in your SQL transformation using fully-qualified name. Notice that the dataset name is _the one you filled in the dialog_, **not** the one of the original dataset that was created in BigQuery. There is no technical limitation though, they can have the same name. 

## How to remove an external bucket

Removing external bucket is as simple as removing any other bucket. Just delete it in the UI or via API. The bucket will be removed from the project, but the schema in the database will remain untouched. If you want to remove the schema, you need to do that manually in your warehouse. You may want to revoke the grants to Keboola Connection to ensure that Keboola no longer has access to it.

## Usage recommendations

* Use external buckets to consume data in your warehouse produced by 3rd-party tools outside of Keboola
* Use external buckets to access data in table-like structures that are not directly supported by Keboola (e.g. views or external tables)
* **Don't** use external buckets to load data into Keboola Connnection from services that already have an existing component
    * you'd have to orchestrate, maintain and monitor the external pipeline, which is normally done by Keboola for you
    * manipulation with the data will not be tracked in Keboola Connection audit trail
    * event-driven triggering is not supported for external buckets, so you'd need to synchronize the pipelines manually based on time
* while there are legitimate uses of external tools, keep in mind that by having data pipelines outside Keboola, you're losing the main benefit of Keboola Connection - the ability to orchestrate, maintain, monitor and audit the pipelines in one place
