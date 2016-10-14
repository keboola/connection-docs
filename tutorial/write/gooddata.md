---
title: Part 3b - Writing to GoodData
permalink: /tutorial/write/gooddata/
---

* TOC
{:toc}

After [manipulating data in SQL](/tutorial/manipulate/) 
and [writing data to Tableau](/tutorial/write/), 
let's now write data to [GoodData Analytics](http://www.gooddata.com/). 
As KBC creates GoodData testing projects for you automatically, 
there is **no need to have a GoodData account** before you start.

Writing data to GoodData is very similar to writing data to Tableau, although 
there are some changes due to the fundamental differences in both platforms.
The GoodData platform uses the concept of 
[Logical Models](https://help.gooddata.com/display/doc/Tutorial+-+Creating+Your+First+Data+Model)
where multiple tables are loaded into the platform together with their logical connection model (schema).
KBC will assist you in creating the model.

## Prepare Data for Writer

To load individual tables instead of denormalized tables, the [transformation created earlier](/tutorial/manipulate/)
has to be modified. Go to **Transformations** and create a new transformation bucket and a new transformation. 
For the sake of practicing, let's create a brand new transformation instead of modifying the existing one.

{: .image-popup}
![Screenshot - Transformation Intro](/tutorial/write/gooddata-transformation-intro.png)

Apart from creating a new transformation, we also need a new transformation bucket, since the
Tableau and Gooddata transformations are not really related. If they were more complex, we would take out the
similar parts into another transformation. Name the new transformation bucket *Opportunity - GoodData*.

{: .image-popup}
![Screenshot - Transformation Bucket Create](/tutorial/write/gooddata-transformation-create-1.png)

Then add a new transformation and name it.

{: .image-popup}
![Screenshot - Transformation Create](/tutorial/write/gooddata-transformation-create-2.png)

Now set the transformation input mapping. Include the following tables from the `in.c-tutorial` storage bucket: 
`opportunity`, `account`, `level`, and `user`. 
Then create the output mapping for the `out_opportunity`, `out_user`, and `out_account` tables 
to be stored in the `out.c-tutorial` output bucket.

{: .image-popup}
![Screenshot - Transformation Input & Output Mapping](/tutorial/write/gooddata-transformation-mapping.png)

Use the following four SQL queries to create the output bucket tables. 

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
![Screenshot - Transformation Queries](/tutorial/write/gooddata-transformation-queries.png)

Run the transformation.

{: .image-popup}
![Screenshot - Transformation Run](/tutorial/write/gooddata-transformation-run.png)

This will create a background job which will 

- take the four tables in the transformation input mapping from Storage,
- modify them with the SQL queries of the Transformation script, and 
- create three new tables in the `out.c-tutorial` output bucket in Storage. 

To see if the transformation job has finished, go to **Jobs**, or click on the little **Transformations job has been scheduled** window 
that pops up after a transformation starts running. When finished, or while waiting for the job to end, continue configuring the GoodData writer.
Start by creating a new writer in the **Writers** section:

{: .image-popup}
![Screenshot - New Writer](/tutorial/write/gooddata-writer-intro-1.png)

## Configure Writer
Find the GoodData writer:

{: .image-popup}
![Screenshot - New Writer](/tutorial/write/gooddata-writer-intro-2.png)

GoodData writer can have multiple configurations (as any other writer or extractor). Each configuration represents a set
of data loaded into a single GoodData project. **Create New Configuration** to continue:

{: .image-popup}
![Screenshot - New GoodData Writer](/tutorial/write/gooddata-writer-intro-3.png)

When creating a new configuration, name it and select properties of the GoodData project.
KBC automatically creates a free Demo GoodData project for you. However, it expires in one
month from the date it has been created.

{: .image-popup}
![Screenshot - Create GoodData Writer Configuration](/tutorial/write/gooddata-writer-create-config.png)

Whilst the configuration is being created, you'll see a warning message saying that the project is being prepared and
cannot be accessed yet. In the meantime, let's configure the tables that are to be loaded to the project.

{: .image-popup}
![Screenshot - Add Tables to GoodData Writer](/tutorial/write/gooddata-configuration-intro.png)

Add the `account` table from the `out.c-tutorial` bucket. When adding a table,
simplify the table title to just the table name (we have only few tables).

{: .image-popup}
![Screenshot - Add Table GoodData Writer](/tutorial/write/gooddata-writer-add-table.png)

Configure the type of each column. Mark

- the [primary key](https://en.wikipedia.org/wiki/Unique_key), identifier, as `CONNECTION_POINT`,
- columns which we want to measure as `FACT`, 
- all other columns used for slicing and filtering as `ATTRIBUTE`, and
- date/datetime columns, being an exception, as `DATE`. 

Do not set the Data Type column.

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 1](/tutorial/write/gooddata-writer-table-config.png)

The new `DATE` column will be marked in red because a
[*Date Dimension*](https://help.gooddata.com/display/doc/Working+with+Dates) has to be added. 
Click on *Add* and create a new date dimension:

{: .image-popup}
![Screenshot - GoodData Writer Date Dimension](/tutorial/write/gooddata-writer-date-dimension.png)

The configuration is now valid (`FirstOrder` column is not red anymore) and can be saved:

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 2](/tutorial/write/gooddata-writer-table-config-2.png)

Then go back to the writer configuration, and add the `out.c-tutorial.user` table.

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 2](/tutorial/write/gooddata-writer-intro-4.png)

