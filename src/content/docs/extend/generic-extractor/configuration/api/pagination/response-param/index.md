---
title: Response Parameter Scroller
slug: 'extend/generic-extractor/configuration/api/pagination/response-param'
---


The Response Parameter Scroller can be used with APIs that provide a certain kind
of value in the response which must be used in the next request.

```json
{
    "api": {
        "pagination": {
            "method": "response.param",
            "responseParam": "links.next",
            "queryParam": "page"
        },
        ...
    },
    ...
}
```

## Configuration Parameters
The following configuration parameters are supported for the `response.param` method of pagination:

- `responseParam` (required, string) --- path to the key which contains the value used for scrolling
- `queryParam` (required, string) --- name of the [query string](/extend/generic-extractor/tutorial/rest/#url) parameter in which
the above value should be sent to the API; the `queryParam` **overrides** the values from the [job
parameters](/extend/generic-extractor/configuration/config/jobs/#request-parameters)
(see an [example](#overriding-parameters)).
- `includeParams` (optional, boolean) --- when `true`, the job parameters
**are added** to the provided URL. The default value is `false`.
- `scrollRequest` (optional, object) --- [job-like](/extend/generic-extractor/configuration/config/jobs/) object (supported fields are
`endpoint`, `method` and `params`) which allows to sent an initial scrolling request (see an [example](#using-scroll-request)).

### Stopping Condition
The pagination ends **when the value of `responseParam` parameters is empty** --- the key is not present at all, is null, is
an empty string, or is `false`. Take care when configuring the `responseParam` parameter. If you, for example, misspell the name of
the key, the extraction will not go beyond the first page.
[Common stopping conditions](/extend/generic-extractor/configuration/api/pagination/#stopping-strategy) also apply.

## Examples
The following API pagination examples demonstrate the use of the Response Parameter Scroller.

### Basic Configuration
Assume you have an API which returns, for instance, the next page number inside the response:

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
    "scrolling": {
        "next_page": 2
    }
}
```

The following configuration can handle such situation:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "response.param",
                "responseParam": "scrolling.next_page",
                "queryParam": "page"
            }
        },
        "config": {
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items"
                }
            ]
        }
    }
}
```

The first request is sent to `/users`. For the second request, the value found in the response
in the property `scrolling.next_page` is sent as the `page` parameter. Therefore the request
is sent to `/users?page=2`.

See [example [EX057]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/057-pagination-response-param-basic).

### Overriding Parameters
The following configuration passes the parameter `orderBy` to every request:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "response.param",
                "responseParam": "scrolling.next_page",
                "includeParams": true,
                "queryParam": "page"
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items",
                    "params": {
                        "page": "start",
                        "orderBy": "id"
                    }
                }
            ]
        }
    }
}
```

The `includeParams` configuration set to `true` causes the parameters from the `job.params` settings to
be sent with every request. If you set `includeParams` to false, they will be sent only with
the first request.

Also notice that the `page` parameter from `job.params` is overridden by the `page` parameter specified
in the `pagination.queryParam`. Therefore the first request is sent to `/users?page=start&orderBy=id`
and the second request to `/users?page=2&orderBy=id`.

See [example [EX058]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/058-pagination-response-param-override).

### Using Scroll Request
The response param scroller supports sending of an initial scrolling request. This can be used
in situations where the API requires special initialization of a scrolling endpoint;
for instance, the [Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/5.2/search-request-scroll.html).
Another example is an API which has something like a search endpoint which needs an initial request and
then allows you to scroll through the results (this is not exactly [RESTful](/extend/generic-extractor/tutorial/rest/) though).

Let's consider an API which --- to list users --- requires that you send a POST request to the
`/search` endpoint with the configuration:

```json
{
    "object": "users",
    "orderBy": "id"
}
```

It will then respond with a **search token** representing an internal cursor:

```json
{
    "scroll": {
        "token": "b97d814f1a715d939f3f96bc574445de",
        "totalCount": 4
    }
}
```

To obtain the actual result, send a request to the `/results` endpoint with the parameter
`scrollToken=b97d814f1a715d939f3f96bc574445de`. The response looks like this:

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
    "scroll": {
        "token": "4015e9ce43edfb0668ddaa973ebc7e87"
    }
}
```

The following configuration is able to handle the situation:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "response.param",
                "responseParam": "scroll.token",
                "queryParam": "scrollToken",
                "scrollRequest": {
                    "endpoint": "results",
                    "method": "GET"
                }
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "search",
                    "method": "POST",
                    "dataField": "items",
                    "dataType": "users",
                    "params": {
                        "object": "users",
                        "orderBy": "id"
                    }
                }
            ]
        }
    }
}
```

The configuration is actually turned upside-down. The `jobs` section defines the initial search request
(`POST` to `/search` with the required parameters `object` and `orderBy`). The first request sent to the API
is therefore:

    POST /search

    {"object":"users","orderBy":"id"}

When the response contains a `scroll.token` field, the scroller starts to act and overrides the above
configuration with the one provided in the `scrollRequest` configuration. The next request is therefore
a `GET` to `/results?scrollToken=b97d814f1a715d939f3f96bc574445de`. The `queryParam` configuration
causes the `scrollToken` request parameter to be added. This will repeat until the `scroll.token` field in
the response is empty.

See [example [EX059]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/059-pagination-response-param-scroll-request).
