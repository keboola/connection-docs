---
title: Multiple Scrollers
slug: 'extend/generic-extractor/configuration/api/pagination/multiple'
---


Setting the pagination method to `multiple` allows you to use **multiple scrollers on a single API**.
This type of pagination contains the definition of all scrollers used in the entire configuration.
Each [job](/extend/generic-extractor/configuration/config/jobs/) is then assigned a 
[`scroller`](/extend/generic-extractor/configuration/config/jobs/#scroller) in its configuration.

This is useful mainly if the API has inconsistent pagination methods among various API calls. 
It may be also useful in case you need to vary parameters --- for instance, set different page sizes for
different endpoints.

```json
{
    "api": {
        "pagination": {
            "method": "multiple",
            "scrollers": {
                "resource_scroller": {
                    "method": "offset",
                    "limit": 100
                },
                "search_scroller": {
                    "method": "pagenum"
                }
            }
        },
        ...
    },
    ...
}
```

## Configuration
The following configuration parameters are supported for the `multiple` method of pagination:

- `scrollers` (required, object) --- object with configuration of the scrollers (see below)
- `default` (optional, string) --- name of a scroller used for all jobs without a specified scroller; if not 
specified, then the jobs with no assigned scroller will not use any type of pagination.

The `scrollers` configuration is an object whose keys are arbitrary scroller names. The values of the 
keys are standard scroller configurations. Any of the supported 
[paging strategies](/extend/generic-extractor/configuration/api/pagination/#paging-strategy) can be used, and 
multiple paging strategies can be mixed. The configurations are the same as if there was a single scroller.
The name of the scroller must be used in a specific [job `scroller` parameter](/extend/generic-extractor/configuration/config/jobs/#scroller).

A `default` scroller can be set (must be one of the names defined in `scrollers`). In that case, all jobs
without an assigned scroller will use the default one.

### Stopping Condition
There are no specific stopping conditions for the `multiple` pagination. Each scroller acts upon its 
normal stopping conditions.

## Examples
Assume you have an API with several endpoints (`/users`, `/orders`, `/search`, etc.). Most endpoints
use the offset pagination strategy (meaning that the results are split into pages of the same size, and 
the next page is obtained by setting offset to a multiple of the page size). The `/search` endpoint uses the 
page number pagination strategy because the retrieved pages are not of equal size. The following 
configuration extracts from two endpoints with different paging strategies.

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "multiple",
                "scrollers": {
                    "list_scroller": {
                        "method": "offset",
                        "limit": "2"
                    },
                    "search_scroller": {
                        "method": "pagenum"
                    }
                },
                "default": "list_scroller"
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users"
                },
                {
                    "endpoint": "search",
                    "scroller": "search_scroller"
                }
            ]
        }
    }
}
```

The `api.pagination.scrollers` defines both pagination methods: 

```json
"scrollers": {
    "list_scroller": {
        "method": "offset",
        "limit": "2"
    },
    "search_scroller": {
        "method": "pagenum"
    }
}
```

It is then important to actually use the scroller in the `job.scroller` configuration for the endpoint `/search`. 
The endpoint `/users` has no assigned scroller, therefore it uses the default one, which is `list_scroller`.

See [example [EX062]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/062-pagination-multiple-scrollers).