---
title: Keboola Connection Overview
permalink: /overview/
---

Keboola Connection (KBC) is a cloud platform for interconnecting diverse systems. It is used to:

- *extract* data from a source system, 
- *manipulate* and augment the extracted data with other data, and finally, 
- *write* the results to a destination system.

To give a simple example of what this means, you might use KBC to *extract* data about your customers from your Salesforce CRM. 
Then you *extract* comments from your Facebook page and find sentiment in them. 
After that, you join those data sets together with weather reports, and *write* everything into Tableau Online 
in order to create reports and analyze your customers' behavior. 

## Keboola Connection Overview
KBC is a complex platform composed of many connected components. The chart below shows how KBC is structured and explains some commonly used terms.

![KBC Structure Chart](/overview/kbc_structure.png)

### Data Source / Systems
Data sources are systems containing data you wish to bring into KBC. They can be pretty much anything from GoogleAnalytics, Facebook, SalesForce
to on-premise databases, legacy systems or even appliances and IoT devices. Data source is not part of KBC.

### Extractors
*Extractors* are KBC components used for gathering data from sources. Typically, they connect to [APIs](https://en.wikipedia.org/wiki/Web_API) of external
services. But they can also connect directly to an arbitrary database, or process incoming e-mails.

### Storage
*Storage* is the central KBC subsystem managing everything related to storing data and accessing it.
It is implemented as a layer on top of various database engines that we use as our *backends* ([Mysql](https://www.mysql.com/),
[Redshift](https://aws.amazon.com/redshift/), and [Snowflake](http://www.snowflake.net/)). Storage provides an important API (Storage API) access for
other KBC components and 3rd party applications.

### Transformations
*Transformations* are the first part of data manipulation. The transformation engine is tasked with modifying the data in Storage.
It picks data from Storage, manipulates it and then stores it back. Transformations can be created by writing a free-form script in
[SQL](https://en.wikipedia.org/wiki/SQL) (MysQL, Redshift), [R](https://www.r-project.org/about.html) and
[Python](https://www.python.org/about/).

### Recipes (Applications)
Recipes and *Applications* form the second part of data manipulation. Applications allow you to enrich the data in Storage.  Unlike the free-form Transformations, these are predefined blocks which can be used to do some pretty
advanced stuff like sentiment analysis, association discovery, or histogram grouping.
Applications can also augment data (for example, adding Weather or Exchange Rates). They actually call on *3rd party services* to bring in additional data. Applications can also be completely created by 3rd party developers - KBC is a very open environment.

### Writers
*Writers* are KBC components delivering output data from KBC into the systems and applications where the data gets used/consumed.

### Data Consumption
*Data Consumption* is represented by 3rd party systems that accept (or extract) data from KBC and use it further. These may be business intelligence analytics or visualization systems, but also e-mail marketing, CRM, or simply any system that can help our customers to realize the extra value KBC adds to the data.

### Orchestrator / Scheduler
In the background, behind the scenes, there is the *Orchestrator* component which allows everything to be
fully automated.  Orchestrator enables to run any component (e.g., data extraction) in specified intervals or at specified times of the day.

## External Environment Schema

KBC is a fully cloud environment heavily relaying on Amazon Services. The following chart shows the overview
of different services and their connections:

![External Environment Schema](/overview/kbc_environment.png)

In place of the *Data Consumption*, the GoodData Business Intelligence Analytics platform is shown.
