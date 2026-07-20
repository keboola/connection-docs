---
title: OAuth 2.0 Authentication
slug: 'components/extractors/generic-extractor/configuration/api/authentication/oauth20'
redirect_from:
    - /extend/generic-extractor/configuration/api/authentication/oauth20/
---


OAuth 2.0 Authentication is one of [two OAuth methods](/components/extractors/generic-extractor/configuration/api/authentication/#oauth) and
is supported only for [components registered in the developer portal](/components/extractors/generic-extractor/publish/).
It is configured by setting the `type` key to `oauth20`:

```json
{
    "api": {
        ...,
        "authentication": {
            "type": "oauth20"
        }
    },
    "config": {
        ...
    }
}
```

The OAuth 2.0 authentication process is described by the [following diagram](https://docs.spring.io/spring-social/docs/1.0.0.M3/reference/html/serviceprovider.html):

![Diagram - OAuth 2.0 authentication](/components/extractors/generic-extractor/configuration/api/authentication/oauth20-diagram.png)

In the diagram, step `6` represents the end of authentication and the actual communication with
the API (extraction of data) may begin.
The final authorization section of the Generic Extractor configuration is generated between
steps `5` and `6`. When a component is published, steps `1` --- `6` of the process are handled by
Keboola (and the end-user).

To **develop and test** a new component with the OAuth authorization, go through
steps `1` --- `6` manually. At step `5`, you will obtain a response which needs to be put
in the `authorization.oauth_api.credentials.data` section of the configuration. The response can be
either plaintext or a JSON. Let's say you obtain a simple plaintext string:

    SomeToken1234abcd567ef

The following configuration needs to be supplied to Generic Extractor:

```json
{
    "parameters": {
        "api": {
            ...
        },
        "config": {
            ...
        }
    },
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "SomeToken1234abcd567ef",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
```

The `authorization` field has a single property `oauth_api` with a single property `credentials`. This
has three child properties:

- `#data` --- contains the response from the service provider; the response is a plaintext string or a JSON string (not an object!).
- `appKey` --- contains the Client ID (use an empty string if not used by the service provider).
- `#appSecret` --- contains the Client Secret (use an empty string if not used by the service provider).

Note that the properties `appKey` and `#appSecret` must exist even if not used by the API; set them
to empty strings. For more information about OAuth 2, see the [official documentation](https://oauth.net/2/)
or learn [more about Keboola-OAuth integration](/extend/common-interface/oauth).

## Configuration Parameters
The following configuration parameters are supported for the `oauth20` authentication type:

- `format` (optional, string) --- If the OAuth service provider response is JSON, use the only possible
value -- `json`. Otherwise do not specify format at all (plaintext is assumed).
- `headers` (optional, object) --- Object whose properties represent the key-value pairs sent as HTTP headers.
- `query` (optional, object) --- Object whose properties represent the key-value pairs of the URL query.

At least one of the `headers` or `query` options should always be specified; otherwise no authentication
will be sent with the API requests. Both fields also allow and practically require using
[functions](/components/extractors/generic-extractor/functions/) to generate an OAuth signature. Specific authentication values
are available in the [OAuth function context](/components/extractors/generic-extractor/functions/#oauth-20-authentication-context).

## Examples
The following two examples demonstrate the support for OAuth 2 in Generic Extractor.

### Bearer Authentication
The most basic OAuth authentication method is with "Bearer Token". If you have an API which supports
this authentication method, the following configuration can be used:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "https://example.com/",
            "authentication": {
                "type": "oauth20",
                "headers": {
                    "Authorization": {
                        "function": "concat",
                        "args": [
                            "Bearer ",
                            {
                                "authorization": "data"
                            }
                        ]
                    }
                }
            }
        },
        "config": {
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
                "#data": "SomeToken1234abcd567ef",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
```

The response obtained from the service provider (the API) is a plaintext string `SomeToken1234abcd567ef`, which
is simply a token to be used to access other API calls. The `api.authentication.headers` section creates
the header `Authorization: Bearer SomeToken1234abcd567ef` using the
[`concat` function](/components/extractors/generic-extractor/functions/#concat).

See [example [EX103]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/103-oauth2-bearer).

### HMAC Authentication
If you have an API which requires an [HMAC](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)
signed token, generate the correct signature using [functions](/components/extractors/generic-extractor/functions).
The following example assumes you obtain the following response from the API upon authentication:

```json
{
    "status": "ok",
    "access_token": "testToken",
    "mac_secret": "iAreSoSecret123"
}
```

The user token is represented by the `access_token` and the token secret (MAC secret) is contained in the
`mac_secret` property. The following configuration generates the MAC signed `Authorization` header:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "https://example.com/",
            "authentication": {
                "type": "oauth20",
                "format": "json",
                "headers": {
                    "Authorization": {
                        "function": "concat",
                        "args": [
                            "MAC id=\"",
                            {
                                "authorization": "data.access_token"
                            },
                            "\", ts=\"",
                            {
                                "authorization": "timestamp"
                            },
                            "\", nonce=\"",
                            {
                                "authorization": "nonce"
                            },
                            "\", mac=\"",
                            {
                                "function": "md5",
                                "args": [
                                    {
                                        "function": "hash_hmac",
                                        "args": [
                                            "sha256",
                                            {
                                                "function": "implode",
                                                "args": [
                                                    "\n",
                                                    [
                                                        {
                                                            "authorization": "timestamp"
                                                        },
                                                        {
                                                            "authorization": "nonce"
                                                        },
                                                        {
                                                            "request": "method"
                                                        },
                                                        {
                                                            "request": "resource"
                                                        },
                                                        {
                                                            "request": "hostname"
                                                        },
                                                        {
                                                            "request": "port"
                                                        },
                                                        "\n"
                                                    ]
                                                ]
                                            },
                                            {
                                                "authorization": "data.mac_secret"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        "config": {
            "debug": true,
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
                "#data": "{\"status\": \"ok\",\"access_token\": \"testToken\", \"mac_secret\": \"iAreSoSecret123\"}",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
```

The above configuration generates the following header:

    Authorization: MAC id="testToken", ts="1492958193", nonce="605cce2a2f687253", mac="ae96f93def8f02770f30e858e074b2a7

The configuration probably looks rather complicated. Most of it is to generate the `mac` value in the above header.
The first step is the [`implode` function](/components/extractors/generic-extractor/functions/#implode) generating a
[Normalized request string](https://tools.ietf.org/html/draft-ietf-oauth-v2-http-mac-01#section-3.2.1). This is then
passed to the [`hash_hmac` function](/components/extractors/generic-extractor/functions/#hash_hmac) along with the
parameters `sha256` (specifying the hashing algorithm) and the hashing key taken from the `authorization` property
`data.mac_secret`. The last (topmost) step is the [`concat` function](/components/extractors/generic-extractor/functions/#concat); it
concatenates all parts of the `Authorization` header.

See [example [EX104]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/104-oauth2-hmac).
