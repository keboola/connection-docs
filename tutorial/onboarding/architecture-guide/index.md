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
3. **Transformations** (SQL, Python, R)
   - Transformations give you the ability to transform your data into the desired format and structures for further usage and consumption.
4. **Flows**
   - Flows bring everything together. A flow is a set of tasks organized in a workflow that has an assigned schedule of execution.
5. **Governance layer**
   - Metadata, telemetry, identity management, access control, etc. 

![Keboola Overview](/tutorial/onboarding/architecture-guide/pic1.png){: .img-responsive}

Many organizations find a single Keboola project sufficient for an extended period, or even indefinitely. It offers all the tools 
integrated into an advanced, modern data stack, allowing users to integrate data sources, develop transformations, orchestrate pipelines, 
and use the project as an analytical environment. Direct interaction with data is possible through SQL, Python, R, or visualization tools 
like Tableau, PowerBI, ThoughtSpot, Qlik, and more.

However, as an organization grows or matures, several reasons may arise for transitioning from using individual data tools to adopting 
a comprehensive data platform. This evolution is encapsulated in the **multi-project architecture (MPA)** within Keboola, signifying the strategic move to split 
the ecosystem into multiple projects. This shift accommodates the evolving needs of a maturing organization and transforms the Keboola Platform 
into a more sophisticated and scalable data solution.

> *"What’s the difference? Proper data platform allows you to fully benefit from the modern approach of data mesh and data democratization.
> Splitting responsibilities and artifacts into multiple isolated environments while keeping them well integrated and managed is
> what’ll allow you to move forward with your business use-cases without creating the bottleneck which typically happens
> as centralized BI teams get overloaded rather sooner than later."*

## What Is MPA?
Multi-project architecture is a strategic approach that involves the partitioning of data processing pipelines across distinct blocks represented by individual Keboola projects. In this framework, each project assumes a specific function, serving as a dedicated entity responsible for delivering a portion of the "data catalog." This catalog can then be utilized by any other project, allowing users to subscribe to it or catering to specific use cases within the organization.

Essentially, MPA marks a transition from a single project, typically focused on Extract, Transform, Load (ETL) processes, to a comprehensive data platform. Beyond simplifying the cognitive complexity of the project, MPA enables the clear separation of responsibilities and access rights within each segment of the data ecosystem. It offers a systematic organization and management of data usage across the entire organization, supporting the transformation of the Keboola Platform from a tool-centric solution to a fully-fledged data platform.

Key benefits of multi-project architecture include:

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

In summary, multi-project architecture is a strategic evolution that optimizes the Keboola Platform. It provides a structured and scalable framework 
to accommodate the complex and dynamic needs of organizations engaged in diverse data processing and analytics activities.

### Determining the Need for Multi-Project Architecture (MPA)
If you find yourself contemplating the implementation of multi-project architecture (MPA) within your Keboola Organization, 
the following set of questions can serve as a valuable guide to assess whether the transition to multiple isolated projects aligns 
with the specific dynamics and needs of your organization:

1. **Do you want to separate data extraction?**  
Consider dedicating a separate project to data acquisition (e.g., L0 or Staging project) to streamline the setup of connectors and scheduling without encumbering data processing. This separation facilitates collaboration among engineers, data source owners, analysts, and other team members.
3. **Do you have many data sources of various types?**  
Evaluate whether distinct groups of data sources (e.g., marketing, CRM, sales, accounting) could benefit from processing in separate projects, thereby maintaining clarity in responsibilities and access permissions.
4. **Do you have multiple teams/branches/countries with specific needs?**  
Assess whether different teams, branches, or countries possess unique data sources, use cases, and requirements, making the case for dedicated isolated projects to cater to specific needs.
5. **Do you have a team of specialists and data consumers?**  
Explore whether a team of specialists (e.g., BI team, data analysts) can manage core data preparation in one project, while data consumers access selected data assets via their dedicated projects, facilitating a balance between specialization and accessibility.
6. **Do you work with external vendors?**  
If external vendors require managed access to specific data subsets, consider creating a separate project for them to ensure controlled access and comprehensive logging.
7. **What does your organizational structure look like?**  
Align project split with existing company domains, following the Data Mesh philosophy, to embrace decentralized data ownership, self-service, and federated management of computing resources.
8. **Is your team small and collaborative?**  
For small, collaborative teams working on multiple sources, consider minimizing the number of projects and perhaps only splitting the L0 layer by source/domain to reduce cognitive complexity.
9. **How will you respond to failures?**  
Ensure that each project is isolated with a clear owner, facilitating swift responses in the event of failures or issues.
10. **Are there differences between regions/countries?**  
Assess the level of complexity introduced by regional or country-specific differences, and evaluate whether maintaining the split on L1 layer and merging at L2 level provides a balanced approach.
11. **Do you have sensitive data?**  
Consider the need to keep sensitive data separate for security reasons or to facilitate separate team management, and assess whether data masking is necessary at the L0 and L1 levels.

By addressing these questions, you can gain valuable insights into whether multi-project architecture aligns with your organizational structure, data processing requirements, and collaboration dynamics, ensuring a strategic and effective implementation of Keboola projects.

