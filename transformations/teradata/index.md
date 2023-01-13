---
title: Teradata Transformation
permalink: /transformations/teradata/
---

* TOC
{:toc}

[Teradata Vantage™](https://www.teradata.com/) is the connected multi-cloud data platform for enterprise analytics that unifies everything — data lakes, data warehouses, analytics, and new data sources and types. Latest version 17.10 is currently supported.

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

## Bucket databases for Read-only input mapping

Teradata organizes tables in databases. Each bucket in Keboola is represented by a separated database, which usually follow this naming pattern: `<stackPrefix>_<projectID>_<bucketID>`
- `stackPrefix` depends on keboola stack which you use
  - https://connection.keboola.com/ - `SAPI`
  - https://connection.eu-central-1.keboola.com/ - `KEBOOLA`
  - https://connection.north-europe.azure.keboola.com/ - `KEBOOLA`
- `projectID` - ID of your project, which you can find in URL
- `bucketID` which you can find in detail of your bucket (field ID, not name). This value is in form where `.` is replaced by `_` 

**Example**:
Bucket with ID `in.c-bucketOutOfTransformation` in project `9435` in `connection.keboola.com` is represented by database `SAPI_9435-in_c-bucketOutOfTransformation`
