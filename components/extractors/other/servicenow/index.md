---
title: ServiceNow Extractor
permalink: /components/extractors/other/servicenow/
redirect_from:
    - /extractors/other/servicenow/
---

* TOC
{:toc}

This extractor Fetches data from ServiceNow Tables. It supports back-fill mode and also incremental fetching.

## Prerequisites

The user must have sufficient roles to access the data in the table specified in the request.
You can use [ServiceNow REST API Explorer](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_GetStartedAccessExplorer.html) to try out API calls before setting up this component.

The user is Authenticated using:

1. Username
2. Password

## General Configuration
 - **Username** (user) - [REQ] Username used to log in to ServiceNow.
 - **Password** (#password) - [REQ] Password associated with username.
 - **Server** (server) - [REQ] ServiceNow server address. Example: https://keboola.service-now.com
 - **Threads** (threads) - [OPT] Integer that specifies number of threads used to call ServiceNow API for a single row. Keep in mind that setting this to a high number and combining with parallel row execution can lead to overload of the source system. This can further lead to API returning 5** status codes that will force the extractor to use backoff strategy leading to increased component run times. Default number of threads is 8
 - **Output Bucket** (output_bucket) - [OPT] Name of the output bucket. If the bucket with specified name does not exit, it will be created automatically.


## Row Configuration
 - **Table** (table) - [REQ] Name of the table to be extracted
 - **Sysparm Query** (sysparm_query) - [OPT] Query which will be sent along with get table request. For more information about querying please refer to [Table API documentation](https://developer.servicenow.com/dev.do#!/reference/api/tokyo/rest/c_TableAPI#table-GET).
 - **Sysparm Fields** (sysparm_fields) - [OPT] Using this parameter you can limit fetched fields. Please use comma separation.
 - **Increment** (increment) - [OPT] Set this parameter to true if you want to do incremental load.

{: .image-popup}
![Screenshot - DynamoDB Streams Confguration](/components/extractors/other/servicenow/servicenow_tables_1.png)

When done, **Save** the configuration. 

