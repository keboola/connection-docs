---
title: Telemetry Dashboards
permalink: /management/telemetry/telemetry-dashboards/
---

* TOC
{:toc}

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
The dashboard is filtered for the last six months, which can be adjusted. It shows data for the whole Keboola organization. If there are several projects for an account, it will show data for all of them. 
If there is only one, it will show the data for that project. 

### KPIs
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ou-kpis.png)

*KPIs* show four of the metrics specified in the contract in comparison to their limits. For PPU, the usage and limit are shown for the period selected in the date range filter. For the others (Projects, 
Users, and Storage TB), the values are for the current month only, and the limits are as defined in the contract. 

### Active Contract Consumption
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ac-org-usage-contract.png)

*Active Contract Consumption* shows three different views of PPU consumption in relation to the contractually agreed values. *PPU* is the actual usage per month. The *Predicted PPU* line is a prediction 
based on the average consumption in the last three months. The *PPU Limit* line is the consumption agreed in the contract, which is determined by allocating the same nemuber of credits to each month of the 
contract's tenure.

### Consumption
{: .image-popup}
![Screenshot - Consumption](/management/telemetry/telemetry-dashboards/ou-consumption.png)

*Consumption* shows three visuals. For the first two, you can drill down by hovering over a point and clicking on it. *PPU Daily* shows daily consumption broken down into groups based on a usage breakdown. 
*PPU Monthly* shows the same information but aggregated by month. The last visual shows the limits and actual consumption per month.    

### Projects
{: .image-popup}
![Screenshot - Projects_1](/management/telemetry/telemetry-dashboards/ou-project1.png)

{: .image-popup}
![Screenshot - Projects_2](/management/telemetry/telemetry-dashboards/ou-project2.png)

*Projects* show the five most demanding components, configurations, and projects. For these four visuals, you can drill down to see a breakdown of consumption by week. There is also a URL that gives
direct access to the underlying data. For the five most expensive projects, there is also a usage breakdown, which shows what has consumed the credits. Next listed are the most demanding SQL and non-SQL 
transformations, which have consumed most of the credits. The last visual is for the most expensive components. 

### Configuration Health
{: .image-popup}
![Screenshot - Configuration Health](/management/telemetry/telemetry-dashboards/ou-config-health.png)

*Configuration Health* shows the health of flows and jobs over time. By hovering over it, you can see more detailed data (the precise number of flows/jobs on a certain day that ended with success/error/warning).

## Activity Center
*Activity Center* provides the most detailed insight into telemetry data from the three modes available. It is not available by default but has to be requested. The customer needs to contact their account 
manager and share with them which project they want Activity Center in (i.e., target project, which can be only one project). Once the Activity Center is enabled for the customer under the profile picture below, 
it will be visible to people with access to the target project.

{: .image-popup}
![Screenshot - Activity Centre in KBC](/management/telemetry/telemetry-dashboards/activity-centre-kbc.png)

Once you select this option, the *Activity Center* opens. It consists of five tabs, each focused on a different part of consumption monitoring. These tabs are available by default for all projects in the 
organization but can be filtered for specific ones. It also allows filtering for dates. This is the default setup for the last three months (it takes two months back and the current, any day in May it takes data 
from 1st March until today), except *Jobs Monitoring*, which provides detailed information on individual jobs, so it is only showing yesterday's data by default. 

All of these filters can be changed. Some visuals provide a drill to see what the one-level lower detail is. It is visible when hovering over in the case of graphical representation, and in the case of one 
number, the drill is available when it is understriked. Each visual has a question mark in the top right corner when hovering over it. When you click this question mark, it will describe the visual (e.g., which 
filters apply to this and the logic behind the calculation).

{: .image-popup}
![Screenshot - Activity Centre Visual Description](/management/telemetry/telemetry-dashboards/ac-info-button.png)

### Organization Usage Activity Center
This tab provides a high-level overview of the consumption within the entire organization and in relation to contracts.
It focuses on five different sections: *KPIs*, *Active Contract Consumption*, *Consumption*, *Projects*, and *Configuration Health*. 

#### KPIs
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ac-org-usage-kpis.png)

*KPIs* show four numbers agreed in the contract relative to the limits. For PPU, the usage and limit are shown for the period selected in the Date range filter. For the others (Projects, Users, and 
Storage TB), this value is for the current month, and the limits are as defined in the contract. 

#### Active Contract Consumption
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ac-org-usage-contract.png)

This option shows three views on PPU consumption relative to contractually agreed values. PPU shows the actual consumption per month. The PPU Predicted line shows the value predicted based 
on the average consumption in the last three months. The PPU limit line shows the consumption agreed in the contract, allocating the exact value of credits to each month of contract tenure.

