---
title: Keboola Governance Guide
permalink: /tutorial/onboarding/governance-guide/
---

* TOC
{:toc}

Welcome to the Keboola Governance Guide! Governance, in the context of our platform, encompasses a spectrum of activities related to tracking, understanding usage, cost management, and maintaining adherence to security and other principles outlined in your [Keboola Platform Usage Blueprint](/tutorial/onboarding/usage-blueprint/).

**If you have any questions or need further assistance, feel free to reach out to our support team.**

## Understanding Platform Activity
### Leveraging Telemetry Data
The Keboola platform captures metadata for every operation within its ecosystem. This encompasses the configuration of each component, user interactions, 
and the execution of every job. In the background, Keboola systematically processes the raw metadata, transforming it into a well-documented
[telemetry data model](/components/extractors/other/telemetry-data). Accessing this telemetry data for your project is facilitated through a dedicated data source 
connector called Telemetry Data.

For optimal governance, it is advisable to establish a distinct Admin project, wherein the Organization mode of the Telemetry Data connector can be 
employed. In instances where organizations operate with a limited number of projects, a straightforward approach involves integrating the Telemetry Data connector 
within one of the existing projects. 

**Enabling Organization mode in the Telemetry Data data source connector:**  
To activate the Organization mode within the Telemetry Data connector, kindly reach out to our Support team or directly contact your account manager. 
They will ensure that this specific option is enabled for your account, allowing you to leverage telemetry data in an organizational context.

#### Activity center
The activity center represents an advanced feature within the Telemetry Data connector, accessible to customers with the Activity Center add-on included in their 
contract. This mode offers a more comprehensive view, providing intricate details about individual components. It includes additional information such as 
**detailed metadata** for storage and other objects, user **activities**, and **specifics regarding job** inputs and outputs. This detailed insight is 
particularly valuable for robust data lineage tracking and advanced usage analysis.

### Monitoring and Analysis
For comprehensive oversight, basic metrics are readily available in the form of a project dashboard on the **Project Consumption** page. 
These fundamental metrics include:
- Consumed credits
- Number of executed jobs
- Error job ratio
- Active flows
- Active component configurations
- Active transformations

Organizations managing multiple projects can utilize the **Organization Usage** page to monitor these metrics across all projects. This broader view encompasses:
- Total credit consumption
- Number of projects
- Number of users
- Size of data in Storage

All metrics are accompanied by a comparison to contractual limits. Furthermore, the usage is graphically represented over time and categorized by individual 
component types, providing a comprehensive analysis.

The platform also highlights the top consuming projects within your organization, along with insights into the most resource-intensive component configurations in 
terms of credit consumption. This detailed monitoring and analysis functionality offer valuable insights for efficient resource management and optimization.

#### Custom metrics
In addition to the foundational metrics mentioned earlier, organizations often create more detailed dashboards to visualize custom metrics tailored to their 
specific needs. Whether utilizing Tableau, PowerBI, Looker, or other tools, it is possible to establish a direct connection between these tools and the Keboola 
Storage backend, enabling the visualization of telemetry data.

While certain metrics may require the development of additional SQL queries, many typical metrics can be easily derived from the Telemetry data itself. 
Some examples of these custom metrics include:
1. **Detailed, multi-dimensional view of consumed credits over time**
   - Per project, user, component, configuration, etc.
2. **Detailed view of executed jobs and error rates**
   - This helps identify users with a high rate of error jobs, indicating a potential need for further assistance or education.
3. **Monitoring outliers**
   - Keep track of weekly, monthly, or other periodic changes in the activity of individual projects, users, or specific configurations. This aids in identifying sudden increases in project activity or specific transformations that may require optimization.
4. **Configuration health metrics**
   - Monitor whether created flows have assigned schedules and notifications.
   - Ensure that configurations have descriptions and adhere to naming conventions specified in the [**Platform Usage Blueprint**](/tutorial/onboarding/usage/blueprint/).
5. **User 360**
   - Verify whether users have multi-factor authentication (MFA) enabled.
   - Identify the projects to which users have access.
   - Track the credit consumption, executed jobs, error rates, number of created and updated configurations, and API tokens created by each user.

By incorporating these custom metrics into your monitoring and analysis strategy, you can gain deeper insights into the performance, health, and compliance aspects of your data platform, facilitating informed decision-making and proactive management.

## Best Practices for Data Management
While the Keboola platform doesn't serve as a standalone data catalog or data lineage visualization tool, its strength lies in the rich metadata it automatically 
collects. 

Recognizing that the needs and requirements of individual organizations vary widely, the platform refrains from providing a one-size-fits-all solution in these 
areas. Instead, it offers seamless integration with a variety of third-party data catalog and lineage visualization tools, such as Informatica, Collibra, DataHub, 
Dawiso, Manta, and others.

To optimize your data management practices:
1. **Leverage rich metadata**
   - Capitalize on the extensive metadata automatically generated by the Keboola platform. This metadata provides valuable insights into your data operations.
2. **Integrate with third-party tools**
   - Integrate Keboola seamlessly with third-party data catalog and lineage visualization tools that align with your organization's specific needs. This allows you to benefit from specialized solutions without compromising flexibility.
3. **Explore diverse solutions**
   - Given the diverse landscape of organizational needs, explore and select data catalog and lineage visualization tools that best suit your unique requirements. Solutions like Informatica, Collibra, DataHub, Dawiso, Manta, among others, offer specialized features to enhance your data management capabilities.
4. **Maintain flexibility**
   - Recognize that a single solution may not cater to every organization's requirements. By maintaining flexibility and integrating with external tools, you can adapt your data management strategy to align with evolving needs.
5. **Facilitate interoperability**
   - Ensure that the selected third-party tools seamlessly integrate with the Keboola platform. This interoperability promotes a cohesive and efficient data management ecosystem. You can always rely on help of Keboola Professional Services to help you identify the integration options.

By following these best practices, you can enhance your data management capabilities, integrate specialized tools as needed, and ensure that your organization's 
unique requirements are met effectively.

### Data Catalogs, Dictionaries, and Data Lineage
For a comprehensive understanding of data lineage, we recommend exploring our blog post on the topic [here](https://www.keboola.com/blog/how-to-get-started-with-data-lineage).

Keboola telemetry data provides detailed tables containing information about all available tables, including their columns with essential details such as 
descriptions, data types, and other pertinent information. This data can be transformed into a format compatible with your chosen data catalog tool and 
subsequently integrated into the tool either through a DB connector, an API endpoint, or by reading directly from Keboola's Storage backend via API.

In addition to table information, separate tables house details about all component configurations, including data sources, transformations, and others, that 
either write data into or read data from these tables. This forms the foundational element of data lineage, enabling the construction of a comprehensive path from 
data sources to destinations.

For those employing a data lineage visualization tool that supports the OpenLineage format, Keboola offers the OpenLineage data destination component, accessible 
[here](https://components.keboola.com/components/keboola.wr-openlineage). This component generates structured OpenLineage data from all jobs executed in Keboola, 
allowing you to directly write this data to your OpenLineage endpoint. This streamlined integration facilitates the incorporation of Keboola's data lineage 
information into your chosen visualization tool, enhancing your data management and analysis capabilities.
