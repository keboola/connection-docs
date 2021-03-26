---
title: Oracle Transformation
permalink: /transformations/oracle/
---

* TOC
{:toc}

The [Oracle database](https://www.oracle.com/index.html) is a multi-model database management system produced and 
is marketed by Oracle Corporation.

## Example
After you create a configuration, configure the database credentials using the `Database Credentials` link:

{: .image-popup}
![Screenshot - Credentials link](/transformations/oracle/navigate-to-credentials.png)

The following SQL code creates user `KEBOOLA_TRANSFORMATION`, a schema with the same name, and grants the user 
read/write privileges only to this schema.

{% highlight sql %}
CREATE USER KEBOOLA_TRANSFORMATION IDENTIFIED BY "secretPassword20" QUOTA UNLIMITED ON USERS;

GRANT CREATE SESSION TO KEBOOLA_TRANSFORMATION;
GRANT CREATE TABLE TO KEBOOLA_TRANSFORMATION;
{% endhighlight %}
 
Fill in the credentials to the database. After testing the credentials, save them:

{: .image-popup}
![Screenshot - Credentials](/transformations/oracle/credentials.png)

After you save the credentials, follow these steps to create a simple Oracle transformation:

- Create a table in Storage by uploading the [sample CSV file](/transformations/source.csv).
- Create input mapping from that table, setting its destination to `source`.
- Create output mapping, setting its destination to a new table in your Storage.
- Copy & paste the below script into the transformation code.
- Save and run the transformation.
 
{% highlight sql %}
CREATE TABLE "result" AS SELECT * FROM "source";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/oracle/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).

Please keep in mind that this transformation, unlike the other transformations, runs on your Oracle Database server 
(it is not provisioned by Keboola). You must ensure a flawless course.
