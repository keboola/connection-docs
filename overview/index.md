---
title: Keboola Connection Overview
permalink: /overview/
---

Keboola connection (KBC) is a cloud platform for connecting diverse systems together. Typically this means that it is used to *extract* data from a source system,
*manipulate* and augment them with other data and *write* results a destination system.
For example you might use KBC to *extract* data about your customers from your Salesforce CRM, you can also *extract* comments from your Facebook page and find sentiment
in them. You can then join those data sets together with weather reports and *write* everything into Tableau Online where you can build reports and analyze your
customers behaviour. This is of course just a simple example of what Keboola Connection can be used for.

 
## Keboola Connection Overview
Keboola Connection (KBC) is a complex platform composed of many connected components. The chart below shows how KBC is structured and explains some commonly used terms.

![KBC Structure Chart](/overview/kbc_structure.png)

### Data source / Systems
Data source are systems that contain the data you wish to bring into KBC. They can be pretty much anything from GoogleAnalytics, Facebook, SalesForce
to on-premise databases, legacy systems or even appliances and IoT devices. Data source is not part of KBC.

### Extractors
*Extractors* are KBC components that are used for gathering data from sources. Typically they connect to [APIs](https://en.wikipedia.org/wiki/Web_API) of external
services. But thay can also connec directly into an arbitrary database, or process incoming e-mails.

### Storage
*Storage* is the central subsystem of KBC that manages everything related with the data storage and access to it.
It is implemented as a layer on top of various database engines that we use as our *backends* ([Mysql](https://www.mysql.com/),
[Redshift](https://aws.amazon.com/redshift/), [Snowflake](http://www.snowflake.net/)). Storage provides an important API (Storage API) access for
other KBC components and 3rd party applications.

### Transformations
*Transformations* are the first part of data manipulation. The transformation engine is tasked with modifying the data in Storage.
It picks data from Storage, manipulates it and then stores it back. You can create transformations by writing free-form script in
[SQL](https://en.wikipedia.org/wiki/SQL) (MysQL, Redshift), [R](https://www.r-project.org/about.html) and
[Python](https://www.python.org/about/) language.

### Recipes (apps)
Recipes and *Applications* are second part of data manipulation. Applications allow you to enrich the data in storage.  Unlike free-form transformations, these are predefined blocks which can be used to do some pretty
advanced stuff - like sentiment analysis or association discovery, histogram grouping).
Applicacations can also do data augmentation (e.g. adding Weather or Exchange Rates) which actually call on *3rd party services* to bring in additional data. Applications can also be completely created by 3rd party developers - KBC is a very open environment.

### Writers
*Writers* are KBC components that you can use to deliver output data from KBC into the systems and applications where the data gets used/consumed.

### Data Consumption
*Data Consumption* is represented by 3rd party systems that accept (or extract) data from KBC and use it further. These may be business intelligence analytics or visualization systems, but also e-mail marketing, CRM, etc. Any system that can help our customers to realize the extra value KBC added to the data.

### Orchestrator / Scheduler
On the background, behind the scenes, there is an *Orchestrator* component which allows everything to be
fully automated.  Orchestrator allows to run any component (e.g. data extraction) in specified intervals or at specified times of days.

### Jobs
Most things done in KBC are done using batch approach. This means that when you do some operation, a **Job** is created
and executed on the background. We also call these jobs **asynchronous***. Multiple jobs can be running at the same 
time and you can continue your work in the mean time. 

## External Environment Schema

KBC is a fully cloud environment heavily relaying on Amazon Services. The following chart shows overview
of different services and their connections:

![External Environment Schema](/overview/kbc_environment.png)

In place of the *Data Consumption*, the GoodData Bussiness Intelligence Analytics platform is shown.
