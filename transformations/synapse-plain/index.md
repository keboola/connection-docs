---
title: Synapse Transformation
permalink: /transformations/synapse-plain/
---

* TOC
{:toc}

[Microsoft Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) is an analytics 
service that brings together enterprise data warehousing and Big Data analytics. It runs natively
on Azure Cloud.

## Example
To create a simple Synapse transformation, follow these steps:

- Create a table in Storage by uploading the [sample CSV file](/transformations/source.csv).
- Create an input mapping from that table, setting its destination to `source` (as expected by the Snowflake script).
- Create an output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.

{% highlight sql %}
CREATE TABLE "result" WITH (DISTRIBUTION = ROUND_ROBIN) AS
	SELECT "first", "second" * 42 AS "larger_second" FROM "source";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/synapse-plain/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).
