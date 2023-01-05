---
title: Teradata Transformation
permalink: /transformations/teradata/
---

* TOC
{:toc}

[Teradata Vantage™](https://www.teradata.com/) is the connected multi-cloud data platform for enterprise analytics that unifies everything—data lakes, data warehouses, analytics, and new data sources and types. Latest version 17.10 is currently supported.

## Example
To create a simple Teradata transformation, follow these steps:

- Create a table in Storage by uploading this [sample CSV file](/transformations/source.csv).
- Created table will be available in your transformation (or Workspace) via [Read-only Input-mapping](), so there is no option to specify standard Input mapping.
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