## How to Design the MPA
Designing a multi-project architecture is a nuanced process, and each design is inherently unique, tailored to the specific environment, business needs, and organizational structure. While there is no one-size-fits-all solution, the following factors play a crucial role in determining the optimal architecture:

1. **Nature of Data/Business:**  
Understand the characteristics of the data and business operations to identify related domains and objects.
2. **Organizational Structure:**
Consider the internal organizational structure, including the roles and responsibilities of data teams within the company.
3. **Data Source Variety and Separation:**  
Evaluate the variety and separation of data sources to determine if specific projects are needed for different types of sources.
4. **Security Aspects:**  
Address security considerations, including geo-locations, data ownership, and compliance requirements.
5. **Volume of Data and Complexity:**  
Assess the volume and complexity of data within particular domains to inform the architecture.

> [!TIP]
> One precursor which should serve as a starting point is a defined **Business Data Model (BDM)**.
> This exercise helps you to understand the business in terms of data and discover domains that are related to each other. 
> 
> Generally speaking, the objects defined in the BDM should be grouped closely within the MPA. For instance, all logic related to a Customer object
> (and any closely related objects) should be in one project. It's common for multiple sources to contribute to this object, possibly coming from
> multiple L0 level projects. However, there should always be a single point of consolidation for this object as soon as possible (e.g., in L1/2). 
>
> See our [**BDM methodology guide**](/tutorial/onboarding/architecture-guide/bdm-guide/) for more information.

### Standard MPA designs
This chapter describes the most typical MPA designs and demonstrates those in simple examples. In general we have defined two main strategies - vertical and horizontal - of splitting the projects that may be combined together into a so-called hybrid design.

As you embark on the design process, keep in mind the dynamic and evolving nature of your organization. Regularly revisit and adjust the MPA design to accommodate changes in business priorities, data landscape, and organizational structure. The goal is to create an architecture that enhances collaboration, efficiency, and scalability across your data projects.

![Vertical and Horizontal Split Design](/tutorial/onboarding/architecture-guide/split-design.png){: .img-responsive}

#### Vertical split design
The vertical split design strategy involves dedicating different pipeline steps to different teams, often aligning with the transition 
between core engineering/IT and business functions within an organization. This approach is commonly observed in enterprise environments, 
where IT teams design logical blocks of infrastructure, represented as projects in Keboola's terminology, vertically into L0 (data acquisition projects), 
L1, L2, and so on. Each layer corresponds to different data processing stages, from acquisition to transformation and blending, to data consumption projects.

**Vertical split design is suitable when:**
1. **Dedicated isolation isn't necessary**  
There's no need to dedicate isolated projects to individual data consumers or business users. Instead, the focus is on logically splitting the data processing into distinct layers.
2. **Managed by BI/data/IT teams**  
BI, data, or IT teams manage the full data environment of the organization. In such cases, these teams are responsible for orchestrating data processing and making datasets available for consumption.
3. **Centralized data access**  
Individual data consumers only access datasets provided by the data team or consume data via a visualization tool connected to a dedicated part of the underlying database.

**Key considerations:**
1. **Logical layering**  
The design is structured based on logical layers, allowing each team to focus on specific aspects of data processing without overlapping responsibilities.
2. **Data team ownership**
The data team has a central role in managing the full data environment and orchestrating data processing activities across different layers.
3. **Data access control**
Data consumers access datasets made available by the data team or utilize data via visualization tools connected to specific sections of the underlying database.

**Benefits:**
1. **Efficient collaboration**  
Teams can efficiently collaborate within their designated pipeline steps, leading to streamlined processes and enhanced efficiency.
2. **Clear responsibilities**  
Responsibilities are clearly defined for each team based on the logical layers, avoiding confusion and promoting focused efforts.
3. **Centralized management**  
Centralized data management by BI, data, or IT teams ensures a structured and organized approach to data processing.

**Considerations for implementation:**
1. **Team alignment**  
Ensure that team structures align with the logical layers of data processing, allowing each team to specialize in their designated stage.
2. **Communication channels**  
Establish clear communication channels between teams to facilitate collaboration and information sharing across different stages of data processing.
3. **Continuous evaluation**  
Regularly evaluate the effectiveness of the Vertical Split Design and make adjustments as needed based on evolving business needs and data requirements.

***Note:** This design is particularly well-suited for environments where a centralized approach to data management and processing is effective, 
and individual data consumers primarily interact with curated datasets provided by the data team.*

![Vertical Split Design](/tutorial/onboarding/architecture-guide/vertical-design.png){: .img-responsive}

**L0 – Data acquisition**
- All data extractions (from Salesforce, Zendesk, MySQL database, Google Analytics and Exponea)
- Basic data quality checks - to make sure that extracted data is in expected shape and quality

**L1 – Core**
- The core layer of data preparation and processing - data from L0 are combined into a unified data model
- Data cleaning
- Data processing

**L2 – Data-marts**
- One or more L2 projects that serve for data-mart creation
- Built datasets are consumed by business/other data consumers 
- Objects in this projects are made accessible from visualization/reporting tools

