---
title: Facebook
permalink: /extractors/social/facebook/
redirect_from:
  - /extractors/facebook/
---

* TOC
{:toc}

This extractor allows to extract data from Facebook using [Facebook Graph API](https://developers.facebook.com/docs/graph-api).
The data involve pages [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed) including comments, likes etc
and also pages or posts [insights](https://developers.facebook.com/docs/graph-api/reference/v2.8/insights).

## Create New Configuration
Find Facebook under the **Extractors** section. Create a new configuration and name it. It can be renamed any time.

{: .image-popup}
![Screenshot - Create configuration](/extractors/facebook/createconfig.png)

Authorize a Facebook account under which you have access to a Facebook page you want to extract. The authorization process asks for `read_insights,public_profile,pages_show_list` [permissions](https://developers.facebook.com/docs/facebook-login/permissions). To irrecoverably dissmiss the authorized account, then go to your [Facebook apps tab(under settings)](https://www.facebook.com/settings?tab=applications) and remove `Keboola Connection Extractor` from the list.

{: .image-popup}
![Screenshot - Authorize configuration](/extractors/facebook/authorizefb.png)

Select Facebook pages to extract from the list of fetched pages associated with the authorized account.

{: .image-popup}
![Screenshot - Select Facebook Pages](/extractors/facebook/selectpages.png)

## Create New Query
Create new query that specifies data to extract. You can choose from a preconfigured template and all necessary fields will fill up automatically.

{: .image-popup}
![Screenshot - New Query](/extractors/facebook/newquery.png)

The query is basically a description of a request that the extractor will send to the Facebook Graph API. All options except `name` represent a
parameter of the [Facebook Graph API request](https://developers.facebook.com/docs/graph-api/using-graph-api), so with a good knowledge of the
API it should be easy to create a query.

### Name
Name describes the query and is used to prefix tables name resulting from the query. One query can produce multiple tables. If a table name produced by the query matches
the query name or its substring trimmed after the last occurrence of underscore then the output table name will not be prefixed and the query name will be used instead.
E.g. if the query name is `posts_insights` and the produced table name is `insights` then the output table name will be `posts_insights`. If the
query name is `foo` and the produced table name is `likes` then the output table name will be `foo_likes`.

### Endpoint
Endpoint is significant URL part of a request made to the Facebook Graph API. The absolute URL is in form `https://graph.facebook.com/<api_version>/<endpoint>`.
For more information see the [list of supported Facebook Graph API page endpoints](https://developers.facebook.com/docs/graph-api/reference/page/).
Typical example could be [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed). If left empty then it references data of the Facebook
page itself such as `insights`.

### Fields
Fields precisely describe the data returned from the endpoint. Typically it is a comma-separated list of fields but it also can be used to parametrize the
fields and also to nest more endpoints into it. If we look at a [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed) endpoint it returns all
posts created by a Facebook page. Each posts contains fields such as `caption`, `message`, `created_time`, `type`, etc. The fields parameter in such case
is `caption,message,created_time,type`.

- **Fields/Endpoint Nesting**
    Posts can contain comments and these can be included in fields as well: `caption,message,created_time,type,comments{message,created_time,from}`. The comma separated list
    in between the curly brackets `{}` specifies fields of the "nested" [comment](https://developers.facebook.com/docs/graph-api/reference/v2.8/comment/) field/endpoint for
    each post (feed endpoint). This way more endpoints can be nested and basically there is no limit of the nesting level. If you want also likes of comments of posts then
    the fields parameter would be: `caption,message,created_time,type,comments{message,created_time,from,likes{name,username}}`.

- **Fields Parameterization**
    Each field can be parameterized by a dot following the parameter/modifier name and value in brackets. Typical parameters could be `since`, `until` or `limit`
    or modifiers that the particular endpoint offers such as `metrics` for [insights](https://developers.facebook.com/docs/graph-api/reference/v2.8/insights) endpoint.
    Example of parameterized fields: `comments.since(2 days ago).until(yesterday){message,created_time,from}` or `insights.since(1000 days ago).metric(page_views_total)`

### Pages
The Pages option specifies Facebook page that the query will be applied to. Can be chosen from a list of selected pages after authorization. There is `All Pages` option meaning
that the query will be applied to all selected pages as well as `None` meaning that query will be applied to no pages. This can be useful to extract data about the
authorized account itself. This option is represented by Facebook Graph API parameter `ids` that is comma separated list of page ids.

### Since and Until (Advanced tab)
The *Since* and *Until* options represent corresponding Facebook Graph API request parameters and specifies date range that will be applied to time based data
retrieved by the **endpoint**. E.g. if the endpoint is `feed` then all posts created within the specified since-until range will be retrieved. Since or Until parameter
is parsed via [strtotime function](http://php.net/manual/en/function.strtotime.php) and can be specified:

- **absolutely** -- as a unix timestamp or in `yyyy-mm-dd` format,
- **relatively** -- e.g. `14 days ago` or `last month`.

For consistent results, specify both since and until parameters. Also, it is recommended that the time span does not exceed 6 months.

### Limit (Advanced Tab)
The *Limit* option represents Facebook Graph API request parameter `limit` and is the maximum number of objects that may be returned in one page of the request.
Default value is 25 and maximum value is 100. It is useful when Facebook Graph API returns an error saying there are too many data requested, in such
cases do lower the limit and retry the query run.

## Output Data Description
Output data represent [tree](https://en.wikipedia.org/wiki/Tree_(graph_theory)) where each node is an array of objects returned from Facebook Graph API. The
tree is transformed into one or more CSV tables. Each row of a table represents one object. Each table has primary key auto-detected during extraction and so
table data is **imported incrementally**. Columns of the output tables represent fields from the `Fields` query option. Moreover each table will always
contain the following basic set of columns:

- `id` -- Id returned by Facebook Graph API,
- `ex_account_id` -- Id of Facebook page corresponding to the object stored in the row
- `fb_graph_node` -- Describes the "vertical position" of the object in the resulting tree. E.g for comments it will
be `page_feed_comments`, for sub-comments (i.e. comments of comments) it will be `page_feed_comments_comments`.
- `parent_id` -- Refers to the `id` column of a parent object represented by some other row and table. For example if the row is representing a
comment object then its parent is post and so parent_id is the id of the post. The parent object type can be also determined
from `fb_graph_node` column as a substring from the beginning until the last occurrence of underscore. E.g. if `fb_graph_node` contains
the value `page_feed_comments`, then the parent object type is `page_feed`. The top parent id is a Facebook page id.

## Facebook API Version
You can set version of Facebook Graph API that will be applied for all request made to the Facebook Graph API by the Facebook extractor.

{: .image-popup}
![Screenshot - Api Version](/extractors/facebook/apiversion.png)
