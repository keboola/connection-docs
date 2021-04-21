---
title: Facebook Ads
permalink: /components/extractors/marketing-sales/facebook-ads/
redirect_from:
    - /extractors/marketing-sales/facebook-ads/
---

* TOC
{:toc}

This extractor uses the [Facebook Marketing API](https://developers.facebook.com/docs/marketing-api/reference) to
extract Facebook Ad Account [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup)
(including adsets, campaigns), as well as [ads insights](https://developers.facebook.com/docs/marketing-api/reference/adgroup/insights).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Facebook Ads** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization) with access to the Ad Account you want to extract.
You will be asked for the `public_profile,ads_management` [permissions](https://developers.facebook.com/docs/facebook-login/permissions). 
Optionally, you can use `Direct token insert` to specify a manually generated access token.

You can always revoke the authorization by going to the
[Facebook apps tab](https://www.facebook.com/settings?tab=applications) (under settings) and removing
`Keboola Ads Extractor` from the list.

Click on **Select Ad accounts** to load a list of Ad accounts associated with the authorization.

{: .image-popup}
![Screenshot - Facebook Accounts](/components/extractors/marketing-sales/facebook-ads/facebook-ads-1.png)

From the list of fetched Ad Accounts associated with the authorized account, select the Ad Accounts
you wish to extract.

{: .image-popup}
![Screenshot - Select Facebook Pages](/components/extractors/marketing-sales/facebook-ads/facebook-ads-2.png)

## Create New Query
Click on the **Create new query** button and specify what data to extract. If you choose a preconfigured template,
all necessary fields will fill in automatically.

{: .image-popup}
![Screenshot - New Query](/components/extractors/marketing-sales/facebook-ads/facebook-ads-3.png)

The query describes the extractor request to be sent to the Facebook Marketing API. Knowing the API will
make creating a query easy because all options except `name` represent the [Facebook Marketing API
request](https://developers.facebook.com/docs/graph-api/using-graph-api) parameters.

### Name
The *Name* option describes the query and is used to prefix all table names resulting from the query.
One query can produce multiple tables. If a table name produced by the query matches the query name or 
its substring trimmed after the last occurrence of an underscore, then the output table name will not be 
prefixed and the query name will be used instead.

For example, if the query name is `ads_insights` and the produced table name is `insights`, then the
output table name will be `ads_insights`. If the query name is `foo` and the produced table name is
`ads`, then the output table name will be `foo_ads`.

### Endpoint
The *Endpoint* option describes a significant URL part of the request made to the Facebook Marketing API.
The absolute URL is in the form `https://graph.facebook.com/<api_version>/<endpoint>`.
A typical example would be [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup).
If left empty, the *Endpoint* option refers to the data of the Facebook authorized account itself.

For more information, see the [list of supported Facebook Marketing API endpoints](https://developers.facebook.com/docs/marketing-api/reference).

### Fields
The *Fields* option describes data returned from the endpoint. Typically, it is a comma-separated list of
fields but it also can be used to parametrize the fields and nest more endpoints into it.
The [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup) endpoint returns all
created ads. Each ad can contain fields such as `id`, `name` and `adset_id`. The fields parameter in such
case is `id,name,adset_id`.

- **Fields/Endpoint Nesting** ---
    Ads can contain recommendations and these can be included in the *fields* as well: `id,name,adset_id,recommendations{title,code,message}`. The comma separated list
    in between the curly brackets `{}` specifies fields of the "nested" field/endpoint
    [ad-recommendation](https://developers.facebook.com/docs/marketing-api/reference/ad-recommendation). This way more endpoints can be nested and there is no limit of nesting levels.

- **Fields Parametrization** ---
    Each field can be parametrized by a dot followed by a modifier name and a value in brackets.
    A typical parameter could be `since`, `until`, `limit`, or any other parameters or modifiers that the particular endpoint offers such as `date_preset` for the [ads insights](https://developers.facebook.com/docs/marketing-api/reference/adgroup/insights) endpoint.
    The following is an example of parametrized fields:     `insights.action_breakdowns(action_type).date_preset(last_month).time_increment(1){ad_id,impressions,reach,actions,clicks,spend}`

### Ad Accounts
This option specifies the Ad Accounts that the query will be applied to. Accounts can be chosen from a
list of selected ad accounts after authorization. The `All Ad Accounts` option means that the query will
be applied to all selected ad accounts; the `None` option says that a query will not be applied to any Ad
account. This is useful when extracting data about the authorized account itself. The *Accounts* option
is represented by the Facebook Marketing API parameter `ids` that is a comma separated list of ad account IDs.

### Since and Until (Advanced tab)
The *Since* and *Until* options represent the corresponding Facebook Marketing API request parameters and
specify a date range that will be applied to time based data retrieved by the **endpoint**. For example,
if the endpoint is `ads`, then all ads created within the since-until range will be retrieved.

The *Since* or *Until* parameters are parsed via the [strtotime function](https://www.php.net/manual/en/function.strtotime.php)
and can be specified

- **absolutely** -- as a unix timestamp or in the `yyyy-mm-dd` format, or
- **relatively** -- for instance, `14 days ago` or `last month`.

For consistent results, specify both the *since* and *until* parameters. It is also recommended that the 
time range does not exceed 6 months.

### Limit (Advanced Tab)
The *limit* option represents the Facebook Marketing API request parameter `limit`; it is the maximum
number of objects that may be returned on a single page of the request. (The default is 25, the maximum
is 100.) It is useful when the Facebook Marketing Api returns an error saying there is too much data
requested. In such case, lower the limit and run the query again.

## Output Data Description
The output data represent a [tree](https://en.wikipedia.org/wiki/Tree_(graph_theory)) where each node is an
array of objects returned from the Facebook Graph API. The tree is transformed into one or more CSV
tables.

Each table row represents one object. Each table has the primary key auto-detected during the
extraction, so the table data is **imported incrementally**. The columns of the output tables represent
fields from the `Fields` query option. Moreover, each table will always contain the following basic set
of columns:

- `ex_account_id` --- ID of the ad account corresponding to the object stored in the row.
- `fb_graph_node` --- Describes the "vertical position" of the object in the resulting tree. For example, for ads it will be `page_ads`, for ads insights it will be `page_ads_insights`.
- `parent_id` ---  Refers to the `id` column of a parent object represented by another row and/or
table. For instance, if the row is representing an insight object, its parent is an ad and `parent_id`
is the ID of the ad. The parent object type can be also determined from the `fb_graph_node` column as a
substring from the beginning until the last occurrence of an underscore, e.g. `page_ads_insights` ->
`page_ads`. The top parent ID is the ad account ID.

### Ads Insights Data Description
All tables containing ads/campaigns insights data have a specific structure. Consider the following query:

- Endpoint parameter: `campaigns`
- Fields parameter: `insights.action_breakdowns(action_type).date_preset(last_28_days).time_increment(1){account_id,account_name,campaign_id,campaign_name,actions}`

 The query asks for the [ads action stats](https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/) data specified by the
 [insights api field](https://developers.facebook.com/docs/marketing-api/reference/ads-action-stats/)
 `actions`. In the api response, each insights object contains an array of actions. The resulting table
 has each insights object copied into rows by the count of all such arrays, i.e., ads action stats 
 objects listed for each insights object in arrays. Moreover, the columns of the resulting insights table 
 contain the column `ads_action_name` with the name of the ads action array (in this case actions) and 
 columns from fields of ads action stats such as `action_type`, `action_reaction` and `value`.

## Facebook API Version
You can set the version of the Facebook Marketing API that will be applied for all requests made to the
API by the Facebook Ads extractor. Read more about the Marketing API versions [here](https://developers.facebook.com/docs/graph-api/changelog/versions).

{: .image-popup}
![Screenshot - Api Version](/components/extractors/marketing-sales/facebook-ads/facebook-ads-4.png)