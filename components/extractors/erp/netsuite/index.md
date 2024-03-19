---
title: NetSuite
permalink: /components/extractors/erp/netsuite/
---

* TOC
{:toc}

The data source for NetSuite enables users to download data from NetSuite using
the [SuiteAnalytics Connect Service](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_3963845427.html). 
Leveraging the ODBC driver, this data source connector provides the same capabilities as other Keboola database data source connectors, including incremental fetching.

## Prerequisites

[SuiteAnalytics Connect Service](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_3996274388.html) must be **enabled** for your account. 
Find more information in the [official documentation](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_1555594476.html).

## Configuration

### Authorization and Credentials

First, it is necessary to set up the connection parameters in the [Credentials section](https://help.keboola.com/components/extractors/database/sqldb/#initial-setup). 
The `Account ID` and `Role ID` variables correspond to your account ID and role ID. These values, along with the hostname and role, are available on the SuiteAnalytics Connect Driver Download page 
under Your Configuration. 

You can access the SuiteAnalytics Connect Driver Download page using the Set Up Analytics Connect link in the Settings portlet when you are logged in to NetSuite. 
For more information, see [Finding Your Settings Portlet](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/bridgehead_1493644302.html).

### Row or Table Configuration

The configuration concepts are the same as for standard [SQL DB data sources](https://help.keboola.com/components/extractors/database/sqldb/).

You may select specific columns and tables to be downloaded, or switch to `Advanced mode` to provide a custom query. Data may be imported incrementally using the `incremental fetching` feature, 
allowing the user to retrieve only new or updated data from their NetSuite account.

Custom query notice: *"Due to Oracle SQL syntax working internally with NetSuite Analytics, you should use Oracle SQL syntax when creating SuiteQL queries. Although SuiteQL supports ANSI SQL-92, there is a risk of critical performance issues, such as time outs that are not operationally remediable, that may occur if a SuiteQL is converted to SQL. This approach helps avoid the worst performance scenario, regardless of other factors."* [Netsuite documentation](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_0824094533.html#SuiteQL-Performance-and-Best-Practices)
