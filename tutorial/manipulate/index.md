---
title: Part 2 - Data Manipulation
permalink: /tutorial/manipulate/
---

At this point, you already know how to quickly [load data into Keboola Connection](/tutorial/load/),
and your [Storage](/storage/tables/) contains four new tables:
*account*, *opportunity*, *level* and *user*.
In this part of the tutorial, we will show you how to manipulate data in Storage using [Transformations](/transformations/).
Let's create a denormalized table from the input tables and do some minor modifications to it.

* TOC
{:toc}

## Creating Transformation
To start, go to the Keboola Connection **Transformations** section:

{: .image-popup}
![Screenshot - Transformations Console](/tutorial/manipulate/transformations-intro.png)

Like [tables](/storage/tables/), [Transformations](/transformations/) are organized into *buckets*.
Each transformation bucket can contain any number of individual transformations.
It should represent a logical set (container) of operations you want to perform together.
Before you start with transformations, create a bucket and call it *Opportunity*.

{: .image-popup}
![Screenshot - Create a Transformation Bucket](/tutorial/manipulate/transformations-create-bucket.png)

Then click on the **New Transformation** button to create an individual transformation.
Enter *Denormalize opportunities* as its *Name* and select **Snowflake** as its *Backend*. 
A backend is the engine running the transformation script; it is either a database server (Snowflake, Redshift) 
or a language interpreter (R, Python, Julia).

{: .image-popup}
![Screenshot - Create a Transformation](/tutorial/manipulate/transformations-create.png)

When you create a transformation, you need to set up

1. [**Input Mapping**](/transformations/mappings/#input-mapping) — what tables will be used in your transformation;
tables not mentioned in Input Mapping cannot be used in the transformation.
2. [**Output Mapping**](/transformations/#output-mapping) — what tables will be written into Storage;
tables not mentioned in Output Mapping will never be modified nor permanently stored (i.e. they are temporary).
3. [**Transformation Script**](/tutorial/manipulate/#transformation-script) — SQL queries defining
what will happen with the data; it takes the tables from Input Mapping, modifies them
and produces the tables referenced in Output Mapping.

The concept of [**mapping**](/transformations/mappings) is an important safeguard
when you are manipulating your data.
Thanks to it, there is no way to modify the wrong tables by accident.
The only tables which are modified by your transformation are those explicitly specified in Output Mapping.

{: .image-popup}
![Screenshot - Empty Transformation](/tutorial/manipulate/transformations-created.png)

### Input Mapping
Let's start with setting Input Mapping by clicking the **New Input** button.

{: .image-popup}
![Screenshot - Add input mapping](/tutorial/manipulate/transformation-input.png)

The *Source* field in the input mapping refers to Storage. Select `in.c-csv-import.account` as the source table.
You can do a full text search in the select field; typing `acc` will give you the table as well.
In the *Destination* field, the table name `account` is automatically filled for you.
This is the name of the source table inside the transformation. Use the **Create Input** button to create
the input mapping.

Add the remaining three tables: `opportunity`, `user` and `level`. If you loaded data using the
[Database extractor](/tutorial/load/database/) or the [Google Drive extractor](/tutorial/load/googledrive/),
feel free to use the tables created by them (e.g., `in.c-keboola-ex-db-snowflake-548904898.account` or
`in.c-keboola-ex-google-drive-548902224.level-level`). In either case, make sure that the destinations
are set to `account`, `opportunity`, `user`, and `level`.
You will get the following configuration:

{: .image-popup}
![Screenshot - Input mapping result](/tutorial/manipulate/transformation-input-end.png)

*See additional information about [Input Mapping](/transformations/mappings/#input-mapping)
(all available options, etc.).*

### Output Mapping
Continue with setting up Output Mapping by clicking on the **New Output** button.

{: .image-popup}
![Screenshot - Add output mapping](/tutorial/manipulate/transformation-output.png)

Enter `opportunity_denorm` into the *Source* field in the output mapping;
the *Source* field refers to the transformation. This table does not exist yet.
We will create it in the transformation.

The *Destination* field refers to the name of the output table in Storage.
It will be auto-generated to `out.c-opportunity.opportunity_denorm`, which is 
perfectly fine. It will create the `opportunity_denorm` table in the `opportunity` [bucket in the output stage](/storage/tables/)
in Storage. Neither the table nor the bucket exist, but they will be created once the transformation runs.

After you finish Output Mapping, you will see this:

{: .image-popup}
![Screenshot - Output mapping result](/tutorial/manipulate/transformation-output-end.png)

The size of the `opportunity_denorm` table shows as *N/A* because the table does not exist yet.

*See additional information about [Output Mapping](/transformations/mappings/#output-mapping)
(all available options, etc.).*

### Transformation Script
To produce that table from the tables `account`, `opportunity` and `user`, write a transformation script.
To save you some time, we have already prepared the necessary SQL queries for you:

{% highlight sql %}
CREATE TABLE "tmp_level" AS
    SELECT "Name", CASE
        WHEN "Level" = 'S' THEN 'Senior'
        WHEN "Level" = 'M' THEN 'Intermediate'
        WHEN "Level" = 'J' THEN 'Junior' END AS "Level"
    FROM "level";

CREATE TABLE "tmp_opportunity" AS
    SELECT * EXCLUDE ("_timestamp"), CASE
        WHEN "Probability" < 50 THEN 'Poor'
        WHEN "Probability" < 70 THEN 'Good'
        ELSE 'Excellent' END AS "ProbabilityClass"
    FROM "opportunity";

CREATE TABLE "opportunity_denorm" AS
    SELECT "tmp_opportunity".*,
        "user"."Name" AS "UserName", "user"."Sales_Market" AS "UserSalesMarket",
        "user"."Global_Market" AS "UserGlobalMarket",
        "account"."Name" AS "AccountName", "account"."Region" AS "AccountRegion",
        "account"."Status" AS "AccountStatus", "account"."FirstOrder" AS "AccountFirstOrder"
    FROM "tmp_opportunity"
        JOIN "user" ON "tmp_opportunity"."OwnerId" = "user"."Id"
        JOIN "account" ON "tmp_opportunity"."AccountId" = "account"."Id"
        JOIN "tmp_level" ON "user"."Name" = "tmp_level"."Name";
{% endhighlight %}

{: .image-popup}
![Screenshot - Transformation Queries](/tutorial/manipulate/transformation-queries.png)

In the first query, we change the user level descriptions into something more clear.

In the second query, we compute the quality level for each deal opportunity based on the estimated probability
of closing the deal.  Note that here we are excluding the system column "_timestamp" 
which appears in [cloned tables on Snowflake backend](/transformations/snowflake/#_timestamp-system-column). 

In the third query, we denormalize all four tables into a single one.
We have prepared the single table so that it will load nicely into Tableau.

{: .image-popup}
![Screenshot - Run Transformation](/tutorial/manipulate/transformations-intro-3.png)

## Running Transformation
Save the queries and then click on **Run Transformation**. This will create a background job which will

- get the specified tables from Storage,
- put them in a transformation database,
- execute the queries/script, and
- store the result in Storage again.

To see if the transformation job was successful, go to [**Jobs**](/management/jobs/), or click on the small
**Transformations job has been scheduled** window that pops up after a transformation starts running.

Having learned to set up a transformation, you can now

- continue with the next [Writing Data](/tutorial/write/) step, or
- take a brief side step to [Using Sandbox](/tutorial/manipulate/sandbox/).
