---
title: Intercom
permalink: /extractors/communication/intercom/
---

* TOC
{:toc}

This extractor fetches data from [Intercom](https://www.intercom.com/).

## Configuring Extractor

Before you start, have a working Intercom account with a plan (trial will work as well). 

After you create the configuration and authorize it with your Intercom account, you can choose a template. 

### Configuration Templates

#### Basic

#### Conversations

#### Users and events (experimental)

*Note: downloading all user events often returns an application error from the Intercom API. 
We're figuring out the reasons with the Intercom support, so until this is resolved, downloading full events 
is considered experimental only.*

## Downloaded Tables

All `custom_attributes` properties are stored as a serialized JSON string. 
Due to the customized structure of this object we are unable to prepare a fixed structure. 
To parse the serialized JSON you can use eg. a Snowflake transformation, that can easily parse JSON objects. 

### users

Serialized [User Model](https://developers.intercom.com/v2.0/reference#user-model)

| Column | Description |
| `type` | 	Value is `user` |
| `id` | The Intercom defined id representing the user |
| `created_at` | The time the user was added to Intercom |
| `signed_up_at` | The time the user signed up |
| `updated_at` | The last time the user was updated |
| `email` | The email you have defined for the user |
| `phone` | The phone number of the user |
| `user_id` | The user id you have defined for the user |
| `last_request_at` | The time the user last recorded making a request |
| `session_count` | How many sessions the user has recorded |
| `unsubscribed_from_emails` | Whether the user is unsubscribed from emails |
| `marked_email_as_spam` | Undocumented |
| `has_hard_bounced` | Undocumented |
| `user_agent_data` | Data about the last user agent the user was seen using |
| `last_seen_ip` | An ip address (e.g. "1.2.3.4") representing the last ip address the user visited your application from. (Used for updating location_data) |
| `pseudonym` | The pseudonym used if this user was previously a Lead  |
| `anonymous` | Whether or not this is a Lead. Always false |
| `name` | The full name of the user |
| `location_data_city_name` | A city name |
| `location_data_continent_code` | A continent code |
| `location_data_country_code` | An ISO 3166 country code |
| `location_data_country_name` | The country name |
| `location_data_latitude` | The latitude |
| `location_data_longitude` | The longitude |
| `location_data_postal_code` | A postal code |
| `location_data_region_name` | A region name |
| `location_data_timezone` | An ISO 8601 timezone |
| `avatar_image_url` | An avatar image URL |
| `custom_attributes` | Serialized JSON of all custom attributes for the `user` object |

### users_tags

Relation between `users` and `tags`.

| Column | Description |
| `type` | 	Value is `tag` |
| `id` [FK] | Tag identifier (`tags.id`) |
| `users_pk` [FK] | User identifier (`users.id`) |

### users_segments

Relation between `users` and `segments`.

| Column | Description |
| `type` | 	Value is `segment` |
| `id` [FK] | Segment identifier (`segments.id`) |
| `users_pk` [FK] | User identifier (`users.id`) |

### users_companies

Relation between `users` and `companies`.

| Column | Description |
| `type` | 	Value is `company` |
| `id` [FK] | Company identifier (`companies.id`) |
| `users_pk` [FK] | User identifier (`users.id`) |

### users_social_profiles

List of social profiles attached to the user.

| Column | Description |
| `type` | 	Value is `social_profile` |
| `id` | User ID on the service |
| `name` | The name of the service (e.g., twitter, facebook) |
| `username` | User name or handle on the service |
| `url` | The user homepage on the service |
| `users_pk` [FK] | User identifier (`users.id`) |

## Usage Limits

TODO
