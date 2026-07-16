---
title: Pagination
slug: 'extend/generic-extractor/configuration/api/pagination'
---


*If new to Generic Extractor, learn about [pagination in our tutorial](/extend/generic-extractor/tutorial/pagination/) first.*
*Use [Parameter Map](/extend/generic-extractor/map/) to help you navigate among various configuration options.*

[Pagination](https://en.wikipedia.org/wiki/Pagination), or paging, describes **how an API splits a large list of items into
separate pages**. Pagination may also be called scrolling or traversing (scrolling through a large result set). Sometimes
it is also referred to as setting a [cursor](https://en.wikipedia.org/wiki/Cursor_(databases)) (pointing to a current
result).

Almost every API has some form of pagination because returning extensive lists of large results is impractical for many
reasons, such as memory overflow issues and long transfer and processing times. So, unless you only want to do an ad-hoc query to
extract thousands of items at most, setting pagination is important.

When configuring Generic Extractor, there is a slight distinction between pagination and scrolling:

- **Pagination** describes paging of the entire API.
- **Scrolling** (scroller) describes paging of a single resource.

As long as the API uses the same pagination method for all resources, there is no need to distinguish between the
two. Setting up pagination for Generic Extractor boils down to two crucial questions:

- **How to obtain the next set of items?** (paging strategy)
- **How to determine that all items were obtained and scrolling can stop?** (stopping strategy)

An example pagination configuration looks like this:

```json
{
    ...,
    "pagination": {
        "method": "offset",
        "limit": "2"
    }
}
```

## Paging Strategy
Generic Extractor supports the following paging strategies (scrollers); they are configured
using the `method` option:

- [`response.url`](/extend/generic-extractor/configuration/api/pagination/response-url/) --- uses a URL provided in the response.
- [`offset`](/extend/generic-extractor/configuration/api/pagination/offset/) --- uses the page size (limit) and **item offset** (like in SQL).
- [`pagenum`](/extend/generic-extractor/configuration/api/pagination/pagenum/) --- uses the page size (limit) and **page number**.
- [`response.param`](/extend/generic-extractor/configuration/api/pagination/response-param/) --- uses a specific value (token) provided in the response.
- [`cursor`](/extend/generic-extractor/configuration/api/pagination/cursor/) --- uses the identifier of the item in response to maintain a scrolling cursor.
- [`multiple`](/extend/generic-extractor/configuration/api/pagination/multiple/) --- allows to set different scrollers for different API endpoints.

### Choosing Paging Strategy
If the API responses contain direct links to the next set of results, use the
[`response.url` method](/extend/generic-extractor/configuration/api/pagination/response-url/).
This applies to the APIs following the [JSON API specification](https://jsonapi.org/). The response usually
contains a `links` section:

```json
{
    "results": [
        ...
    ],
    "links": {
        "next": "http://example.com/posts?page=2"
    }
}
```

If the API response contains a parameter used to obtain the next page, use the
[`response.param` method](/extend/generic-extractor/configuration/api/pagination/response-param/).
It is preferred to use an
authoritative value provided by the API than any of the following methods.
This can be some kind of scrolling token or even a page number of the next page, for example:

```json
{
    "results": [
        ...
    ],
    "scrolling": {
        "next_page": 2
    }
}
```

If the API does not provide a scrolling hint within the response, use one of the
`offset`, `pagenum` or `cursor` methods:

- Use the [`pagenum` method](/extend/generic-extractor/configuration/api/pagination/pagenum/) if the API expects the **page**
number/index. For example, `/users?page=2` retrieves the 2nd page regardless of how many items the page contains.
- Use the [`offset` method](/extend/generic-extractor/configuration/api/pagination/offset/) if the API expects the **item**
number/index. For example, `/users?startWith=20` retrieves the 20th and following items.
- Use the [`cursor` method](/extend/generic-extractor/configuration/api/pagination/cursor/) if the API expects an item **identifier**.
For example, `/users?startWith=20` retrieves an item with ID 20 and the following items.

If the API uses different paging methods for different endpoints, use the
[`multiple` method](/extend/generic-extractor/configuration/api/pagination/multiple/) together with
any of the above methods.

## Stopping Strategy
Generic Extractor stops scrolling

- based on the `nextPageFlag` condition configuration.
- based on the `forceStop` condition configuration.
- based on the `limitStop` condition configuration.
- when the **same result** is obtained twice.

Apart from those, each pagination method may have its own
[stopping strategy](#combining-multiple-stopping-strategies).

The **same result** condition deals with the situation when there is no clear limit to
stop the scrolling. Generic Extractor keeps requesting higher and higher pages from the API.
Let's say that there are 150 pages of results in total. When Generic Extractor asks for page 151, various
situations can arise:

- Most common --- API returns an **empty page**; scrolling with
[`pagenum`](/extend/generic-extractor/configuration/api/pagination/pagenum/) and
[`offset` methods](/extend/generic-extractor/configuration/api/pagination/pagenum/) will stop, and other methods will probably stop
too (depends on how empty the response is).
- Less common --- API returns an **error** --- in this case a different stopping condition such as [`nextFlag`](#next-page-flag) or
[`forceStop`](#force-stop) has to be used.
- Less common --- API keeps returning the **last page**, the extraction is stopped when a page is obtained twice (see
[example [041]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/041-paging-stop-same)). If the API returns
the last page and it is the same as the previous page, the extraction is stopped. You will see this in the Generic Extractor logs as
the following message:

		Job '1234567890' finished when last response matched the previous!

- Even less common --- API keeps returning the **first page**, the extraction is stopped when a page is obtained twice (see
[example [EX042]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/042-paging-stop-same-2)). If the API returns
the first page, it is not same as the previous page and therefore another request is sent to `users?offset=6&limit=2`. Then the result
is the same as the previous page, the same check kicks in and the extraction is stopped too. However, the results from the first
page will be duplicated.

### Next Page Flag
The above describes automatic behavior of Generic Extractor regarding scrolling stopping.
Using **Next Page Flag** allows you to do a **manual setup of the stopping strategy**: Generic Extractor analyzes the response,
looks for a particular field (the flag) and decides whether to continue scrolling based on the value or presence of that flag.

Next Page Flag is configured using three options:

- **`field`** (required) --- name of a field containing any value. The field must be in the root of the response.
    It will be converted to [boolean](/extend/generic-extractor/tutorial/json/#data-values).
- **`stopOn`** (required) --- value to which the field will be compared to. When the values are equal, the scrolling stops.
- **`ifNotSet`** --- assumed value of the `field` in case it is not present in the response. It defaults to the `stopOn` value.

The boolean conversion has the following rules:

- `false`, `0`, `null`, string `"0"`, empty array `[]` is **`false`**.
- Everything else is **`true`**.

Example `nextPageFlag` setting:

```json
"pagination": {
    "nextPageFlag": {
        "field": "moreItems",
        "stopOn": false,
        "ifNotSet": true
    },
    ...
}
```

See our [Next Page Flag Examples](#next-page-flag-examples).

### Force Stop
Force stop configuration allows you to stop scrolling when some extraction limits are hit.
The supported options are:

- `pages` --- maximum number of pages to extract
- `time` --- maximum number of seconds the extraction should run
- `volume` --- maximum number of bytes which can be extracted

This is an example or the `forceStop` setting:

```json
"pagination": {
    "forceStop": {
        "pages": 20,
        "time": 3600
    },
    ...
}
```

The volume of the response is measured as number of bytes in compressed JSON. Therefore the response

```json
{
    "items": [
        {
            "id": 123,
            "name": "John Doe"
        },
        {
            "id": 234,
            "name": "Jane Doe"
        }
    ]
}
```

is compressed (minified) to:

```json
    {"items":[{"id":123,"name":"John Doe"},{"id":234,"name":"Jane Doe"}]}
```

which makes it 69 bytes long.

The following is a **force stop example** configuration that will stop scrolling after extracting two pages of results, or
after extracting 69 bytes of minified JSON data (whichever comes first).

```json
"pagination": {
    "forceStop": {
        "pages": 2,
        "volume": 69
    },
    "method": "offset",
    "limit": "2"
}
```

See [example [EX048]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/048-force-stop)
and [example [EX116]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/116-multiple-conditions-multiple-jobs)
(combining multiple conditions)
and [example [EX140]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/140-pagination-forcestop-child-filter)
(combining with child jobs).

### Limit Stop
Limit stop configuration allows you to stop scrolling when a specified number of items is extracted.
The supported options are:

- `count` (required, integer) --- total number of items to extract
- `field` (required, string) --- path to the key which contains the value with total number of items

The two options are **mutually exclusive**, but one of them is required. In both cases, the total number of items may not be
honored exactly. If the total amount is not divisible by the page size, then the leftover from the last page (if any)
is extracted too (see example [EX127](https://github.com/keboola/generic-extractor/tree/master/doc/examples/127-pagination-stop-field) and [EX138](https://github.com/keboola/generic-extractor/tree/master/doc/examples/138-pagination-stop-field-child-filter) (combining with child jobs)).
This is an example or the `limitStop` setting:

```json
"pagination": {
    "limitStop": {
        "field": "items.count"
    },
    ...
}
```

The above configuration will search the response for the key `count` inside the key `items`. The obtained value is
expected to be the total number of items to extract. In the sample response below, it will be `4`:

```json
{
    "items": [
        {
            "id": 123,
            "name": "John Doe"
        },
        {
            "id": 234,
            "name": "Jane Doe"
        }
    ],
    "scroller": {
        "count": 4,
        "offset": 0
    }
}
```

Note that if the field does not exist in the response (e.g., you misspell it in the configuration), paging stops after the first page.
See [example [EX126]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/126-pagination-stop-limit)
(a modified version of [EX049](https://github.com/keboola/generic-extractor/tree/master/doc/examples/049-pagination-offset-rename).
For `count` configuration, see [example [EX127]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/127-pagination-stop-field)
(a modified version of [EX051](https://github.com/keboola/generic-extractor/tree/master/doc/examples/051-pagination-pagenum-basic).

### Combining Multiple Stopping Strategies
All stopping strategies are evaluated simultaneously and for the scrolling to continue, none of
the stopping conditions must be met. In other words, the scrolling continues until any of the
stopping conditions is true. To this you need to account specific stopping strategies for
each scroller. For example, the scrolling of this configuration:

```json
"pagination": {
    "nextPageFlag": {
        "field": "isLast",
        "stopOn": true
    },
    "forceStop": {
        "pages": 20
    },
    "method": "offset",
    "limit": "10"
}
```

will stop if **any** of the following is true:

- An empty page is encountered (`offset` scroller specific).
- A page contains less then 10 items (`offset` scroller specific).
- A page contains the same items as the previous page.
- 20 pages were extracted (`forceStop`).
- The `isLast` field is present in the response and is true (`nextPageFlag`).
- The `isLast` field is not present in the response.

## Next Page Flag Examples
In this section, we want to show you the following examples of the Next Page Flag stopping strategy:

- Has-More Scrolling
- Non-Boolean Has-More Scrolling
- Is-Last Scrolling

### Has-More Scrolling
Assume that the API returns a response which contains a `hasMore` field. The field is present in
every response and has always the value `true` except for the last response where it is `false`.
The following pagination configuration can be used to configure the stopping strategy:

```json
"pagination": {
    "nextPageFlag": {
        "field": "hasMore",
        "stopOn": false,
        "ifNotSet": false
    },
    ...
}
```

It means that the scrolling will **continue** till the field `hasMore` is present in the response and true.
In this case, setting `ifNotSet` is not necessary.

See [example [EX045]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/045-next-page-flag-has-more)
and [example [EX139]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/139-pagination-hasmore-child-filter)] (combining with child jobs).

### Non-Boolean Has-More Scrolling
Assume that the API returns a response which contains a `hasMore` field. The field is present only in the
last response and has the value `"no"` there.
The following pagination configuration can be used to configure the stopping strategy:

The configuration:

```json
"pagination": {
    "nextPageFlag": {
        "field": "hasMore",
        "stopOn": true,
        "ifNotSet": false
    },
    ...
}
```

means that the scrolling will **continue** until the field `hasMore` is present. This takes advantage of the
boolean conversion which converts the value `"no"` to true. If the field `hasMore` is not present, it defaults
to false. In this case setting `ifNotSet` is mandatory.

See [example [EX046]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/046-next-page-flag-has-more-2).

### Is-Last Scrolling
Assume that the API returns a response which contains an `isLast` field. The field is present only in the
last response and has the value `true` there.
The following pagination configuration can be used to configure the stopping strategy:

```json
"pagination": {
    "nextPageFlag": {
        "field": "isLast",
        "stopOn": true,
        "ifNotSet": false
    },
    ...
}
```

The scrolling will **stop** when the field `isLast` is present in the response and true.
Because the field `isLast` is not present at all times, the `ifNotSet` configuration is required.

See [example [EX047]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/047-next-page-flag-is-last).

