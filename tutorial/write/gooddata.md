---
title: Writing to GoodData
permalink: /tutorial/write/gooddata/
---

* TOC
{:toc}

After [manipulating data in SQL](/tutorial/manipulate/) and [writing data to Tableau](/tutorial/write/),
let's now write data to [GoodData](http://www.gooddata.com/).

**You need to have a GoodData account** before you start.

Writing data to GoodData is very similar to writing data to Tableau, although
there are some changes due to the fundamental differences in both platforms.
The GoodData platform uses the concept of
[Logical Models](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-in-gooddata)
where multiple tables are loaded into the platform together with their logical connection model (schema).
Keboola Connection will assist you in creating the model.

## Prepare Data for Writer

To load individual tables instead of denormalized tables, the [transformation created earlier](/tutorial/manipulate/)
has to be modified. Go to **Transformations** and create a new transformation bucket and a new transformation.
For the sake of practicing, let's create a brand new transformation instead of modifying the existing one.

{: .image-popup}
![Screenshot - Transformation Intro](/tutorial/write/gooddata-transformation-intro.png)

Apart from creating a new transformation, we also need a new transformation bucket, since the
Tableau and GoodData transformations are not really related. If they were more complex, we would take out the
similar parts into another transformation. Name the new transformation bucket *Opportunity - GoodData* and
choose the **Snowflake** backend.

{: .image-popup}
![Screenshot - Transformation Bucket Create](/tutorial/write/gooddata-transformation-create-1.png)

Then add a new transformation and name it.

{: .image-popup}
![Screenshot - Transformation Create](/tutorial/write/gooddata-transformation-create-2.png)

Now set the transformation input mapping. Include the following tables from the `in.c-csv-import` storage bucket:
`opportunity`, `account`, `level`, and `user`.
If you loaded data using the
[Database extractor](/tutorial/load/database/) or [Google Drive extractor](/tutorial/load/googledrive/),
feel free to use the tables created by them (e.g., `in.c-keboola-ex-db-snowflake-548904898.account` or `in.c-keboola-ex-google-drive-548902224.level-level`). In either case, make sure that the destinations
are set to `account`, `opportunity`, `user` and `level`.
Then create the output mapping for the `out_opportunity`, `out_user`, and `out_account` tables
to be stored in the `out.c-opportunity-gooddata` output bucket.

{: .image-popup}
![Screenshot - Transformation Input & Output Mapping](/tutorial/write/gooddata-transformation-mapping.png)

Use the following four SQL queries to create the output tables.

{% highlight sql %}
CREATE TABLE "tmp_level" AS
    SELECT "Name", CASE "Level"
        WHEN 'S' THEN 'Senior'
        WHEN 'M' THEN 'Intermediate'
        WHEN 'J' THEN 'Junior' END AS "Level"
    FROM "level";

CREATE TABLE "out_opportunity" AS
    SELECT *, CASE
        WHEN "Probability" < 50 THEN 'Poor'
        WHEN "Probability" < 70 THEN 'Good'
        ELSE 'Excellent' END AS "ProbabilityClass"
    FROM "opportunity";

CREATE TABLE "out_user" AS
    SELECT "user"."Name" AS "Name", "user"."Sales_Market" AS "UserSalesMarket",
        "user"."Global_Market" AS "UserGlobalMarket"
    FROM
        "user" JOIN "tmp_level" ON "user"."Name" = "tmp_level"."Name";

CREATE TABLE "out_account" AS
    SELECT * FROM "account";
{% endhighlight %}

{: .image-popup}
![Screenshot - Transformation Queries](/tutorial/write/gooddata-transformation-queries.png)

Run the transformation.

{: .image-popup}
![Screenshot - Transformation Run](/tutorial/write/gooddata-transformation-run.png)

This will create a background job which will

- take the four tables in the transformation input mapping from Storage,
- modify them with the SQL queries of the Transformation script, and
- create three new tables in the `out.c-opportunity-gooddata` output bucket in Storage.

To see if the transformation job has finished, go to **Jobs**, or click on the little **Transformations job has been scheduled** window
that pops up after a transformation starts running. When finished, or while waiting for the job to end, continue configuring the GoodData writer.

## Configure Writer
Start by creating a new writer in the **Components -- Writers** section:

{: .image-popup}
![Screenshot - New Writer](/tutorial/write/gooddata-writer-intro-1.png)

The GoodData writer can have multiple configurations (as any other writer or extractor). Each configuration represents a set
of data loaded into a single GoodData project. **New Configuration** to continue:

{: .image-popup}
![Screenshot - New GoodData Writer](/tutorial/write/gooddata-writer-intro-3.png)

And choose its name:

{: .image-popup}
![Screenshot - New GoodData Writer](/tutorial/write/gooddata-writer-intro-4.png)

**Set Up GoodData Project** to continue:

{: .image-popup}
![Screenshot - Setup GoodData Project](/tutorial/write/gooddata-writer-intro-setup-project.png)

Keboola Connection can create a free Demo GoodData project for you. However, it expires in one
month from the date it was created.

{: .image-popup}
![Screenshot - Create GoodData Project](/tutorial/write/gooddata-writer-create-demo-project.png)

