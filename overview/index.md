---
title: Keboola Connection Overview
permalink: /overview/
---

* TOC
{:toc}

Keboola Connection is a cloud platform for **interconnecting diverse systems**. It is used to

- *extract data* from a source system,
- *manipulate and augment* the extracted data with other data, and finally,
- *write the results* to a destination system.

To give a simple **example** of what this means, you might use Keboola Connection to *extract* data about your customers from your Salesforce CRM.
Then you *extract* comments from your Facebook page and find sentiment in them.
After that, you join those data sets together with weather reports, and *write* everything into Tableau Online
in order to create reports and analyze your customers' behavior.

## Keboola Connection Architecture

The following chart shows how Keboola Connection platform is structured. The platform is composed of many components which
are structured into categories described below.

![KBC Structure Chart](/overview/kbc_structure.png){: .img-responsive}

### Configurations

Typically, Keboola Connection is fully managed by Keboola. 
However, it also supports multi-, hybrid- and private cloud deployments.  

When finishing your innovation cycle in the cloud, 
your data pipeline processes can be compiled and executed in the cloud within your secure Keboola Connection environment. 
However, you can also do an on-premise offload utilising your existing hardware inside your private cloud infrastructure. 


### Source Systems
Source systems contain data you wish to [bring into Keboola Connection](/tutorial/load/).
They can be pretty much anything from Google Analytics, Facebook, SalesForce to on-premise databases,
legacy systems or even appliances and IoT devices. Data sources are not part of Keboola Connection.

