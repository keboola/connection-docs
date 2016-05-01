---
title: Part 2 - Data Manipulation
permalink: /overview/tutorial/manipulate/
---

At this point, you already know how to quickly [load data into KBC](/overview/tutorial/load/),
and your *in.c-tutorial* bucket contains four new tables: *account*, *opportunity*, *level* and *user*. 
In this part of the tutorial, we will show you how to manipulate data in Storage using Transformations. 
Let's create a denormalized table from the input tables and do some minor modifications to it.

To start, go to the **Transformations** section:

{: .image-popup}
![Screenshot - Transformations Console](/overview/tutorial/manipulate/transformations-intro.png)

Like tables, Transformations are organized into *buckets*. Each transformation bucket can contain any number
of individual transformations. It should represent a logical set (container) of operations you want to perform together.
Before you start with transformations, create a bucket and call it *Opportunity*. 

{: .image-popup}
![Screenshot - Create a Transformation Bucket](/overview/tutorial/manipulate/transformations-create-bucket.png)

Then click on *Add Transformation* in the upper right corner to create an individual transformation. 
Make sure to enter its *Name* and select *Backend*. A backend is the engine running the transformation script;
it is either a database server (MySQL, Redshift, Snowflake) or a language interpreter (R, Python). 
Name your transformation *Denormalize opportunities*, and choose the *MySQL* backend.

{: .image-popup}
![Screenshot - Create a Transformation](/overview/tutorial/manipulate/transformations-create.png)

When you create a transformation, you need to enter three things:

- *Input Mapping* - what tables will be used in the Transformation,  
- *Transformation Script* - SQL queries defining what will happen with the data, and 
- *Output Mapping* - what tables will be written into Storage.

Tables not mentioned in *Input Mapping* cannot be used in the transformation. 
Tables from Storage not mentioned in *Output Mapping* will never be modified nor permanently stored (i.e. they are temporary). 
*Transformation Script* itself takes the tables from *Input Mapping*, modifies them and produces tables referenced in *Output Mapping*.

The concept of the input/output mapping is an important safeguard when you are manipulating your data. 
Thanks to it, there is no way to modify unwanted tables by accident. 
The only tables which are modified by your transformation are those explicitly specified in *Output Mapping*.  

Let's start with setting the input mapping by clicking on the *Add Input* button.

{: .image-popup}
![Screenshot - Add input mapping](/overview/tutorial/manipulate/transformation-input.png)

The *source* field in the input mapping refers to Storage. Select `in.c-tutorial.account` as the source table. 
You can do a full text search in the select field; typing `acc` will give you the table as well. 
In the *destination* field, the table name `account` is automatically filled for you. 
This is the name of the table inside the transformation. *Create* the input mapping.

Add the remaining three tables: `opportunity`, `user` and `level`. You will get the following configuration:

{: .image-popup}
![Screenshot - Input mapping result](/overview/tutorial/manipulate/transformation-input-end.png)

Continue with setting up *Output Mapping* by clicking on the *Add Output* button.

{: .image-popup}
![Screenshot - Add output mapping](/overview/tutorial/manipulate/transformation-output.png)

Enter `opportunity_denorm` into the *source* field in the output mapping; the source field refers to the transformation.
This table does not exist yet. We will create it in the transformation.

The *destination* field refers to the name of the table in Storage. Enter `out.c-tutorial.opportunity_denorm`. 
It will create the `opportunity_denorm` table in the `tutorial` bucket in the *out*put stage in Storage. 
This table does not exist either, but it will be created once the transformation runs. 
After you finish the output mapping, you will see this:

{: .image-popup}
![Screenshot - Output mapping result](/overview/tutorial/manipulate/transformation-output-end.png)

The size of the `opportunity_denorm` table shows as *N/A* because the table does not exist yet.

To produce that table from tables `account`, `opportunity` and `user`, click *Edit Queries* and write the transformation script. 
To save you some time, we have already prepared the necessary SQL queries for you:

{% highlight sql %}
CREATE TABLE tmp_level AS 
    SELECT Name, CASE Level 
        WHEN 'S' THEN 'Senior'
        WHEN 'M' THEN 'Intermediate'
        WHEN 'J' THEN 'Junior' END AS Level
    FROM level;

CREATE TABLE tmp_opportunity AS 
    SELECT *, CASE 
        WHEN Probability < 50 THEN 'Poor'
        WHEN Probability < 70 THEN 'Good'
        ELSE 'Excellent' END AS ProbabilityClass
    FROM opportunity;

CREATE TABLE opportunity_denorm AS 
    SELECT tmp_opportunity.*, 
        user.Name AS UserName, user.Sales_Market AS UserSalesMarket, 
        user.Global_Market AS UserGlobalMarket,
        account.Name AS AccountName, account.Region AS AccountRegion, 
        account.Status AS AccountStatus, account.FirstOrder AS AccountFirstOrder
    FROM tmp_opportunity 
        JOIN user ON tmp_opportunity.OwnerId = user.Id
        JOIN account ON tmp_opportunity.accountId = account.Id
        JOIN tmp_level ON user.Name = tmp_level.Name
{% endhighlight %}

{: .image-popup}
![Screenshot - Transformation Queries](/overview/tutorial/manipulate/transformation-queries.png)

In the first query, we change the user level descriptions into something more clear. 
In the second query, we compute the quality level for each deal opportunity based on the estimated probability of closing the deal. 
In the third query, we denormalize all four tables into a single one. 
We have prepared the single table so that it will load nicely into Tableau.

{: .image-popup}
![Screenshot - Run Transformation](/overview/tutorial/manipulate/transformations-intro-3.png)


Save the queries and then click on *Run Transformation*. This will create a background job which will 

- get the specified tables from Storage,
- put them in a transformation database, 
- execute the queries, and 
- store the result in Storage again. 

Having learned to set up a transformation, you can now
  
- continue with the next [Writing Data](/overview/tutorial/write/) step, or
- take a brief side step to [Using Sandbox](/overview/tutorial/manipulate/sandbox/).
