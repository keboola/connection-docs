---
title: Query Authentication
slug: 'components/extractors/generic-extractor/configuration/api/authentication/query'
redirect_from:
    - /extend/generic-extractor/configuration/api/authentication/query/
---

Query Authentication provides the simplest authentication method, in which
the credentials are sent in the [request URL](/components/extractors/generic-extractor/tutorial/rest#url).
This method is most often used with APIs that authenticate using API tokens and
signatures. Dynamic values of query parameters can be generated using 
[user functions](/components/extractors/generic-extractor/functions/). 

## User Interface
In the user interface, you simply select the `Query` method and enter the key-value pairs of the query parameters.

![img.png](/components/extractors/generic-extractor/configuration/api/authentication/query.png)

***Note:** Unless you need multiple parameters, the [API Key authentication method](/components/extractors/generic-extractor/configuration/api/authentication/api_key) may be more suitable.*

## JSON

A sample Query authentication configuration looks like this:

```json
{
    "api": {
        ...,
        "authentication": {
            "type": "query",
            "query": {
                "apikey": "2267709"
            }
        }
    }
}
```

## Configuration Parameters
The following configuration parameters are supported for the `query` type of authentication:

- `query` (required, object): An object whose properties represent key-value pairs of the URL query.

## Basic Configuration Example
Let's say you have an API that requires an `api-token` parameter (with value 2267709) to be sent with
each request. The following authentication configuration does exactly that:

```json
"authentication": {
    "type": "query",
    "query": {
        "api-token": "2267709"
    }
}
```

For this use case, it is also possible to use the [`defaultOptions` setting](/components/extractors/generic-extractor/configuration/api/#default-parameters).
However, we recommend using the `authentication` setting for credentials so that the Generic Extractor
configuration remains organized.

See [example [EX077]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/077-query-auth).

## Configuration With Encrypted Token Example
Usually, you want the value used for authentication to be encrypted (the `api-token` parameter with the value 2267709 in our example), so you do not expose it to other users or store it in the configuration 
versions history. The following authentication configuration, combined with the parameter defined in the [`config`](/components/extractors/generic-extractor/configuration/config/) section, does 
that (the value with the prefix `#` is encrypted upon saving the configuration):

```json
{
    "api": {
        ...,
        "authentication": {
            "type": "query",
            "query": {
                "api-token": {
                    "attr": "#token"
                }
            }
        }
    },
    "config": {
        ...,
        "#token": "2267709" 
        }
    }
}
```

See [example [EX094]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/094-function-config-headers).
