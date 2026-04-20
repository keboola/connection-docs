---
title: Telemetry Data
permalink: /components/extractors/other/telemetry-data/
redirect_from:
    - /extractors/other/telemetry-data/

---

<!-- Table definitions, column descriptions, and diagram relationships are all maintained
     in a single file: _data/telemetry_tables.yml
     The Liquid template that renders each table is: _includes/telemetry-table.html -->

* TOC
{:toc}

***Note:** Initially, the Keboola platform was referred to as Keboola Connection (KBC). While it is now simply known as Keboola, references to "Connection" or the
abbreviation "KBC" might still appear in table names, column names, etc.*

The Telemetry Data connector allows you to retrieve data about your project or your entire [organization](/management/organization/).
It helps you monitor activities and usage in your Keboola projects. It also aids Keboola in calculating your project's consumption.

If you don't need to work directly with the data or would like to see it in graphical form in Keboola, you can check the [Telemetry Dashboards](/management/telemetry/telemetry-dashboards).

## Configuration
To configure the data source connector, select one of the following modes:

1. [**Project mode**](#project-mode-tables): Extracts data only from a selected Keboola project.
2. [**Organization mode**](#organization-mode-tables): Extracts data from all projects within your organizations. The data is compiled into a single target project. This must be set up by Keboola. After configuring the connector, contact your Keboola Account Manager or our [support team](/management/support/).
3. [**Activity Center mode**](#activity-center-mode-tables): Extracts data from all projects within your organizations. The data is compiled into a single target project. This mode is available to customers who have the **Activity Center add-on** in their contract and also must be set up by Keboola. After configuring the connector, contact your Keboola Account Manager or our [support team](/management/support/).

## Data Model
The interactive model below helps you understand relations between individual tables extracted by this component.
Use the toolbar to filter tables by mode, switch layout direction, and expand tables to see their columns. You can zoom with the scroll wheel, pan by dragging the background, and drag individual tables to rearrange them.

<div id="diagram-viewer"></div>

<script src="https://unpkg.com/d3@7/dist/d3.min.js"></script>
<script src="https://unpkg.com/elkjs@0.9.3/lib/elk.bundled.js"></script>
<script>
window.TELEMETRY_DIAGRAM = {{ site.data.telemetry_tables | jsonify }};
</script>
<script src="/assets/js/diagram-viewer.js"></script>

## Project Mode Tables
The extracted tables provide you with information about your buckets, configurations, branches, jobs, AI agent and MCP interactions, sandboxes, projects, users, and security events.

{% assign sorted_tables = site.data.telemetry_tables.tables | sort: "id" %}
{% for table in sorted_tables %}{% if table.mode == "project" %}
{% include telemetry-table.html table=table %}
{% endif %}{% endfor %}

## Organization Mode Tables
In addition to the tables provided to you by [Project Mode](#project-mode-tables), this mode adds information about your organizations, outlines the limits of your contracts, and includes a table with usage metrics. This table can be used as a common dimension for both contract limits and metric values.

{% for table in sorted_tables %}{% if table.mode == "organization" %}
{% include telemetry-table.html table=table %}
{% endif %}{% endfor %}

## Activity Center Mode Tables
In addition to the tables provided to you by [Organization Mode](#organization-mode-tables), this mode adds information about columns, flows, notifications, schedules, storage metadata, tokens, transformations, triggers, user activity, and workspaces.

{% for table in sorted_tables %}{% if table.mode == "activity_center" %}
{% include telemetry-table.html table=table %}
{% endif %}{% endfor %}

## dst_ Columns
Columns with the **dst_** prefix are system columns used in Telemetry Data connector executions. They are **not** related to the data itself.

## Data Recency
You can obtain telemetry data for your project that is approximately 4-8 hours old when running the connector.

*Note: This is not guaranteed, as the raw data is processed before reaching the connector's source; therefore delays in processing might occur.*
