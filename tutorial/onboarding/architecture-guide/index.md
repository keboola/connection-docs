---
title: Multi-Project Architecture Guide
permalink: /tutorial/onboarding/architecture-guide/
---

* TOC
{:toc}

Welcome to the Multi-Project Architecture Guide!

This guide is designed to assist you in strategically organizing your Keboola projects, offering insights into standard architectures 
that have proven successful for clients of varying sizes. By delving into this resource, you will gain a deeper understanding of the diverse project structures 
that align with different organizational needs and requirements. Whether you're a small team or a large enterprise, this guide aims to empower you 
with the knowledge needed to make informed decisions on how best to configure your Keboola projects for optimal efficiency and effectiveness.

## Single Keboola Project 
The foundation of implementing and utilizing the **Keboola Platform** begins with the establishment of the initial **Keboola project**. 

Conceptually, a Keboola project serves as a logical construct, providing isolation for access rights, responsibilities, data pipelines, storage, 
and embedded processes. This segregation facilitates the distributed allocation of access and responsibilities among individuals and teams 
while maintaining comprehensive control over the data governance layer.

By default, every Keboola project encompasses essential building blocks, including:
1. **Storage**
  - Relational databases such as Snowflake, Redshift, Synapse, Exasol, and others
  - Object storage options like S3 or Azure Blob Storage
2. **Components**
  - Data sources: Connectors to pull data from various sources into the Keboola storage
  - Data destinations: Facilitating reverse ETL to push processed data from Keboola to databases, services, or applications.
  - Applications: Advanced components for tasks like data quality checks, natural language processing (NLP), and more.
  - Data templates: Predefined packages of components for streamlined pipeline setup.
3. **Transformations** (SQL, Python, R) – giving you the ability to transform your data into the desired format and structures for further usage and consumption
4. **Flows** – bringing it all together. Flow is a set of tasks organized in a workflow that has an assigned schedule of execution
5. **Governance layer** – metadata, telemetry, identity management, access control etc. 

![Keboola Overview](/tutorial/onboarding/architecture-guide/pic1.png){: .img-responsive}
