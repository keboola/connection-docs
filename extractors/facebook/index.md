---
title: Facebook
permalink: /extractors/social/facebook/
redirect_from:
  - /extractors/facebook/
---

* TOC
{:toc}

This extractor allows to extract data from Facebook using [Facebook Graph API](https://developers.facebook.com/docs/graph-api). The data involve pages [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed) including comments, likes etc and also pages or posts [insights](https://developers.facebook.com/docs/graph-api/reference/v2.8/insights).

## Create and Initiate New Configuration

 1. Find Facebook under the **Extractors** section. Create a new configuration and name it. It can be renamed any time.

    ![Screenshot - Create configuration](/extractors/facebook/createconfig.png){: .image-popup}

 2. Authorize a Facebook account under which you have access to a Facebook page you want to extract. The authorization process asks for `read_insights,public_profile,pages_show_list` [permissions](https://developers.facebook.com/docs/facebook-login/permissions). To irrecoverably dissmiss the authorized account, then go to your [Facebook apps tab(under settings)](https://www.facebook.com/settings?tab=applications) and remove `Keboola Connection Extractor` from the list.

    ![Screenshot - Authorize configuration](/extractors/facebook/authorizefb.png){: .image-popup}

 3. Select Facebook pages to extract from the list of fetched pages associated with the authorized account.

    ![Screenshot - Select Facebook Pages](/extractors/facebook/selectpages.png){: .image-popup}

## Create New Query

Create new query that specifies data to extract. You can choose from a preconfigured template and all necessary fields will fill up automatically.
![Screenshot - New Query](/extractors/facebook/newquery.png){: .image-popup}

The query is basically a description of request that will extractor make to Facebook Graph Api. All parameters except Name listed below represent a parameter of [Facebook Graph API request](https://developers.facebook.com/docs/graph-api/using-graph-api), so with a good knowledge of the api it should be easy to create a query. Query contains the following parameters:

### Name

Name describes the query and is used to prefix tables name resulting from the query. One query can produce multiple tables. If a table name produced by a query matches the query name or its substring trimmed after the last occurence of underscore then the output table name will not be prefixed and used the query name instead, e.g if query name is `posts_insights` and produced table name is `insights` then output table will be `posts_insights` unlike if query name is `foo` and produced table name is `likes` then output table name will be `foo_likes`.

### Endpoint

String describing significant url part of request made to Facebook Graph API. Can be also empty. The absolute url is in form `https://graph.facebook.com/<api_version>/<endpoint>`. For more info see the [list of supported Facebook Graph API page endpoints](https://developers.facebook.com/docs/graph-api/reference/page/). Typical example could be [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed). If left empty then it references to data of Facebook page itself such as `insights`.

### Fields
Required string that precisely describes the data returned from the endpoint. Typically it is a comma-separated list of fields but also can be used to parametrize the fields or/and nest more endpoints into it. If we look at a [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed endpoint it returns all posts created by a Facebook page. Each posts contain fields such as caption, message, created_time or type etc. so the fields parameter in such case is `caption,message,created_time,type`.

- **Fields/Endpoint Nesting**
    Posts can contain comments and these can be included in fields as well: `caption,message,created_time,type,comments{message,created_time,from}`. The comma separated list in between the curly brackets `{}` specifies fields of the "nested" field/endpoint [comment](https://developers.facebook.com/docs/graph-api/reference/v2.8/comment/) for each post(i.e. feed endpoint). This way can be nested more endpoints and basically there is no limit of nesting level. If we want also likes of comments of posts then the fields parameter would be: `caption,message,created_time,type,comments{message,created_time,from,likes{name,username}}`.

- **Fields Parameterization**
    Each field can be parameterized by a dot following the parameter/modifier name and value in brackets. Typical parameter could be **since, until or limit** or any other parameters or modifiers that the particular endpoint offers such as **metrics** for [insights](https://developers.facebook.com/docs/graph-api/reference/v2.8/insights) endpoint. Example of parameterized fields: `comments.since(2 days ago).until(yesterday){message,created_time,from}` or `insights.since(1000 days ago).metric(page_views_total)`

### Pages
Specifies Facebook page that the query will be applied to. Can be chosen from a list of selected pages after authorization. There is `All Pages` option meaning that all selected pages will be applied as well as `None` meaning that no page will be applied - this can be useful to extracted data about the authorized account itself. It is represented by Facebook Graph API parameter `ids` that is comma separated list of page ids.

### Since and Until (Advanced tab)
Represents corresponding Facebook Graph API request parameters and specifies date range that will be applied to time based data retrieved by the **endpoint**, e.g. if endpoint is `feed` then all posts created within the since-until range will be retrieved. Since or Until parameter is parsed via [strtotime function](http://php.net/manual/en/function.strtotime.php) and can be specified:

- **absolutely** as a unix timestamp or in `yyyy-mm-dd` format
- **relatively** e.g. "14 days ago" or "last month"

For consistent results, specify both since and until parameters. Also, it is recommended that the time difference is a maximum of 6 months.

### Limit (Advanced Tab)
Represents Facebook Graph API request parameter `limit` and is the maximum number of objects that may be returned in one page of the request. Default is 25 and maximum is 100. It is useful when Facebook Graph Api returns error saying there are too many data requested, in such cases lower the limit and retry the query run.

## Output Data Description
Output data represent tree where each node is array of objects returned from Facebook Graph API and transformed into one or more CSV tables. Each row of table represents one object. Each table has primary key auto-detected during extraction and so table data is **imported incrementally**. Columns of the output tables represent fields from the **fields** query parameter. Moreover each table will always contain the following basic set of columns:

- **id** id returned by Facebook Graph API
- **ex_account_id** Id of Facebook page corresponding to the object stored in the row
- **fb_graph_node** describes the objects "vertical position" of the resulting tree. e.g for comments it will be `page_feed_comments`, for sub-comments (i.e. comments of comments) it will be `page_feed_comments_comments` etc
- **parent_id** refers to **id** column of a parent object represented by some other row and/or table. For example if the row is representing a comment object then its parent is post and so parent_id is the id of the post. The parent object type can be also determined from **fb_graph_node** column as a substring from the beginning until the last occurrence of underscore, e.g. page\_feed\_comments -> page_feed. The top parent id is a Facebook page id.
