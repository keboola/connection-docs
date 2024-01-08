---
title: Keboola Connection Overview
permalink: /overview/
---

* TOC
{:toc}

Keboola is a cloud-based data integration and transformation platform that provides tools for data engineering, integration, transformation, and orchestration. 

Key aspects of Keboola include:
- **Data Integration** – extracting data from diverse sources, such as databases, cloud services, and APIs, as well as loading it into a wide range of data destinations.
- **Data Storage** – data processed in Keboola is stored in its data warehousing infrastructure (Snowflake, BigQuery, Redshift, Synapse or others), making it easily accessible for analysis.
- **Data Manipulation** – wide range of tools to interact (clean, enrich, transform, analyse) with the data using SQL, Python, R or other languages.
- **Automation** – users can build data Flows and automate the entire process end to end. 

Keboola is a preferred choice for data engineers, data analysts, and data scientists seeking to **optimize data processes and establish a unified platform for data-
related tasks**. For organizations, one of Keboola’s paramount advantages lies in the consolidation of the entire data stack. By using an all-in-one platform, 
organizations can efficiently **govern and manage the data ecosystem**, making it invaluable for extracting insights, whether for business intelligence, reporting, 
or more advanced data science and machine learning applications.

## Deployment Options
The Keboola platform is typically **fully managed by Keboola**. However, it also supports **multi-tenant, hybrid, and private cloud deployments**.

In the most common multi-tenant deployment, all resources are managed and fully maintained by Keboola.

In the multi-tenant **'bring your own database'** option, you can use your own Snowflake, BigQuery, Redshift, Synapse, or other data storage, 
while the rest is still managed and maintained by Keboola.

With the single-tenant option, Keboola is **deployed to your cloud environment** (AWS, Azure, or GCP) and supports authentication via your own identity management.

## Keboola Architecture
Your Keboola account is structured around [**projects**](/management/project/). While the [Free Plan](/management/payg-project/) includes 
a single project, clients with a subscription to Keboola can enjoy the flexibility of multiple projects organized within 
a versatile [**multi-project architecture**](/tutorial/onboarding/architecture-guide/). This architecture not only accommodates the implementation 
of a Data Mesh approach but also supports a robust data warehouse structure tailored to specific needs and use cases.

The following diagram illustrates the structure of a single Keboola project, composed of various categorized components described below.

{: .image-popup}
![Keboola Architecture 1](/overview/project-structure1.png)

### Data Source Connectors
[Data sources connectors](/components/extractors/), formerly known as [extractors](/components/extractors/) are Keboola components used 
to gather data from various sources. They can connect to APIs of external services, databases, applications, object storages, and many others.