#### Consumption
{: .image-popup}
![Screenshot - Consumption](/management/telemetry/telemetry-dashboards/ac-org-usage-consumption.png)

*Consumption* shows three visuals. The first two have drills available once you hover over and click on the desired point. PPU Daily shows daily consumption broken down into groups based on usage breakdown. PPU 
Daily per Project shows the consumption split between projects. The last visual shows the limits and actual values per month.  

#### Projects
{: .image-popup}
![Screenshot - Projects_1](/management/telemetry/telemetry-dashboards/ac-org-usage-projects1.png)

{: .image-popup}
![Screenshot - Projects_2](/management/telemetry/telemetry-dashboards/ac-org-usage-projects2.png)

*Projects* shows the five most demanding components, configurations, and projects. These four visuals provide the drill that breaks down the consumption into weeks and provides a URL so this can be accessed 
directly. The five most expensive projects also show the usage breakdown—what consumes the credits. The most demanding transformation shows the SQL and non-SQL transformations that consume the most of the 
credits. The last visual then shows the most expensive components. 

#### Configuration Health
{: .image-popup}
![Screenshot - Configuration Health](/management/telemetry/telemetry-dashboards/ac-org-usage-config-health.png)

*Configuration Health* shows the health of flows and jobs over time. By hovering over it, you can see more detailed data (the precise number of flows/jobs on a certain day that ended with success/error/warning).

### Project Overview
This tab provides visuals focused on PPU consumption and shows the most expensive projects, transformations, configurations, and components. It also shows the configurations, projects, and users whose consumption has increased significantly. It can be filtered for the branch (development vs. main).

#### PPU and usage
{: .image-popup}
![Screenshot - PPU and Usage](/management/telemetry/telemetry-dashboards/ac-project-overview-ppu.png)

These four visuals show the PPU consumption from different angles. The first focuses on PPU usage per configuration, differentiating between SQL, KBC, and CDC credits. PPU Daily shows the breakdown of PPU 
between component types over time selected. A configuration usage treemap provides an overview of how many jobs were executed for the components. In the drill, the particular configuration, project, and how many 
credits were consumed can also be found. The last visual is in addition to the treemap, as it shows credit consumption per component and is split between SQL, KBC, and CDC credits. 

#### Top 10 
{: .image-popup}
![Screenshot - Top 10](/management/telemetry/telemetry-dashboards/ac-project-overview-top10.png)

The first of two tables focuses on the top ten transformations based on their consumption. It provides more details on the runtime and input and output mapping (e.g., whether any filters are applied or 
the output is incremental or full load). The top 10 Component Configurations show the most expensive configurations and provide information on how long they ran. 

#### Significant changes (outliers)
{: .image-popup}
![Screenshot - Top 10](/management/telemetry/telemetry-dashboards/ac-project-overview-outliers.png)

The last part of the significant changes shows the outliers for Projects, Configurations, and Users. All the tables show average PPU consumption in the previous 30 days and only show projects, configurations, or 
users that consumed 50% more or 50% less on given days. It also bills more than one credit. The percentage is shown in the last column. 

### Project Users
This tab provides an overview of users within the projects and allows them to be filtered by branch type and specific user. It shows the user roles, activities, and who joined the projects in the last seven days. 

#### Overview
{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-users-overview.png)

This part summarizes the users in the project. 

#### Activities
{: .image-popup}
![Screenshot - Activities](/management/telemetry/telemetry-dashboards/ac-project-users-activities.png)

### Project Health
This tab shows the overall health of the projects. It can be filtered for the branch (development vs. main). The overview section focuses on the flows and jobs. The next section focuses on component trends, 
and the last section shows four individual metrics: configuration without description, flows without error notifications, unused configurations, and unused tables.

#### Overview
{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-health-overview.png)

#### Components
{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-health-components.png)

#### Configurations, flow notifications, and tables
{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-health-config.png)

### Jobs Monitoring
{: .image-popup}
![Screenshot - Jobs Monitoring](/management/telemetry/telemetry-dashboards/ac-jobs-monitoring.png)

This tab provides the lowest detail. It allows filtering based on many fields (in addition to those mentioned already: Project ID, Component, Component Type, Component Configuration, Configuration ID, 
Job Run Type, Job Status, Token Name, and Flow). By default, it is filtered for only yesterday's jobs, with status as error, warning, and success, and only for the jobs that are run automatically (Job Run Type = 
a flow). It shows all these details together in a table. 
