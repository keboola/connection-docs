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
3. **Transformations** (SQL, Python, R) – giving you the ability to transform your data into the desired format and structures for further usage and consumption.
4. **Flows** – bringing it all together. A flow is a set of tasks organized in a workflow that has an assigned schedule of execution.
5. **Governance layer** – metadata, telemetry, identity management, access control, etc. 

![Keboola Overview](/tutorial/onboarding/architecture-guide/pic1.png){: .img-responsive}

Many organizations find a single Keboola project sufficient for an extended period, or even indefinitely. It offers all the tools 
integrated into an advanced, modern data stack, allowing users to integrate data sources, develop transformations, orchestrate pipelines, 
and use the project as an analytical environment. Direct interaction with data is possible through SQL, Python, R, or visualization tools 
like Tableau, PowerBI, ThoughtSpot, Qlik, and more.

However, as an organization grows or matures, several reasons may arise for transitioning from using individual data tools to adopting 
a comprehensive data platform. This evolution is encapsulated in the **Multi-Project Architecture (MPA)** within Keboola, signifying the strategic move to split 
the ecosystem into multiple projects. This shift accommodates the evolving needs of a maturing organization and transforms the Keboola Platform 
into a more sophisticated and scalable data solution.

> *"What’s the difference? Proper data platform allows you to fully benefit from the modern approach of data mesh and data democratization.
> Splitting responsibilities and artifacts into multiple isolated environments while keeping them well integrated and managed is
> what’ll allow you to move forward with your business use-cases without creating the bottleneck which typically happens
> as centralized BI teams get overloaded rather sooner than later."*

## What Is MPA?
Multi-Project Architecture (MPA) is a strategic approach that involves the partitioning of data processing pipelines across distinct blocks represented by individual Keboola projects. In this framework, each project assumes a specific function, serving as a dedicated entity responsible for delivering a portion of the "data catalog." This catalog can then be utilized by any other project, allowing users to subscribe to it or catering to specific use cases within the organization.

Essentially, MPA marks a transition from a single project, typically focused on Extract, Transform, Load (ETL) processes, to a comprehensive data platform. Beyond simplifying the cognitive complexity of the project, MPA enables the clear separation of responsibilities and access rights within each segment of the data ecosystem. It offers a systematic organization and management of data usage across the entire organization, supporting the transformation of the Keboola Platform from a tool-centric solution to a fully-fledged data platform.

Key benefits of Multi-Project Architecture include:

1. **Separation of Responsibilities and Access Rights:**
Ideal for organizations with diverse use cases, users, and personas, MPA facilitates the distinct allocation of responsibilities and access rights based on functional requirements.
2. **Functional Designation of Projects:**
Projects can be designated for specific functions such as stable data pipelines, experimental projects, consumption projects, etc., providing clarity in their purpose.
3. **Clear Separation of Logical Pipeline Steps:**
Each project delineates a logical step in the data pipeline, contributing to a clear and organized structure of data processing.
4. **Team Assignment to Projects:**
Different teams can be assigned to different projects, promoting collaboration and specialization. For instance, the marketing team may operate on a dedicated marketing project.
5. **Flexibility of the Infrastructure:**
MPA allows for flexibility in configuring the infrastructure to match the evolving needs of the organization.
6. **Readiness for Future Expansions:**
The architectural design of MPA is conducive to future expansions, ensuring scalability and adaptability as the organization grows.
7. **Mitigation of Unknowns in Architecture Design:**
MPA simplifies the process of adjusting the architecture to changing conditions or scope, offering agility in responding to evolving requirements.

In summary, Multi-Project Architecture is a strategic evolution that optimizes the Keboola Platform, providing a structured and scalable framework to accommodate the complex and dynamic needs of organizations engaged in diverse data processing and analytics activities.
