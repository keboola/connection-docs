---
title: Keboola Connection Overview
permalink: /overview/
---

* TOC
{:toc}

Keboola is a cloud-based platform for all your data integration, transformation, and orchestration needs. 
Designed for data engineers, analysts, and scientists, Keboola **simplifies data processes, enabling efficient management and insightful analysis**. 

Key features of Keboola:
- **Data Integration:** Effortlessly extract data from various sources like databases, cloud services, and APIs. Load it seamlessly into destinations of your choice for comprehensive analysis.
- **Data Storage:** Use Keboola's robust data warehousing (Snowflake, BigQuery, Redshift, Synapse, etc.) for secure and accessible data storage. 
- **Data Manipulation:** With our extensive toolset, clean, enrich, and transform your data using SQL, Python, R, and more, directly within Keboola.
- **Automation:**  Automate your data workflows end-to-end with Keboola's intuitive Flows, saving time and reducing manual errors.

## Deployment Options
Keboola supports various deployment models to suit your specific needs:

- **Fully Managed:** Let us handle everything for you.
- **Multi-Tenant:** Let us fully manage and maintain all resources.
- **Multi-Tenant with BYO Database:** Use your data storage (Snowflake, BigQuery, Redshift, Synapse, etc.) while we manage the rest.
- **Single-Tenant:** Deploy Keboola in your cloud environment (AWS, Azure, GCP) for maximum control and security.

## Keboola Architecture
Keboola organizes accounts by [**projects**](/management/project/), offering a single project on the [Free Plan](/management/payg-project/) and multiple projects 
under its subscription models. This [**multi-project architecture**](/tutorial/onboarding/architecture-guide/) supports a Data Mesh strategy and a customizable 
data warehouse structure for various needs and use cases.

The following diagram illustrates the structure of a single Keboola project, composed of various categorized components described below.

{: .image-popup}
![Keboola Architecture 1](/overview/project-structure1.png)

### Data Source Connectors
[Data sources connectors](/components/extractors/), formerly known as [extractors](/components/extractors/), are Keboola components used 
to gather data from various sources. They can connect to APIs of external services, databases, applications, object storage, and many others.

### Storage
[Storage](/storage/) is the central component in Keboola responsible for data management and access. It comprises two sections: 

