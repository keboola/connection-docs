---
title: Customer IO
permalink: /components/extractors/marketing-sales/customerio/
---

* TOC
{:toc}

The Customer IO extractor uses the [Customer IO Beta API](https://customer.io/docs/api/#tag/betaOverview) 
to extract customers, campaigns, segments and activites from your [Customer.io account](https://customer.io/). 

Before you start, have a working [Mailchimp](https://login.mailchimp.com/signup/) account filled with [data](https://us13.admin.mailchimp.com/campaigns/)
and an API key.

## Get API Key

You can generate a bearer token, known as an App API Key, with a defined scope in [your account settings](https://fly.customer.io/settings/api_credentials?keyType=app)
. [Learn more about bearer authorization in Customer.io.](https://customer.io/docs/managing-credentials)


## Configuration

## Authorization

**API key** - Your API key that you generated in [previous step.](/components/extractors/marketing-sales/customerio/#get-api-key)


{: .image-popup}
![API Key](/components/extractors/marketing-sales/customerio/api_key.png)

## Load type

If set to Incremental update, the result tables will be updated based on primary key consisting of all selected dimensions. Full load overwrites the destination table each time, with no primary keys.

**Note**: When set to incremental updates the primary key is set automatically based on the dimensions selected. 
If the dimension list is changed in an existing configuration, the existing result table might need to be dropped or the primary key changed before the load, since it structure 
will be different. If set to full load, **no primary key** is set.


{: .image-popup}
![Load type](/components/extractors/marketing-sales/customerio/load_type.png)

## Incremental loading

Some of the datasets allow `Continue since last run` option. When checked, only the new messages that had appeared since last run are downloaded. 

To backfill without changing this attribute, click the `Reset State` button.


{: .image-popup}
![Load type](/components/extractors/marketing-sales/customerio/incremental.png)


## Campaigns

Downloads campaigns dataset. Note that columns `actions` and `tags` contain JSON and Array object in textual form.

**Columns**:

| column         | example                                                  |
|----------------|----------------------------------------------------------|
| actions        | [{‘id’: 3, ‘type’: ‘email’}, {‘id’: 7, ‘type’: ‘email’}] |
| active         |                           FALSE                          |
| created        |                                               1591294006 |
| created_by     | Leos                                                     |
| customer_id    | 123x                                                     |
| date_attribute |                                                          |
| deduplicate_id |                                             123123:29:00 |
| first_started  |                                                        0 |
| frequency      |                                                          |
| id             |                                                        1 |
| name           | Onboarding Campaign                                      |
| start_hour     |                                                          |
| start_minutes  |                                                          |
| state          | draft                                                    |
| tags           | [‘Sample’]                                               |
| timezone       |                                                          |

## Segments

Segments are groups of people, subsets of your audience. You get get information about segments and the customers contained by a segment. 

**Example output**

| deduplicate_id | description                                                                                                                                                               | id | name             | progress | state    | tags |    type |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----|------------------|----------|----------|------|--------:|
| 26521567:45:00 | Includes all people|  1 | Signed up        |          | finished |      | dynamic |
| 26582936:15:00 | Anyone associated with active customer account.                                                                                                                           | 13 | Active Customers |          | finished |      | dynamic |


## Messages

List metadata about messages. You may choose which types of messages you wish.  
Allowable values are `email`, `webhook`, `twilio`, `urban_airship`, `slack`, `push`.

[More info here](https://customer.io/docs/api/#apibeta-apimessagesmessages_list) 



## Customers

### Attributes

Comma separated list of required customer attributes. 
Each customer may have different set of columns, this is to limit only to attributes you need. All attributes are downloaded if left empty.

**NOTE** It is possible that there are some custom attributes with the same name. E.g. `Name` and `name` 
or `Last name` and `last_name` are considered the same after conversion to supported Storage format. 
You may use appropriate [processors](https://developers.keboola.com/extend/component/processors/) to deal with this situation.

### Filter

An additional filter condition in JSON format. The filter language is defined [here](https://customer.io/docs/documentation/api-triggered-data-format.html#general-syntax)

**Example Values**: 

- `Find the first 2 customers in segment 7 and segment 5` =>: `{"and":[{"segment":{"id":7}},{"segment":{"id":5}}]}`
- `Find the first 10 unsubscribed customers` =>: `{"attribute":{"field":"unsubscribed","operator":"eq","value":"true"}}}`


## Activities 
 
 Return information about activities. Activities are cards in campaigns, broadcasts, etc. They might be messages, webhooks, attribute changes, etc.


### Mode of result parsing

Each activity type may have different columns and table structure, for this reason the extractor allows fetching data in two modes:

**`PARSED_DATA`**
 
 Will generate structured table for each activity type. e.g. `event` type will generate table `activity_event`:
 
 | customer_id | data_description | data_project | data_start           | id      | name             | timestamp  |  type |
|-------------|------------------|--------------|----------------------|---------|------------------|------------|------:|
| David       |                  | test         |                      | 1234d   | inactive project | 1609808524 | event |
| Tom         |                  | test2        | 2020-10-19T11:18:55Z | 3467g   | enroll           | 1603120800 | event |
| Carl        | desc             | TS_Test      |                      | 667676h | credit grant     | 1616382356 | event |
 
 
- `SINGLE_TABLE` 

Will populate single activities_all table with data unparsed as column. The data will be present in a `data` folder as a JSON string.
 
 Example:

| customer_id               | data                                                                                                                                                                | delivery_id | delivery_type | id                         | timestamp  |  type |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|---------------|----------------------------|------------|------:|
| David| {'daysofinactivity': 76, 'lastactivitydate': '2020-10-21', 'project': 'test', 'projecturl': 'example.com'} |             |               | 1234d | 1609808524 | event |
| Tom  | {'project': 'test2', 'start': '2020-10-19T11:18:55Z'}                                                |             |               | 01EN0Q4 | 1603120800 | event |


