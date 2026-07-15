---
title: Iterations
slug: 'extend/generic-extractor/configuration/iterations'
redirect_from:
    - /extend/generic-extractor/iterations/
---


The `iterations` section allows you to **execute a configuration multiple times, each time with different
values**. The most typical use for `iterations` is extraction of the same data from multiple accounts.
Iterations can always be replaced by creating multiple complete configurations of Generic Extractor.

Iterations are specified as an array of objects, where each object contains the same properties
as the [`config`](/extend/generic-extractor/configuration/config/) section. All properties of the object are optional.

Consider the following example of an `iterations` configuration defining that the entire Generic Configuration
will be executed twice: the first time with the username `JohnDoe`, and the second time with the username
`DoeJohn`.

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "users"
                }
            ]
        },
        "iterations": [
            {
                "username": "JohnDoe",
                "#password": "TopSecret"
            },
            {
                "username": "DoeJohn",
                "#password": "EvenMoreSecret"
            }
        ]
    }
}
```

Since **all `iterations` properties override the `config` properties**, they are accessible
as [configuration attributes](/extend/generic-extractor/functions/#configuration-attributes)
via the `attr` property.

Keep in mind that `iterations` can refer directly only to the things specified in the `config` section.
For the `api` section, you must use [functions](/extend/generic-extractor/functions/).
Also, it is not possible to iterate over values returned in the response.
The number of iterations and their values must be defined in the configuration.

## Configuration
Because the values defined in `iterations` override those in the `config` section,
everything that can be in the `config` section is allowed as well
(including arbitrary user attributes used in [functions](/extend/generic-extractor/functions/)).
Using `jobs` and `mappings` in iterations does not make much sense though.

Also, if you use `userData` in iterations, they must result in the same columns; otherwise the resulting
table cannot be imported into Storage. If you use `incrementalOutput`, only the last value of `incrementalOutput`
is honoured.

## Examples

### Iterating Parameters
Suppose, you have an API which takes a URL parameter `account_id`, which restricts the returned data to a
certain account. The following configuration executes the entire configuration for two accounts --- `345` and `456`:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "userData": {
                "account": {
                    "attr": "accountId"
                }
            },
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "account_id": {
                            "attr": "accountId"
                        }
                    }
                }
            ]
        },
        "iterations": [
            {
                "accountId": 345
            },
            {
                "accountId": 456
            }
        ]
    }
}
```

Since the `iterations` section overrides the values in the `config` section, the below configuration
yields the exact same results as the configuration above:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "accountId": 123,
            "userData": {
                "account": {
                    "attr": "accountId"
                }
            },
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "account_id": {
                            "attr": "accountId"
                        }
                    }
                }
            ]
        },
        "iterations": [
            {
                "accountId": 345
            },
            {
                "accountId": 456
            }
        ]
    }
}
```

It looks as if the first execution is with `account_id=123`, but it is not the case. The configuration
will be executed only twice: the first time with `account_id=345` and the second time with `account_id=456`.
See [example [EX112]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/112-iterations-params).

### Iterating Headers
Suppose you have an API from which you want to extract data from two accounts (`JohnDoe` and `DoeJohn`). The
API uses the [HTTP Basic Authentication](/extend/generic-extractor/configuration/api/authentication/basic/) method, and in addition,
each user has their own API token, which must be provided in the `X-Api-Token` header.

Even if the above parameters relate to the [`api` configuration](/extend/generic-extractor/configuration/api/), which cannot
be directly included in `iterations`, we can specify them as `http.headers` and therefore it is still possible to use them.

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ]
        },
        "iterations": [
            {
                "http": {
                    "headers": {
                        "X-Api-Token": "1234abcd"
                    }
                },
                "username": "JohnDoe",
                "#password": "TopSecret"
            },
            {
                "http": {
                    "headers": {
                        "X-Api-Token": "zyxv9876"
                    }
                },
                "username": "DoeJohn",
                "#password": "EvenMoreSecret"
            }
        ]
    }
}
```

Next to `username` and `#password` from the `config` section, the above configuration overrides also
the `http.headers.X-Api-Token` setting. The configuration can be simplified by using
[functions and references](/extend/generic-extractor/functions/):

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "http": {
                "headers": {
                    "X-Api-Token": {
                        "attr": "apiToken"
                    }
                }
            },
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ]
        },
        "iterations": [
            {
                "apiToken": "1234abcd",
                "username": "JohnDoe",
                "#password": "TopSecret"
            },
            {
                "apiToken": "zyxv9876",
                "username": "DoeJohn",
                "#password": "EvenMoreSecret"
            }
        ]
    }
}
```

Here, the `config` section specifies the part of the token authentication which is common to both iterations.
Each iteration then specifies only the token. By writing `"attr": "apiToken"` under `X-Api-Token` we say that
`X-Api-Token` will have the value of the `apiToken` property from the `config` section. That property is in
turn specified in the iteration objects.

See [example [EX113]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/113-iterations-headers).