- [File Storage](/storage/files/), with all raw files uploaded to your project, and
- [Table Storage](https://help.keboola.com/storage/tables/), where all data tables are organized into buckets, further categorized into in and out stages.

This component acts as a middle layer that works with various [backend](/transformations/#backends) database systems like 
[Snowflake](https://www.snowflake.com/), [Redshift](https://aws.amazon.com/redshift/), [BigQuery](https://cloud.google.com/bigquery/),
[Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/), and others. It provides a key Storage API for working with data, 
making it easier to connect with other parts of the system and third-party applications.

### Transformations & Workspaces
[Transformations](/transformations/) allow you to manipulate data in your project. They are the tasks you want to perform and enable you to write custom scripts
in [SQL](https://en.wikipedia.org/wiki/SQL) (Snowflake, Redshift, BigQuery, etc.), dbt, [Julia](https://julialang.org/), [Python](https://www.python.org/about/), 
and [R](https://www.r-project.org/about.html). 

All transformations operate on a copy of Storage data in an isolated environment — a [workspace](/transformations/workspace/), guaranteeing safety for your
analyses and experimentation. Workspaces support collaborations and can be shared. 

- **SQL workspaces** are accessible through the database provider's IDE or your preferred SQL IDE.
- **Python, R, or Julia workspaces** are available through Keboola's hosted and managed Jupyter Lab environment.
  
### Data Destination Connectors
[Data destination connectors](/components/writers/), formerly known as [writers](/components/writers/), are components responsible
for output data delivery from Keboola to the systems and applications where the data gets used or consumed. These connectors often interface 
with [relational databases](/components/writers/database/), BI, [reporting and analytics](/components/writers/bi-tools/) platforms, tools, or applications.

### Full Automation
Keboola provides the [Flows](https://help.keboola.com/orchestrator/) component, formerly known as [Orchestrator](/orchestrator/), 
to fully automate end-to-end processes. With flows, you can specify the execution order of individual connectors, transformations, and other components and
set up parallelization. By adding a **schedule** or trigger, you can [automate](/orchestrator/) processes at specified intervals or times 
of the day.

The platform automatically scales resources to facilitate the automated processes.

### Development Branches
The [Development Branches](/components/branches/) feature enables you to modify component settings without affecting active configurations or 
entire orchestrated workflows. It's particularly useful for implementing significant project changes or when you need to be extra careful 
about performing your changes safely.

### Applications
Unlike free-form transformations, [applications](/components/applications/) are **predefined blocks** that enable users to perform advanced tasks such as 
sentiment analysis, association discovery, or histogram grouping. They can also enhance data, for example, by incorporating external data like weather or exchange 
rates through third-party services.

### Data Apps
[Data apps](/components/data-apps/) are user-friendly, interactive web applications that use data for insights or automated actions. These applications 
are typically custom-built to address specific challenges, providing users with dynamic, purpose-built experiences. Examples of data apps include recommendation 
engines, interactive segmentation tools, AI integration solutions, data visualization platforms, custom internal reporting tools for business teams, and financial 
apps for gaining insights into spending patterns.

## Keboola Governance
### Operational Metadata
Keboola diligently collects diverse [operational metadata](/management/jobs/#search-attributes), including user activity, job status, data flow, 
schema evolution, data pipeline performance, and adherence to a client's security rules. All project metadata is readily accessible within the client's Keboola 
environment, empowering users to conduct in-depth analyses, audits, or event-driven actions.

Using this metadata, we dynamically and automatically construct data lineage, providing a real-time understanding of data origin and usage. This capability 
serves analytical and regulatory purposes, offering invaluable insights into the journey and utilization of data within the platform."

### Cost Monitoring
Keboola gathers and organizes telemetry data including every job execution and user activity. Within each job detail, information regarding 
consumed credit units is available, allowing for the precise calculation of the associated dollar amount, effectively quantifying the cost of the process. This 
granular level of detail enables the attribution of costs to specific departments, teams, use cases, and individual users, providing comprehensive insights into 
resource utilization.

### Identity and Access management
Effortlessly oversee user accounts within your organization, regulating their access to specific Keboola projects and datasets. Streamline data sharing across 
your organization, ensuring a comprehensive understanding of each user's access privileges and fostering a transparent overview of data accessibility.

## Extending the Platform 
The Keboola platform, as an open environment consisting of many built-in interoperating components (Storage, transformations, data source connectors, etc.), 
can be [extended](https://developers.keboola.com/extend/) with **arbitrary code to extract, transform, or write data**.

You can extend the platform by creating

- [components](https://developers.keboola.com/extend/#component) (used as data source and destination connectors and applications).
- components based on the [Generic Extractor](https://developers.keboola.com/extend/#generic-extractor/).

Keboola, your in-house teams, or 3rd parties can create all components. They can use already existing data, ETL processes, and workflows. 
The platform automates infrastructure, user and data management, offering services like [data catalog](/catalog/), operational metadata, governance, 
and reverse billing. Components can be private or shared with Keboola users via our marketplace featuring applications mainly from 3rd parties 
to enhace workflows and support a composable enterprise.

Components can be run as standard pieces of our Flows [/tutorial/automate/#main-header], obtaining the full support and services (a link to your
[components](https://components.keboola.com/components), [logs, etc.](https://developers.keboola.com/extend/common-interface/)).

### Keboola CLI
[Keboola CLI](https://developers.keboola.com/cli/) (Command Line Interface) is a set of commands for operating your cloud data pipeline. It can be installed in 
the Windows, macOS, and Linux environments.

## Keboola Support
When working with the Keboola platform, you are never on your own, and there are multiple [ways to obtain support](/management/support/) from us. 
To solve your problem or to gain context, our support staff may join your project when requested.

## Other Commonly Used Terms
This section explains a few terms often used throughout these documentation pages.

### Stacks
The Keboola platform is available in multiple stacks, either multi-tenant or single-tenant. The current multi-tenant stacks are:

- US Virginia AWS – [connection.keboola.com](https://connection.keboola.com/),
- EU Frankfurt AWS – [connection.eu-central-1.keboola.com](https://connection.eu-central-1.keboola.com/).
- EU Ireland Azure – [connection.north-europe.azure.keboola.com](https://connection.north-europe.azure.keboola.com/).
- EU Frankfurt GCP - [connection.europe-west3.gcp.keboola.com](https://connection.europe-west3.gcp.keboola.com/)

A **stack** combines a datacenter location (region) and a cloud provider and is identified by its domain (URL). The currently supported cloud 
providers are [Amazon AWS](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/en-us/), and [Google Cloud](https://cloud.google.com/). 
A stack is an entirely independent, full instance of Keboola platform services. That means that if you have projects in multiple stacks, you need to have 
multiple Keboola accounts.

Each stack uses a different network with a different set of **dedicated** [IP addresses](/components/ip-addresses/). 
Our [developer documentation](https://developers.keboola.com/overview/api/#regions-and-endpoints) describes how to handle multiple stacks 
when working with the API in more detail.

Single-tenant stacks are available for a single enterprise customer with a domain name in the form `connection.CUSTOMER_NAME.keboola.com`.

### Jobs
Most things in the Keboola platform are done using the batch approach; when you perform an action, a [job](/management/jobs/) is created and executed 
in the background. We also call these jobs **asynchronous**. Multiple jobs can run simultaneously and you can continue your work in the meantime.

### Tokens
In Keboola, every action requires a [token](/management/project/tokens/) for authorization, automatically assigned to users at first login. Additionally, 
tokens for restricted access can be created and shared. This token system enables easy [sharing of specific resources](/management/project/tokens/#limited-tokens), 
like tables, without requiring platform registration.

### Input and Output Mapping
To make sure your transformation does not harm data in Storage, [mapping](/transformations/mappings) separates source data from your script. A secure workspace 
is created with data copied from the tables specified in the [input mapping](/transformations/mappings/#input-mapping). After the transformation is executed 
successfully, only tables and files defined in the [output mapping](/transformations/mappings/#output-mapping) are returned to Storage.
