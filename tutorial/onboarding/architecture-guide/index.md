---
title: Multi-Project Architecture Guide
permalink: /tutorial/onboarding/architecture-guide/
---

* TOC
{:toc}

Welcome to the Multi-Project Architecture Guide!

This guide helps you effectively organize your Keboola projects, sharing successful strategies for clients of all sizes. You'll learn about various project 
setups that meet your organizational needs and gain insights to tailor your Keboola projects for maximum efficiency and success.

## Single Keboola Project 
A **Keboola project** is the starting point for using the **Keboola Platform**, acting as a self-contained environment for managing access, data pipelines, 
storage, and processes. It provides a structured framework for distributing tasks and access across teams, ensuring efficient data governance.

Each project includes the follwoing key components:

1. **Storage**
   - Relational databases such as Snowflake, Redshift, Synapse, Exasol, and others
   - Object storage options like S3 or Azure Blob Storage
2. **Components**
   - Data sources and destinations for loading data into Keboola Storage and exporting to databases, services, or applications
   - Applications for specialized tasks (data quality checks, NLP, etc.)
   - Data templates for easy pipeline setup
3. **Transformations** allow you manipulate data for further use and consumption (SQL, Python, and R).
4. **Flows** bring everything together as sets of tasks organized in workflows with assigned schedules of execution.
5. **Governance layer** covers metadata, telemetry, identity management, access control, etc. 

{: .image-popup}
![Keboola Overview](/tutorial/onboarding/architecture-guide/pic1.png)

For many organizations, a single Keboola project suffices indefinitely, supporting a comprehensive data stack for integration, transformation, pipeline 
orchestration, and analysis through SQL, Python, R, and visualization tools (e.g., Tableau, PowerBI, ThoughtSpot, and Qlik).

As organizations evolve, they may transition to a **multi-project architecture** within Keboola. This advanced structure allows for a scalable and 
sophisticated data solution by splitting responsibilities across multiple projects. This approach aligns with modern data management strategies, such as data mesh 
and democratization, by maintaining integrated yet isolated environments to avoid bottlenecks typically encountered with centralized BI teams.

## Multi-Project Architecture (MPA)
MPS is a design strategy that divides data processing tasks among multiple function-specific Keboola projects. It transforms a single-procect focus on Extract, Transform, and Load (ETL) processes into a structured data platform, enhancing organizational data management. This approad clarifies role, simplifies access control, and supports tailored data usage and governance.

These are the key benefits of MPA:

1. **Defined Roles and Access:** Facilitates role-specific access and responsibilities, ideal for diverse organizational needs.
2. **Purpose-Specific Projects:** Assigns projects to specific functions like stable pipelines ot experimental projects for clarity.
3. **Organized Data Processing:** Segregates data pipeline stages into distinct projects for better structure.
4. **Team Collaboration:** Allows team-specific project assignments, enhancing focus and collaboration. For instance, your marketing team may operate
on a dedicated marketing project.
5. **Adaptable Infrastructure:** Offers infrastructure flexibility to meet changing organizational needs.
6. **Scalability and Future Growth:** Prepares the architecture for scalable expansion and adaptability.   
7. **Responsive Architecture Design:** Enables agile adjustments to evolving data management requirements.
   
### Assessing MPA Necessity
To determine if MPA suits your organization, consider:

1. **Do you want to separate data extraction?**  
Streamline data acquisition with a dedicated project (e.g., L0 or Staging project) to enhance collaboration.
2. **Do you have diverse data sources?**  
Process varying data sources (e.g., marketing, CRM, sales, accounting) in distinct projects for clearer management.
3. **Do you have unique team requirements?**  
Cater to different team, branch, or country-specific needs with isolated projects.
4. **Do you have specialist and consumer teams?**  
Can your team of specialists (e.g., BI team, data analysts) prepare core data in one project, while data consumers access selected data assets via their dedicated projects? Balance data preparation and access between specialist and consumer projects.
5. **Do you collaborate with external vendors?**  
Control data access for external vendors through dedicated projects.
6. **What is your organizational structure?**  
Align projects with company domains, adopting a decentralized data management approach.
7. **What is your team size?**  
For small, collaborative teams, minimize project numbers and focus on essential separations (perhaps only splitting the L0 layer by source/domain).
8. **How to respond to failures?**  
Ensure that each project is isolated with a clear owner to resolve issues quickly.
9. **Are there differences between regions/countries?**
Consider splitting projects based on regional differences to manage complexity. Evaluate whether maintaining the split on L1 layer and merging at L2 level provides a balanced approach.
10. **Do you use sensitive data?**  
Keep sensitive data separate for security reasons and to facilitate team management. Assess whether data masking is necessary at the L0 and L1 levels.

By addressing these questions, you can gain valuable insights into whether multi-project architecture aligns with your organizational structure, 
data processing requirements, and collaboration dynamics, ensuring a strategic and effective implementation of Keboola projects.

## How to Design the MPA
Designing a multi-project architecture is a nuanced process, and each design is inherently unique, tailored to the specific environment, business needs, 
and organizational structure. While there is no one-size-fits-all solution, the following factors play a crucial role in determining the optimal architecture:

1. **Nature of data/business:**  
Understand the characteristics of the data and business operations to identify related domains and objects.
2. **Organizational structure:**  
Consider the internal organizational structure, including the roles and responsibilities of data teams within the company.
3. **Data source variety and separation:**  
Evaluate the variety and separation of data sources to determine if specific projects are needed for different types of sources.
4. **Security aspects:**  
Address security considerations, including geo-locations, data ownership, and compliance requirements.
5. **Volume of data and complexity:**  
Assess the volume and complexity of data within particular domains to inform the architecture.

