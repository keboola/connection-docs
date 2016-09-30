---
title: Keboola Connection Overview
permalink: /overview/
---

* TOC
{:toc}

Keboola Connection (KBC) is a cloud platform for **interconnecting diverse systems**. It is used to

- *extract data* from a source system, 
- *manipulate and augment* the extracted data with other data, and finally, 
- *write the results* to a destination system.

To give a simple **example** of what this means, you might use KBC to *extract* data about your customers from your Salesforce CRM. 
Then you *extract* comments from your Facebook page and find sentiment in them. 
After that, you join those data sets together with weather reports, and *write* everything into Tableau Online 
in order to create reports and analyze your customers' behavior. 

## Keboola Connection Architecture

The following chart shows how KBC is structured. All KBC parts are briefly described below.

![KBC Structure Chart](/overview/kbc_structure.png){: .img-responsive}

### Data Sources
Data sources are systems containing data you wish to bring into KBC. They can be pretty much anything from GoogleAnalytics, 
Facebook, SalesForce to on-premise databases, legacy systems or even appliances and IoT devices. Data sources are not part of KBC.

### Extractors
[*Extractors*](/extractors/) are KBC components used for gathering data from sources. 
Typically, they connect to [APIs](https://en.wikipedia.org/wiki/Web_API) of external
services. But they can also connect directly to an arbitrary database, or process incoming e-mails.

### Storage
[*Storage*](/storage/) is the central KBC component managing everything related to storing data and accessing it.
It has two sections: [File Storage](/storage/file-uploads/) with all raw files uploaded 
to your project, and [Table Storage](/storage/tables/) where all data tables are organized 
into buckets which are further organized into *in* and *out* stages.

Storage is implemented as a layer on top of various database engines that we use as our *backends* ([MySQL](https://www.mysql.com/),
[Redshift](https://aws.amazon.com/redshift/), and [Snowflake](http://www.snowflake.net/)). 
It provides an important API (Storage API) access for other KBC components and 3rd party applications. 
Your own **remote storage** can be connected to KBC as well.

### Data Manipulation
There are two ways how data in KBC can be [manipulated](/manipulation/): via [Transformations](/manipulation/transformations/) 
(simpler) and Applications (not as simple but more powerful). Both pick data from Storage, manipulate it and then store it back. 

#### Transformations
Transformations can be created by writing a **free-form script** in
[SQL](https://en.wikipedia.org/wiki/SQL) (MySQL, Redshift), [R](https://www.r-project.org/about.html) and
[Python](https://www.python.org/about/). KBC provides each user with [Sandbox](/manipulation/transformations/sandbox/) - a safe environment for your experiments. 

#### Applications
Unlike the free-form Transformations, Applications are **predefined blocks** which can be used to do some pretty
advanced stuff like sentiment analysis, association discovery, or histogram grouping.
Applications can also augment data (for example, add Weather or Exchange Rates) by calling on *3rd party services* to bring in additional data. 
All applications are **implemented as extensions** (see below) and as such can be completely created by 3rd party developers.

### Extensions
KBC, as an open environment consisting of many built-in interoperating components (Storage, Transformations, Readers etc.), 
can be [extended](https://developers.keboola.com/extend/) with **arbitrary code to extract, manipulate or write data**. 

There are two types of extensions: [Custom Extensions](https://developers.keboola.com/extend/) 
(used as extractors, applications and writers) and Generic Extractor. 
They can be created by us, our customers and 3rd parties, and can be offered also to other KBC users through our AppStore.

### Writers
Writers are KBC components delivering output data from KBC into the systems and applications where the data gets used/consumed.

### Data Consumption
*Data Consumption* is represented by 3rd party systems that accept (or extract) data from KBC and use it further. 
These may be business intelligence analytics or visualization systems, but also e-mail marketing, CRM, 
or simply any system that can help our customers to realize the extra value KBC adds to the data.

### Full Automation
In the background, behind the scenes, there is the [**Orchestrator**](/overview/tutorial/automate/) 
(or Scheduler) component which allows everything to be fully automated. 
Orchestrator enables to run any component (for example, data extraction) in specified intervals or at specified times of the day.

## Other Commonly Used Terms
This section explains a few terms that are often used throughout these documentation pages. 

### Jobs
Most things in KBC are done using the batch approach; when you do some operation, a job is created
and executed in the background. We also call these jobs **asynchronous**. Multiple jobs can be running at the same 
time and you can continue your work in the meantime. 

### Tokens
Every operation done in KBC must be authorized with a [*token*](/storage/tokens/). Each KBC user is automatically assigned a token on their first login. 
Apart from that, tokens with limited access to some KBC operations can be created (and shared with other people). 
The principle of token authorization allows you, for example, to easily [share a single table](/overview/tutorial/management/#user-management) 
from your Storage with someone without them having to register to KBC (enter email/password).

### Input / Output Mapping
To make sure your transformation does not harm data in Storage, [mapping](/manipulation/transformations/#mappings) separates 
source data from your script. A secure workspace is created with data copied from the tables specified 
in the [input mapping](/manipulation/transformations/#input-mapping).
After the transformation has been executed successfully, only tables and files defined 
in the [output mapping](/manipulation/transformations/#output-mapping) are brought back to Storage. 

## External Environment Schema

KBC is a fully cloud environment heavily relaying on Amazon Services. The following chart shows the overview
of different services and their connections:

![External Environment Schema](/overview/kbc_environment.png){: .img-responsive}

In place of *Data Consumption*, the GoodData Business Intelligence Analytics platform is shown.

