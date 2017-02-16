---
title: Facebook Ads
permalink: /extractors/marketing-sales/facebook-ads/
redirect_from:
  - /extractors/facebook-ads/
---

* TOC
{:toc}

This extractor allows to extract ads data from Facebook using [Facebook Marketing API](https://developers.facebook.com/docs/marketing-api/reference/v2.8). The data involve Ad Account [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup) including adsets, campaigns etc and also [ads insights](https://developers.facebook.com/docs/marketing-api/reference/adgroup/insights/).

## Create and Initiate New Configuration

 1. Find Facebook Ads under the **Extractors** section. Create a new configuration and name it. It can be renamed any time.

    ![Screenshot - Create configuration](/extractors/facebook-ads/createconfig.png){: .image-popup}

 2. Authorize a Facebook account under which you have access to an Ad Account you want to extract. The authorization process asks for `public_profile,ads_management` [permissions](https://developers.facebook.com/docs/facebook-login/permissions). To irrecoverably dissmiss the authorized account, then go to your [Facebook apps tab(under settings)](https://www.facebook.com/settings?tab=applications) and remove `Keboola Ads Extractor` from the list.

    ![Screenshot - Authorize configuration](/extractors/facebook-ads/authorizefb.png){: .image-popup}

 3. Select Ad Accounts to extract from the list of fetched Ad Accounts associated with the authorized account.

    ![Screenshot - Select Facebook Pages](/extractors/facebook-ads/selectadaccounts.png){: .image-popup}

## Create New Query

Create new query that specifies data to extract. You can choose from a preconfigured template and all necessary fields will fill up automatically.
![Screenshot - New Query](/extractors/facebook-ads/newquery.png){: .image-popup}

The query is basically a description of request that will extractor make to Facebook Marketing Api. All parameters except Name listed below represent a parameter of [Facebook Marketing API request](https://developers.facebook.com/docs/graph-api/using-graph-api), so with a good knowledge of the api it should be easy to create a query. Query contains the following parameters:

### Name

Name describes the query and is used to prefix tables name resulting from the query. One query can produce multiple tables. If a table name produced by a query matches the query name or its substring trimmed after the last occurence of underscore then the output table name will not be prefixed and used the query name instead, e.g if query name is `ads_insights` and produced table name is `insights` then output table will be `ads_insights` unlike if query name is `foo` and produced table name is `ads` then output table name will be `foo_ads`.

### Endpoint

String describing significant url part of request made to Facebook Marketing API. Can be also empty. The absolute url is in form `https://graph.facebook.com/<api_version>/<endpoint>`. For more info see the [list of supported Facebook Marekting API endpoints](https://developers.facebook.com/docs/marketing-api/reference/v2.8). Typical example could be [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup). If left empty then it refers to the data of Facebook authorized account itself.

### Fields
Required string that precisely describes the data returned from the endpoint. Typically it is a comma-separated list of fields but also can be used to parametrize the fields or/and nest more endpoints into it. If we look at a [ads](https://developers.facebook.com/docs/marketing-api/reference/adgroup) endpoint it returns all created ads. Each ad can contain fields such as id, name, adset_id etc. so the fields parameter in such case is `id,name,adset_id`.

- **Fields/Endpoint Nesting**
    Ads can contain recommendation and these can be included in fields as well: `id,name,adset_id,recommendations{title,code,message}`. The comma separated list in between the curly brackets `{}` specifies fields of the "nested" field/endpoint [ad-recommendation](https://developers.facebook.com/docs/marketing-api/reference/ad-recommendation/) for each ad endpoint. This way can be nested more endpoints and basically there is no limit of nesting level.

- **Fields Parameterization**
    Each field can be parameterized by a dot following the parameter/modifier name and value in brackets. Typical parameter could be **since, until or limit** or any other parameters or modifiers that the particular endpoint offers such as **date_preset** for [ads insights](https://developers.facebook.com/docs/marketing-api/reference/adgroup/insights/) endpoint. Example of parameterized fields: `insights.action_breakdowns(action_type).date_preset(last_month).time_increment(1){ad_id,impressions,reach,actions,clicks,spend}`

### Ad Accounts
Specifies Ad Accounts that the query will be applied to. Can be chosen from a list of selected ad accounts after authorization. There is `All Ad Accounts` option meaning that all selected ad accounts will be applied as well as `None` meaning that no ad account will be applied - this can be useful to extracted data about the authorized account itself. It is represented by Facebook Marketing API parameter `ids` that is comma separated list of ad accounts ids.

### Since and Until (Advanced tab)
Represents corresponding Facebook Marketing API request parameters and specifies date range that will be applied to time based data retrieved by the **endpoint**, e.g. if endpoint is `ads` then all ads created within the since-until range will be retrieved. Since or Until parameter is parsed via [strtotime function](http://php.net/manual/en/function.strtotime.php) and can be specified:

- **absolutely** as a unix timestamp or in `yyyy-mm-dd` format
- **relatively** e.g. "14 days ago" or "last month"

For consistent results, specify both since and until parameters. Also, it is recommended that the time difference is a maximum of 6 months.

### Limit (Advanced Tab)
Represents Facebook Marketing API request parameter `limit` and is the maximum number of objects that may be returned in one page of the request. Default is 25 and maximum is 100. It is useful when Facebook Marketing Api returns error saying there are too many data requested, in such cases lower the limit and retry the query run.

## Output Data Description
Output data represent tree where each node is array of objects returned from Facebook Marketing API and transformed into one or more CSV tables. Each row of table represents one object. Each table has primary key auto-detected during extraction and so table data is **imported incrementally**. Columns of the output tables represent fields from the **fields** query parameter. Moreover each table will always contain the following basic set of columns:

- **ex_account_id** Id of ad account corresponding to the object stored in the row
- **fb_graph_node** describes the objects "vertical position" of the resulting tree. e.g for ads it will be `page_ads`, for ads insights it will be `page_ads_insights` etc
- **parent_id** refers to **id** column of a parent object represented by some other row and/or table. For example if the row is representing a insight object then its parent is ad and so parent_id is the id of the ad. The parent object type can be also determined from **fb_graph_node** column as a substring from the beginning until the last occurrence of underscore, e.g. page\_ads\_insights -> page_ads. The top parent id is an ad account id.

## Facebook API Version
You can set version of Facebook Marketing API that will be applied for all request made to Facebook Markegint API by facebook extractor. Read more about Marketing API versions [here](https://developers.facebook.com/docs/marketing-api/versions).
