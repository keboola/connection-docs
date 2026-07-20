---
title: Response URL Scroller
slug: 'components/extractors/generic-extractor/configuration/api/pagination/response-url'
redirect_from:
    - /extend/generic-extractor/configuration/api/pagination/response-url/
---


The Response URL Scroller can be used with APIs that provide the URL of the 
next page in the response. This scroller is suitable for APIs supporting the 
[JSON API specification](https://jsonapi.org/format/#fetching-pagination).

```json
{
    "api": {
        "pagination": {
            "method": "response.url",
            "urlKey": "links.next"
        },
        ...
    }
}
```

## Configuration Parameters
The following configuration parameters are supported for the `response.url` pagination method:

- `urlKey` (optional, string) --- path in the response to the field which contains the URL of the next request; 
the default value is `next_page`.
- `delimiter` (optional, string) --- char used as the delimiter of the nested keys in the `urlKey`; 
the default value is `.`.
- `paramIsQuery` (optional, boolean) 
	- if `true` --- URL is assumed to be only [query string](/components/extractors/generic-extractor/tutorial/rest/#url) parameters; 
	the parameters in the response **override** the [parameters in the job](/components/extractors/generic-extractor/configuration/config/jobs/#request-parameters). 
	- if `false` --- URL with a path is assumed. `false` is the default value; the parameters in the response 
	**are overridden** by the parameters in the job. 
- `includeParams` (optional, boolean) 
	- if `true` --- job parameters **are added** to the parameters of the URL provided in the response; the default value is `false`. 

See the [examples below](#examples).

### Stopping Condition
The pagination ends **when the value of the `urlKey` parameter is empty** --- the key is not present at all, is null,
is an empty string or is `false`. Be careful when configuring the `urlKey` parameter. If you, for example, misspell the
key name, the extraction will not go beyond the first page. 
[Common stopping conditions](/components/extractors/generic-extractor/configuration/api/pagination/#stopping-strategy) also apply.

## Examples
This section provides three API pagination examples where the Response URL Scroller is used.

### Basic Configuration
To configure pagination for an API that supports the [JSON API specification](https://jsonapi.org/format/#fetching-pagination),
use the configuration below:

```json
"pagination": {
    "method": "response.url",
    "urlKey": "links.next"
}
```

The configuration expects a response to contain a `links.next` field with the URL of the next page, e.g.:

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
    "links": {
        "next": "/users?page=2"
    }
}
```

The URL may be either an *absolute link* (`http://example.com/users?page=2`) or an *absolute path* (`/users?page=2`). 
If the URL is *relative* (`users?page=2`), it is appended to the endpoint URL.

See [example [EX054]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/054-pagination-response-url-basic).

### Merging Parameters
To pass additional parameters to each of the page URLs, use the `includeParams` parameter:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "response.url",
                "urlKey": "links.next",
                "includeParams": true
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
                        "account": 123
                    }
                }
            ]
        }
    }
}
```

A sample response:

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
    "links": {
        "next": "/users?page=2"
    }
}
```

In the above configuration, the `account` parameter is sent with every API request. If it were not for the
`includeParams` option, it would be sent **only with the first request**. Note that adding 
a `jobs.params.page` parameter would overwrite the `page` parameter in the response URL and thus 
would probably break the paging.

See [example [EX055]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/055-pagination-response-url-params).

### Overriding Parameters
Sometimes the API does not pass the entire URL, but only the [query string](/components/extractors/generic-extractor/tutorial/rest/#url)
parameters which should be used for querying the next page.

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
    "links": {
        "next": "?page=2"
    }
 }
```

Then use the `paramsIsQuery` configuration so that your Generic Extractor can produce a 
valid URL:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://mock-server:80/056-pagination-response-url-params-override/",
            "pagination": {
                "method": "response.url",
                "urlKey": "links.next",
                "paramIsQuery": true,
                "includeParams": true
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
                        "account": 123,
                        "page": "start"
                    }
                }
            ]
        }
    }
}
```

Also notice that with the above 
configuration the `page` parameter specified in the job is used only for the first page because it 
is overridden by the `page` parameter given in the response. That is to say that the first request is sent to
`/users?account=123&page=start` and the second request is sent to `/users?account=123&page=2`.

See [example [EX056]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/056-pagination-response-url-params-override).
