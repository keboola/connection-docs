---
title: Part 3b - Writing to GoodData
permalink: /overview/tutorial/write/gooddata/
---

In the previous steps you learned, how to quickly [manipulate data](/overview/tutorial/manipulate/) in
KBC using SQL and how to [write data to Tableau](/overview/tutorial/write/). In this part of the tutorial, you'll
see how to write data to [GoodData Analytics](http://www.gooddata.com/). Keboola can automatically create 
Gooddata testing projects for you, so you **don't need to have any GoodData account** before you start.

Writing data to GoodData is in principle same as writing data to Tableu, but there are some variations which
are caused by the fundamental differences of both platforms.
Gooddata platform uses a different approach then Tableau, it has the concept of 
[Logical Models](https://help.gooddata.com/display/doc/Tutorial+-+Creating+Your+First+Data+Model), which
means that multiple tables are loaded into GoodData platform together with their logical connection model (schema). 
You don't need to create the model yourself as KBC will help you to create the model.

## Prepare data for the Writer
Because we want to load invidual tables instead of a denormalized tables, we need to modify the
[transformation we create before](/overview/tutorial/manipulate/). Go to **Transformations**
and create a new Transformation Bucket and a new Transformation (for training reasons, lets 
create a new transformation instead of modyfing the existing one):

{: .image-popup}
![Screenshot - Transformation Intro](/overview/tutorial/write/gooddata-transformation-intro.png)

We want to create a new transformation bucket (not only a new transformation), because the 
Tableu and Gooddata transformations are not really related. If they were more complex, than we would take out the
similar parts into another transformation. Name the new transformation bucket:

{: .image-popup}
![Screenshot - Transformation Bucket Create](/overview/tutorial/write/gooddata-transformation-create-1.png)

Add and name new transformation:

{: .image-popup}
![Screenshot - Transformation Create](/overview/tutorial/write/gooddata-transformation-create-2.png)

Now set transformation input mapping - include tables `opportunity`, `account`, `level`, `user` from 
Storage bucket `in.c-tutorial`. Then create output mapping for tables 
`out_opportunity`, `out_user`, `out_account` to store them in output bucket `out.c-tutorial`.

{: .image-popup}
![Screenshot - Transformation Input & Output Mapping](/overview/tutorial/write/gooddata-transformation-mapping.png)

Use the following four SQL queries, to create the tables in output bucket. There are no modifications to 
to the *account* table, so we might have also used an [alias](/storage/alias/). 

{% highlight sql %}
CREATE TABLE tmp_level AS 
    SELECT Name, CASE Level 
        WHEN 'S' THEN 'Senior'
        WHEN 'M' THEN 'Intermediate'
        WHEN 'J' THEN 'Junior' END AS Level
    FROM level;

CREATE TABLE out_opportunity AS 
    SELECT *, CASE 
        WHEN Probability < 50 THEN 'Poor'
        WHEN Probability < 70 THEN 'Good'
        ELSE 'Excellent' END AS ProbabilityClass
    FROM opportunity;

CREATE TABLE out_user AS 
    SELECT user.Name AS Name, user.Sales_Market AS UserSalesMarket, 
        user.Global_Market AS UserGlobalMarket 
    FROM
        user JOIN tmp_level ON user.Name = tmp_level.Name;

CREATE TABLE out_account AS 
    SELECT * FROM account;
{% endhighlight %}        

{: .image-popup}
![Screenshot - Transformation Queries](/overview/tutorial/write/gooddata-transformation-queries.png)

Run the transformation:

{: .image-popup}
![Screenshot - Transformation Run](/overview/tutorial/write/gooddata-transformation-run.png)

This will create a background job, which will take the four tables in transformation input mapping from Storage,
modify them with the SQL queries of the Transformation script, and create three new tables in output 
`out.c-tutorial` bucket in Storage. When the job finishes successfully (or in the mean time, if you feel lucky!), 
you can continue with configuration of the GoodData writer - start by creating a new writer in the **Writers** section:

{: .image-popup}
![Screenshot - New Writer](/overview/tutorial/write/gooddata-writer-intro-1.png)

## Configure the Writer
Find GoodData writer:

{: .image-popup}
![Screenshot - New Writer](/overview/tutorial/write/gooddata-writer-intro-2.png)

GoodData writer can have multiple configurations (as any other writer or extractor). Each configuration represents a set
of data loaded into a single GoodData project. **Create New Configuration** to continue: 

{: .image-popup}
![Screenshot - New GoodData Writer](/overview/tutorial/write/gooddata-writer-intro-3.png)

When you create a new configuration, you have to name it, and select properties of the GoodData project.
We can automatically create a Demo GoodData project for you, which is free of charge, but expires in 1 
month from creation.

{: .image-popup}
![Screenshot - Create GoodData Writer Configuration](/overview/tutorial/write/gooddata-writer-create-config.png)

When the configuration is created, you'll see a warning message saying that the project is being prepared and
you cannot access it yet. In the mean time, we can configure the tables which should be loaded to the
project.

{: .image-popup}
![Screenshot - Add Tables to GoodData Writer](/overview/tutorial/write/gooddata-configuration-intro.png)

Add the table `account` from the bucket `out.c-tutorial`. When adding each table
we will simplify the table title to just the table name (we have only few tables).

{: .image-popup}
![Screenshot - Add Table GoodData Writer](/overview/tutorial/write/gooddata-writer-add-table.png)

When you add the table, you need to configure type of each column. The 
[primary key](https://en.wikipedia.org/wiki/Unique_key) (identifier) should be marked as `CONNECTION_POINT`. 
Columns which we want to measure should be marked as `FACT`, and all other columns used for slicing and
filtering should be marked as `ATTRIBUTE` with the exception of date/datetime columns which should be marked as
`DATE`. Do not set the column Data Type.

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 1](/overview/tutorial/write/gooddata-writer-table-config.png)

When you add a `DATE` column, it will be marked in red, because a 
[*Date Dimension*](https://support.gooddata.com/hc/en-us/articles/215776077-Intro-to-Date-Dimensions) has to 
be added. Click on *Add* and create a new date dimension:  

{: .image-popup}
![Screenshot - GoodData Writer Date Dimension](/overview/tutorial/write/gooddata-writer-date-dimension.png)

The configuration is now valid (`FirstOrder` column is not red anymore) and can be saved:

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 2](/overview/tutorial/write/gooddata-writer-table-config-2.png)

Then go back to the writer configuration and add the table `out.c-tutorial.user`.

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 2](/overview/tutorial/write/gooddata-writer-intro-4.png)

The table title should set to *user* and the columns should be set in the following way:

{: .image-popup}
![Screenshot - GoodData Writer User Table Configuration](/overview/tutorial/write/gooddata-writer-table-config-3.png)

Save the table configuration, go back to writer configuration, and add the third table 
`out.c-tutorial.opportunity`, set the table title to *opportunity* and set the columns to the following:
- *Amount* and *Probability* to `FACT`
- *AccountId* and *OwnerId* to `REFERENCE`
- *CreatedDate*, *CloseDate*, *Start_Date* and *End_Date* to `DATE`
- *Id* to `IGNORE` (we won't be needing it any more)
- everything else to `ATTRIBUTE`  

You should obtain the following result:

{: .image-popup}
![Screenshot - GoodData Writer Opportunity Table Configuration](/overview/tutorial/write/gooddata-writer-table-config-4.png)

You need to specify `account` and `user` as a referenced table in for the `REFERENCE` columns. You also need to 
add a date dimension for each date column. In case of `CreatedDate` tick the **Include Time** checkbox when
creating the date dimension. The result should look like this:

{: .image-popup}
![Screenshot - GoodData Writer Opportunity Table Configuration Final](/overview/tutorial/write/gooddata-writer-table-config-5.png)

Save the table configuration and go back to the writer configuration. The warning message about GoodData project
being prepared should be gone by now. If not, try to refresh the page in few moments. Once the project is ready, 
you have to add each table to project upload by ticking the check right to its name. When you have all three tables
marked, you can click on **Upload project** to push them to GoodData:

{: .image-popup}
![Screenshot - GoodData Writer Tables Finished](/overview/tutorial/write/gooddata-writer-intro-5.png)

This will create a background job, which will write the tables into GoodData. In the mean time, you can click on
**Enable Access To Project**. This will give the current KBC user (you) access to the GoodData project referenced
in the Writer configuration. 

{: .image-popup}
![Screenshot - GoodData Writer Access Project](/overview/tutorial/write/gooddata-writer-intro-6.png)
 
Clicking the **GoodData Project** link will take you directly to GoodData BI and automatically log you in. You 
can then create your report:

{: .image-popup}
![Screenshot - GoodData Introduction](/overview/tutorial/write/gooddata-intro.png)
 
When you create a report, you first need to specify a metric. Metric can be computed from columns, we have marked
as `FACT` when setting up the writer (those are `amount` and `probability`). Let's add a metric for the
`SUM` of `Amount`:

{: .image-popup}
![Screenshot - GoodData Create Metric](/overview/tutorial/write/gooddata-dashboard-1.png)

Then you can specify, how this metric should be sliced in the **How** section, lets slice it by
`ProbabilityClass`:

{: .image-popup}
![Screenshot - GoodData Slice Metric](/overview/tutorial/write/gooddata-dashboard-2.png)

You can add additonal slices, or filters in the dashboard wizard. To close the wizard, click done and the
result will be shown to you in form of table. To change the view, use the appropriate icon at the 
top right corner.

{: .image-popup}
![Screenshot - GoodData Chart](/overview/tutorial/write/gooddata-dashboard-3.png)

This will give you the same chart, we produced in the [Tableu Example](/overview/tutorial/write/).
This concludes the tutorial to writing data to GoodData BI platform using KBC. You can now:
continue to [Setting up Automation](/overview/tutorial/automate/) 