**LX – Telemetry and governance**
- Typically we would recommend to keep a separate project for consumption of Keboola’s telemetry data and other metadata that describe overall platform usage and serve for organization’s admins as a detailed monitoring 

#### Horizontal split design
The Horizontal Split Design involves dividing data pipelines and infrastructure based on departments, circles, or other entities within an organization. 
This approach tailors data processing to specific use cases and allows individual entities to independently manage their entire data-related workflow. 
For example, a marketing data catalog can be exclusively maintained by the marketing department, leveraging their domain knowledge.

**Horizontal split design is suitable when:**
1. **Entities operate independently**  
Individual entities operate as clearly standalone units and are capable of independently handling the entire data-related workflow.
2. **Use-case-driven infrastructure**  
Infrastructure is designed based on specific use cases, allowing each entity to manage data pipelines aligned with their unique requirements.

**Key considerations:**  
1. **Departmental independence**  
Each department or entity operates independently, taking care of its entire data-related work, from data extractions to full data processing.
2. **Use-case-driven**  
Infrastructure is driven by specific use cases, ensuring that each department's data needs are addressed within its designated project.

**Horizontal split design example:**
1. **Sales and CRM:**
   - Data extractions from Salesforce and part of MySQL database.
   - Full data processing, including eventual data testing.
   - Consumers access data directly in this project or via a visualization/reporting tool connected to this project.
2. **Marketing:**
   - Data extractions from Google Analytics, Exponea, and part of MySQL database.
   - Full data processing, including eventual data testing.
   - Consumers access data directly in this project or via a visualization/reporting tool connected to this project.
3. **Operations:**
   - Data extractions from Zendesk and part of MySQL database.
   - Full data processing, including eventual data testing.
   - Consumers access data directly in this project or via a visualization/reporting tool connected to this project.

![Horizontal Split Design](/tutorial/onboarding/architecture-guide/horizontal-design.png){: .img-responsive}

**Benefits:**

Departmental Autonomy:

Each department or entity enjoys autonomy in managing its specific data-related processes, fostering independence and flexibility.

Use-Case Customization:

Infrastructure is customized based on specific use cases, ensuring that each entity's data processing aligns with its unique requirements.

Domain Knowledge Utilization:

Departments leverage their domain knowledge to curate and manage their respective data catalogs, optimizing for accuracy and relevance.

Considerations for Implementation:

Departmental Collaboration:

While entities operate independently, establish communication channels for collaboration and information sharing where needed.

Data Governance:

Implement data governance practices to ensure consistency and adherence to standards across different horizontal splits.

Scalability:

Evaluate the scalability of each horizontal split to accommodate future growth and changing data processing needs within individual departments.

Note:

This design is effective when entities operate as self-contained units and can manage their entire data workflow independently, aligning well with specific departmental requirements and domain knowledge.

 

Hybrid Split Design
The Hybrid Split Design is a comprehensive approach that combines both vertical and horizontal splits within the data environment. This design is often the most typical and practical solution for organizations. It acknowledges the need to vertically separate data extractions and integrations from processing and consumption. Simultaneously, it recognizes the necessity to horizontally split one or more of these vertical layers, dedicating isolated environments to individual business units, departments, or teams.

Is Hybrid Split Design Right for You?

Hybrid Split Design is suitable when:

Need for Vertical and Horizontal Separation:

There is a requirement to separate data extractions and integrations (vertical split) from processing and consumption, and simultaneously, there is a need to horizontally split these vertical layers to cater to specific business units, departments, or teams.

Balance of Independence and Collaboration:

The organization seeks a balance between providing independence to different entities for their specific data workflows while fostering collaboration where needed.

Key Considerations:

Combination of Vertical and Horizontal Splits:

Integrates both vertical and horizontal splits to create a nuanced and adaptable data architecture.

Isolation for Business Units or Teams:

Allocates isolated environments to individual business units, departments, or teams based on their unique data processing needs.

Benefits:

Balanced Independence:

Achieves a balance between providing independence to different entities for their specific data workflows (vertical split) and facilitating collaboration (horizontal split).

Customization for Entities:

Allows customization of data processing environments based on specific business unit or team requirements.

Considerations for Implementation:

Vertical Split Clarity:

Clearly define the vertical split, ensuring a clear separation between data extractions/integrations and processing/consumption layers.

Horizontal Split Alignment:

Align horizontal splits with specific business units, departments, or teams, ensuring that each entity has an isolated environment.

Collaboration Channels:

Establish channels for collaboration and information sharing where needed, fostering effective communication between different entities.

Scalability and Adaptability:

Assess the scalability and adaptability of the Hybrid Split Design to accommodate future growth, changes in data landscape, and evolving business needs.

Note:

The Hybrid Split Design recognizes the complexity of organizational data requirements and strives to provide a flexible, adaptable, and balanced solution. It allows organizations to leverage the benefits of both vertical and horizontal splits, tailoring the data architecture to meet diverse and evolving needs.

![Hybrid Split Design](/tutorial/onboarding/architecture-guide/hybrid-design.png){: .img-responsive}
