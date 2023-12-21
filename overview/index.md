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
