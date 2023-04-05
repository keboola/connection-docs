---
title: Teradata Transformation
permalink: /transformations/teradata/
---

* TOC
{:toc}

[Teradata Vantage™](https://www.teradata.com/) is the connected multi-cloud data platform for enterprise analytics that unifies everything: data lakes, data warehouses, analytics, and new data sources and types. Latest version 17.10 is currently supported.

## Example
To create a simple Teradata transformation, follow these steps:

- Create a table in Storage by uploading this [sample CSV file](/transformations/source.csv).
- Created table will be available in your transformation (or Workspace) via [Read-only Input-mapping](/transformations/#read-only-input-mapping), so there is no option to specify standard Input mapping.
- Create an output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.

{% highlight sql %}
CREATE TABLE "transformationTable" (
"id" INT NOT NULL,
"name" VARCHAR(10) NOT NULL
);

INSERT INTO "transformationTable" ("id", "name") VALUES (1, 'john');
INSERT INTO "transformationTable" ("id", "name") VALUES (2, 'doe');
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/teradata/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).

## Bucket Objects for Read-Only Input Mapping
For more information on how a **read-only input mapping** works, visit the [link](/transformations/mappings/#read-only-input-mapping).

Teradata organizes tables in databases. Each bucket in Keboola Connection is represented by a separate database, usually following this naming pattern: `<stackPrefix>_<projectID>-<bucketID>`
- `stackPrefix` – depends on which Keboola stack you are using
  - `SAPI` on https://connection.keboola.com/
  - `KEBOOLA` everywhere else
- `projectID` – the ID of your project, which you can find in the URL.
- `bucketID` – you can find this string ID in the detail of your bucket (field ID, not the name). For this value, `.` is replaced by `_`. 

However, a **read-only input mapping** cannot access alias tables, because technically it is just a reference to an existing schema.
If you want to access a bucket that is linked from another project, you need to use the ID of the source project from where the bucket is linked.

**Example**:
Bucket with ID `in.c-bucketOutOfTransformation` in project `9435` on `connection.keboola.com` is represented by database `SAPI_9435-in_c-bucketOutOfTransformation`
