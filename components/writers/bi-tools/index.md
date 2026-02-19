---
title: Business Intelligence
permalink: /components/writers/bi-tools/
redirect_from:
    - /writers/bi-tools/

---

Data destination connectors export data from Keboola to external systems. The following data destination connectors
allow to push data to various business intelligence platforms:

- [GoodData](/components/writers/bi-tools/gooddata/) --- writes tables to [GoodData](https://www.gooddata.com/) and optionally also manages the GoodData project LDM.
- [Looker](/components/writers/bi-tools/looker/) --- writes tables to [Looker](https://looker.com/)
- [Tableau](/components/writers/bi-tools/tableau/) --- writes tables to [Tableau](https://www.tableau.com/) TDE files, which can be downloaded or uploaded to Dropbox, Google Drive or Tableau Server. You can also use the [Snowflake writer](/components/writers/database/snowflake/) to send data into Tableau.
- [ThoughtSpot](/components/writers/bi-tools/thoughtspot) --- writes tables to [ThoughtSpot](https://www.thoughtspot.com/product).
- And more

A number of BI and Analytics tools are also accessible via the [Data Gateway](/components/applications/data-gateway/) component, which is providing read only access to the data to third-party applications supporting Snowflake as a data source.

Users with access to Snowflake or BigQuery [workspaces](/workspace/) can utilize [read-only access to storage](/transformations/mappings/#read-only-input-mapping) to query the data in Storage directly. Or load data to created workspace by using [Snowflake](/components/writers/database/snowflake/) or [BigQuery](/components/writers/database/bigquery/) data destination connectors.