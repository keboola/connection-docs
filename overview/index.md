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

{: .image-popup}
![Keboola Architecture 2](/overview/project-structure2.png)

### Data Source Connectors
[Data sources connectors](/components/extractors/), formerly known as [extractors](/components/extractors/) are Keboola components used 
to gather data from various sources. They can connect to APIs of external services, databases, applications, object storages, and many others.

### Storage
[Storage](/storage/) is the central component in Keboola responsible for data management and access. It comprises two sections: [File Storage](/storage/files/) 
with all raw files uploaded to your project, and [Table Storage](https://help.keboola.com/storage/tables/) where all data tables are organized into buckets, 
further categorized into in and out stages.

This component operates as an abstraction layer on top of various [backend](/transformations/#backends) database engines 
including [Snowflake](https://www.snowflake.com/), [Redshift](https://aws.amazon.com/redshift/), [BigQuery](https://cloud.google.com/bigquery/),
[Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/) and more. It offers a vital API [Storage API]()[LINK] 
for interactions with the data, facilitating communication with other components and third-party applications.

### Transformations
[Transformations](/transformations/) allow end-users to create custom scripts in [SQL](https://en.wikipedia.org/wiki/SQL) (Snowflake, Redshift, BigQuery, and 
more), dbt, [Julia](https://julialang.org/), [Python](https://www.python.org/about/) and [R](https://www.r-project.org/about.html). 
Keboola provides Workspaces, offering a safe environment for experimentation, analytics and transformation development.

[Workspaces](/transformations/workspace/) are managed environments for code development. SQL workspaces are accessible through the database provider's IDE or your preferred SQL IDE. Python, R, or Julia workspaces are available through Keboola's hosted and managed Jupyter Lab environment. These workspaces can be shared with other users to facilitate collaboration.

### Data Destination Connectors
Data destination connectors [LINK], formerly known as Writers, are components responsible for output data delivery from Keboola to the systems and applications where the data gets used or consumed. These connectors often interface with relational databases, BI, reporting and analytics platforms, tools or applications.

### Full Automation
Keboola provides the Flows [LINK] component, formerly known as Orchestrator, to fully automate end-to-end processes. With Flows, you can specify the execution order of individual connectors, transformations, and other components, along with setting up parallelization. By adding a schedule or trigger [LINK][link to scheduler], you can automate processes at specified intervals or times of the day.

The platform automatically scales resources for to facilitate the automated processes.

### Applications
Unlike the free-form Transformations, Applications are predefined blocks, that enable users to perform advanced tasks such as sentiment analysis, association discovery, or histogram grouping. They can also enhance data, for example, by incorporating external data like Weather or Exchange Rates through third-party services.

### Data Apps
Data Apps are user-friendly, interactive web applications designed to leverage data for insights or automated actions. These applications are typically custom-built to address specific challenges, providing users with dynamic, purpose-built experiences. Examples of Data Apps include recommendation engines, interactive segmentation tools, AI integration solutions, data visualization platforms, custom internal reporting tools for business teams, and financial apps for gaining insights into spending patterns.


