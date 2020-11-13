---
title: Oracle Transformation
permalink: /transformations/oracle/
---

* TOC
{:toc}

[Oracle database](https://www.oracle.com/index.html) is a multi-model database management system produced and marketed by Oracle Corporation.

## Example
After you create a configuration, the first step is to configure database credentials using the `Database Credentials` link:

{: .image-popup}
![Screenshot - Credentials link](/transformations/oracle/navigate-to-credentials.png)

The following SQL code creates user and schema `KEBOOLA_TRANSFORMATION` and grants privileges read/write only to this schema.

{% highlight sql %}
CREATE USER KEBOOLA_TRANSFORMATION IDENTIFIED BY "secretPassword20" QUOTA UNLIMITED ON USERS;

GRANT CREATE SESSION TO KEBOOLA_TRANSFORMATION;
GRANT CREATE TABLE TO KEBOOLA_TRANSFORMATION;
{% endhighlight %}
 
Fill in the credentials to the database. After testing the credentials, Save them:

{: .image-popup}
![Screenshot - Credentials](/transformations/oracle/credentials.png)

After you save the credentials, follow these steps for create a simple Oracle transformation:
 - set the input mapping from that table to source,
 - set the output mapping for the destination table to a new table in your Storage,
 - copy & paste the below script into the transformation code, and, finally,
 - save and run the transformation.
 
{% highlight sql %}
CREATE TABLE "result" AS SELECT * FROM "SOURCE";
{% endhighlight %}

{: .image-popup}
![Screenshot - Sample Transformation](/transformations/oracle/sample-transformation.png)

You can organize the script into [blocks](/transformations/#writing-scripts).