{% include tip.html content="
One precursor which should serve as a starting point is a defined **business data model (BDM)**.
This exercise helps you to understand the business in terms of data and discover domains that are related to each other. 

Generally speaking, the objects defined in the BDM should be grouped closely within the MPA. For instance, all logic related to a Customer object
(and any closely related objects) should be in one project. It's common for multiple sources to contribute to this object, possibly coming from
multiple L0 level projects. However, there should always be a single point of consolidation for this object as soon as possible (e.g., in L1/2). 

See our [**BDM methodology guide**](/tutorial/onboarding/architecture-guide/bdm-guide/) for more information.
" 
%}

### Standard MPA designs
This chapter describes the most typical MPA designs and demonstrates those in simple examples. In general we have defined two main strategies - vertical and horizontal - of splitting the projects that may be combined together into a so-called hybrid design.

As you embark on the design process, keep in mind the dynamic and evolving nature of your organization. Regularly revisit and adjust the MPA design to accommodate changes in business priorities, data landscape, and organizational structure. The goal is to create an architecture that enhances collaboration, efficiency, and scalability across your data projects.

{: .image-popup}
![Vertical and Horizontal Split Design](/tutorial/onboarding/architecture-guide/split-design.png)
<div align="center">Vertical and Horizontal Split Design</div>

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

{: .image-popup}
![Vertical Split Design](/tutorial/onboarding/architecture-guide/vertical-design.png)
<div align="center">Vertical Split Design Example</div>

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
1. **Sales and CRM**
   - Data extractions from Salesforce and part of MySQL database.
   - Full data processing, including eventual data testing.
   - Consumers access data directly in this project or via a visualization/reporting tool connected to this project.
2. **Marketing**
   - Data extractions from Google Analytics, Exponea, and part of MySQL database.
   - Full data processing, including eventual data testing.
   - Consumers access data directly in this project or via a visualization/reporting tool connected to this project.
3. **Operations**
   - Data extractions from Zendesk and part of MySQL database.
   - Full data processing, including eventual data testing.
   - Consumers access data directly in this project or via a visualization/reporting tool connected to this project.

{: .image-popup}
![Horizontal Split Design](/tutorial/onboarding/architecture-guide/horizontal-design.png)
<div align="center">Horizontal Split Design Example</div>

**Benefits:**
1. **Departmental autonomy**  
Each department or entity enjoys autonomy in managing its specific data-related processes, fostering independence and flexibility.
2. **Use-case customization**  
Infrastructure is customized based on specific use cases, ensuring that each entity's data processing aligns with its unique requirements.
3. **Domain knowledge utilization**  
Departments leverage their domain knowledge to curate and manage their respective data catalogs, optimizing for accuracy and relevance.

**Considerations for implementation:**  
1. **Departmental collaboration**  
While entities operate independently, establish communication channels for collaboration and information sharing where needed.
2. **Data governance**  
Implement data governance practices to ensure consistency and adherence to standards across different horizontal splits.
3. **Scalability**  
Evaluate the scalability of each horizontal split to accommodate future growth and changing data processing needs within individual departments.

***Note**: This design is effective when entities operate as self-contained units and can manage their entire data workflow independently, 
aligning well with specific departmental requirements and domain knowledge.*

#### Hybrid split design
The Hybrid Split Design is a comprehensive approach that combines both vertical and horizontal splits within the data environment. 
This design is often the most typical and practical solution for organizations. It acknowledges the need to vertically separate data extractions 
and integrations from processing and consumption. Simultaneously, it recognizes the necessity to horizontally split one or more of these vertical layers, 
dedicating isolated environments to individual business units, departments, or teams.

**Hybrid split design is suitable when:**
1. **Need for vertical and horizontal separation**  
There is a requirement to separate data extractions and integrations (vertical split) from processing and consumption, and simultaneously,
there is a need to horizontally split these vertical layers to cater to specific business units, departments, or teams.
2. **Balance of independence and collaboration**  
The organization seeks a balance between providing independence to different entities for their specific data workflows while fostering collaboration where needed.

**Key considerations:**
1. **Combination of vertical and horizontal splits**  
Integrates both vertical and horizontal splits to create a nuanced and adaptable data architecture.
2. **Isolation for business units or teams**  
Allocates isolated environments to individual business units, departments, or teams based on their unique data processing needs.

**Benefits:**
1. **Balanced independence**  
Achieves a balance between providing independence to different entities for their specific data workflows (vertical split) and facilitating collaboration (horizontal split).
2. **Customization for entities**  
Allows customization of data processing environments based on specific business unit or team requirements.

**Considerations for implementation:**
1. **Vertical split Clarity**  
Clearly define the vertical split, ensuring a clear separation between data extractions/integrations and processing/consumption layers.
2. **Horizontal split alignment**  
Align horizontal splits with specific business units, departments, or teams, ensuring that each entity has an isolated environment.
3. **Collaboration channels**  
Establish channels for collaboration and information sharing where needed, fostering effective communication between different entities.
4. **Scalability and adaptability**  
Assess the scalability and adaptability of the hybrid split design to accommodate future growth, changes in data landscape, and evolving business needs.

***Note:** The hybrid split design recognizes the complexity of organizational data requirements and strives to provide a flexible, adaptable, 
and balanced solution. It allows organizations to leverage the benefits of both vertical and horizontal splits, tailoring the data architecture 
to meet diverse and evolving needs.*

{: .image-popup}
![Hybrid Split Design](/tutorial/onboarding/architecture-guide/hybrid-design.png)
<div align="center">Hybrid Split Design Example</div>
