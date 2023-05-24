---
title: Okta
permalink: /components/extractors/other/okta/
redirect_from:
    - /extractors/other/okta/
---

* TOC
{:toc}

This extractor fetches data from [Okta](https://www.okta.com/). It supports backfill mode and also incremental fetching.

## Prerequisites
Before you start, get an Okta API token. To find out how to obtain the token, go to the [Okta docs](https://developer.okta.com/docs/guides/create-an-api-token/main).

## Supported Endpoints
  - users
 - user_types
 - devices

## General Configuration
 - **Organization URL** (org_url) – [REQ] Example: keboola.okta.com
 - **API Token** (#api_token) – [REQ] API key to authenticate the connection with Okta


## Row Configuration
 - **Endpoint** (endpoint) – [REQ] Endpoint of Okta from which data will be fetched.
 - **Search** (search) – [OPT] Refer to the [Okta docs](https://developer.okta.com/docs/reference/api/users/#list-users-with-search) for query syntax.
 - **Sync Mode** (sync_mode) – [OPT] Full sync downloads all data from the source on every run; incremental sync downloads data updated since the last run.
 - **Storage Table Name** (output_table_name) – [REQ] Name of the table stored in Storage.
 - **Load Type** (load_type) – [REQ] If full load is used, the destination table will be overwritten on every run. If incremental load is used, data will be upserted into the destination table. Tables with a primary key will have rows updated, and tables without a primary key will have rows appended.

When done, **save** the configuration. 
