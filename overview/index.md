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

The following chart shows how Kebooa Connection platform is structured. The platform is composed of many components which
are structured into categories described below.

![KBC Structure Chart](/overview/kbc_structure.png){: .img-responsive}

### Data Sources
Data sources are systems containing data you wish to [bring into Keboola Connection](/tutorial/load/).
They can be pretty much anything from Google Analytics, Facebook, SalesForce to on-premise databases,
legacy systems or even appliances and IoT devices. Data sources are not part of Keboola Connection.

### Extractors
[Extractors](/components/extractors/) are Keboola Connection components used for gathering data from sources.
Typically, they connect to [APIs](https://en.wikipedia.org/wiki/Web_API) of external
services. But they can also connect directly to an arbitrary database, or process incoming e-mails.

### Storage
[Storage](/storage/) is the central Keboola Connection component managing everything related to storing data and accessing it.
It has two sections: [File Storage](/storage/file-uploads/) with all raw files uploaded
to your project, and [Table Storage](/storage/tables/) where all data tables are organized
into buckets which are further organized into *in* and *out* stages.

Storage is implemented as a layer on top of various database engines that we use as our [backends](/transformations/#backends) ([Snowflake](http://www.snowflake.net/) and [Redshift](https://aws.amazon.com/redshift/)).
It provides an important API (Storage API) access for other components and 3rd party applications.
Your own **remote storage** can be connected to Keboola Connection as well.

### Transformations
[Transformations](/transformations/) are components which allow the end-user can be created by writing a **free-form script** in
[SQL](https://en.wikipedia.org/wiki/SQL) (Snowflake, Redshift), [Julia](https://julialang.org/),
[Python](https://www.python.org/about/) and [R](https://www.r-project.org/about.html). KBC provides each user with [Sandbox](/transformations/sandbox/) --- a safe environment for your experiments.

### Applications
Unlike the free-form Transformations, [Applications](/components/applications/) are **predefined blocks**, which
can be used to do some pretty advanced stuff like sentiment analysis, association discovery, or histogram grouping.
Applications can also augment data (for example, add Weather or Exchange Rates) by calling on *3rd party services*
to bring in additional data.

### Writers
[Writers](/components/writers/) are components delivering output data from Keboola Connection into the systems 
and applications where the data gets used/consumed. These can be commonly used [relational databases](/components/writers/database/) or various [BI, reporting and analytics](/components/writers/bi-tools/) tools.

### Data Consumption
*Data Consumption* is represented by 3rd party systems that accept (or extract) data from KBC and use it further.
These may be business intelligence analytics or visualization systems, but also e-mail marketing, CRM,
or simply any system that can help our customers to realize the extra value KBC adds to the data.

### Full Automation
In the background, behind the scenes, there is the [**Orchestrator**](/orchestrator/)
(or Scheduler) component which allows everything to be fully automated.
Orchestrator enables to run any component (for example, data extraction) in specified intervals or at specified times of the day.

### Components
Keboola Connection, as an open environment consisting of many built-in interoperating components (Storage, 
Transformations, Extractors etc.), can be [extended](https://developers.keboola.com/extend/) with
 **arbitrary code to extract, transform or write data**.

There are two ways of extending the platform: creating [Components](https://developers.keboola.com/extend/#component)
(used as extractors, applications and writers) and creating components based on
[Generic Extractor](https://developers.keboola.com/extend/#generic-extractor/).
All components can be created by us, our customers and 3rd parties, and can be kept private or offered to 
other Keboola Connection users.

## Keboola Support
When working with KBC, you are never on your own and there are multiple [ways to obtain support](/management/support/) from us.
To solve your problem or to gain context, our support staff may join your project when requested.

## Other Commonly Used Terms
This section explains a few terms that are often used throughout these documentation pages.

### Regions
Keboola Connection is available in multiple regions — currently in:

- US AWS -- [connection.keboola.com](https://connection.keboola.com), 
- EU AWS -- [connection.eu-central-1.keboola.com](https://connection.eu-central-1.keboola.com),
- US Azure -- [connection.east-us-2.azure.keboola.com](https://connection.east-us-2.azure.keboola.com). 

A **Region** instance is a combination of a datacenter location and a cloud provider. Currently supported
cloud providers are [Amazon AWS](https://aws.amazon.com/) and [Microsoft Azure](https://azure.microsoft.com/).
Each region instance is a completely independent full stack of Keboola Connection services. That means that 
if you have projects in multiple regions, you need to have multiple Keboola Connection accounts.

Each region uses a different network, which means different settings if you 
employ [IP address](/components/ip-addresses/) filtering.
The [Developer documentations](https://developers.keboola.com/overview/api/#regions-and-endpoints) describes in 
more details how to handle regions when working with the API.

### Jobs
Most things in KBC are done using the batch approach; when you do some operation, a job is created
and executed in the background. We also call these jobs **asynchronous**. Multiple jobs can be running at the same
time and you can continue your work in the meantime.

### Tokens
Every operation done in KBC must be authorized with a [*token*](/management/project/tokens/). Each KBC user is automatically assigned a token on their first login.
Apart from that, tokens with limited access to some KBC operations can be created (and shared with other people).
The principle of token authorization allows you, for example, to easily [share a single table](/management/project/tokens/#limited-tokens)
from your Storage with someone without them having to register to KBC (enter email/password).

### Input / Output Mapping
To make sure your transformation does not harm data in Storage, [mapping](/transformations/mappings)
separates source data from your script. A secure workspace is created with data copied from the tables specified
in the [input mapping](/transformations/mappings/#input-mapping).
After the transformation has been executed successfully, only tables and files defined
in the [output mapping](/transformations/mappings/#output-mapping) are brought back to Storage.
