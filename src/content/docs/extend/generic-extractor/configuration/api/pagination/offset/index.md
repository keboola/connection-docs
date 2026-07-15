---
title: Offset Scroller
slug: 'extend/generic-extractor/configuration/api/pagination/offset'
---


The Offset scroller handles a pagination strategy in which the API splits the results into pages
of the same size (limit parameter) and navigates through them using the **item offset** parameter. This 
is similar to paging in SQL language. If you need to use the page offset, use the 
[Page Number Scroller](/extend/generic-extractor/configuration/api/pagination/pagenum/).

An example configuration:

```json
{
    "api": {
        "pagination": {
            "method": "offset",
            "limit": 100,
            "limitParam": "count",
            ...
        },
        ...
    }
}
```

## Configuration Parameters
The following configuration parameters are supported for the `offset` method of pagination:

- `limit` (required, integer) --- page size
- `limitParam` (optional, string) --- name of the parameter in which the API expects the page size; the default value is `limit`.
- `offsetParam` (optional, string) --- name of the parameter in which the API expects the item offset; the default value is `offset`.
- `firstPageParams` (optional, boolean) --- when false, the first page is retrieved without the page parameters; the default value is `true`.
- `offsetFromJob` (optional, boolean) --- when true, the offset parameter value is taken from the job parameters; the default value is `false`.

The limit value is configured by the `limit` parameter, but it may be overridden in 
the [job parameters](/extend/generic-extractor/configuration/config/jobs/#request-parameters). The offset value is computed automatically starting from 0, but it may be overridden in the job parameters if `offsetFromJob` is set to `true`.

**Important:** Do not set the limit parameter above the limit supported by the API. To give an example, if the API returned 
100 items at most and you set the limit 1000, it would cause the extraction to stop after the first page. This is because the 
[underflow condition](/extend/generic-extractor/configuration/api/pagination/#stopping-strategy) would be triggered.

### Stopping Condition
Scrolling is stopped **when the result contains less items than requested**	 --- specified in the
`limit` configuration (underflow). This also includes an instance when no items are returned, or the 
response is empty.

Let's say that you have an API endpoint `users` which takes the parameters `limit` and `offset`. 
There are four users in total. The response looks as follows:

```json
[
    {
        "id": 345,
        "name": "Jimmy Doe"
    },
    {
        "id": 456,
        "name": "Jenny Doe"
    }
]
```

Querying `users?offset=0&limit=2` returns the first two users. Querying `users?offset=2limit` returns
the second two users. Generic Extractor will then query `users?offset=4&limit=2`. 

If the response is empty (the API returns an empty page, `[])`, the **underflow** check kicks in 
and the extraction is stopped. See [example [043]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/043-paging-stop-underflow).

Note that the **emptiness** is evaluated on the extracted array as [auto-detected](/extend/generic-extractor/configuration/config/jobs/#data-field) or 
specified by the [`dataField`](/extend/generic-extractor/configuration/config/jobs/#data-field) configuration. 
That means that the entire response
may be non-empty. See [example [044]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/044-paging-stop-underflow-struct).

You will also see the following warning in the logs:

    WARNING: dataField `results.users.items` contains no data!

which is expected.

All [common stopping conditions](/extend/generic-extractor/configuration/api/pagination/#stopping-strategy) apply as well.

## Examples
This section contains three examples of API pagination using the Offset Scroller.

### Basic Scrolling
This is the simplest scrolling setup:

```json
"pagination": {
    "method": "offset",
    "limit": "20"
}
```

The first request is sent with the parameters `limit=20` and `offset=0`, for example, `/users?limit=20&offset=0`.
The next request has `limit=20` and `offset=20`, for example, `/users?limit=20&offset=20`.
See [example [EX043]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/043-paging-stop-underflow) and
[example [EX044] with a more structured response](https://github.com/keboola/generic-extractor/tree/master/doc/examples/044-paging-stop-underflow-struct).

### Renaming Parameters
The `limitParam` and `offsetParam` configuration options allow you to rename the limit and 
offset for the needs of a specific API:

```json
"pagination": {
    "method": "offset",
    "limitParam": "count",
    "offsetParam": "skip",
    "limit": "100"
}
```

Here the API expects the parameters `count` and `skip`. The first request will be sent with the parameters `count=100` 
and `skip=0`, for example, `/users?count=2&skip=0`. 

See [example [EX049]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/049-pagination-offset-rename).

### Overriding Limit and Offset
It is possible to override both the limit and offset parameters of a specific API job. 
This is useful in case you want to use different limits for different API endpoints.

In the configuration below, the first API request to the `users` endpoint will be
`GET /users?count=2&skip=2`. This is because the values `count=2` and `skip=2` are taken from the 
job `params`. 

Notice that the job `params` names must correspond to the names of the offset and limit parameters 
(`skip` and `count` in this case). The limit parameter is always overridden to 5, no setting is necessary. 
The offset parameter is overridden to 2; this requires setting `offsetFromJob`. 
Without it being set, the `jobs.params.skip` value would be ignored. 

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "offset",
                "limitParam": "count",
                "offsetParam": "skip",
                "offsetFromJob": true,
                "limit": "20"
            }
        },
        "config": {
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items",
                    "params": {
                        "count": 2,
                        "skip": 2
                    }
                },
                {
                    "endpoint": "orders",
                    "dataField": "items",
                    "params": {
                        "count": 10
                    }
                }
            ]            
        }
    }
}
```

The entire endpoint configuration means that the first two items of the `users` endpoint will be skipped.
For the `orders` endpoint, the `skip` (offset) parameter is not overridden, and therefore it starts at zero.
The `count` (limit) parameter is set to 10. Therefore the first request to that endpoint will be
`GET /orders?count=10&skip=0`. 

See [example [EX050]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/050-pagination-offset-override).
