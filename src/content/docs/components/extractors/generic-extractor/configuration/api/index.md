---
title: API Configuration
slug: 'components/extractors/generic-extractor/configuration/api'
redirect_from:
    - /extend/generic-extractor/configuration/api/
---


*To configure your first Generic Extractor, follow our [tutorial](/components/extractors/generic-extractor/tutorial/basic/).*
*Use [Parameter Map](/components/extractors/generic-extractor/map/) to help you navigate among various
configuration options.*

The API section of Generic Extractor configuration **describes global characteristics of an API**. These include
[HTTP headers](/components/extractors/generic-extractor/tutorial/rest/#headers), authentication and pagination methods.

A sample API configuration can look like this:

```json
{
    ...,
    "api": {
        "baseUrl": "https://example.com/v3.0/",
        "caCertificate": "-----BEGIN CERTIFICATE-----\nMIIFaz....",
        "pagination": {
            "method": "offset",
            "offsetParam": "offset",
            "limitParam": "count"
        },
        "authentication": {
            "type": "basic"
        },
        "retryConfig": {
            "account": 3
        },
        "http": {
            "headers": {
                "Accept": "application/json"
            },
            "defaultOptions": {
                "params": {
                    "company": 123
                }
            },
            "requiredHeaders": ["X-AppKey"],
            "ignoreErrors": [405],
            "connectTimeout": 30,
            "requestTimeout": 300
        }
    }
}
```

## Base URL
The `baseUrl` configuration **defines the URL to which the API requests should be sent**. We
recommend that the URL ends with a slash so that the `jobs.endpoint` can be set easily.
See the [`endpoint` configuration](/components/extractors/generic-extractor/configuration/config/jobs/#endpoint) for a detailed description of
how `api.baseUrl` and `jobs.endpoint` work together.

## CA certificate
The `caCertificate` configuration **defines custom certificate authority bundle in 
[`crt`/`pem` format](https://serverfault.com/questions/9708/what-is-a-pem-file-and-how-does-it-differ-from-other-openssl-generated-key-file)**.
It allows connecting to a HTTPS server with a untrusted/self-signed certificate.
The value is not certificate of the server, but a certificate of the certificate authority used to generate the server certificate.
You can define a single root certificate, or a bundle of root and intermediate certificates
(see [EX141](https://github.com/keboola/generic-extractor/tree/master/doc/examples/141-https-self-signed)).

## Client certificate
The `#clientCertificate` configuration **defines the client certificate and private key**. This is required
if the server requires two-way SSL authentication, so in addition to the verification of the server,
the server also verifies the client (see [EX142](https://github.com/keboola/generic-extractor/tree/master/doc/examples/142-https-client-cert)).

**Value is the client certificate, followed by the private key. Both
in [`crt`/`pem` format](https://serverfault.com/questions/9708/what-is-a-pem-file-and-how-does-it-differ-from-other-openssl-generated-key-file)**.

Example:
```json
{
  "api": {
    "baseUrl": "https://my-server.com",
    "#clientCertificate": "-----BEGIN CERTIFICATE-----\n...\n----END CERTIFICATE-----\n-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
  }
}
```

## Pagination
Pagination (or scrolling) **describes how the API pages through a large set of results**. Because
there are many different pagination strategies, the configuration is described on a
[separate page](/components/extractors/generic-extractor/configuration/api/pagination/).

## Authentication
Authentication (authorization) needs to be configured for any API which is not public.
Because there are many authorization methods used by different APIs, there are also many
[configuration options](/components/extractors/generic-extractor/configuration/api/authentication/).

## Retry Configuration
By default, Generic Extractor **automatically retries failed HTTP requests** --- repeatedly, and on most errors.
This is one of the big advantages over writing your own extractor from scratch. Tweak the retry setting to optimize
the speed of an extraction or to avoid unwanted flooding of the API.

Every HTTP response contains a [Status code](/components/extractors/generic-extractor/tutorial/rest/#http-status) and,
optionally, a Header describing the situation or further actions. Status codes 2xx (beginning with 2; e.g., 200
OK) represent success and no action is needed for them. Status codes 3xx (e.g., 301 Moved Permanently) represent
redirection and are automatically handled by Generic Extractor (the redirection is followed).

This leaves us with status codes 4xx (e.g., 404 Not Found) and 5xx (e.g., 500 Internal Server Error). The 4xx codes
represent the codes whose error is on the client side. 5xx represent errors on the server side. When
retrying, this distinction is really irrelevant because we need to use the codes that represent transient/temporary
errors. Unfortunately, there is no definitive official list of those. When it comes to communicating with
a real world API, the typical examples of transient errors are:

- Network outage/malfunction
- Target server maintenance/outage
- API throttling/rate limiting

The rate limiting behaviour is not universally agreed upon. A nice API should return a
`503 Service Unavailable` status together with a `Retry-After` HTTP header specifying number of
seconds to wait before the next request. This is, however, not supported by many APIs.
**Adjusting to the API rate limiting is the main reason for changing Retry Configuration**.

The next aspect to consider is "when to retry". Even if the error is transient, retrying
immediately (within few milliseconds) usually makes no sense because the error is probably still not gone.
There are two retry strategies:

- Either the API sends a `Retry-After` header (or its equivalent), or
- Generic Extractor uses an [exponential backoff algorithm](https://en.wikipedia.org/wiki/Exponential_backoff).

### API Retry Strategy
Per the HTTP specification, the API may send the [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
header which should contain number of seconds to pause/sleep before the next request. Generic Extractor
supports some extensions to this. First, the *Retry Header* name may be customized. Second, the header
value may be as follows:

- Number of seconds before the next request
- [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time) of the time of the next request
- String date in [RFC 1123 format](https://www.php.net/manual/en/class.datetime.php#datetime.constants.rfc1123) of the
time of the next request

The second and third options are often called **Rate Limit Reset** as they describe when the next successful request
can be made (i.e., the limit is reset).

### Backoff Strategy
The exponential backoff in Generic Extractor is defined as `truncate(2^(retry\_number - 1)) * 1000` seconds.
This means that the first retry (zero-based index) will be after 0 seconds (`(2^(0-1)) = 0.5`, truncated to 0).
The retry delays are the following:

|retry|1|2|3|4|5|6|7|8|9|10|11|12|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|delay|0s|1s|2s|4s|8s|16s|32s|64s|128s (~2min)|256s (~4min)|512s (~8.5min)|1024s (~17min)|

The default number of retries is **10** which means that the retries stop after
511 seconds (~8.5 minutes).

### Configuration
The default Retry configuration `retryConfig` is:

```json
{
    "http": {
        "retryHeader": "Retry-After",
        "codes": [500, 502, 503, 504, 408, 420, 429],
        "maxRetries": 10
    },
    "curl": {
        "codes": [28, 6, 7, 35, 52, 56]
    }
}
```

The above defined `curl.codes` cover the common network errors. You can find a full list of
supported codes in the [cURL documentation](https://curl.haxx.se/libcurl/c/libcurl-errors.html).
There is no way to set the actual backoff strategy as it is derived automatically from the
content of the HTTP header specified in `retryHeader`. Generic Extractor will fallback to the
exponential backoff strategy in case the header contents are invalid (that includes, e.g., a typo
in the header name). Make sure to check that the backoff is correct --- the times can be verified
in the [debug](/components/extractors/generic-extractor/running/#debug-mode) messages:

    Http request failed, retrying in 1s

If the exponential backoff is used, you will see its sequence of times.
See an [example](/components/extractors/generic-extractor/configuration/api/#retry-configuration).

## Default HTTP Options
The `http` configuration option allows you to set the timeouts, default headers and parameters sent with each API call
(defined later in the [`jobs` section](/components/extractors/generic-extractor/configuration/config/jobs/#request-parameters)).

### Headers
The `http.headers` configuration allows you to **set the default headers sent with
each API call**. The configuration is an object where names are the names of
the headers and values are their values --- for instance:

```json
"http": {
    "headers": {
        "Accept": "application/json",
        "Accept-Encoding": "gzip"
    }
}
```

See the full [example](/components/extractors/generic-extractor/configuration/api/#default-headers).

### Request Parameters
The `http.defaultOptions.params` configuration allows you to **set the
[request parameters](/components/extractors/generic-extractor/tutorial/rest/#url) to be
sent with each API request**. The same rules apply as to the
[`jobs.params`](/components/extractors/generic-extractor/configuration/config/jobs/#request-parameters).

See an [example](/components/extractors/generic-extractor/configuration/api/#default-headers).

### Required Headers
Similar to the `http.headers` option, the `http.requiredHeaders` option allows you to **set the HTTP header
for every API request**. The difference is that the `requiredHeaders` configuration specifies **only the header names**.
The actual values must be provided in the [`config`](/components/extractors/generic-extractor/configuration/config/)
configuration section. This is useful in case the header values change dynamically or they are provided as part
of [template configuration](/components/extractors/generic-extractor/publish/).

If the `api` configuration section looks like this:

```json
"http": {
    "requiredHeaders": ["Accept", "Accept-Encoding"]
}
```

then the header values must be provided in the `config` configuration section:
```json
"http": {
    "headers": {
        "Accept": "application/json",
        "Accept-Encoding": "gzip"
    }
}
```

Failing to provide the header values in the `config` section will cause an error:

    Missing required header Accept in config.http.headers!

See the full [example](/components/extractors/generic-extractor/configuration/api/#required-headers).

### Ignore Errors
The `ignoreErrors` option allows you to force Generic Extractor to ignore certain extraction errors.
The option lists HTTP codes for which any errors occurring during downloading
and JSON parsing the response will be ignored. The `ignoreErrors` option error is an array of HTTP
response status codes; the default value is an empty array.

If the `ignoreErrors` is set to a non-empty array -- for instance:

```json
"http": {
    "ignoreErrors": [404]
}
```

Then the following happens:

- A response with status 2XX is processed normally.
- A response with status 404 is processed as if it were a success response.
    - If parsing of the response body JSON succeeds, it is added as any other row.
    - If parsing of the response body JSON fails, it is added as a row with the `errorData` field.
- A response with status 4XX (other than 404) causes the extraction to fail.
- A response with status 5XX causes the request to be [retried](#retry-configuration). If that does
not help, it causes the extraction to fail.

If the `ignoreErrors` contains 5XX status codes, the [Retry rules](#retry-configuration) are still applied.
But regardless of the outcome of the retries, the response will be considered as success.

See [example [EX132]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/132-ignore-errors).

**Important**: Use this feature with **caution**! It is designed to workaround weird or buggy REST
API implementations and should not be used blindly if other solutions may be applied (e.g.,
[`responseFilter`](/components/extractors/generic-extractor/configuration/config/jobs/#response-filter). When ignoring errors,
**you might miss even those errors that require your attention.**

### Connect Timeout

The `connectTimeout` option is a float describing the number of seconds to wait while trying to connect to a server. 
Default value is `30` seconds. Use `0` to wait indefinitely, we do not recommend it.

```json
"http": {
    "connectTimeout": 30
}
```

### Request Timeout

The `requestTimeout` option is a float describing the total timeout of the request in seconds.
Default value is `300` seconds. Use `0` to wait indefinitely, we do not recommend it. 

```json
"http": {
    "requestTimeout": 300
}
```

## Examples

### Retry Configuration
Assume that you have an API which implements throttling in the following way: when
the number of requests is exceeded, it returns an empty response with the status code `202` and
a timestamp when a new requests can be made in the `X-RetryAfter` HTTP header.
Then create the following API configuration to make Generic Extractor handle the
situation:

```json
"api": {
    "baseUrl": "http://example.com/",
    "retryConfig": {
        "http": {
            "retryHeader": "X-RetryAfter",
            "codes": [500, 502, 503, 504, 408, 420, 429, 202]
        },
        "maxRetries": 3
    }
}
```

Notice that it is necessary to add the response code `202` to the existing default codes. I.e., setting
`"codes": [202]` is likely very wrong.

See [example [EX037]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/037-retry-header).

### Default Headers
Assume that you have an API which returns a JSON response only if the client sends an
`Accept: application/json` header. Additionally, if the client sends an
`Accept-Encoding: gzip` header, the HTTP transmission will be compressed (and thus faster).
The following configuration sends both headers with every API request:

```json
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "headers": {
            "Accept": "application/json",
            "Accept-Encoding": "gzip"
        }
    }
}
```

See [example [EX038]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/038-default-headers).

### Default Parameters
Assume that you have an API requiring all requests to contain a filter
for the account to which they belong. This is done by passing the `account=XXX` parameter.
The following configuration sends the parameter with every API request:

```json
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "defaultOptions": {
            "params": {
                "account": 123
            }
        }
    }
}
```

For this use case, the [query authentication](/components/extractors/generic-extractor/configuration/api/authentication/query/)
may also be used.

See [example [EX039]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/039-default-parameters).

### Required Headers
Assume that an API requires the header `X-AppKey` to be sent with each
API request. The following API configuration can be used:

```json
"api": {
    "baseUrl": "http://example.com",
    "http": {
        "requiredHeaders": ["X-AppKey"]
    }
},
```

Then the actual header value must be added to the `config` section.

```json
"http": {
    "headers": {
        "X-AppKey": "ThisIsSecret"
    }
}
```

For this use case, the [authentication](/components/extractors/generic-extractor/configuration/api/authentication/) may also be used.
See [example [EX040]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/040-required-headers).
