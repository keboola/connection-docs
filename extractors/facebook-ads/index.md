---
title: Facebook Ads
permalink: /extractors/marketing-sales/facebook-ads/
redirect_from:
  - /extractors/facebook-ads/
---

* TOC
{:toc}

This extractor allows to extract ads data from Facebook using [Facebook Marketing API](https://developers.facebook.com/docs/marketing-api/reference/v2.8).
The data involve Ad Account [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup) including adsets, campaigns
and also [ads insights](https://developers.facebook.com/docs/marketing-api/reference/adgroup/insights/).

## Create and Initiate New Configuration
Find Facebook Ads under the **Extractors** section. Create a new configuration and name it. It can be renamed any time.

{: .image-popup}
![Screenshot - Create configuration](/extractors/facebook-ads/createconfig.png)

Authorize a Facebook account under which you have access to an Ad Account you want to extract. The authorization process asks for `public_profile,ads_management` [permissions](https://developers.facebook.com/docs/facebook-login/permissions). To irrecoverably dissmiss the authorized account, then go to your [Facebook apps tab(under settings)](https://www.facebook.com/settings?tab=applications) and remove `Keboola Ads Extractor` from the list.

{: .image-popup}
![Screenshot - Authorize configuration](/extractors/facebook-ads/authorizefb.png)

Select Ad Accounts to extract from the list of fetched Ad Accounts associated with the authorized account.

{: .image-popup}
![Screenshot - Select Facebook Pages](/extractors/facebook-ads/selectadaccounts.png)

## Create New Query
Create a new query that specifies data to extract. You can choose from a preconfigured template and all necessary fields will fill up automatically.

{: .image-popup}
![Screenshot - New Query](/extractors/facebook-ads/newquery.png)

The query is basically a description of a request that the extractor will send to the Facebook Marketing API. All options except `name` represent
parameters of the [Facebook Marketing API request](https://developers.facebook.com/docs/graph-api/using-graph-api), so with a good knowledge
of the API it should be easy to create a query.

### Name
Name option describes the query and is used to prefix tables name resulting from the query. One query can produce multiple tables. If a table name produced by the query matches
the query name or its substring trimmed after the last occurrence of underscore then the output table name will not be prefixed and the query name will be used instead.
E.g. if the query name is `ads_insights` and the produced table name is `insights` then the output table name will be `ads_insights`. If the
query name is `foo` and the produced table name is `ads` then the output table name will be `foo_ads`.

### Endpoint
Endpoint options describes significant URL part of the request made to Facebook Marketing API. The absolute URL is in
form `https://graph.facebook.com/<api_version>/<endpoint>`. For more info see the
[list of supported Facebook Marketing API endpoints](https://developers.facebook.com/docs/marketing-api/reference/v2.8). Typical example
could be [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup). If left empty, then it refers to the data of the Facebook authorized account itself.

### Fields
Fields option is required to precisely describe the data returned from the endpoint. Typically it is a comma-separated list of fields but also can be used
to parametrize the fields and nest more endpoints into it. If you look at a [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup)
endpoint it returns all created ads. Each ad can contain fields such as `id`, `name`, `adset_id`. The fields parameter in such case is `id,name,adset_id`.

- **Fields/Endpoint Nesting**
    Ads can contain recommendations and these can be included in fields as well: `id,name,adset_id,recommendations{title,code,message}`. The comma separated list
    in between the curly brackets `{}` specifies fields of the "nested" field/endpoint
    [ad-recommendation](https://developers.facebook.com/docs/marketing-api/reference/ad-recommendation/). This way more endpoints can be nested and basically
    there is no limit of nesting level.

- **Fields Parameterization**
    Each field can be parameterized by a dot followed by the modifier name and value in brackets. Typical parameter could
    be `since`, `until`, `limit` or any other parameters or modifiers that the particular endpoint offers such as `date_preset`
    for [ads insights](https://developers.facebook.com/docs/marketing-api/reference/adgroup/insights/) endpoint.
    Example of parameterized fields: `insights.action_breakdowns(action_type).date_preset(last_month).time_increment(1){ad_id,impressions,reach,actions,clicks,spend}`

### Ad Accounts
This option specifies Ad Accounts that the query will be applied to. Accounts can be chosen from a list of selected ad accounts after authorization.
There is `All Ad Accounts` option meaning that the query will be applied to all selected ad accounts as well as `None` meaning that query will
be applied to no Ad account. This can be useful to extract data about the authorized account itself. The *Accounts* option is represented by the Facebook
Marketing API parameter `ids` that is comma separated list of ad accounts IDs.

### Since and Until (Advanced tab)
*Since* and *Until* options represent the corresponding Facebook Marketing API request parameters and specify date range that will be applied to
time based data retrieved by the **endpoint**. E.g. if the endpoint is `ads` then all ads created within the since-until range will be retrieved.
Since or Until parameter is parsed via [strtotime function](http://php.net/manual/en/function.strtotime.php) and can be specified:

- **absolutely** -- as a unix timestamp or in `yyyy-mm-dd` format,
- **relatively** -- e.g. `14 days ago` or `last month`.

For consistent results, specify both `since` and `until` parameters. Also, it is recommended that the time range does not exceed 6 months.

### Limit (Advanced Tab)
The *limit* option represents the Facebook Marketing API request parameter `limit` and it is the maximum number of objects that may be returned
in a single page of the request. Default is 25 and maximum is 100. It is useful when Facebook Marketing Api returns an error saying there are
too many data requested. In such case, you can lower the limit and retry the query run.

## Output Data Description
Output data represent [tree](https://en.wikipedia.org/wiki/Tree_(graph_theory)) where each node is an array of objects returned from Facebook Graph API. The
tree is transformed into one or more CSV tables. Each row of a table represents one object. Each table has primary key auto-detected during extraction and so
table data is **imported incrementally**. Columns of the output tables represent fields from the `Fields` query option. Moreover each table will always
contain the following basic set of columns:

- `ex\_account\_id` -- Id of the ad account corresponding to the object stored in the row.
- `fb\_graph\_node` -- Describes the "vertical position" of the object in the resulting tree. E.g. for ads it will be `page_ads`, for ads insights it will be `page_ads_insights`.
- `parent_id` --  Refers to **id** column of a parent object represented by some other row and/or table. For example if the row is representing a insight object then its parent is ad and so parent_id is the id of the ad. The parent object type can be also determined from **fb_graph_node** column as a substring from the beginning until the last occurrence of underscore, e.g. page\_ads\_insights -> page_ads. The top parent id is an ad account id.

### Ads Insghts Data Description
Tables containing ads/campaigns insights data have a specific structure. Consider the following query:

- Endpoint parameter: `campaigns`
- Fields parameter: `insights.action_breakdowns(action_type).date_preset(last_28_days).time_increment(1){account_id,account_name,campaign_id,campaign_name,actions}`

 The query asks for [ads action stats](https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/) data specified by [insights api field](https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/) `actions`. In the api response, each insights object contains an array of actions. The resulting table has each insights object copied into rows by count of all such arrays, i.e.,  [ads action stats](https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/) objects listed for each insights object in arrays. Morover, columns of the resulting insights table contain column `ads_action_name` with name of the ads action array(in this case actions) and columns from fields of [ads action stats](https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/) such as `action_type`, `action_reaction`, `value`.

## Facebook API Version
You can set version of Facebook Marketing API that will be applied for all request made to Facebook Markegint API by facebook extractor. Read more about Marketing API versions [here](https://developers.facebook.com/docs/marketing-api/versions).
