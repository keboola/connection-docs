---
title: Telemetry Dashboards
permalink: /management/telemetry/telemetry-dashboards/
---

* TOC
{:toc}

***Note:** Initially, the Keboola platform was referred to as Keboola Connection (KBC). While it is now simply known as Keboola, references to “Connection” or the abbreviation “KBC” might still appear in table
names, column names, etc.*

To get to all three telemetry dashboards, click the top right corner of the profile picture. The [Project Consumption](#project-consumption) dashboard is always available. Check with your account manager to see 
if [Organization Usage](#organization-usage) or [Activity Center](#activity-center) are also available. 

## Project Consumption
{: .image-popup}
![Screenshot - Project Consumption Dashboard](/management/telemetry/telemetry-dashboards/project-consumption.png)

By default, the dashboard is filtered for the last six months. The date range at the top of the dashboard can be changed. 

The *KPIs* section presents overall statistics of the Keboola project. Some are self-explanatory (e.g., *Consumed Credits* and *Number of Jobs*). An explanation for the others can be found under 
the question mark or here in the documentation. *Error Jobs Ratio* shows the number of error jobs as a percentage of the total number of jobs run. *Active Flows* shows the number of flows with jobs starting 
in the selected date range. *Active Component Configurations* is like *Active Flows* but shows how many configurations have a job started in the selected date range, and the same applies to *Active 
Transformations*.

*Credits History* shows the evolution of consumed credits over time. *Trends* at the bottom of the print screen shows the monthly evolution of consumption broken into component types (bar chart) plus 
a graph of the number of error jobs and the total number of jobs. 

## Organization Usage
The dashboard is filtered for the last six months, which can be adjusted. It shows data for the whole Keboola organization. If you have an organization, you can view its usage, which typically includes multiple 
projects. 

### KPIs
*KPIs* show four of the metrics specified in the contract in comparison to their limits. For PPU, the usage and limit are shown for the period selected in the date range filter. For the others (Projects, 
Users, and Storage TB), the values are for the current month only, and the limits are as defined in the contract. 

{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ou-kpis.png)

### Active Contract Consumption
*Active Contract Consumption* shows three different views of PPU consumption in relation to the contractually agreed values. *PPU* is the actual usage per month. The *Predicted PPU* line is a prediction 
based on the average consumption in the last three months. The *PPU Limit* line is the consumption agreed in the contract, which is determined by allocating the same number of credits to each month of the 
contract's tenure.

{: .image-popup}
![Screenshot - Active Contract Consumption](/management/telemetry/telemetry-dashboards/ac-org-usage-contract.png)

### Consumption
*Consumption* shows three visuals. For the first two, you can drill down by hovering over a point and clicking on it. *PPU Daily* shows daily consumption broken down into groups based on a usage breakdown. 
*PPU Monthly* shows the same information but aggregated by month. The last visual shows the limits and actual consumption per month.    

{: .image-popup}
![Screenshot - Consumption](/management/telemetry/telemetry-dashboards/ou-consumption.png)

### Projects
*Projects* show the five most demanding components, configurations, and projects. For these four visuals, you can drill down to see a breakdown of consumption by week. There is also a URL that gives
direct access to the underlying data. For the five most expensive projects, there is also a usage breakdown, which shows what has consumed the credits. Next listed are the most demanding SQL and non-SQL 
transformations, which have consumed most of the credits. The last visual is for the most expensive components. 

{: .image-popup}
![Screenshot - Projects_1](/management/telemetry/telemetry-dashboards/ou-project1.png)

{: .image-popup}
![Screenshot - Projects_2](/management/telemetry/telemetry-dashboards/ou-project2.png)

### Configurations Health
*Configurations Health* gives the health of flows and jobs over time. By hovering over a day, you can see more detailed data (the numbers of flows or jobs on that day that ended with success, error, 
or warning).

{: .image-popup}
![Screenshot - Configuration Health](/management/telemetry/telemetry-dashboards/ou-config-health.png)

## Activity Center
*Activity Center* provides the most detailed insight into telemetry data from the three modes available. It is not available by default but has to be requested. You need to tell your account 
manager which project you want to be the target project in your *Activity Center*. You can have only one target project. Once the *Activity Center* has been enabled, it will be visible to everyone with access
to the target project.

The *Activity Center* dashboard is only available in one Keboola project. However, it shows information on consumption and trends for all Keboola projects that are associated with the given customer (organization).

{: .image-popup}
![Screenshot - Activity Centre in KBC](/management/telemetry/telemetry-dashboards/activity-centre-kbc.png)

The *Activity Center* has five tabs, each focused on a different aspect of consumption monitoring. These tabs are available by default for all projects in the organization but can be filtered for specific 
ones. You can also filter by date. The default setup is for the current month and the two previous months. For example, if you access the *Activity Center* during May, you will get data from 1st March until 
today. However, *Jobs Monitoring* provides detailed information on individual jobs, so it shows only yesterday's data by default. 

All these filters can be changed. For some visuals, you can drill down to see a lower level of detail. For a  graphical representation, the drill-down can be accessed by hovering over a point. The drill-down 
is available for a number if it has an underline. When you hover over a visual, a question mark appears in the top right corner. If you click on the question mark, you will get a description of the visual 
(e.g., which filters are applicable and the logic behind the calculation).

{: .image-popup}
![Screenshot - Activity Centre Visual Description](/management/telemetry/telemetry-dashboards/ac-info-button.png)

### Organization Usage Activity Center
This tab provides a high-level overview of the consumption within the entire organization and in relation to contracts.
It focuses on five different sections: *KPIs*, *Active Contract Consumption*, *Consumption*, *Projects*, and *Configuration Health*. 

#### KPIs
*KPIs* show four of the metrics specified in the contract in comparison to the limits. For *PPU*, the usage and limit are shown for the period selected in the date range filter. For the others (*Projects*, 
*Users*, and *Storage TB*), the values are for the current month only, and the limits are as defined in the contract. 

{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ac-org-usage-kpis.png)

#### Active Contract Consumption
This option shows three different views of PPU consumption in relation to the contractually agreed values. *PPU* is the actual usage per month. The *Predicted PPU* line is a prediction based on
the average consumption in the last three months. The *PPU Limit* line is the consumption agreed in the contract, which is determined by allocating the same number of credits to each month of 
the contract's tenure.

{: .image-popup}
![Screenshot - Active Contract Consumption](/management/telemetry/telemetry-dashboards/ac-org-usage-contract.png)

This option shows three different views of PPU consumption in relation to the contractually agreed values. *PPU* is the actual usage per month. The *Predicted PPU* line is a prediction based on
the average consumption in the last three months. The *PPU Limit* line is the consumption agreed in the contract, which is determined by allocating the same number of credits to each month of 
the contract's tenure.

#### Consumption
*Consumption* shows three visuals. For the first two, you can drill down by hovering over a point and clicking on it. *PPU Daily* shows daily consumption broken down into groups based on a usage breakdown. 
*PPU Daily per Project* shows the consumption split between projects. The last visual shows the limits and actual values per month.  

{: .image-popup}
![Screenshot - Consumption](/management/telemetry/telemetry-dashboards/ac-org-usage-consumption.png)

#### Projects
*Projects* show the five most demanding components, configurations, and projects. For these four visuals, you can drill down to see a breakdown of consumption by week. There is also a URL that gives direct 
access to the underlying data. For the five most expensive projects, there is also a usage breakdown, which shows what has consumed the credits. Next listed are the most demanding SQL and non-SQL 
transformations, which have consumed most of the credits. The last visual is for the most expensive components. 

{: .image-popup}
![Screenshot - Projects_1](/management/telemetry/telemetry-dashboards/ac-org-usage-projects1.png)

{: .image-popup}
![Screenshot - Projects_2](/management/telemetry/telemetry-dashboards/ac-org-usage-projects2.png)

#### Configuration Health
*Configuration Health* gives the health of flows and jobs over time. By hovering over a day, you can see more detailed data (the numbers of flows or jobs on that day that ended with success, error, or 
warning).

{: .image-popup}
![Screenshot - Configuration Health](/management/telemetry/telemetry-dashboards/ac-org-usage-config-health.png)

### Project Overview
This tab provides visuals focused on PPU consumption and shows the most expensive projects, transformations, configurations, and components. It also shows the configurations, projects, and users whose consumption has increased significantly. It can be filtered by branch (development vs. main).

#### PPU and usage
These four visuals show PPU consumption from different angles. The first focuses on *PPU per Configuration*, differentiating between SQL, KBC, and CDC credits. *PPU Daily* shows a breakdown of PPU 
between component types over the period selected. *Component's Usage* is a treemap and provides an overview of how many jobs were executed for the components. You can drill down for a particular 
configuration or project to see how many credits it consumed. The last visual also shows the credits consumed per component split between SQL, KBC, and CDC credits. 

{: .image-popup}
![Screenshot - PPU and Usage](/management/telemetry/telemetry-dashboards/ac-project-overview-ppu.png)

#### Top 10 
Top 10 has two tables. The first is the *Top 10 Transformations* based on their consumption. It provides details about the runtime and input and output mapping (e.g., whether any filters were applied or 
whether the output was incremental or full load). *Top 10 Component Configurations* shows the most expensive configurations and provides information on how long they ran for. 

{: .image-popup}
![Screenshot - Top 10](/management/telemetry/telemetry-dashboards/ac-project-overview-top10.png)

#### Significant changes (outliers)
*Significant changes* shows outliers for projects, configurations, and users. The tables show the average PPU consumption over the previous 30 days for projects, configurations, or users that consumed
50% more or 50% less on given days. It lists days on which a project billed more than 1 credit. The last column is the percentage of billed credits versus the average. 

{: .image-popup}
![Screenshot - Outliers](/management/telemetry/telemetry-dashboards/ac-project-overview-outliers.png)

### Project Users
The first section provides an *Overview* of users within a project. They can be filtered by branch type and specific user. It shows the user roles, activities, and how many joined the project 
in the last seven days. 

#### Overview
*Users* shows the total number of users per project with limits consistent with those in the organization usage tab. *Active Users* shows the count of users who performed an action within the project during
the selected period. *Users by Role* displays all users in the project according to their role, based on the selected date range, project, and branch type. 

{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-users-overview.png)

The second section, *Activities*, summarizes the users in a project. 

#### Activities
*Activities* summarizes user activity within a selected project. It details how many PPU users consumed and the status of their jobs (*UserJobs PPU*), and measures user activity based on the number of 
configuration changes (*Configuration Updates*). Also, it shows the newly added project members in the last 7 days, along with their details (*Newly Added Users Last 7 Days*).

{: .image-popup}
![Screenshot - Activities](/management/telemetry/telemetry-dashboards/ac-project-users-activities.png)

### Project Health
This tab shows the overall health of a project. It can be filtered by branch (development vs. main). The *Overview* section focuses on flows and jobs. The next section focuses on trends for *Components*, 
and the last section shows four individual metrics: Configurations without a Description*, *Flows without Error Notifications*, *Unused Configurations*, and *Unused Tables*.

#### Overview
*Overview* shows key metrics regarding the health of jobs and flows. *Jobs Error Ratio/Flow Error Ratio* indicates the percentage of jobs that ended in error relative to successful ones, while and *Error 
Jobs/Error Flows* presents the absolute number of jobs that concluded with errors. Additionally, since flows can also end with warnings, two metrics display the percentage and absolute number of flows with 
warning. 

{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-health-overview.png)

Below, two graphs illustrate the health of flows and jobs over time. By hovering over a particular day on the graph, you can view more detailed data, including the number of flows or jobs that ended with 
success, error, or warning on that day.

#### Components
This section provides a more detailed view of the errors. *Error Jobs PPU* displays the number of credits consumed by jobs that ended in error; you can drill down to see further details. *PPU Consumed by Error 
Jobs* shows the trend of credit consumption over time. *Components Errors Trend* examines the errors, split by component type, over time. The last two graphs, *Components Errors* and *Components Error Ratio*, 
present similar information on component errors—the first in absolute values and the second as a percentage.

{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-health-components.png)

#### Configurations, flow notifications, and tables
This section displays important metrics with available drill-downs for all. While these metrics do not indicate immediate issues, they provide insights that could be useful for cleanup exercises. *Configurations 
without Description* shows how many configurations lack a description, making it unclear what the configuration accomplishes. *Flows without Error Notifications* indicates how many flows do not send  
notifications when errors occur, which means errors might go unnoticed unless manually checked. *Unused Configurations* and *Unused Tables* identify configurations and tables that have not been used in any jobs 
or had any imports or exports, respectively, in the last 30 days.

{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-health-config.png)

### Jobs Monitoring
This tab provides the lowest level of detail. It can be filtered on many fields in addition to those mentioned already: Project ID, Component, Component Type, Component Configuration, Configuration ID, 
Job Run Type, Job Status, Token Name, and Flow. By default, it lists only yesterday's jobs whose status was error, warning, or success and only for jobs that were run automatically (Job Run Type is a flow).
The details are shown as a table. 

{: .image-popup}
![Screenshot - Jobs Monitoring](/management/telemetry/telemetry-dashboards/ac-jobs-monitoring.png)