Name the table *user* and set the columns in the following way:

{: .image-popup}
![Screenshot - GoodData Writer User Table Configuration](/tutorial/write/gooddata-writer-table-config-3.png)

Save the table configuration, and go back to the writer configuration. Add the third table called
`out.c-tutorial.opportunity`. Name it *opportunity* and set the columns as follows:

- *Amount* and *Probability* to `FACT`,
- *AccountId* and *OwnerId* to `REFERENCE`,
- *CreatedDate*, *CloseDate*, *Start_Date* and *End_Date* to `DATE`,
- *Id* to `IGNORE` (we won't be needing it any more), and
- everything else to `ATTRIBUTE`.

You should obtain the following result:

{: .image-popup}
![Screenshot - GoodData Writer Opportunity Table Configuration](/tutorial/write/gooddata-writer-table-config-4.png)

Specify `account` and `user` as a referenced table for the `REFERENCE` columns. 
Also, add a date dimension for each date column. In case of `CreatedDate`, tick the **Include Time** checkbox 
when creating the date dimension. The result should look like this:

{: .image-popup}
![Screenshot - GoodData Writer Opportunity Table Configuration Final](/tutorial/write/gooddata-writer-table-config-5.png)

Save the table configuration, and go back to configuring the writer. The warning message about GoodData project
being prepared should be gone by now. If not, refresh the page in a few moments. 

Once the project is ready, add all three tables to the project upload by ticking the check right of their names. 
With all three tables marked, click on **Upload project** to push them to GoodData:

{: .image-popup}
![Screenshot - GoodData Writer Tables Finished](/tutorial/write/gooddata-writer-intro-5.png)

The tables will be written into GoodData by a background job. When a job is running, a small orange circle appears
under *Last runs*, along with RunId and other info on the job. Green is for success, red for failure. 
Click on the indicator, or the info next to it for more details. 

In the mean time, click on **Enable Access To Project**. This will give the current KBC user, you, 
access to the GoodData project referenced in the Writer configuration.

{: .image-popup}
![Screenshot - GoodData Writer Access Project](/tutorial/write/gooddata-writer-intro-6.png)

Clicking the **GoodData Project** link will take you directly to GoodData BI and automatically log you in. 
Then create your report:

{: .image-popup}
![Screenshot - GoodData Introduction](/tutorial/write/gooddata-intro.png)

First, specify a metric. It can be computed from columns we marked as `FACT` 
when setting up the writer (those are `amount` and `probability`). 
Let's add a metric for `SUM` of `Amount`,

{: .image-popup}
![Screenshot - GoodData Create Metric](/tutorial/write/gooddata-dashboard-1.png)

Then specify how this metric should be sliced in the **How** section. Let's slice it by
`ProbabilityClass`:

{: .image-popup}
![Screenshot - GoodData Slice Metric](/tutorial/write/gooddata-dashboard-2.png)

Additional slices, or filters can be added in the dashboard wizard. To close the wizard, click done and the
result will be shown to you as a table. To change the view, use the appropriate icon in the
top right corner.

{: .image-popup}
![Screenshot - GoodData Chart](/tutorial/write/gooddata-dashboard-3.png)

This will give you the same chart we produced in the [Tableau Example](/tutorial/write/).

The tutorial on writing data to GoodData BI platform using KBC ends here. 
Continue to [Setting up Automation](/tutorial/automate/).