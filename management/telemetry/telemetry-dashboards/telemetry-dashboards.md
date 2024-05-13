---
title: Telemetry Dashboards
permalink: /management/telemetry/telemetry-dashboards/
---

* TOC
{:toc}

To get to all three telemetry dashboards, click the top right corner of the profile picture. The [Project Consumption](#project-consumption) dashboard is always available. If you check with the Account Manager, 
[Organization Usage](#organization-usage) or [Activity Center](#activity-center) might also be available. If you get this available, you are in the right project.

## Project Consumption
{: .image-popup}
![Screenshot - Project Consumption Dashboard](/management/telemetry/telemetry-dashboards/project-consumption.png)

The dashboard has been filtered by default for the last 6 months; however, the Date range at the top of the dashboard can be changed. 

In the *KPIs* section, the overall statistics of the Keboola project are presented. Some are self-explanatory (e.g., *Consumed Credits*, *Number of Jobs*), and the explanation for others can be found under 
the question mark or here. *Error Jobs Ratio* shows the percentage of error jobs in the total number of jobs run. *Active Flows* show several flows with jobs starting in the selected date range. 
*Active Component Configurations* is similar to the active flows, showing how many configurations have a job started in the selected date range, and the same applies to *Active Transformations*.

*Credit History* shows the evolution of consumed credits over time. Trends at the bottom of the print screen show the monthly evolution of consumption broken into component types (bar chart) and the error jobs and total jobs. 

## Organization Usage
The dashboard is filtered for the last six months, which can be adjusted. It shows data for the whole Keboola organization (if there are more projects for the account, it will show data for all; 
if there is only one, it will show the data for only one project). 

### KPIs
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ou-kpis.png)

*KPIs* show four of the numbers agreed in the contract in relation to the limits. For PPU, the usage and limit are shown for the period selected in the Date range filter. For the others, for Projects, Users, and 
Storage TB, this value is for the current month, and the limits are as defined in the contract. 

### Active Contract Consumption
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ac-org-usage-contract.png)

*Active Contract Consumption* shows three different views on PPU consumption in relation to contractually agreed values. PPU shows the actual usage per month. The PPU Predicted line shows the value predicted 
based on the average consumption in the last three months. The PPU limit line shows the consumption agreed in the contract, allocating the same value of credits to each month of contract tenure.

### Consumption
{: .image-popup}
![Screenshot - Consumption](/management/telemetry/telemetry-dashboards/ou-consumption.png)

*Consumption* shows three visuals. The first two have drill available once you hover over and click on the desired point. PPU Daily shows daily consumption broken down into groups based on usage breakdown. 
*PPU Monthly* shows the same information but aggregates it per month. The last visual shows the limits and actual consumption per month.    

### Projects
{: .image-popup}
![Screenshot - Projects_1](/management/telemetry/telemetry-dashboards/ou-project1.png)

{: .image-popup}
![Screenshot - Projects_2](/management/telemetry/telemetry-dashboards/ou-project2.png)

*Projects* show the five most demanding components, configurations, and projects. These four visuals provide the drill that breaks down the consumption into weeks and provides a URL so this can be accessed 
directly. The five most expensive projects also show the usage breakdown—what consumes the credits. The most demanding transformation shows the SQL and non-SQL transformations consuming the most of the credits. 
The last visual then shows the most expensive components. 

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

Once this is clicked, the *Activity Center* opens. It consists of five tabs, each focused on a different part of consumption monitoring. These tabs are available by default for all projects in the organization 
but can be filtered for specific ones. It also allows filtering for dates. This is the default setup for the last three months (it takes two months back and the current, any day in May it takes data from 1st 
March until today), except *Jobs Monitoring*, which provides detailed information on individual jobs, so it is only showing yesterday's data by default. All of these filters can be changed. Some visuals provide 
a drill to see what the one-level lower detail is. It is visible when hovering over in the case of graphical representation, and in the case of one number, the drill is available when it is understriked. Each 
visual has a question mark in the top right corner when hovering over it. When this question mark is clicked on, it will describe the visual (e.g., which filters apply to this and the logic behind the 
calculation).

{: .image-popup}
![Screenshot - Activity Centre Visual Description](/management/telemetry/telemetry-dashboards/ac-info-button.png)


### Organization Usage Activity Center
This tab provides highlevel overview on the consumption within the whole organization and in relation to contract. 
In details it focus on five different section - KPIs, Active Contract Consumption, Consumption, Projects and Configuration Health. 

#### KPIs
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ac-org-usage-kpis.png)

KPIs shows four of the numbers that are agreed in contract with relation to the limits. For PPU the usage and limit are shown for the period selected in Date range filter, for the others for Projects, Users, Storage TB this value is for current month and the limits are as defined in contract. 

