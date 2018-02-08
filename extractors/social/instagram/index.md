---
title: Instagram
permalink: /extractors/social/instagram/
---

* TOC
{:toc}

This extractor uses [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)(built on [Facebook Graph API](https://developers.facebook.com/docs/graph-api)) to extract media objects, comments, insights and metrics from [Instagram Business Accounts](https://business.instagram.com/getting-started). In order access a business account's data, user has to authorize a Facebook Account and choose Facebook Page that is connected to a [Instagram Business Accounts](https://business.instagram.com/getting-started). The rest of configuring process is almost identical as configuring [Facebook](/extractors/social/facebook/) extractor.

## Prerequisites
Before you begin, you must have:

 - a Facebook Page
 - a role on that Page
 - an Instagram account
 - [the Facebook Page conencted to the Instagram Business Account](https://developers.facebook.com/docs/instagram-api/getting-started#connect)

## Create New Configuration
Find Instagram in the **Extractors** section, create a new configuration and name it. It can be renamed any time.

{: .image-popup}
![Screenshot - Create configuration](/extractors/social/instagram/createconfig.png)

Authorize the Facebook account with access to the Facebook page you have Instagram business account connected to.
You will be asked for the `instagram_basic,instagram_manage_insights,pages_show_list` [permissions](https://developers.facebook.com/docs/facebook-login/permissions).
Optionally, you can use `Direct token insert` to specify a manually generated access token.

You can always revoke the authorization by removing the *Keboola IG Extractor* from the list
in the [Facebook apps tab](https://www.facebook.com/settings?tab=applications) (under settings).

{: .image-popup}
![Screenshot - Authorize configuration](/extractors/social/instagram/authorizefb.png)

From the list of fetched Instagram business Accounts associated with the authorized Facebook account, select the one you want to extract from.

{: .image-popup}
![Screenshot - Select Instagram business Account](/extractors/social/instagram/selectpages.png)

## Create New Query
Create a new query and specify what data to extract. If you choose a preconfigured template,
all necessary fields will fill up automatically.

{: .image-popup}
![Screenshot - New Query](/extractors/social/instagram/newquery.png)

The query describes the extractor request to be sent to the Instagram Graph API that is built on Facebook Graph API. Knowing the API will make
creating a query easy because all options except `name` represent the [Facebook Graph API request](https://developers.facebook.com/docs/graph-api/using-graph-api) parameters.

### Name
The *Name* option describes the query and is used to prefix all table names resulting from the query.
One query can produce multiple tables. If a table name produced by the query matches the query name or
its substring trimmed after the last occurrence of an underscore, then the output table name will not be
prefixed and the query name will be used instead.

For example, if the query name is `media_comments` and the produced table name is `media_comments`, the output
table name will be `media_comments`. If the query name is `foo` and the produced table name is `insights`,
the output table name will be `foo_insights`.

### Endpoint
The *Endpoint* option describes a significant URL part of the request made to the Facebook Instagram API.
The absolute URL is in the following form: `https://graph.facebook.com/<api_version>/<endpoint>`.
A typical example would be the [media](https://developers.facebook.com/docs/instagram-api/reference/media).
If left empty, the *Endpoint* option references data of the Instagram business Account itself which in fact refers to [user](https://developers.facebook.com/docs/instagram-api/reference/user) endpoint.

### Fields
The *Fields* option describes data returned from the endpoint. Typically, it is a comma-separated list of
fields but it also can be used to parametrize the fields and nest more endpoints into it.
The [media](https://developers.facebook.com/docs/instagram-api/reference/media#metadata) endpoint returns all
media object created by a Instagram account. Each media object contains fields such as `caption`, `comments_count`, `created_time`
and `like_count`. The fields parameter in such case is `caption,comments_count,created_time,like_count`.

- **Fields/Endpoint Nesting** ---
    Media can contain comments and these can be included in the *fields* as well: `caption,message,created_time,like_count,comments{text,replies,timestamp,like_count,user}`. The comma separated list in between the curly brackets `{}` specifies fields of the "nested" [comment](https://developers.facebook.com/docs/instagram-api/reference/comment#reading) field/endpoint for each media. This way, more endpoints can be nested and there is no limit of nesting levels.

- **Fields Parametrization** ---
    Each field can be parametrized by a dot following a parameter/modifier name and a value in brackets.
    Typical parameters would be `since`, `until` or `limit`,
    or modifiers that the particular endpoint offers such as `metrics` for the [insights](https://developers.facebook.com/docs/instagram-api/reference/user/insights) endpoint.
    An example of parametrized fields: `comments.limit(10){text,like_count}` or `insights.period(lifetime).since(5 days ago).until(today).metric(impressions)`.

### Instagram Business Account
The *Instagram Business Account* option specifies the Instagram Business Account that the query will be applied to. It can be chosen from a
list of selected accounts after authorization. There is the `All Instagram Business Accounts` option meaning that the query will
be applied to all selected accounts. The `None` option means that the query will not be applied to any accounts.
It can be useful when extracting data about the authorized account itself. This option is represented
by the Facebook Graph API parameter `ids` that is a comma separated list of page ids.

### Since and Until (Advanced tab)
The *Since* and *Until* options represent corresponding Facebook Graph API request parameters and
specify the date range that will be applied to the time based data retrieved by the **endpoint**. For
example, if the endpoint is `feed` then all media objects created within the specified since-until range will be retrieved.

The *Since*/*Until* parameter is parsed via the [strtotime function](http://php.net/manual/en/function.strtotime.php) and can be specified

- **absolutely** --- as a unix timestamp or in the `yyyy-mm-dd` format, or
- **relatively** --- e.g. `14 days ago` or `last month`.

For consistent results, specify both the *since* and *until* parameters.

### Limit (Advanced Tab)
The *Limit* option represents the Facebook Graph API request parameter `limit`; it is the maximum number
of objects that may be returned in one page of the request. (The default is 25 and the maximum is 100.)
It is useful when the Facebook Graph API returns an error saying there is too much data requested; in such
cases, lower the limit and run the query again.

## Output Data Description
The output data represent a [tree](https://en.wikipedia.org/wiki/Tree_(graph_theory)) where each node is an
array of objects returned from the Facebook Graph API. The tree is transformed into one or more CSV tables.

Each row of a table represents one object. Each table has the primary key auto-detected during the
extraction, so the table data is **imported incrementally**. The columns of the output tables represent
fields from the `Fields` query option. Moreover, each table will always contain the following basic set of columns:

- `id` --- Id returned by the Facebook Graph API
- `ex_account_id` --- Id of the Instagram Business Account corresponding to the object stored in the row
- `fb_graph_node` --- Describes the "vertical position" of the object in the resulting tree. For example,
for media obecjts it will be `page_media`, for comments of media it will be
`page_media_comments`.
- `parent_id` --- Refers to the `id` column of a parent object represented by some other row and table.
For instance, if the row is representing a comment object, its parent is a media object and `parent_id`
is the id of the media object. The parent object type can be also determined from the `fb_graph_node` column as a
substring from the beginning until the last occurrence of an underscore. To give an example, if
`fb_graph_node` contains the value `page_media_comments`, the parent object type is `page_media`. The
top parent is named `page` and it represents Instagram Business Account id.


## Facebook API Version
Instagram Graph API versioning follows Facebook Graph API versioning. You can set the version of the Facebook Graph API that will be applied for all requests made to the API
by the Instagram extractor.

{: .image-popup}
![Screenshot - Api Version](/extractors/social/facebook/apiversion.png)
