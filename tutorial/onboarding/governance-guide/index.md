---
title: Keboola Governance Guide
permalink: /tutorial/onboarding/governance-guide/
---

Welcome to the Keboola Governance Guide! Here, we cover everything you need to know about managing and monitoring your use of our platform, 
including operating costs and adhering to security and other rules you've set in your [Keboola Platform Usage Blueprint](/tutorial/onboarding/usage-blueprint/).

**If you have any questions or need further assistance, our support team is here for you.**

* TOC
{:toc}

## Understanding Platform Activity
### Using Telemetry Data
Keboola collects metadata about every operation on the platform, including how components are set up, how users interact, and every job that runs.
This metadata is processed into a user-friendly [telemetry data model](/components/extractors/other/telemetry-data). You can check it out via a special 
connector called Telemetry Data.

We recommend creating a separate Admin project to use the Organization mode of the Telemetry Data connector.
If you're working with just a few projects, you can simply add the Telemetry Data connector to one of them.

**To turn on Organization mode in the Telemetry Data connector:**  
Get in touch with our support team or your account manager. They'll switch on this feature for your account, helping you get a comprehensive view of your project's telemetry data.

#### Activity center
The Activity Center add-on represents an advanced feature within the Telemetry Data connector for those who have it included in their contract. 
It gives a deeper look into your data, showing **detailed metadata** about each component, like storage details, user **activities**, and **specifics regarding job** inputs and outputs. This extra detail is great for closely tracking your data's journey and advanced usage analysis.

### Monitoring and Analysis
You can quickly check basic usage stats on the **Project Consumption** page of your project dashboard, including:

- Consumed credits
- Number of executed jobs
- Error job ratio
- Active flows
- Active component configurations
- Active transformations

For those overseeing several projects, the **Organization Usage** page lets you view these metrics for all projects together, showing:

- Total credit consumption
- Number of projects
- Number of users
- Size of data in Storage

These figures are compared with your plan's limits, with trends and breakdowns by component type shown in easy-to-understand graphs.

Additionally, the platform points out which projects and components use the most credits, helping you manage resources better and fine-tune where needed.

#### Custom metrics
Beyond the basic metrics, many organizations customize their dashboards with metrics specific to their needs using tools like Tableau, PowerBI, or Looker. 
They connect these tools directly to Keboola Storage to display telemetry data.

While certain metrics might need additional SQL queries, you can quickly get many valuable insights directly from the telemetry data. Examples include:

1. **Breakdown of credit use**: See how credits are used across different projects, users, components, etc., over time.
2. **Job executions and error analysis**: Identify which users frequently encounter errors, possibly needing extra help or training.
3. **Spotting outliers**: Monitor unusual changes in project activities, user actions, or configurations to find areas that might need optimization.
4. **Configuration health metrics**: Check if created flows have schedules and notifications set up and if configurations are properly described and named according to your [**Platform Usage Blueprint**](/tutorial/onboarding/usage-blueprint/).
5. **User 360**: Ensure users have multi-factor authentication enabled. See which projects they can access, and track their credit use, executed jobs, error rates, configuration changes, and API token creations.

With these custom metrics, you get a fuller picture of your platform's operation. You can make better decisions and manage resources more effectively.

## Best Practices for Data Management

Recognizing that the needs and requirements of individual organizations vary widely, the platform refrains from providing a one-size-fits-all solution. 
Instead, it offers seamless integration with third-party data catalog and lineage visualization tools like Informatica, Collibra, DataHub, 
Dawiso, Manta, and others.

To make the most of your data management:
1. **Use Keboola's metadata**: Take advantage of the rich metadata Keboola automatically gathers for insights into your data processes.
2. **Integrate with external tools**: Connect Keboola with third-party tools that fit your organization's needs for a tailored data cataloging and lineage visualization approach.
3. **Find the right tools**: With so many specialized tools available, pick those that meet your organization's specific data management needs, such as Informatica, Collibra, DataHub, Dawiso, and Manta, among others.
4. **Stay flexible**: Your needs might change, so keep your options open by choosing solutions that allow easy integration with Keboola.
5. **Ensure compatibility**: Make sure your chosen third-party tools work smoothly with Keboola to create an efficient data management system. Keboola Professional Services can guide you through integration options.

By following these best practices, you can enhance your data management capabilities, integrate specialized tools as needed, and ensure that your organization's 
unique requirements are met effectively.

### Understanding Your Data's Journey
To learn more about data lineage, check out our [blog post](https://www.keboola.com/blog/how-to-get-started-with-data-lineage).

Keboola's telemetry data includes detailed tables about your data, such as table columns, descriptions, and data types. You can format this information to work
with your data catalog tool and link it using a database connector, an API, or directly through Keboola's API.

You'll also find details on all component configurations, like data sources and transformations, in separate tables. This information is key to tracing your 
data's path from source to destination.

For tools supporting OpenLineage, Keboola provides an OpenLineage data destination [component](https://components.keboola.com/components/keboola.wr-openlineage). 
It structures OpenLineage data from Keboola jobs, making it easy to integrate into your visualization tool for better data management and insight.