#### Active Contract Consumption
{: .image-popup}
![Screenshot - KPIs](/management/telemetry/telemetry-dashboards/ac-org-usage-contract.png)

Shows three different views on PPU consumption in relation to contractually agreed values.  PPU shows the actual usage per month. PPU Predicted line shows the value predicted based on the average consumption in the last 3 months. PPU limit line shows the consumption agreed in the contract, allocates the same value of credits into each month of contract tenure.

#### Consumption
{: .image-popup}
![Screenshot - Consumption](/management/telemetry/telemetry-dashboards/ac-org-usage-consumption.png)

Consumption shows three visual where first two have drill available once hover over and click on the desired point. PPU Daily shows daily consumption broken down into groups based on usage breakdown. PPU Daily per Project shows the consumption split between projects. The last visual shows the limits and actual values per month.  

#### Projects
{: .image-popup}
![Screenshot - Projects_1](/management/telemetry/telemetry-dashboards/ac-org-usage-projects1.png)

{: .image-popup}
![Screenshot - Projects_2](/management/telemetry/telemetry-dashboards/ac-org-usage-projects2.png)

Projects shows 5 most demanding components, configurations and projects. All of these four visuals provide the drill that breaks down the consumption into weeks and provides url so this can be access directly. Five most expensive projects also shows the usage breakdown - what consume the credits. Most demanding transformation shows the SQL and non-SQL transformations consuming the most of the credits. Last visual then show the most expensive components. 

#### Configuration Health
{: .image-popup}
![Screenshot - Configuration Health](/management/telemetry/telemetry-dashboards/ac-org-usage-config-health.png)

Configuration Health shows the flows and jobs health over time. Whe hover over it is possible to see more detailed data (precise number of flows/jobs at a certain day that ended with success/error/warning).

### Project Overview
This tab provides visuals focused on the PPU consumption and shows the most expensive projects, transformations, configurations and components. It also shows the configurations, projects and users whose consumption increased significantly. It can be filtered for the branch (development vs. main).

#### PPU and usage
{: .image-popup}
![Screenshot - PPU and Usage](/management/telemetry/telemetry-dashboards/ac-project-overview-ppu.png)

These four visuals show the PPU consumption from different angles. First one focus on PPU usage per configuration with differentiation between SQL, KBC and CDC credits. PPU Daily is showing the breakdown of PPU between component type over time selected. Treemap of configuration usage provides overview based on how many jobs were executed for component. In the drill it can also be found the particular configuration, project and also how many credits were consumed. Last visual it is addition to the treemap as it shows credit consumption per component and it split between SQL, KBC and CDC credits. 

#### Top 10 
{: .image-popup}
![Screenshot - Top 10](/management/telemetry/telemetry-dashboards/ac-project-overview-top10.png)

First of two tables focuses on Top 10 transformation based on their consumption and providing more details on the runtime and input and output mapping (e.g. whether there are any filters applied or if the output is incremental or full load). Top 10 Component Configurations shows the most expensive Configuration with information on how long these ran. 

#### Significant changes (outliers)
{: .image-popup}
![Screenshot - Top 10](/management/telemetry/telemetry-dashboards/ac-project-overview-outliers.png)

Last part of the Significant changes shows the outliers for Projects, Configurations and Users. All the table shows averarage PPU consumption in the last 30 days and only shows projects, configurations or user that consumed on given days 50% more or 50% less than the average and also it bills more than 1 credit. The percentage is shown in the last column. 

### Project Users
This tab provides overview of users within the projects. It allowes to be filtered also based on branch type and specific user. 
It shows the user roles, activities and who joined the projects in last 7 days. 

#### Overview
{: .image-popup}
![Screenshot - Project Users Overview](/management/telemetry/telemetry-dashboards/ac-project-users-overview.png)

This part summarizes the users in the project. 

#### Activities
{: .image-popup}
![Screenshot - Activities](/management/telemetry/telemetry-dashboards/ac-project-users-activities.png)

### Project Health
This tab is focused on overall health in the projects. It can be filtered for the branch (development vs. main).
In the overview part it focus on the flows and jobs, next part focus on components trends and the last shows four individual metrics - configuration without description, flows without error notifications, unused configurations and unused tables.

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

This tab provides the lowest detailed. It allows to filter based on many different fields (additional to those mentioned already - Project ID, Component, Component Type, Component Configuration, Configuration ID, Job Run Type, Job Status, Token Name and Flow) and by default it is filtered for only yesterday's jobs, with status as error, warning and success and only for the jobs that are run automatically (Job Run Type = orchestration). 
It shows all these details together in a table. 
