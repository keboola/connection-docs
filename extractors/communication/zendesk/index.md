---
title: Zendesk
permalink: /extractors/communication/zendesk/
---

* TOC
{:toc}

This extractor fetches data from [Zendesk](https://www.zendesk.com/).


## Configuring Extractor
Before you start, have a working Zendesk account and get an API Token.

### Create New Application API Token

Log in to your account on the [Zendesk](https://www.zendesk.com/) site.

Go to **Admin / Channels / API**, and use the **add new token** link.

{: .image-popup}
![Zendesk API token list](/extractors/communication/zendesk/01-zendesk-api.png)

Fill a **label** for the new token (for example, `Keboola Zendesk Extractor`) and click the **Create** button.

{: .image-popup}
![Zendesk Token registration](/extractors/communication/zendesk/02-zendesk-api-form.png)

When the registration is finished, take a note of the API Key and save it. You will need it when creating your extractor configuration in KBC.

{: .image-popup}
![Zendesk API token](/extractors/communication/zendesk/03-zendesk-api-key.png)

### Set Up Extractor
In the Extractors section, find Zendesk and create a new configuration.

{: .image-popup}
![Zendesk New configuration](/extractors/communication/zendesk/04-new-configuration.png)

Provide information about your Zendesk Account and API token.

- **Your Zendesk domain**
- **User Email** -- your Zendesk user email
- **Token** -- Zendesk API Token

{: .image-popup}
![Zendesk Credentials](/extractors/communication/zendesk/05-credentials.png)

You can choose between two templates --- *Tickets with Comments* and *Tickets without Comments*. The latter one will get only the initial ticket
and not the other responses to it. It is much quicker though. Also note that some of the tables described below may not be extracted if there is
no data for it.

**Save** and click **Run Extraction**.

## Extraction Output Tables

### 1 -- Tags

This table contains an overview of tags in Zendesk:

| Column | Description |
| `name` | Tag name |
| `count` | Count of objects with assigned tag (tickets, etc.)|

### 2 -- Groups

Information about groups of tickets and users

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the group |
| `name` | Group name |
| `url` | API url of group detail |
| `deleted` | `1` if group is deleted |
| `created_at` | Date/time string of group creation |
| `updated_at` | Date/time string of the last update of the group |

### 3 -- Organizations

Information about organizations of your customers (end-users)

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the organization  |
| `name` | Organization name |
| `url` | API url of organization detail |
| `shared_tickets` | `1` if end users in this organization are able to see each other's tickets |
| `shared_comments` | `1` if end users in this organization are able to see each other's comments on tickets |
| `created_at` | Date/time string of organization creation |
| `updated_at` | Date/time string of the last update of the organization |
| `details` | Details note about organization |
| `notes` | Note about organization |
| `groups_pk` | Group identifier |
| `tags` | JSON encoded array of assigned tags |

### 4 -- Organizations-domain-names

List of domain names associated with customer organizations

| Column | Description |
| `domain` | Domain name |
| `organizations_pk` | Organization identifier |

### 5 -- Users

List of all agents and customers

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the user |
| `name` | Full name |
| `email` | User email |
| `url` | API url with user detail |
| `deleted` | `1` if user is deleted |
| `created_at` | Date/time string of user creation |
| `updated_at` | Date/time string of the last update of the user |
| `time_zone` | Time-zone of the user |
| `phone` | User phone number |
| `locale` | User locale |
| `organizations_pk` | Organization identifier |
| `role` | User role (`admin`, `agent`, `end-user`) |
| `verified` | `1` if user is verified by Zendesk |
| `external_id` | String identifier of external user |
| `alias` | User name alias shown in personalized emails |
| `active` | `1` if user account is activated |
| `shared` | `1` if user is shared from different Zendesk |
| `shared_agent` | `1` if user is shared agent from different Zendesk |
| `last_login_at` |  Date/time string of last user sign in |
| `two_factor_auth_enabled` | `1` if user has enabled two factor authentication |
| `signature` | User signature |
| `details` | Details note about user |
| `notes` | Note about user |
| `custom_role_id` | Identifier of user custom role |
| `moderator` | `1` if user can moderate forum |
| `ticket_restriction` | Specifies which tickets the user has access to  (`requested`, `assigned`, `groups`, `organization` or empty) |
| `only_private_comments` | `1` if user can create only private comments  |
| `restricted_agent` | `1` if agent has some restrictions (`1` for agents, empty for admins) |
| `suspended` | `1` if user account is suspended |
| `chat_only` | `1` if user is agent only in Zopim, not in Zendesk |
| `tags` | JSON encoded array of assigned tags |

### 6 -- Users-photos

List of user profile photos

| Column | Description |
| `id` | The integer representation of the unique identifier for the file |
| `file_name` | Name of the image file |
| `content_url` | File download url |
| `content_type` | Content type of the image |
| `size` | File size in bytes |
| `width` | Image width in pixels |
| `height` | Image height in pixels |
| `inline` | `1` if file is excluded from the attachment list |
| `users_pk` | User identifier |

### 7 -- Users-groups

Relations between users and groups

| Column | Description |
| `users_pk` | User identifier |
| `groups_pk` | Group name |

### 8 -- Tickets

List of created tickets

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the ticket |
| `url` | API url of ticket detail |
| `external_id` | String identifier of external ticket |
| `type` | Type of ticket (`problem`, `incident`, `question` or `task`) |
| `subject` | Ticket subject |
| `priority` | Urgency (`urgent`, `hight`, `normal` or `low`) |
| `status` | State (`new`, `open`, `pending`, `hold`, `solved` or `closed`) |
| `recipient` | Recipient e-mail address |
| `requester_pk` | Requester user identifier |
| `submitter_pk` | Submitter user identifier |
| `assignee_pk` | Assigned user identifier |
| `organization_pk` | Organization identifier |
| `group_pk` | Group identifier |
| `forum_topic_pk` | The topic this ticket originated from |
| `has_incidents` | `1` if ticket is marked as a problem |
| `due_at` | Ticket due date |
| `via_channel` | Info how was the ticket created |
| `ticket_form_pk` | Ticket form identifier |
| `brand_pk` | Brand identifier |
| `created_at` | Date/time string of ticket creation |
| `updated_at` | Date/time string of the last update of the ticket |
| `tags` | JSON encoded array of assigned tags |

### 9 -- Tickets-ratings

Basic data for ticket satisfaction ratings

| Column | Description |
| `id` | Rating identifier |
| `score` | Rating state (`offered`, `unoffered`, `good` or `bad`) |
| `tickets_pk` [PK] | Ticket identifier |

### 10 -- Tickets-sharing-agreements

| Column | Description |
| `sharing_agreements_pk` [PK] | Agreement identifier |
| `tickets_pk` [PK] | Ticket identifier |

### 11 -- Tickets-followups

| Column | Description |
| `followup_tickets_pk` [PK] | Follow-up ticket identifier |
| `tickets_pk` [PK] | Ticket identifier |

### 12 -- Tickets-comments

List of conversation (comments) between requesters, collaborators, and agents (available only when *Tickets with Comments* template is used).

| Column | Description |
| `id` [PK] | Comment identifier |
| `type` | Has the value `Comment` |
| `body` | Comment body |
| `public` | `1` if comment is public, empty if comment is internal note |
| `author_pk` | Author user identifier |
| `tickets_audits_pk` | Ticket audit identifier |
| `via_channel` | Info how was the comment created |
| `ip_address` | Author IP address |
| `created_at` | Date/time string of comment creation |
| `tickets_pk` | Ticket identifier |

### 13 -- Tickets-comments-attachments

List of uploaded comment attachments (available only when *Tickets with Comments* template is used).

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the file |
| `file_name` | Name of the image file |
| `content_url` | File download url |
| `content_type` | Content type of the file |
| `size` | File size in bytes |
| `width` | Image width in pixels |
| `height` | Image height in pixels |
| `inline` | `1` if file is excluded from the attachment list |
| `tickets_comments_pk` | Comment identifier |

### 14 -- Tickets-comments-attachments-thumbnails (available only when *Tickets with Comments* template is used).

Uploaded attachment thumbnails

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the thumbnail |
| `file_name` | Name of the thumbnail file |
| `content_url` | File download url |
| `content_type` | Content type of the file |
| `size` | File size in bytes |
| `width` | Image width in pixels |
| `height` | Image height in pixels |
| `inline` | `1` if file is excluded from the attachment list |
| `tickets_comments_attachments_pk` | Attachment identifier |

### 15 -- Tickets-audits

Basic info about each ticket update (available only when *Tickets with Comments* template is used).

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the audit |
| `tickets_pk` | Ticket identifier |
| `created_at` | Date/time string of audit creation |
| `via_channel` | Info how was the audit created |
| `author_pk` | Author user identifier |

### 16 -- Tickets-metrics

Metrics data for tickets

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the metric |
| `url` | API url of metric detail |
| `tickets_pk` | Ticket identifier |
| `created_at` | Date/time string of metric creation |
| `updated_at` | Date/time string of the last update of the metric |
| `group_stations` | Number of groups this ticket passed through |
| `assignee_stations` | Number of assignees this ticket has |
| `reopens` | Ticket reopens count |
| `replies` | Ticket replies count |
| `assignee_updated_at` | Date/time string of last update of ticket by assignee |
| `requester_updated_at` | Date/time string of last update of ticket by requester |
| `status_updated_at` | Date/time string of last status update |
| `initially_assigned_at` | Date/time string of first time of ticket assigning |
| `assigned_at` | Date/time string of last ticket assignee update |
| `solved_at` | Date/time string when ticket was marked as solved |
| `latest_comment_added_at` | Date/time string of last comment created |
| `reply_time_in_minutes_calendar` | Number of minutes to the first reply inside and out of business hours |
| `reply_time_in_minutes_business` | Number of minutes to the first reply inside and out of business hours |
| `first_resolution_time_in_minutes_calendar` | Number of minutes to the first resolution time inside and out of business hours |
| `first_resolution_time_in_minutes_business` | Number of minutes to the first resolution time inside and out of business hours |
| `full_resolution_time_in_minutes_calendar` | Number of minutes to the full resolution inside and out of business hours |
| `full_resolution_time_in_minutes_business` | Number of minutes to the full resolution inside and out of business hours  |
| `agent_wait_time_in_minutes_calendar` | Number of minutes the agent spent waiting inside and out of business hours |
| `agent_wait_time_in_minutes_business` | Number of minutes the agent spent waiting inside and out of business hours |
| `requester_wait_time_in_minutes_calendar` | Number of minutes the requester spent waiting inside and out of business hours |
| `requester_wait_time_in_minutes_business` | Number of minutes the requester spent waiting inside and out of business hours |
| `on_hold_time_in_minutes_calendar` |  Number of minutes the ticket was marked as `hold` |
| `on_hold_time_in_minutes_business` |  Number of minutes the ticket was marked as `hold` |

### 17 -- Tickets-fields

List of customized fields that are displayed on the ticket form

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the fields |
| `type` | Field type (`checkbox`, `date`, `decimal`, `integer`, `regexp`, `tagger`, `text` or `textarea`) |
| `title` | Field title |
| `active` | `1` if field is available |
| `tag` | Tag value to set for `checkbox` fields when checked |

### 18 -- Tickets-fields-values

Values of ticket custom fields

| Column | Description |
| `tickets_fields_pk` [PK] | Ticket field identifier |
| `value` | JSON encoded value of the field |
| `tickets_pk` [PK] | Ticket identifier |

## Usage Limits

Limits of the extractor are based on [Zendesk API Rate Limits](https://developer.zendesk.com/rest_api/docs/core/introduction#rate-limits).

