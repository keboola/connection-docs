---
title: External Buckets
permalink: /storage/byodb/external-buckets/
---

* TOC
{:toc}

If you operate Keboola in Bring Your Own Database (BYODB) mode atop your own data warehouse, the data residing in the warehouse will not automatically be visible or accessible from inside Keboola. 
We address this by providing the **External Buckets** feature.

The exact implementation of external buckets depends on the database backend you use; it could be a database, schema, or another concept. Unless stated otherwise, we will describe the implementation for Snowflake.

<div class="clearfix"></div>

{: .alert.alert-info}
External buckets feature is available only in the BYODB mode. To enable it, please contact [support](/management/support).

{% include public-beta-warning.html %}

## What Is an External Bucket?

Storage in Keboola is organized into [buckets](/storage/buckets/). An **external bucket** is a special type of bucket wherein the contents of the bucket are not managed by Keboola. It can be located _anywhere in the storage backend used by your Keboola project_ (Snowflake or BigQuery) and is a virtual bucket created atop a Snowflake schema or BigQuery dataset respectively. All table-like objects (such as tables, views, and external tables) inside the schema are mapped to tables in the bucket. Access to the bucket is read-only; you cannot write to the bucket from Keboola. A single schema can be registered with multiple projects in Keboola simultaneously.

## Creating an External Bucket

An external bucket can be created in the Storage section of the project. 

{: .image-popup}
![Register external data button](/storage/byodb/external-buckets/figures/1.png)

Click on the **Register External Data** button. The dialog will differ based on the backend you are using. 

### Snowflake

Fill in the name of the new bucket, database name, and schema name. 

{: .image-popup}
![Register external data popup - Snowflake](/storage/byodb/external-buckets/figures/2-snflk.png)

Then continue to the next step, where we will provide you with a guide on how to correctly grant Keboola access to the schema in Snowflake.

{: .image-popup}
![Register external data popup step 2 - Snowflake](/storage/byodb/external-buckets/figures/3-snflk.png)

{: .alert.alert-info}
Note: This set of permissions grants the Keboola service account read-only access to the data.

Once you are done, click **Register Bucket**, and you can start using it.

### BigQuery

Fill in the name of the new bucket and dataset name. 

{: .image-popup}
![Register external data popup - BigQuery](/storage/byodb/external-buckets/figures/2-bq.png)

Then continue to the next step, where we will provide you with a guide on how to correctly grant Keboola access to the dataset in BigQuery.

{: .image-popup}
![Register external data popup step 2 - BigQuery](/storage/byodb/external-buckets/figures/3-bq.png)

{: .alert.alert-info}
Note: By adding the Keboola service account as a subscriber, you enable read-only access to the data.

{: .alert.alert-warning}
[External tables](https://cloud.google.com/bigquery/docs/external-data-cloud-storage) are not supported, and if the shared dataset contains such tables, they will be ignored.

Once you are done, click **Register Bucket**, and you can start using it.

### Considerations

When you register an external bucket, we analyze the metadata of objects in it and register all tables and views as tables in the bucket in Keboola. 
If you later add additional tables or views, you will need to manually refresh the external bucket using the **Refresh** action in the bucket detail to make them visible in Keboola. 

{: .image-popup}
![Bucket refresh](/storage/byodb/external-buckets/figures/4.png)

## Using an External Bucket

External buckets are not part of a normal [input mapping](transformations/mappings/#input-mapping). They are accessible via the [read-only input mapping](/transformations/mappings/#read-only-input-mapping). 
Keep in mind that external buckets cannot be used in an [output mapping](transformations/mappings/#output-mapping) as they are not writable.

### External Bucket in a Snowflake SQL Transformation

Because external buckets are not part of a normal [input mapping](transformations/mappings/#input-mapping), they are not copied into your transformation workspace. 
You need to reference them in you transformation using a fully-qualified name.

In the following example, you've created an external bucket called `users-reporting` that references the `sales_emea` schema in the database `REPORTING`. The schema contains a table called `users`. You want to create a new table `MQL_USERS` that contains only users sourced from marketing qualified leads. You can do that using the following SQL:

```sql
CREATE TABLE "MQL_USERS" AS SELECT * 
FROM "REPORTING"."sales_emea"."users"
WHERE "source" = 'mql';
```

*Note: The query uses the **fully-qualified name** of the table in the `FROM` clause.*

### External Bucket in a BigQuery SQL Transformation

In BigQuery, the external bucket is mapped to an actual dataset, `users-reporting` (the name you filled in the dialog), in your project – in this case, project `sapi-9752`. 
You can reference the contents of the dataset in your SQL transformation using a fully-qualified name. 

```bigquery
CREATE TABLE `MQL_USERS` AS SELECT *
FROM `users-reporting`.`users`
WHERE `source` = "mql";
```

{: .alert.alert-warning}
The dataset name is **the name of bucket you provided in the dialog** (`users-reporting`), **not** that of the original dataset created in BigQuery (`sales_emea`). However, there are no technical limitations; they can have the same name. 

## Removing an External Bucket

Removing an external bucket is as simple as removing any other bucket. Simply delete it in the UI or via API. The bucket will be removed from the project, but the schema in the database will remain untouched. 
If you wish to remove the schema, you will need to do so manually in your warehouse. You may want to revoke the grants to Keboola to ensure that Keboola no longer has access to it.

## Usage Recommendations

* Use external buckets to consume data in your warehouse produced by 3rd-party tools outside of Keboola.
* Use external buckets to access data in table-like structures that are not directly supported by Keboola (e.g., views or external tables).
* **It's discouraged** to use external buckets to load data into Keboola from services that already have an existing component. Consider the following limitations of such an approach:
    * You would have to orchestrate, maintain, and monitor the external pipeline, which is normally done by Keboola for you.
    * Manipulation of the data will not be tracked in the Keboola audit trail.
    * Event-driven triggering is not supported for external buckets, so you would need to synchronize the external and Keboola pipelines manually based on time.
* While there are legitimate uses of external tools, keep in mind that by having data pipelines outside Keboola, you lose the main benefit of Keboola – the ability to orchestrate, maintain, monitor, and audit the pipelines in one place.


## Limitations

* Table names in the external buckets can't be longer than **92 characters** and can contain only **alphanumeric** characters, **dashes**, and **underscores**. Tables that do not meet these requirements **will be ignored**.
