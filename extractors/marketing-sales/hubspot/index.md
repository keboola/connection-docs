---
title: HubSpot
permalink: /extractors/marketing-sales/hubspot/
---

* TOC
{:toc}

The HubSpot extractor fetches data from [HubSpot](http://www.hubspot.com/).

HubSpot is inbound marketing and sales software that helps companies attract visitors, convert leads, and close customers.

## Create New Configuration
Before you start, have a working HubSpot account and get a HubSpot API Key.

### Application API Key

Login to [HubSpot](http://www.hubspot.com/) and in top right corner click on the arrow next to your avatar. Then select **Integrations**.

{: .image-popup}
![HubSpot Logged Menu](/extractors/marketing-sales/hubspot/03-logged-menu.jpg)

On the following screen, click on **Get your HubSpot API Key**.

{: .image-popup}
![HubSpot Integrations](/extractors/marketing-sales/hubspot/04-integrations.jpg)

Then click on the biggest blue button in the world. It will reveal your API Key.

{: .image-popup}
![HubSpot API](/extractors/marketing-sales/hubspot/05-key.png)

You can easily copy it to your clipboard.

{: .image-popup}
![HubSpot API](/extractors/marketing-sales/hubspot/05-key-clipboard.png)

### Setup Extractor
In the Extractors section, find HubSpot and create a new configuration.

{: .image-popup}
![HubSpot New Configuration](/extractors/marketing-sales/hubspot/01-new-configuration.png)

Provide your **API key**.

{: .image-popup}
![HubSpot Credentials](/extractors/marketing-sales/hubspot/02-credentials.png)

And finally, select one of the data mapping **templates** and click on **Save configuration**.

{: .image-popup}
![HubSpot Data Mapping](/extractors/marketing-sales/hubspot/06-template.png)

## Extraction Output Tables

### 1 --- Companies
This table contains all companies stored in HubSpot.

| Column | Description |
| `company_id` [PK] | Integer representation of the unique identifier for a company |
| `name` | Name of the company |
| `website` | Website of the company |
| `created_date` | Timestamp of the company created date in milliseconds |
| `last_updated_date` | Timestamp of the company last updated date in milliseconds |

### 2 --- Contacts
This table contains all contacts stored in HubSpot.

| Column | Description |
| `contact_id` [PK] | Integer representation of the unique identifier for a contact |
| `first_name` | First name of the contact |
| `last_name` | Last name of the contact |
| `profile_url` | Link to the contact's profile in HubSpot |

### 3 --- Companies_contacts
This table defines which contacts belong to which companies (M:N).

| Column | Description |
| `company_id` [PK] | Company identifier |
| `contact_id` [PK] | Contact identifier |

### 4 --- Deals
This table contains information about deals in HubSpot.

| Column | Description |
| `deal_id` [PK] | Integer representation of the unique identifier for a check |
| `name` | Name of the deal |
| `owner_id` | Owner identifier |
| `company_id` | Company identifier |
| `pipeline_id` | Pipeline identifier |
| `stage_id` | Stage identifier |
| `type` | Type of the deal (new business, existing business, ...) |
| `amount` | Deal value |
| `created_date` | Timestamp of the deal created date in milliseconds |
| `last_updated_date` | Timestamp of the deal last updated date in milliseconds |
| `closed_date` | Timestamp of the deal closed date in milliseconds |

### 5 --- Owners
This table contains all owners stored in HubSpot:

| Column | Description |
| `owner_id` [PK] | Integer representation of the unique identifier for an owner |
| `first_name` | First name of the owner |
| `last_name` | Last name of the owner |
| `email` | Email of the owner |
| `type` | Type of the owner (i.e. Person) |

### 6 --- Pipelines
This table contains all HubSpot deal pipelines.

| Column | Description |
| `pipeline_id` [PK] | Integer representation of the unique identifier for a pipeline |
| `label` | Pipeline name |

### 7 --- Stages
This table contains all HubSpot deal stages.

| Column | Description |
| `stage_id` [PK] | Integer representation of the unique identifier for a stage |
| `pipeline_id` | Pipeline identifier |
| `label` | Name of the stage |
