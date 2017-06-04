---
title: Facebook
permalink: /extractors/social/facebook/
---

* TOC
{:toc}

This extractor uses the [Facebook Graph API](https://developers.facebook.com/docs/graph-api) to extract 
your Facebook pages [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed) 
(including comments, likes etc.), as well as pages or posts [insights](https://developers.facebook.com/docs/graph-api/reference/v2.8/insights).

## Create New Configuration
Find Facebook in the **Extractors** section, create a new configuration and name it. It can be renamed any time.

{: .image-popup}
![Screenshot - Create configuration](/extractors/social/facebook/createconfig.png)

Authorize the Facebook account with access to the Facebook page you want to extract.
You will be asked for the `read_insights,public_profile,pages_show_list` [permissions](https://developers.facebook.com/docs/facebook-login/permissions). 
Optionally, you can use `Direct token insert` to specify a manually generated access token.

You can always revoke the authorization by removing the *Keboola Connection Extractor* from the list
in the [Facebook apps tab](https://www.facebook.com/settings?tab=applications) (under settings).

{: .image-popup}
![Screenshot - Authorize configuration](/extractors/social/facebook/authorizefb.png)

From the list of fetched pages associated with the authorized account, select the Facebook pages you want to extract.

{: .image-popup}
![Screenshot - Select Facebook Pages](/extractors/social/facebook/selectpages.png)

## Create New Query
Create a new query and specify what data to extract. If you choose a preconfigured template,
all necessary fields will fill up automatically.

{: .image-popup}
![Screenshot - New Query](/extractors/social/facebook/newquery.png)

The query describes the extractor request to be sent to the Facebook Graph API. Knowing the API will make
creating a query easy because all options except `name` represent the [Facebook Graph API request](https://developers.facebook.com/docs/graph-api/using-graph-api) parameters.

### Name
The *Name* option describes the query and is used to prefix all table names resulting from the query.
One query can produce multiple tables. If a table name produced by the query matches the query name or 
its substring trimmed after the last occurrence of an underscore, then the output table name will not be 
prefixed and the query name will be used instead.

For example, if the query name is `posts_insights` and the produced table name is `insights`, the output
table name will be `posts_insights`. If the query name is `foo` and the produced table name is `likes`,
the output table name will be `foo_likes`.

### Endpoint
The *Endpoint* option describes a significant URL part of the request made to the Facebook Graph API.
The absolute URL is in the following form: `https://graph.facebook.com/<api_version>/<endpoint>`.
A typical example would be the [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed).
If left empty, the *Endpoint* option references data of the Facebook page itself.

For more information, see the [list of supported Facebook Graph API page endpoints](https://developers.facebook.com/docs/graph-api/reference/page/).

### Fields
The *Fields* option describes data returned from the endpoint. Typically, it is a comma-separated list of
fields but it also can be used to parametrize the fields and nest more endpoints into it.
The [feed](https://developers.facebook.com/docs/graph-api/reference/v2.8/page/feed) endpoint returns all
posts created by a Facebook page. Each post contains fields such as `caption`, `message`, `created_time`
and `type`. The fields parameter in such case is `caption,message,created_time,type`.

- **Fields/Endpoint Nesting** ---
    Posts can contain comments and these can be included in the *fields* as well: `caption,message,created_time,type,comments{message,created_time,from}`. The comma separated list in between the curly brackets `{}` specifies fields of the "nested" [comment](https://developers.facebook.com/docs/graph-api/reference/v2.8/comment/) field/endpoint for each post (feed endpoint). This way, more endpoints can be nested and there is no limit of nesting levels. If you wanted to include likes of posts comments,the fields parameter would be: `caption,message,created_time,type,comments{message,created_time,from,likes{name,username}}`.

- **Fields Parametrization** ---
    Each field can be parametrized by a dot following a parameter/modifier name and a value in brackets.
    Typical parameters would be `since`, `until` or `limit`,
    or modifiers that the particular endpoint offers such as `metrics` for the [insights](https://developers.facebook.com/docs/graph-api/reference/v2.8/insights) endpoint.
    An example of parametrized fields: `comments.since(2 days ago).until(yesterday){message,created_time,from}` or `insights.since(1000 days ago).metric(page_views_total)`.

### Pages
The *Pages* option specifies the Facebook page that the query will be applied to. It can be chosen from a
list of selected pages after authorization. There is the `All Pages` option meaning that the query will
be applied to all selected pages. The `None` option means that the query will not be applied to any pages.
It can be useful when extracting data about the authorized account itself. This option is represented
by the Facebook Graph API parameter `ids` that is a comma separated list of page ids.

### Since and Until (Advanced tab)
The *Since* and *Until* options represent corresponding Facebook Graph API request parameters and
specify the date range that will be applied to the time based data retrieved by the **endpoint**. For
example, if the endpoint is `feed` then all posts created within the specified since-until range will be retrieved.

The *Since*/*Until* parameter is parsed via the [strtotime function](http://php.net/manual/en/function.strtotime.php) and can be specified

- **absolutely** --- as a unix timestamp or in the `yyyy-mm-dd` format, or
- **relatively** --- e.g. `14 days ago` or `last month`.

For consistent results, specify both the *since* and *until* parameters. It is also recommended that the 
time range does not exceed 6 months.

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
- `ex_account_id` --- Id of the Facebook page corresponding to the object stored in the row
- `fb_graph_node` --- Describes the "vertical position" of the object in the resulting tree. For example,
for comments it will be `page_feed_comments`, for sub-comments (i.e. comments of comments) it will be
`page_feed_comments_comments`.
- `parent_id` --- Refers to the `id` column of a parent object represented by some other row and table.
For instance, if the row is representing a comment object, its parent is a post and `parent_id`
is the id of the post. The parent object type can be also determined from the `fb_graph_node` column as a
substring from the beginning until the last occurrence of an underscore. To give an example, if
`fb_graph_node` contains the value `page_feed_comments`, the parent object type is `page_feed`. The
top parent id is the Facebook page id.

## Facebook API Version
You can set the version of the Facebook Graph API that will be applied for all requests made to the API
by the Facebook extractor.

{: .image-popup}
![Screenshot - Api Version](/extractors/social/facebook/apiversion.png)

## Migration from Old Extractor
The configuration and resulting data tables produced by both new and old extractors are too different; 
that's why their migration has to be done manually by following the next seven steps:

1. Create a configuration of your new Facebook extractor
2. Migrate your Authorized Account (see below)
3. Add new queries to the configuration
4. Run the configuration
5. Preview and analyze the resulting tables
6. Update all corresponding transformations and writers with the new tables
7. Update all affected orchestrations

### Migration of Authorized Account

Use `Direct token insert` in the authorization modal and copy the access token stored in the old 
`sys.c-ex-facebook.accounts` sys table under the column token. For each row of the sys table, there has to 
be one configuration of the new extractor.

- Copy the token from the old configuration

{: .image-popup}
![Screenshot - New Query](/extractors/social/facebook/copytoken.png)

- Insert the copied token

{: .image-popup}
![Screenshot - New Query](/extractors/social/facebook/inserttoken.png)