Let's create a [*Date Dimension*](https://help.gooddata.com/doc/en/reporting-and-dashboards/dates-and-times).

{: .image-popup}
![Screenshot - Create a date dimension](/tutorial/write/gooddata-writer-date-button.png)

Name the dimension `first_order`:

{: .image-popup}
![Screenshot - GoodData Writer Date Dimension](/tutorial/write/gooddata-writer-date-dimension.png)

Now let's configure the tables that are to be loaded to the project.

{: .image-popup}
![Screenshot - Add Tables to GoodData Writer](/tutorial/write/gooddata-writer-new-table-button.png)

Add the `account` table from the `out.c-opportunity-gooddata` bucket. When adding a table,
simplify the table title to just the table name (we have only few tables).

{: .image-popup}
![Screenshot - Add Table GoodData Writer](/tutorial/write/gooddata-writer-add-table.png)

Configure the type of each column. Mark

- the [primary key](https://en.wikipedia.org/wiki/Unique_key), identifier, as `CONNECTION_POINT`,
- columns which we want to measure as `FACT`,
- all other columns used for slicing and filtering as `ATTRIBUTE`, and
- date/datetime columns, being an exception, as `DATE`.

Do not set the *Data Type* column.

Set the previously created date dimension `first_order` to the *FirstOrder* column.

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 1](/tutorial/write/gooddata-writer-table-config.png)

**Save** the column settings.

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 1 Save](/tutorial/write/gooddata-writer-table-config-1.png)

Then go back to the writer configuration, and add the `out.c-opportunity-gooddata.user` table.

{: .image-popup}
![Screenshot - GoodData Writer Table Configuration Part 2](/tutorial/write/gooddata-writer-intro-5.png)

Name the table *user* and set the *Name* column to `CONNECTION_POINT` and everything else to `ATTRIBUTE`.

{: .image-popup}
![Screenshot - GoodData Writer User Table Configuration](/tutorial/write/gooddata-writer-table-config-2.png)

Save the table configuration, and go back to the writer configuration. 

Add four other date dimensions called `created_date`, `close_date`, `start_date` and `end_date`. In case of `created_date`, tick the **Include Time** checkbox when creating the date dimension. The result should look like this:

{: .image-popup}
![Screenshot - GoodData Writer User Table Configuration](/tutorial/write/gooddata-writer-date-list.png)

Add the third table called
`out.c-opportunity-gooddata.out_opportunity`. Name it *opportunity* and set the columns as follows:

- *Amount* and *Probability* to `FACT`,
- *AccountId* and *OwnerId* to `REFERENCE` and connect them to tables `account` and `user`,
- *CreatedDate*, *CloseDate*, *Start_Date* and *End_Date* to `DATE` and connect them to the previously created date dimensions,
- *Id* to `IGNORE` (we won't be needing it any more), and
- everything else to `ATTRIBUTE`.

You should obtain the following result:

{: .image-popup}
![Screenshot - GoodData Writer Opportunity Table Configuration](/tutorial/write/gooddata-writer-table-config-3.png)

{: .image-popup}
![Screenshot - GoodData Writer Opportunity Table Configuration](/tutorial/write/gooddata-writer-table-config-3a.png)

{: .image-popup}
![Screenshot - GoodData Writer Opportunity Table Configuration](/tutorial/write/gooddata-writer-table-config-3b.png)

Save the table configuration, and go back to configuring the writer.

Now click on **Run Component** to push the tables to GoodData:

{: .image-popup}
![Screenshot - GoodData Writer Tables Finished](/tutorial/write/gooddata-writer-intro-6.png)

The tables will be written into GoodData by a background job. When a job is running, a small orange circle appears
under *Last runs*, along with RunId and other info on the job. Green is for success, red for failure.
Click on the indicator, or the info next to it for more details.

In the meantime, click on **GoodData Project** to reveal other options and **Go To Project**.

{: .image-popup}
![Screenshot - GoodData Writer Access Project](/tutorial/write/gooddata-writer-intro-7.png)

Then create your report:

{: .image-popup}
![Screenshot - GoodData Introduction](/tutorial/write/gooddata-intro.png)

First, specify a metric. It can be computed from columns we marked as `FACT`
when setting up the writer (those are *Amount* and *Probability*).
Let's add a metric for `SUM` of *Amount*,

{: .image-popup}
![Screenshot - GoodData Create Metric](/tutorial/write/gooddata-dashboard-1.png)

Then specify how this metric should be sliced in the **How** section. Let's slice it by
`ProbabilityClass`:

{: .image-popup}
![Screenshot - GoodData Slice Metric](/tutorial/write/gooddata-dashboard-2.png)

Additional slices or filters can be added in the dashboard wizard. To close the wizard, click **Done** and the
result will be shown to you as a table. To change the view, use the appropriate icon in the
top right corner.

{: .image-popup}
![Screenshot - GoodData Chart](/tutorial/write/gooddata-dashboard-3.png)

This will give you the same chart we produced in the [Tableau Example](/tutorial/write/).

The tutorial on writing data to GoodData BI platform using Keboola Connection ends here.
Continue to [Setting up Automation](/tutorial/automate/).
