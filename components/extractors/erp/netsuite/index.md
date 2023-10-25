---
title: NetSuite
permalink: /components/extractors/erp/netsuite/
---

* TOC
{:toc}

NetSuite Data Source enables the user to download data from NetSuite using
the [SuiteAnalytics Connect Service](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_3963845427.html). Leveraging the ODBC driver, this extractor provides the same capabilities as other Keboola Connection database
extractors, including incremental fetching.

## Prerequisites

[SuiteAnalytics Connect Service](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_3996274388.html)
**must be enabled for your account.**  Find more information in
the [official documentation](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_1555594476.html)

## Configuration

### Authorization & Credentials

First it is necessary to setup the connection parameters in the [Credentials section](https://help.keboola.com/components/extractors/database/sqldb/#initial-setup). The `Account ID` and `Role ID` variables correspond to your account ID and role ID. These values as well as hostname and
role are available on the SuiteAnalytics Connect Driver Download page under Your Configuration. You can access the
SuiteAnalytics Connect Driver Download page using the Set Up Analytics Connect link in the Settings portlet when you are
logged in to NetSuite. For more information,
see [Finding Your Settings Portlet](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/bridgehead_1493644302.html)
.

### Row / Table Configuration

The configuration concepts are same as for
standard [SQL DB Data Sources](https://help.keboola.com/components/extractors/database/sqldb/)

You may select specific columns and tables to be downloaded, or switch to `Advanced mode` to provide a custom query.
Data may be imported incrementally using `incremental fetching` feature, allowing the user to only retrieve new or
updated data from their NetSuite account.