### Storage
[Storage](/storage/) is the central component in Keboola responsible for data management and access. It comprises two sections: [File Storage](/storage/files/) 
with all raw files uploaded to your project, and [Table Storage](https://help.keboola.com/storage/tables/) where all data tables are organized into buckets, 
further categorized into in and out stages.

This component operates as an abstraction layer on top of various [backend](/transformations/#backends) database engines 
including [Snowflake](https://www.snowflake.com/), [Redshift](https://aws.amazon.com/redshift/), [BigQuery](https://cloud.google.com/bigquery/),
[Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) and more. It offers a vital API Storage API 
for interactions with the data, facilitating communication with other components and third-party applications.

### Transformations
[Transformations](/transformations/) allow end-users to create custom scripts in [SQL](https://en.wikipedia.org/wiki/SQL) (Snowflake, Redshift, BigQuery, and 
more), dbt, [Julia](https://julialang.org/), [Python](https://www.python.org/about/), and [R](https://www.r-project.org/about.html). 
Keboola provides Workspaces, offering a safe environment for experimentation, analytics and transformation development.

[Workspaces](/transformations/workspace/) are managed environments for code development. SQL workspaces are accessible through the database provider's IDE or your 
preferred SQL IDE. Python, R, or Julia workspaces are available through Keboola's hosted and managed Jupyter Lab environment. These workspaces can be shared with 
other users to facilitate collaboration.

### Data Destination Connectors
[Data destination connectors](/components/writers/), formerly known as [writers](/components/writers/), are components responsible
for output data delivery from Keboola to the systems and applications where the data gets used or consumed. These connectors often interface 
with [relational databases](/components/writers/database/), BI, [reporting and analytics](/components/writers/bi-tools/) platforms, tools or applications.

### Full Automation
Keboola provides the [Flows](https://help.keboola.com/orchestrator/) component, formerly known as [Orchestrator](https://help.keboola.com/orchestrator/), 
to fully automate end-to-end processes. With flows, you can specify the execution order of individual connectors, transformations, and other components, 
along with setting up parallelization. By adding a **schedule** or trigger, you can [automate](/orchestrator/) processes at specified intervals or times 
of the day.

The platform automatically scales resources for to facilitate the automated processes.

### Applications
Unlike the free-form transformations, [applications](/components/applications/) are **predefined blocks**, that enable users to perform advanced tasks such as 
sentiment analysis, association discovery, or histogram grouping. They can also enhance data, for example, by incorporating external data like weather or exchange 
rates through third-party services.

### Data Apps
[Data apps](/components/data-apps/) are user-friendly, interactive web applications designed to leverage data for insights or automated actions. These applications 
are typically custom-built to address specific challenges, providing users with dynamic, purpose-built experiences. Examples of data apps include recommendation 
engines, interactive segmentation tools, AI integration solutions, data visualization platforms, custom internal reporting tools for business teams, and financial 
apps for gaining insights into spending patterns.

## Keboola Governance
### Operational Metadata
Keboola diligently collects a diverse array of [operational metadata](/management/jobs/#search-attributes), encompassing user activity, job status, data flow, 
schema evolution, data pipeline performance, and adherence to a client's security rules. All project metadata is readily accessible within the client's Keboola 
environment, empowering users to conduct in-depth analyses, audits, or event-driven actions.

Leveraging this metadata, we dynamically and automatically construct data lineage, providing a real-time understanding of data origin and usage. This capability 
serves both analytical and regulatory purposes, offering invaluable insights into the journey and utilization of data within the platform."

### Cost Monitoring
Keboola meticulously gathers and organizes telemetry data encompassing every job execution and user activity. Within each job detail, information regarding 
consumed credit units is available, allowing for the precise calculation of the associated dollar amount, effectively quantifying the cost of the process. This 
granular level of detail enables the attribution of costs to specific departments, teams, use-cases, and individual users, providing comprehensive insights into 
resource utilization.

### Identity and Access management
Effortlessly oversee user accounts within your organization, regulating their access to specific Keboola projects and datasets. Streamline data sharing across 
your organization, ensuring a comprehensive understanding of each user's access privileges and fostering a transparent overview of data accessibility.

## Extending the Platform 
The Keboola platform, as an open environment consisting of many built-in interoperating components (Storage, transformations, data source connectors, etc.), 
can be [extended](https://developers.keboola.com/extend/) with **arbitrary code to extract, transform or write data**.

There are two ways of extending the platform: creating [components](https://developers.keboola.com/extend/#component) (used as data destination connectors,
applications and data source connectors) and creating components based on [Generic Extractor](https://developers.keboola.com/extend/#generic-extractor/).

All components can be created by us, your in-house teams or 3rd parties. They can easily use already existing data, ETL processes, and workflows. 
The development platform provides you with automation of infrastructure, user management, data management, and essential services like [data catalog](/catalog/), 
operational metadata, full governance, and reverse billing per job. The components can be kept private or offered to other Keboola users. Our market place 
consists of hundreds of applications that are developed mainly by 3rd parties and can be natively used as part of the workflows you are creating. This provides a 
great way for our users to really manage their environment and create a composable enterprise.

Components can be run as standard pieces of our Flows [LINK], obtaining the full support and services (a link to your
[components](https://components.keboola.com/components), [logs, etc.](https://developers.keboola.com/extend/common-interface/)).

### Keboola CLI
[Keboola CLI](https://developers.keboola.com/cli/) (Command Line Interface) is a set of commands for operating your cloud data pipeline. It is available to 
install in the Windows, macOS, and Linux environments.

## Keboola Support
When working with Keboola platform, you are never on your own and there are multiple [ways to obtain support](/management/support/) from us. 
To solve your problem or to gain context, our support staff may join your project when requested.

## Other Commonly Used Terms
This section explains a few terms that are often used throughout these documentation pages.

### Stacks
The Keboola platform is available in multiple stacks, these can be either multi-tenant or single-tenant. The current multi-tenant stacks are:

- US Virginia AWS – [connection.keboola.com](https://connection.keboola.com/),
- EU Frankfurt AWS – [connection.eu-central-1.keboola.com](https://connection.eu-central-1.keboola.com/).
- EU Ireland Azure – [connection.north-europe.azure.keboola.com](https://connection.north-europe.azure.keboola.com/).
- EU Frankfurt GCP - [connection.europe-west3.gcp.keboola.com](https://connection.europe-west3.gcp.keboola.com/)

A **stack** is a combination of a datacenter location (region) and a cloud provider, and is identified by its domain (URL). The currently supported cloud 
providers are [Amazon AWS](https://aws.amazon.com/) and [Microsoft Azure](https://azure.microsoft.com/en-us/). A stack is a completely independent full instance 
of Keboola platform services. That means that if you have projects in multiple stacks, you need to have multiple Keboola accounts.

Each stack uses a different network with a different set of **dedicated** [IP addresses](/components/ip-addresses/). 
Our [developer documentation](https://developers.keboola.com/overview/api/#regions-and-endpoints) describes in more detail how to handle multiple stacks 
when working with the API.

Single-tenant stacks are available for a single enterprise customer with a domain name in form `connection.CUSTOMER_NAME.keboola.com`.

### Jobs
Most things in Keboola platform are done using the batch approach; when you perform an operation, a [job](/management/jobs/) is created and executed 
in the background. We also call these jobs **asynchronous**. Multiple jobs can be running at the same time and you can continue your work in the meantime.

### Tokens
Every operation done within the Keboola platform must be authorized with a [token](/management/project/tokens/). Each Keboola user is automatically assigned 
a token on their first login. Apart from that, tokens with limited access to some Keboola platform operations can be created (and shared with other people). 
The principle of token authorization allows you, for example, to easily [share a single table](/management/project/tokens/#limited-tokens) from your Storage 
with someone without them having to register to the Keboola platform (enter email/password).

### Input and Output Mapping
To make sure your transformation does not harm data in Storage, [mapping](/transformations/mappings) separates source data from your script. A secure workspace 
is created with data copied from the tables specified in the [input mapping](/transformations/mappings/#input-mapping). After the transformation has been executed 
successfully, only tables and files defined in the [output mapping](/transformations/mappings/#output-mapping) are brought back to Storage.
