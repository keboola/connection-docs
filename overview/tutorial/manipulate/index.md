---
title: Part 2 - Data Manipulation
permalink: /overview/tutorial/manipulate/
---

In the [previous step](/overview/tutorial/load/) you learned, how to quickly load data into
KBC and you should now have tables *account*, *opportunity*, *user* and *usergoal* in bucket 
*in.c-tutorial*. In this part of the tutorial you will learn how to manipulate with data in storage 
using Transformations. We will create a denormalized table from the input tables and do some
minor modifications to it.

To create a transformation, go to **Transformations** section:

{: .image-popup}
![Screenshot - Transformations Console](/overview/tutorial/manipulate/transformations-intro.png)

Like tables, Transformations are organized into *buckets*. Each transformation bucket can contain any number
of individiual transformations and it should represent a logical set (container) of operations you want to perform together.
Before you can start with transformations, you must create a bucket. Lets name the bucket *Opportunity*. 

{: .image-popup}
![Screenshot - Create a Transformation Bucket](/overview/tutorial/manipulate/transformations-create-bucket.png)

When the bucket is created, you can create individual transformations by clicking on *Add Transformation*. Each 
transformation must have a *Name* and *Backend*. Backend is the engine running the transformation script, it can be
a database server (MySQL, Redshift, Snowflake) or a language interpreter (R, Python). Create a new tranformation
*Denormalize opportunities* on the *MySQL* backend.

{: .image-popup}
![Screenshot - Create a Transformation](/overview/tutorial/manipulate/transformations-create.png)

When you create a transformation, you need to enter three things:

- *Input mapping* - definition of what tables will be used in the Transformation  
- *Transformation script* - SQL queries which define what will happen with the data 
- *Output mapping* - definition of what tables will be put into Storage

The *Input mapping* is there to select the tables you will use in your transformation. Tables not 
mentioned in Input Mapping cannot be used in the transformation. The *Output Mapping* is there to
select what tables will be written to Storage. Tables from Storage not mentioned in the output mapping will 
never be modified. Tables from Transformation not mentioned in the output mapping will not be permanently 
stored (i.e. they are temporary). The transformation script itself should therefore take the tables from
*input mapping*, modify them and produce tables referenced in *output mapping*.

The concept of input/output mapping is an important safeguard when you are manipulating with your data. Thanks
to it, there is no way to modify unwanted tables by accident. The only tables which are modifed by your transformation
are those explicitly specified in the output mapping.  

Lets start with setting the Input mapping by clicking on the *Add Input* button.

{: .image-popup}
![Screenshot - Add input mapping](/overview/tutorial/manipulate/transformation-input.png)

The source field in input mapping refers to Storage. In the *source* field, select the source table `in.c-tutorial.account`. 
You can do fulltext search in the select field, so typying `acc` will give you the table as well. In the 
*destination* field, the table name `account` is automatically filled for you. This is the name of the 
table inside the transformation. *Create* the input mapping.

Add the tables `opportunity`, `user` and `level` in the same way. And you should end up with the following configuration:

{: .image-popup}
![Screenshot - Input mapping result](/overview/tutorial/manipulate/transformation-input-end.png)

Lets continue with setting up *Output mapping* by clicking on the *Add Output* button.

{: .image-popup}
![Screenshot - Add output mapping](/overview/tutorial/manipulate/transformation-output.png)

The source field in output mapping refers to the Transformation. In the *source* field, enter e.g.
`opportunity_denorm` - we don't have this table yet, we will have to create it in the transformation.
The *destination* field referes to the name of the table in Storage. Enter 
`out.c-tutorial.opportunity_denorm` which will create a table `opportunity_denorm` in bucket `tutorial` in
the *out*put stage in Storage. This table does not exist either, but it will be created once the 
transformation runs. You should obtain the following result when you create the output mapping:

{: .image-popup}
![Screenshot - Output mapping result](/overview/tutorial/manipulate/transformation-output-end.png)

Note that the `opportunity_denorm` table shows *N/A* size, this is correct, because the table does not exist yet.
You can now write the transformation script which will produce that table from tables
`account`, `opportunity` and `user`. To save you some time, we already prepared the necessary SQL queries for
you:

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

In the first query, we change the user level descriptions into something more clear. In the second query
we compute deal opportunity quality level based. In the third query, we denormalize all four tables into a 
single one. We prepared the single table so that it will load nicely into 
Tableu.

{: .image-popup}
![Screenshot - Run Transformation](/overview/tutorial/manipulate/transformations-intro-3.png)


You can now click on *Run Transformation*, this will create a background job, 
which will get the specified tables from Storage, put them in a transformation database, execute the queries and
store the result in Storage again. You can now:
  
- continue with the next step [Writing data](/overview/tutorial/write/)
- or you can take a brief side step to [Using Sandbox](/overview/tutorial/manipulate/sandbox/)
