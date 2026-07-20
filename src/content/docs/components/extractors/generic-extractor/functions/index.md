---
title: Functions
slug: 'components/extractors/generic-extractor/functions'
redirect_from:
    - /extend/generic-extractor/functions/
---


Functions are simple pre-defined functions that

- allow you to add extra flexibility when needed.
- can be used in several places in the Generic Extractor configuration to introduce dynamically generated values instead of
those provided statically.
- allow referencing the existing values in the configuration instead of copying them.
- are advantageous and sometimes necessary when [publishing your configuration as a new component](/components/extractors/generic-extractor/publish/).

## Configuration
A function is used instead of a simple value in specific parts of the Generic Extractor configuration (see [below](#function-contexts)).
A function configuration is an object with the properties `function` (one of the [available function names](#supported-functions) and `args`
(function arguments), for example:

```json
{
    "function": "concat",
    "args": [
        "John",
        "Doe"
    ]
}
```

The argument of a function can be any of the following:

- [Scalar](/components/extractors/generic-extractor/tutorial/json/#data-values) (simple) value (as in the above example)
- Reference to a value from [function context (see below)](#function-contexts)
- Another function object

Additionally, the function may be replaced by a plain reference to the function context. This means you can write (where permitted)
a configuration value in three possible ways:

**A simple value:**

```json
{
    ...,
    "baseUrl": "http://example.com/
}
```

**A function call:**

```json
{
    ...,
    "baseUrl": {
        "function": "concat",
        "args": [
            "http://",
            "example.com"
        ]
    }
}
```

**A reference to a value from the function context:**
```json
{
    ...,
    "baseUrl": {
        "attr": "someUrl"
    }
}
```

These forms can be combined freely. They can be also nested in a virtually unlimited way. For instance:

```json
{
    ...,
    "baseUrl": {
        "function": "concat",
        "args": [
            "https://",
            {
                "attr": "domain"
            }
        ]
    }
}
```

### User Interface
You may create functions in the user interface's `User Parameters` or `User Data` sections. 
You can also create the functions directly from other configuration contexts, e.g., when defining the query parameters on the endpoint.

Aside from predefined functions, the UI also offers the most common templates that you can use.

![img.png](/components/extractors/generic-extractor/functions.png)

The UI also offers a convenient way to evaluate the function and see the results.

![img.png](/components/extractors/generic-extractor/function_eval.gif)

## Supported Functions

### md5
The [`md5` function](https://www.php.net/manual/en/function.md5.php) calculates the [MD5 hash](https://en.wikipedia.org/wiki/MD5) of a
string. The function takes one argument, which is the string to hash.

```json
{
    "function": "md5",
    "args": [
        "NotSoSecret"
    ]
}
```

The above will produce `1228d3ff5089f27721f1e0403ad86e73`.

See an [example](#job-parameters).

### sha1
The [`sha1` function](https://www.php.net/manual/en/function.sha1.php) calculates the [SHA-1 hash](https://en.wikipedia.org/wiki/SHA-1) of a
string. The function takes one argument which is the string to hash.

```json
{
    "function": "sha1",
    "args": [
        "NotSoSecret"
    ]
}
```

The above will produce `64d5d2977cc2573afbd187ff5e71d1529fd7f6d8`.

See an [example](#job-parameters).

### base64_encode
The [`base64_encode` function](https://www.php.net/manual/en/function.base64-encode.php) converts a
string to the [MIME Base64 encoding](https://en.wikipedia.org/wiki/Base64#MIME). The function
takes one argument which is the string to encode.

```json
{
    "function": "base64_encode",
    "args": [
        "TeaPot"
    ]
}
```

The above will produce `VGVhUG90`.

See an [example](#nested-functions).

### hash_hmac
The [`hash_hmac` function](https://www.php.net/manual/en/function.hash-hmac.php) creates
an [HMAC (Hash-based message authentication code)](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)
from a string. The function takes
three arguments:

1. Name of a hashing algorithm (see the
[list of supported algorithms](https://www.php.net/manual/en/function.hash-algos.php#refsect1-function.hash-algos-examples))
2. Value to hash
3. Secret key

```json
{
    "function": "hash_hmac",
    "args": [
        "sha256",
        "12345abcd5678efgh90ijk",
        "TeaPot"
    ]
}
```

The above will return `d868d581b2f2edd09e8e7ce12c00723b3fcffb6a5d74c40eae9d94181a0bf731`.

See an [example](#api-default-parameters).

### hash
This function works similarly to the `hash_hmac` function but requires only two arguments (no secret key required):

1. The name of a hashing algorithm (see the
   [list of supported algorithms](https://www.php.net/manual/en/function.hash-algos.php#refsect1-function.hash-algos-examples)).
2. The value to hash.

```json
{
    "function": "hash",
    "args": [
        "sha256",
        "12345abcd5678efgh90ijk"
    ]
}
```

### time
The [`time` function](https://www.php.net/manual/en/function.time.php) returns the current time as a
[Unix timestamp](https://en.wikipedia.org/wiki/Unix_time).
To obtain the current time in a more readable format, use the
the [`date` function](#date). It takes no arguments.

```json
{
    "function": "time"
}
```

The above will produce something like `1492674974`.

### date
The [`date` function](https://www.php.net/manual/en/function.date.php) formats the provided or the current
timestamp into a human readable format. The function takes either one or two arguments:

1. [Formatting string](https://www.php.net/manual/en/function.date.php#refsect1-function.date-parameters)
2. Optional [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time); if not provided, the current time is used.

```json
{
    "function": "date",
    "args": [
        "Y-m-d"
    ]
}
```

The above will produce something like `2017-04-20`.

```json
{
    "function": "date",
    "args": [
        "Y-m-d H:i:s",
        1490000000
    ]
}
```

The above will produce `2017-03-20 8:53:20`.

See an [example](#user-data).

### strtotime
The [`strtotime` function](https://www.php.net/manual/en/function.strtotime.php) converts a string date into a [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time). The function takes
one or two arguments:

1. String date
2. Base for relative dates (see below)

```json
{
    "function": "strtotime",
    "args": [
        "21 oct 2017 9:16pm"
    ]
}
```

The above will produce `1508620560`, which represents the date `2017-10-21 21:16:00`. However, the
[`strtotime` function](https://www.php.net/manual/en/function.strtotime.php) is most useful with relative dates which it also allows. For example, you can
write:

```json
{
    "function": "strtotime",
    "args": [
        "-7 days",
        1508620560
    ]
}
```

The above will give `1508015760`, which represents the date `2017-10-14 21:16:00`. The second argument
specifies the base date (as a Unix timestamp) from which the relative date is computed. This is particularly
useful for [incremental extraction](/components/extractors/generic-extractor/incremental/). Also note that
it is common to combine the `strtotime` and `date` functions to convert between string and timestamp
representation of a date.

See an [example](#nested-strtotime).

### sprintf
The `sprintf` function formats values and inserts them into a string. The `sprintf` function maps directly to
the [original PHP function](https://www.php.net/manual/en/function.sprintf.php), which is very versatile and has many
uses. The function accepts two or more arguments:

1. String with [formatting directives](https://www.php.net/manual/en/function.sprintf.php) (marked with the percent character `%`)
2. Values inserted into the string:

```json
{
    "function": "sprintf",
    "args": [
        "Three %s are %.2f %s.",
        "apples",
        0.5,
        "plums"
    ]
}
```

The above will produce `Three apples are 0.50 plums.`

See a [simple insert example](#api-base-url) or a [formatting example](#job-placeholders).

### concat
The `concat` function concatenates an arbitrary number of strings into one. For example:

```json
{
    "function": "concat",
    "args": [
        "Hen",
        "Or",
        "Egg"
    ]
}
```

The above will produce `HenOrEgg` (see [example 1](#api-base-url), [example 2](#headers)). See also the
[`implode` function](#implode).

### implode
The [`implode` function](https://www.php.net/manual/en/function.implode.php) concatenates an arbitrary number
of strings into one using a delimiter. The function takes
two arguments:

1. Delimiter string which is used for the concatenation
2. Array of values to be concatenated

For example:

```json
{
    "function": "implode",
    "args": [
        ",",
        [
            "apples",
            "oranges",
            "plums"
        ]
    ]
}
```

The above will produce `apples,oranges,plums` (see an [example](#headers)).
The delimiter can be empty, in which case the `implode` function is equivalent to the [`concat` function](#concat):

```json
{
    "function": "implode",
    "args": [
        "",
        [
            "Hen",
            "Or",
            "Egg"
        ]
    ]
}
```

### ifempty
The `ifempty` function can be useful for handling optional values. The function takes two arguments and
returns the first one if it is not empty. If the first argument is empty, it returns the second argument.

```json
{
    "function": "ifempty",
    "args": [
        "",
        "Banzai"
    ]
}
```

The above will return `Banzai`. For the `ifempty` function, an empty string and the values `0` and `null` are
considered 'empty'.

See an [example](#optional-job-parameters).

## Function Contexts
Every place in the Generic Extractor configuration in which a function may be used may allow different arguments of the function.
This is referred to as a **function context**. Many contexts share access to **configuration attributes**.

### Configuration Attributes
The configuration attributes are accessible in specific function contexts and they represent the entire [`config`](/components/extractors/generic-extractor/configuration/config/)
section of the Generic Extractor configuration. There is some processing involved:

- The [`jobs`](/components/extractors/generic-extractor/configuration/config/jobs/) section is removed entirely.
- All other values are flattened (keys are concatenated using a dot `.`) into a one-level deep object.
- The result object is available in a property named `attr`.

For example, the following configuration:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com"
        },
        "config": {
            "debug": true,
            "outputBucket": "get-tutorial",
            "server": "localhost:8888",
            "incrementalOutput": false,
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ],
            "http": {
                "headers": {
                    "X-AppKey": "ThisIsSecret",
                    "X-Auth": {
                        "function": "concat",
                        "args": [
                            "Tea",
                            "Pot"
                        ]
                    }
                }
            },
            "userData": {
                "tag": "fullExtract",
                "mode": "development"
            },
            "mappings": {
                "content": {
                    "whatever": "foobar"
                }
            }
        }
    }
}
```

will be converted to the following function context:

```json
{
	"attr": {
		"debug": true,
		"outputBucket": "mock-server",
		"server": "localhost:8888",
		"incrementalOutput": false,
		"http.headers.X-AppKey": "ThisIsSecret",
		"http.headers.X-Auth.function": "concat",
		"http.headers.X-Auth.args.0": "Tea",
		"http.headers.X-Auth.args.1": "Pot",
		"userData.tag": "fullExtract",
		"userData.mode": "development",
		"mappings.content.whatever": "foobar"
	}
}
```

See [example [EX119]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/119-function-nested-config).

### Base URL Context
The Base URL function context is used when setting the [`baseURL` for API](/components/extractors/generic-extractor/configuration/api/#base-url), and it
contains [configuration attributes](/#function-contexts).

See an [example](#api-base-url).

### Headers Context
The Headers function context is used when setting the [`http.headers` for API](/components/extractors/generic-extractor/configuration/api/#headers)
or the [`http.headers` in config](/components/extractors/generic-extractor/configuration/config/#http), and it contains
[configuration attributes](/#function-contexts).

See an [example](#headers).

### Parameters Context
The Parameters function context is used when setting job [request parameters --- `params`](/components/extractors/generic-extractor/configuration/config/jobs/#request-parameters).
It contains [configuration attributes](/#function-contexts) plus the times of the current
(`currentStart`) and previous (`previousStart`) run of Generic Extractor.
The times are [Unix timestamps](https://en.wikipedia.org/wiki/Unix_time).
If the extraction is run for the first time, `previousStart` is 0.

With the following configuration:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com"
        },
        "config": {
            "debug": true,
            "outputBucket": "get-tutorial",
            "server": "localhost:8888",
            "jobs": [
                ...
            ]
        }
    }
}
```

the parameters function context will contain:

```json
{
    "attr": {
        "debug": true,
        "outputBucket": "mock-server",
        "server": "localhost:8888"
    },
    "time": {
        "previousStart": 0,
        "currentStart": 1492678268
    }
}
```

See an [example of using parameters context](#job-parameters).

The `time` values are used in [incremental processing](/components/extractors/generic-extractor/incremental/).

### Placeholder Context
The Placeholder function context refers to configuration of [placeholders in child jobs](/components/extractors/generic-extractor/configuration/config/jobs/children/#placeholders).
When using function to process a placeholder value, the placeholder must be specified as an object with the `path` property.
Therefore instead of writing:

```json
"placeholders": {
    "user-id": "userId"
}
```

write:

```json
"placeholders": {
    "user-id": {
        "path": "userId",
        "function": ...
    }
}
```

The placeholder function context contains the following structure:

```json
{
    "placeholder": {
        "value": "???"
    }
}
```

where `???` is the value obtained from the response JSON from the path provided in the `path` property
of the placeholder.

See an [example](#job-placeholders).

### User Data Context
The User Data function context is used when setting the [`userData`](/components/extractors/generic-extractor/configuration/config/#user-data).
The parameters context contains [configuration attributes](/#function-contexts) plus the times of the current (`currentStart`) and
previous (`previousStart`) run of Generic Extractor. The User Data Context is therefore
same as the [Parameters Context](#parameters-context).

See an [example](#user-data).

### Login Authentication Context
The Login Authentication function context is used in the
[login authentication](/components/extractors/generic-extractor/configuration/api/authentication/login/) method.
Functions are supported in both [`loginRequest`](/components/extractors/generic-extractor/configuration/api/authentication/login/#configuration-parameters)
and [`apiRequest` ](/components/extractors/generic-extractor/configuration/api/authentication/login/#configuration-parameters) configurations.
The `loginRequest` function context contains [configuration attributes](/#function-contexts).
In the `apiRequest` context, the flattened reponse of the login request is available additionally
to the [configuration attributes](/#function-contexts).
The login authentication context is the same for both `params` and `headers`
[login authentication configuration options](/components/extractors/generic-extractor/configuration/api/authentication/login/#configuration-parameters). If the
login authentication request returns e.g.:

```json
{
    "user": "John Doe",
	"authorization": {
		"token": "quiteSecret",
		"validUntil": "2017-20-12 12:20:17"
	}
}
```

The following function context will be available in the API request headers and query:

```json
{
    "attr": {
		"outputBucket": "mock-server"
    },
    "response": {
        "user": "John Doe",
        "authorization.token": "quiteSecret",
        "authorization.validUntil": "2017-20-12 12:20:17"
    }
}
```

The login response is available in the `response` node. The `attr` node contains [configuration attributes](/components/extractors/generic-extractor/functions/#configuration-attributes).
See an [example](/components/extractors/generic-extractor/configuration/api/authentication/login/#login-authentication-with-functions) and a more
[complicated example](/components/extractors/generic-extractor/configuration/api/authentication/login/#login-authentication-with-login-and-api-request) of using functions in
both login request and API request.

### Query Authentication Context
The Query Authentication function context is used in the
[query authentication](/components/extractors/generic-extractor/configuration/api/authentication/query/) method.
The Query Authentication Context contains [configuration attributes](/#function-contexts) plus
a representation of the complete HTTP request to be sent (`request`) plus a key
value list of query parameters of the HTTP request (`query`).

The following configuration:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "http": {
                "defaultOptions": {
                    "params": {
                        "account": "admin"
                    }
                }
            },
            "authentication": {
                "type": "query",
                "query": {
                    "signature": {
                        "function": "sha1",
                        "args": [
                            "time",
                            {
                                "attr": "#api-key"
                            }
                        ]
                    }
                }
            }
        },
        "config": {
            "#api-key": "12345abcd5678efgh90ijk",
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "params": {
                        "showColumns": "all"
                    }
                }
            ]
        }
    }
}
```

leads to the following function context:

```json
{
	"query": {
		"account": "admin",
		"showColumns": "all"
	},
	"request": {
		"url": "http:\/\/example.com\/users?account=admin&showColumns=all",
		"path": "\/users",
		"queryString": "account=admin&showColumns=all",
		"method": "GET",
		"hostname": "example.com",
		"port": 80,
		"resource": "\/users?account=admin&showColumns=all"
	},
	"attr": {
		"#api-key": "12345abcd5678efgh90ijk",
		"outputBucket": "mock-server"
	}
}
```

See the [basic example](#api-default-parameter) and a [more complicated example](#api-query-authentication).

### OAuth 2.0 Authentication Context
The OAuth Authentication Context is used for the
[`oauth20`](/components/extractors/generic-extractor/configuration/api/authentication/oauth20/) authentication method
(it is not applicable to `oauth10`) and contains the following:

- Representation of the complete HTTP request to be sent (`request`)
- A key value list of query parameters of the HTTP request (`query`)
- An `authorization` section containing the response from the OAuth service provider

This context is available for both the `headers` and `query` sections of the `oauth20` authentication methods.

The following configuration:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "oauth20",
                "format": "json",
                "headers": {
                    "Authorization": {
                        "function": "concat",
                        "args": [
                            "Bearer ",
                            {
                                "authorization": "#data.access_token"
                            }
                        ]
                    }
                }
            }
        },
        "config": {
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ]
        }
    },
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"access_token\": \"testToken\", \"foo\": {\"bar\": \"baz\"}}",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
```

leads to the following function context:

```json
{
	"query": {
		"showColumns": "all"
	},
	"request": {
		"url": "http:\/\/example.com\/users?showColumns=all",
		"path": "\/users",
		"queryString": "showColumns=all",
		"method": "GET",
		"hostname": "example.com",
		"port": 80,
		"resource": "\/users?showColumns=all"
	},
	"authorization": {
		"data.status": "ok",
		"data.access_token": "testToken",
		"data.foo.bar": "baz"
		"timestamp": 1492949837,
		"nonce": "99206d94a6846841",
		"clientId": "clientId",
	}
}
```

The `authorization` section of the configuration contains the
[OAuth2 response](/components/extractors/generic-extractor/configuration/api/authentication/oauth20/). The function context contains
the parsed and flattened response fields under the key `data`, provided that the response was sent in JSON format
and that [`"format": "json"`](/components/extractors/generic-extractor/configuration/api/authentication/oauth20/#configuration) was set.

In the response above, these are the keys `data.status`, `data.access_token`, `data.foo.bar`. This is defined
entirely by the behavior of the OAuth Service provider. If the response is a plaintext (usually directly a token),
then the entire response is available in the field `data`.

Apart from that, the fields `timestamp` (Unix timestamp of the request),
`nonce` (cryptographic [nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) for
signing the request) and `clientId` (the value of `authorization.oauth_api.credentials.appKey`, which is obtained when
the application is published) are added to the `authorization` section.

For usage, see [OAuth examples](/components/extractors/generic-extractor/configuration/api/authentication/oauth20/).

### OAuth 2.0 Login Authentication Context
The OAuth Login Authentication Context is used for the
[`oauth20.login`](/components/extractors/generic-extractor/configuration/api/authentication/oauth20-login/) authentication method
(it is not applicable to `oauth20`). The OAuth Login Authentication context contains
OAuth information split into the properties `consumer` (response obtained from the service provider) and
`user` (data obtained from the user). This context is available for
both the `headers` and `params` sections of the `oauth20` authentication methods.
For the context available in the `apiRequest` configuration, see the [login authentication](/components/extractors/generic-extractor/functions/#login-authentication-context).

The following configuration:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com",
            "authentication": {
                "type": "oauth20.login",
                ...
            }
        },
        "config": {
            ...
        }
    },
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"access_token\": \"testToken\", \"mac_secret\": \"iAreSoSecret123\", \"foo\": {\"bar\": \"baz\"}}",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
```

leads to the following function context:

```json
{
    "consumer": {
        "client_id": "clientId",
        "client_secret": "clientSecret"
    },
    "user": {
        "status": "ok",
        "access_token": "testToken",
        "mac_secret": "iAreSoSecret123",
        "foo.bar": "baz"
    }
}
```

The `authorization` section of the configuration contains the
[OAuth2 response](/components/extractors/generic-extractor/configuration/api/authentication/oauth20/). The function context
contains the parsed and flattened response fields in the `user` property. The content of the
`user` property is fully dependent on the response of the OAuth service provider. The
`consumer` property contains the `client_id` and `client_secret` which contain values of
`authorization.oauth_api.credetials.appKey` and
`authorization.oauth_api.credetials.appSecret` respectively.
(These are obtained by Keboola when the application is published).

For usage, see [OAuth Login examples](/components/extractors/generic-extractor/configuration/api/authentication/oauth20-login/).

## Examples

### API Base URL
When [publishing your Generic Extractor configuration](/components/extractors/generic-extractor/publish/), chances are
you want the end-user to provide a part of the API configuration. Due to the limitations of
[how templates work](/components/extractors/generic-extractor/publish/#configuration-considerations), the parameter
obtained from the end-user configuration will be only available in the `config` section.

Let's say that the end-user enters `www.example.com` as the API server and that values become
available as the `server` property of the `config` section, for instance:

```json
"config": {
    "outputBucket": "ge-tutorial",
    "server": "www.example.com",
    "jobs": [
        {
            "endpoint": "users",
            "dataType": "users"
        }
    ]
}
```

This means that the [configuration attributes](#configuration-attributes) will be available as:

```json
{
    "attr": {
        "outputBucket": "ge-tutorial",
        "server": "www.example.com"
    }
}
```

Then use the [`concat` function](#concat) to access that value and merge it with other parts to create the
final API URL (`http://example.com/api/1.0/`):

```json
{
    "parameters": {
        "api": {
            "baseUrl": {
                "function": "concat",
                "args": [
                    "http://",
                    {
                        "attr": "server"
                    },
                    "/api/1.0/"
                ]
            }
        }
    }
}
```

See [example [EX087] with concat](https://github.com/keboola/generic-extractor/tree/master/doc/examples/087-function-baseurl)
or an alternative [example [EX088] with sprintf](https://github.com/keboola/generic-extractor/tree/master/doc/examples/088-function-baseurl-sprintf).

### API Default Parameters
Suppose you have an API which expects a `tokenHash` parameter to be sent with every request. The
token hash is supposed to be generated by the SHA-256 hashing algorithm from a token and secret
you obtain.

Because the [`api.http.defaultOptions.params`](/components/extractors/generic-extractor/configuration/api/#headers) option does not
support functions, either supply the parameters in the [`jobs.params`](/components/extractors/generic-extractor/configuration/config/jobs/#request-parameters)
configuration, or use [API Query Authentication](/components/extractors/generic-extractor/configuration/api/authentication/query/).
Using (or abusing) the API Query Authentication is possible if the default parameters represent authentication, or
if the API does not use any authentication method (two authentication methods are not possible):

The below configuration reads the `#api-key` and `#secret-key` parameters from the `config` section,
computes SHA-256 hash and sends it as a `tokenHash` parameter with every request.

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "query",
                "query": {
                    "tokenHash": {
                        "function": "hash_hmac",
                        "args": [
                            "sha256",
                            {
                                "attr": "#api-key"
                            },
                            {
                                "attr": "#secret-key"
                            }
                        ]
                    }
                }
            }
        },
        "config": {
            "#api-key": "12345abcd5678efgh90ijk",
            "#secret-key": "TeaPot",
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ]
        }
    }
}
```

See [example [EX099]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/099-function-query-parameters).

The solution with using the `jobs.params` configuration can look like this:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "#api-key": "12345abcd5678efgh90ijk",
            "#secret-key": "TeaPot",
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "tokenHash": {
                            "function": "hash_hmac",
                            "args": [
                                "sha256",
                                {
                                    "attr": "#api-key"
                                },
                                {
                                    "attr": "#secret-key"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}
```

The only practical difference is that the `tokenHash` parameter is going to be sent only with
the single `users` job.

See [example [EX098]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/098-function-hmac).

### API Query Authentication
Suppose you have an API with only a single endpoint `/items` to which you have to
pass a `type` parameter to list resources of a given type. On top of that, the API requires
an `apiToken` parameter and a `signature` parameter (a hash of the token and type) to be sent with every request.
The following configuration handles the situation:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://mock-server:80/101-function-query-auth/",
            "authentication": {
                "type": "query",
                "query": {
                    "apiToken": {
                        "attr": "#token"
                    },
                    "signature": {
                        "function": "sha1",
                        "args": [
                            {
                                "function": "concat",
                                "args": [
                                    {
                                        "attr": "#token"
                                    },
                                    {
                                        "query": "type"
                                    }
                                ]
                            }
                        ]
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-Api-Token": "token"
                    }
                }
            }
        },
        "config": {
            "#token": "1234abcd567efg890hij",
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "items",
                    "dataType": "users",
                    "params": {
                        "type": "users"
                    }
                },
                {
                    "endpoint": "items",
                    "dataType": "orders",
                    "params": {
                        "type": "orders"
                    }
                }
            ]
        }
    }
}
```

There are two jobs, both to the same endpoint (`items`), but with a different `type` parameter and `dataType`.
The authentication method `query` adds two more parameters to each request: `apiToken` (contain the value
of `config.#token`) and `signature`. The `signature` parameter is created as an SHA-1 hash of the
token and resource type (`"query": "type"` is taken from the `jobs.params.type` value).

See [example [EX101]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/101-function-query-auth).

### Job Placeholders
Let's say you have an API with an endpoint `/users`, returning a list of users, and an
endpoint `/user/{userId}`, returning details of a specific user with a given ID. The list response
looks like this:

```json
[
    {
        "id": 3,
        "name": "John Doe"
    },
    {
        "id": 234,
        "name": "Jane Doe"
    }
]
```

To obtain the details of the first user, the user-id has to be padded to five digits. The details API call for the
first user must be sent to `/user/00003`, and for the second user to `/user/00234`. To achieve this, use the
`sprintf` function, which allows [number padding](https://www.php.net/manual/en/function.sprintf.php#example-6129).

The following `placeholders` configuration in the child job calls the function with the first argument set to
`%'.05d` (which is a sprintf [format](https://www.php.net/manual/en/function.sprintf.php) to pad with zero to five digits)
and the second argument set to the value of the `id` property found in the parent response. The placeholder path must
be specified in the `path` property. That means that the configuration:

```json
"placeholders": {
    "user-id": "id"
}
```

has to be converted to:

```json
"placeholders": {
    "user-id": {
        "path": "id",
        "function": "sprintf",
        "args": [
            "%'.05d",
            {
                "placeholder": "value"
            }
        ]
    }
}
```

The following `user-detail` table will be extracted:

|id|name|address\_city|address\_country|address\_street|parent\_id|
|123|John Doe|London|UK|Whitehaven Mansions|00003|
|234|Jane Doe|St Mary Mead|UK|High Street|00234|

Notice that the `parent_id` column contains the processed value and not the original one.

See [example [EX085]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/085-function-job-placeholders),
or a not-so-useful [example [EX086]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/086-function-job-placeholders-reference)
(using reference).

### Job Parameters
Let's say you have an API which requires you to send a hash of a certain value with every request. Specifically,
each request must be done with the [HTTP POST method](/components/extractors/generic-extractor/tutorial/rest/#method) with content:

```json
{
    "token": "someValue"
}
```

The following configuration does exactly that. The value of the token is taken from the configuration
root (using the `attr` reference). This is useful in case the configuration is used as part of a
[template](/components/extractors/generic-extractor/publish/). The actual hash will be generated of the `NotSoSecret` value.

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "tokenValue": "NotSoSecret",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "method": "POST",
                    "params": {
                        "token": {
                            "function": "md5",
                            "args": [
                                {
                                    "attr": "tokenValue"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}
```

See [example [EX089]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/089-function-job-parameters-md5)
or an alternative [example [EX090] with SHA1 hash](https://github.com/keboola/generic-extractor/tree/master/doc/examples/090-function-job-parameters-sha1).
or an alternative [example [EX136]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/136-post-request-functions) with more deeply nested functions.

### Optional Job Parameters
Let's say you have an API which allows you to send the list of columns to be contained in the API response.
For example, to list users and include their `id`, `name` and `login` properties, call
`/users?showColumns=id,name,login`. Also, you want to enter these values as an array in the `config` section because
the config is generated by a [template](/components/extractors/generic-extractor/publish/). If the end-user
does not wish to filter the columns, they can
list all the columns (which would be annoying) or leave the column filter empty. In that case, the API
call would be `/users?showColumns=all`.

The following configuration does exactly that:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "columns": "",
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "method": "GET",
                    "params": {
                        "showColumns": {
                            "function": "ifempty",
                            "args": [
                                {
                                    "attr": "columns"
                                },
                                "all"
                            ]
                        }
                    }
                }
            ]
        }
    }
}
```

See [example [EX097]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/097-function-ifempty).

### User Data
Assume that you have an API returning a response that does not contain any time information. For example:

```json
[
    {
        "id": 3,
        "name": "John Doe"
    },
    {
        "id": 234,
        "name": "Jane Doe"
    }
]
```

Add the extraction time to each record so that you at least know when each record was obtained
(when the creation time is unknown). Add additional data to each record using
the [`userData` configuration](/components/extractors/generic-extractor/configuration/config/#user-data):

```json
"userData": {
    "extractionDate": {
        "function": "date",
        "args": [
            "Y-m-d H:i:s",
            {
                "time": "currentStart"
            }
        ]
    }
}
```

The following table will be extracted:

|id|name|extractionDate|
|3|John Doe|2017-04-20 10:17:20|
|234|Jane Doe|2017-04-20 10:17:20|

Or, use an alternative configuration that also adds the current date:

```json
"userData": {
    "extractionDate": {
        "function": "date",
        "args": [
            "Y-m-d H:i:s"
        ]
    }
}
```

But whereas the first one puts a single same date to each record, the alternative configuration will return different times for different records
as they are extracted.

See [example [EX091]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/091-function-user-data) or
an alternative [example [EX092] with a set date](https://github.com/keboola/generic-extractor/tree/master/doc/examples/092-function-user-date-set-date).

### Headers
Suppose you have an API which requires you to send a custom `X-Api-Auth` header with every request.
The header must contain a user name and password separated by a colon. For instance, `JohnDoe:TopSecret`.

This can be done using the following `api` configuration:

```json
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "headers": {
            "X-Api-Auth": {
                "function": "concat",
                "args": [
                    {
                        "attr": "credentials.#username"
                    },
                    ":",
                    {
                        "attr": "credentials.#password"
                    }
                ]
            }
        }
    }
}
```

Alternatively, achieve the same result using the `implode` function:

```json
"api": {
    "baseUrl": "http://mock-server:80/093-function-api-http-headers/",
    "http": {
        "headers": {
            "X-Api-Auth": {
                "function": "implode",
                "args": [
                    ":",
                    [
                        {
                            "attr": "credentials.#username"
                        },
                        {
                            "attr": "credentials.#password"
                        }
                    ]
                ]
            }
        }
    }
}
```

Both configurations rely on having the username and password parameters
in the [`config` section](/components/extractors/generic-extractor/configuration/config/), in this case also nested in the `credentials` property:

```json
"config": {
    "credentials": {
        "#username": "JohnDoe",
        "#password": "TopSecret"
    },
    "jobs": ...
}
```

See [example [EX093]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/093-function-api-http-headers) or an
[alternative example [EX094] setting headers in the `config` section](https://github.com/keboola/generic-extractor/tree/master/doc/examples/094-function-config-headers).

### Nested Functions
If the API in the [above example](#headers) tries to mimic the
[HTTP authentication](/components/extractors/generic-extractor/configuration/api/authentication/basic/),
the header has to be sent as a [base64 encoded](https://en.wikipedia.org/wiki/Base64#MIME) value.
That is instead of sending a `JohnDoe:TopSecret`, you have to send `Sm9obkRvZTpUb3BTZWNyZXQ=`. To do this
you have to wrap the `concat` function which generates the header value in another function (`base64_encode`).

```json
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "headers": {
            "X-Api-Auth": {
                "function": "base64_encode",
                "args": [
                    {
                        "function": "concat",
                        "args": [
                            {
                                "attr": "#username"
                            },
                            ":",
                            {
                                "attr": "#password"
                            }
                        ]
                    }
                ]
            }
        }
    }
}
```

See [example [EX095]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/095-function-nested).

### Nested StrToTime
Suppose you have an API which requires you to specify the `from` and `to` date parameters to obtain orders created
in that time interval. You want to specify only the `from` date and extract a week of data.
Enter (preferably in a [template](/components/extractors/generic-extractor/publish/)) the
value `2017-10-04` and send an API request to
`/orders?from=2017-10-04&to=2017-10-11`. The following configuration can be used:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "startDate": "2017-10-04",
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "method": "GET",
                    "params": {
                        "from": {
                            "attr": "startDate"
                        },
                        "to": {
                            "function": "date",
                            "args": [
                                "Y-m-d",
                                {
                                    "function": "strtotime",
                                    "args": [
                                        "+7 days",
                                        {
                                            "function": "strtotime",
                                            "args": [
                                                {
                                                    "attr": "startDate"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}
```

The configuration probably seems rather complicated, so taken apart -- the most innermost part:

```json
{
    "function": "strtotime",
    "args": [
        {
            "attr": "startDate"
        }
    ]
}
```

takes the value from the `config` property `startDate` (which is `2017-10-04`) and converts it to
a timestamp value (`???` below).

Then there is an outer part:

```json
{
    "function": "strtotime",
    "args": [
        "+7 days",
        ???
    ]
}
```

that takes the timestamp representing `2017-10-04` and adds 7 days to it. This yields another
timestamp value (`???` below).

Then there is another outer part:

```json
{
    "function": "date",
    "args": [
        "Y-m-d",
        ???
    ]
}
```

converting the timestamp back to a string format (`Y-m-d` format) which yields `2017-10-11`.
This value is assigned to the `to` parameter of the API call.

See [example [EX096]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/096-function-nested-from-to).