### Extractors
[Extractors](/components/extractors/) are Keboola Connection components used for gathering data from sources.
Typically, they connect to [APIs](https://en.wikipedia.org/wiki/Web_API) of external
services. But they can also connect directly to an arbitrary database, or process incoming e-mails.

### Storage
[Storage](/storage/) is the central Keboola Connection component managing everything related to storing data and accessing it.
It has two sections: [File Storage](/storage/files/) with all raw files uploaded
to your project, and [Table Storage](/storage/tables/) where all data tables are organized
into buckets which are further organized into *in* and *out* stages.

Storage is implemented as a layer on top of various database engines that we use as our [backends](/transformations/#backends) ([Snowflake](https://www.snowflake.com/) and [Redshift](https://aws.amazon.com/redshift/)).
It provides an important API (Storage API) access for other components and 3rd party applications.
Your own **remote storage** can be connected to Keboola Connection as well.

### Transformations
[Transformations](/transformations/) are components which end-users can create by writing a **free-form script** in
[SQL](https://en.wikipedia.org/wiki/SQL) (Snowflake, Redshift), [Julia](https://julialang.org/),
[Python](https://www.python.org/about/) and [R](https://www.r-project.org/about.html). 
Keboola Connection provides each user with [Sandbox](/transformations/sandbox/) --- a safe environment for your experiments.

### Applications
Unlike the free-form Transformations, [Applications](/components/applications/) are **predefined blocks**, which
can be used to do some pretty advanced stuff like sentiment analysis, association discovery, or histogram grouping.
Applications can also augment data (for example, add Weather or Exchange Rates) by calling on *3rd party services*
to bring in additional data.

### Writers
[Writers](/components/writers/) are components delivering output data from Keboola Connection into the systems 
and applications where the data gets used/consumed. These can be commonly used [relational databases](/components/writers/database/) or various [BI, reporting and analytics](/components/writers/bi-tools/) tools.

### Data Consumption
*Data Consumption* is represented by 3rd party systems that accept (or extract) data from Keboola Connection and use it further.
These may be business intelligence analytics or visualization systems, but also e-mail marketing, CRM,
or simply any system that can help our customers to realize the extra value Keboola Connection adds to the data.

### Full Automation

In the background, behind the scenes, there is the [**Orchestrator**](/orchestrator/)
(or Scheduler) component which allows everything to be fully automated.
Orchestrator enables to specify what components should be executed in what order and when 
(specified intervals, specified times of the day, etc.).

The whole warehouse or data lake cycle can be fully automated via [API](https://developers.keboola.com/automate/#automation).
The end-to-end serverless solution automatically enables you to connect data sources, automatically store data 
in the correct format, check for format inconsistencies, and choose different metadata providers based on the
operation you wish to perform on the data. The platform scales the needed resources automatically across various 
types of data (structured, semi-structured, and non-structured) and processes.

The whole environment tracks all the [operational metadata](#operational-metadata) and 
can be accessed without a server via [APIs](https://developers.keboola.com/overview/api/). 
This is useful when automating development, testing and production run of data jobs with automatic controls of 
[pipelines](https://keboola.docs.apiary.io/#reference/development-branches).

### Operational Metadata

Keboola Connection collects all kinds of [operational metadata](/management/jobs/#search-attributes), 
describing user activity, job activity, data flow, 
schema evolution, data pipeline performance, compliance with a client’s security rules, etc. 
All project metadata is accessible from within the client’s Keboola Connection environment to perform any kind of analysis, audit, or event action.

Based on the metadata, we are able to build **data lineage** on the fly and automatically. 
This makes it possible to understand where the data is coming from and how it is used, both for analytical and regulatory purposes.

### Components

Keboola Connection, as an open environment consisting of many built-in interoperating components (Storage, 
Transformations, Extractors etc.), can be [extended](https://developers.keboola.com/extend/) with
 **arbitrary code to extract, transform or write data**.

There are two ways of extending the platform: 
creating [Components](https://developers.keboola.com/extend/#component) (used as extractors, applications and writers) and 
creating components based on [Generic Extractor](https://developers.keboola.com/extend/#generic-extractor/).

All components can be created by us, your in-house teams or 3rd parties.
They can easily use already existing data, ETL processes, and workflows. 
The development platform provides you with automation of infrastructure, user management, data management, and essential services like 
[data catalogue](/catalog/), operational metadata, full governance, and 
reverse billing per job. 
The components can be kept private or offered to other Keboola Connection users.
Our market place consists of hundreds of applications that are developed mainly by 3rd 
parties and can be natively used as part of the workflows you are creating. 
This provides a great way for our users to really manage their environment and create a composable enterprise.

Components can be run as standard pieces of our [orchestrations](/orchestrator/), 
obtaining the full support and services (a link to your [components](https://components.keboola.com/components), 
[logs, etc.](https://developers.keboola.com/extend/common-interface/)).

## Keboola Support
When working with Keboola Connection, you are never on your own and there are multiple [ways to obtain support](/management/support/) from us.
To solve your problem or to gain context, our support staff may join your project when requested.

## Other Commonly Used Terms
This section explains a few terms that are often used throughout these documentation pages.

### Stacks
Keboola Connection is available in multiple stacks, these can be either multi-tenant
or single-tenant. The current multi-tenant stacks are:

- US AWS -- [connection.keboola.com](https://connection.keboola.com), 
- EU AWS -- [connection.eu-central-1.keboola.com](https://connection.eu-central-1.keboola.com),
- EU Azure -- [connection.north-europe.azure.keboola.com](https://connection.north-europe.azure.keboola.com). 

A **stack** is a combination of a datacenter location (region) and a cloud provider, and is identified by
its domain (URL). The currently supported
cloud providers are [Amazon AWS](https://aws.amazon.com/) and [Microsoft Azure](https://azure.microsoft.com/en-us/).
A stack is a completely independent full instance of Keboola Connection services. That means that 
if you have projects in multiple stacks, you need to have multiple Keboola Connection accounts.

Each stack uses a different network with a different set of **dedicated [IP addresses](/components/ip-addresses/)**.
The [Developer documentations](https://developers.keboola.com/overview/api/#regions-and-endpoints) describes in 
more detail how to handle multiple stacks when working with the API.

Single-tenant stacks are available for a single enterprise customer with a domain name in form `connection.CUSTOMER_NAME.keboola.com`.

### Jobs
Most things in Keboola Connection are done using the batch approach; when you perform an operation, a [job](/management/jobs/) is created
and executed in the background. We also call these jobs **asynchronous**. Multiple jobs can be running at the same
time and you can continue your work in the meantime.

### Tokens
Every operation done in Keboola Connection must be authorized with a [*token*](/management/project/tokens/). Each Keboola Connection user is automatically assigned a token on their first login.
Apart from that, tokens with limited access to some Keboola Connection operations can be created (and shared with other people).
The principle of token authorization allows you, for example, to easily [share a single table](/management/project/tokens/#limited-tokens)
from your Storage with someone without them having to register to Keboola Connection (enter email/password).

### Input / Output Mapping
To make sure your transformation does not harm data in Storage, [mapping](/transformations/mappings)
separates source data from your script. A secure workspace is created with data copied from the tables specified
in the [input mapping](/transformations/mappings/#input-mapping).
After the transformation has been executed successfully, only tables and files defined
in the [output mapping](/transformations/mappings/#output-mapping) are brought back to Storage.
