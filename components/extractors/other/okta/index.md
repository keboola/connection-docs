---
title: Okta Extractor
permalink: /components/extractors/other/okta/
redirect_from:
    - /extractors/other/okta/
---

* TOC
{:toc}

This extractor fetches data from [Okta](https://www.okta.com/). It supports backfill mode and also incremental fetching.

## Prerequisites

- Okta API token

You can find out how to obtain the API token in [Okta docs](https://developer.okta.com/docs/guides/create-an-api-token/main).

## Supported endpoints
 
 - users
 - user_types
 - devices

## General Configuration
 - **Organization url** (org_url) - [REQ] Example: keboola.okta.com
 - **API Token** (#api_token) - [REQ] API Key to Authenticate the connection with Octa.


## Row Configuration
 - **Endpoint** (endpoint) - [REQ] Endpoint of Octa from which data will be fetched.
 - **Search** (search) - [OPT] Refer to [Okta docs](https://developer.okta.com/docs/reference/api/users/#list-users-with-search) for query syntax.
 - **Sync Mode** (sync_mode) - [OPT] Full Sync downloads all data from the source every run, Incremental Sync downloads data updated since the last run time.
 - **Storage Table Name** (output_table_name) - [REQ] Name of the table stored in Storage.
 - **Load Type** (load_type) - [REQ] If Full load is used, the destination table will be overwritten every run. If incremental load is used, data will be upserted into the destination table. Tables with a primary key will have rows updated, tables without a primary key will have rows appended.

When done, **save** the configuration. 