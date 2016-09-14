---
title: HubSpot
permalink: /extractors/hubspot/
---

* TOC
{:toc}

This HubSpot extractor fetches data from [HubSpot](http://www.hubspot.com/).

HubSpot is inbound marketing and sales software that helps companies attract visitors, convert leads, and close customers.

## Configuring Extractor

### Create New Application API Key

Log in to your account on the [HubSpot](http://www.hubspot.com/) site.

### Setup Extractor
In the Extractors section, find HubSpot and create a new configuration.

{: .image-popup}
![HubSpot New Configuration](/extractors/hubspot/01-new-configuration.png)

Provide **API key**

{: .image-popup}
![HubSpot Credentials](/extractors/hubspot/02-credentials.png)

And finally, select one of the data mapping **templates** and click on **Save configuration**.

{: .image-popup}
![HubSpot Data Mapping](/extractors/hubspot/06-template.png)

## Extraction Output Tables

### 1 -- Companies

This table contains all companies stored in HubSpot

| Column | Description |
| `company_id` [PK] | Integer representation of the unique identifier for the company |
| `name` | Name of the company |
| `website` | Website of the company |
| `created_date` | Timestamp of company created date in milliseconds |
| `last_updated_date` | Timestamp of company last updated date in milliseconds |

### 2 -- Contacts

All contacts stored in HubSpot:

| Column | Description |
| `contact_id` [PK] | Integer representation of the unique identifier for the contact |
| `first_name` | First name of contact |
| `last_name` | Last name of contact |
| `profile_url` | Link to contact's profile in HubSpot |

### 3 -- Companies_contacts

Defines which contacts belong to which companies (M:N):

| Column | Description |
| `company_id` [PK] | Company identifier |
| `contact_id` [PK] | Contact identifier |

### 4 -- Deals

Information about deals in HubSpot:

| Column | Description |
| `deal_id` [PK] | Integer representation of the unique identifier for the check |
| `name` | Name of the deal |
| `owner_id` | Owner identifier |
| `company_id` | Company identifier |
| `pipeline_id` | Pipeline identifier |
| `stage_id` | Stage identifier |
| `type` | Type of the deal (new business, existing bussines, ...) |
| `amount` | Deal value |
| `created_date` | Timestamp of deal created date in milliseconds |
| `last_updated_date` | Timestamp of deal last updated date in milliseconds |
| `closed_date` | Timestamp of deal closed date in milliseconds |

### 5 -- Owners

Owners stored in HubSpot:

| Column | Description |
| `owner_id` [PK] | Integer representation of the unique identifier for the owner |
| `first_name` | First name of the owner |
| `last_name` | Last name of the owner |
| `email` | Email of the owner |
| `type` | Type of the owner (i.e. Person) |

### 6 -- Pipelines

HubSpot deal pipelines:

| Column | Description |
| `pipeline_id` [PK] | Integer representation of the unique identifier for the pipeline |
| `label` | Pipeline name |

### 7 -- Stages

HubSpot deal stages:

| Column | Description |
| `stage_id` [PK] | Integer representation of the unique identifier for the stage |
| `pipeline_id` | Pipeline identifier |
| `label` | Name of the stage |
