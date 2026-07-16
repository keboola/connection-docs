---
title: Generic Writer Configuration 
slug: 'extend/generic-writer/configuration'
---


This component allows you to write data to a specified endpoint in a specified format. It currently supports single
table and single endpoint per configuration.

The data can be sent in two ways:

1. Send all content at once - either BINARY or JSON in chunks
2. [Iterate](/extend/generic-writer/configuration/#iterate-by-columns) through each row - where the data is sent in
   iterations specified in the input data. By default 1 row = 1 iteration. This allows to change the endpoint
   dynamically based on the input using placeholders: `www.example.com/api/user/{{id}}`. Or sending data with different
   user parameters that are present in the input table.

### Configuration parameters

*Click on the section names if you want to learn more.*

- [**api**](/extend/generic-writer/configuration/#api) --- [REQUIRED] sets the basic properties of the API.
    - [**base_url**](/extend/generic-writer/configuration/#base-url) ---  [REQUIRED] defines the URL to which the API requests
      should be sent.
    - [**authentication**](/extend/generic-writer/configuration/#authentication) --- needs to be configured for any API
      which is not public.
    - [**retry_config**](/extend/generic-writer/configuration/#retry-config) --- automatically, and repeatedly, retries
      failed HTTP requests.
    - [**default_query_parameters**](/extend/generic-writer/configuration/#default-query-parameters) --- sets the
      default query parameters sent with each API call.
    - [**default_headers**](/extend/generic-writer/configuration/#default-headers) --- sets the default query headers
      sent with each API call.
    - [**ssl_verification**](/extend/generic-writer/configuration/#ssl-verification) --- allows turning of the SSL certificate
      verification. Use with caution.
    - [**timeout**](/extend/generic-writer/configuration/#timeout) --- maximum time in seconds for which the component
      waits after each request (defaults to None if not set).
- [**user_parameters**](/extend/generic-writer/configuration/#user-parameters) --- user parameters to be used in various
  contexts, e.g. passwords. Supports dynamic functions.
- [**request_parameters**](/extend/generic-writer/configuration/#request-parameters) --- [REQUIRED] HTTP parameters of the request
    - [**method**](/extend/generic-writer/configuration/#method) --- [REQUIRED] defines the HTTP method of the requests.
    - [**endpoint_path**](/extend/generic-writer/configuration/#enpoint-path) --- [REQUIRED] relative path of the endpoint.
    - [**query_parameters**](/extend/generic-writer/configuration/#query-parameters) --- query parameters sent with each
      request
    - [**headers**](/extend/generic-writer/configuration/#headers) --- headers sent with each request
- [**request_content**](/extend/generic-writer/configuration/#request-content) --- [REQUIRED] defines how the data is sent
    - [**content_type**](/extend/generic-writer/configuration/#content-type) --- [REQUIRED] defines how the data is transferred (
      JSON, binary file, Empty, etc.)
    - [**json_mapping**](/extend/generic-writer/configuration/#json-mapping) --- defines the CSV 2 JSON conversion in
      case of JSON content type.
    - [**iterate_by_columns**](/extend/generic-writer/configuration/#iterate-by-columns) --- defines set of columns in
      the input data that are excluded from the content and may be used instead of placeholders within the
      request_options. The input table is iterated row by row, e.g. 1 row = 1 request
- [**debug**](/extend/generic-writer/configuration/#debug) --- Turns on more verbose logging for debugging purposes.

There are also simple pre-defined [**functions**](/extend/generic-writer/configuration/#dynamic-functions) available,
adding extra flexibility when needed.

### Configuration Map

The following sample configuration shows various configuration options and their nesting. You can use the map to
navigate between them.

```json {
  "parameters": {
    "debug": false,
    "api": {
      "base_url": "https://example.com/api",
      "default_query_parameters": {
        "content_type": "json"
      },
      "default_headers": {
        "Authorization": {
          "attr": "#token"
        }
      },
      "retry_config": {
        "max_retries": 5,
        "codes": [
          500,
          429
        ]
      },
      "ssl_verification": true,
      "timeout": 5
    },
    "user_parameters": {
      "#token": "Bearer 123456",
      "date": {
        "function": "concat",
        "args": [
          {
            "function": "string_to_date",
            "args": [
              "yesterday",
              "%Y-%m-%d"
            ]
          },
          "T"
        ]
      }
    },
    "request_parameters": {
      "method": "POST",
      "endpoint_path": "/customer/[[id]]",
      "headers": {
        "Content-Type": "application/json"
      },
      "query_parameters": {
        "date": {
          "attr": "date"
        }
      }
    },
    "request_content": {
      "content_type": "JSON",
      "json_mapping": {
        "nesting_delimiter": "__",
        "chunk_size": 100,
        "column_data_types": {
          "autodetect": true,
          "datatype_override": [
            {
              "column": "phone",
              "type": "string"
            },
            {
              "column": "rank",
              "type": "number"
            },
            {
              "column": "is_active",
              "type": "bool"
            }
          ]
        },
        "request_data_wrapper": "{ \"data\": [[data]]}",
        "column_names_override": {
          "full_name": "FULL|NAME"
        }
      },
      "iterate_by_columns": [
        "id"
      ]
    }
  }
} ```

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Api
    $("span:contains('\"debug\"')").wrap("<a href='/extend/generic-writer/configuration/#debug'></a>");
    $("span:contains('\"api\"')").wrap("<a href='/extend/generic-writer/configuration/#api'></a>");
    $("span:contains('\"base_url\"')").wrap("<a href='/extend/generic-writer/configuration/#base-url'></a>");
    $("span:contains('\"default_query_parameters\"')").wrap("<a href='/extend/generic-writer/configuration/#default-query-parameters'></a>");
    $("span:contains('\"default_headers\"')").first().wrap("<a href='/extend/generic-writer/configuration/#default-headers'></a>");
    $("span:contains('\"retry_config\"')").first().wrap("<a href='/extend/generic-writer/configuration/#retry-config'></a>");
    $("span:contains('\"authentication\"')").first().wrap("<a href='/extend/generic-writer/configuration/#authentication '></a>");

    $("span:contains('\"user_parameters\"')").first().wrap("<a href='/extend/generic-writer/configuration/#user-parameters '></a>");

    // Request options
    $("span:contains('\"request_parameters\"')").wrap("<a href='/extend/generic-writer/configuration/#request-parameters'></a>");
    $("span:contains('\"api_request\"')").wrap("<a href='/extend/generic-writer/configuration/#api-request'></a>");
    $("span:contains('\"method\"')").wrap("<a href='/extend/generic-writer/configuration/#method'></a>");
    $("span:contains('\"endpoint_path\"')").first().wrap("<a href='/extend/generic-writer/configuration/#endpoint-path'></a>");
    $("span:contains('\"headers\"')").first().wrap("<a href='/extend/generic-writer/configuration/#headers'></a>");
    $("span:contains('\"query_parameters\"')").first().wrap("<a href='/extend/generic-writer/configuration/#query-parameters'></a>");

    // Content
    $("span:contains('\"request_content\"')").first().wrap("<a href='/extend/generic-writer/configuration/#request-content'></a>");
    $("span:contains('\"content_type\"')").first().wrap("<a href='/extend/generic-writer/configuration/#content-type'></a>");

    // JSON CONFIG
    $("span:contains('\"json_mapping\"')").wrap("<a href='/extend/generic-writer/configuration/#json-mapping'></a>");
    $("span:contains('\"chunk_size\"')").wrap("<a href='/extend/generic-writer/configuration/#chunk_size'></a>");
    $("span:contains('\"nesting_delimiter\"')").wrap("<a href='/extend/generic-writer/configuration/#nesting-delimiter'></a>");
    $("span:contains('\"request_data_wrapper\"')").wrap("<a href='/extend/generic-writer/configuration/#request-data-wrapper'></a>");
    $("span:contains('\"autodetect\"')").first().wrap("<a href='/extend/generic-writer/configuration/#autodetect'></a>");
    $("span:contains('\"column_data_types\"')").wrap("<a href='/extend/generic-writer/configuration/#column-data-types'></a>");
    $("span:contains('\"datatype_override\"')").wrap("<a href='/extend/generic-writer/configuration/#column-datatype-override'></a>");
    $("span:contains('\"column_names_override\"')").wrap("<a href='/extend/generic-writer/configuration/#datatype-override'></a>");
    $("span:contains('\"iterate_by_columns\"')").wrap("<a href='/extend/generic-writer/configuration/#iterate-by-columns'></a>");

    // Configuration
    $("span:contains('\"debug\"')").wrap("<a href='/extend/generic-writer/configuration/#debug'></a>");

}, false);
</script>
<style>
pre a {
    border-bottom: 1px dashed navy;
}
</style>

## Api

Defines the basic properties of the API that may be shared for multiple endpoints. Such as authentication, base url,
etc.

### Base URL

An URL of the endpoint where the payload is being sent. e.g. `www.example.com/api/v1`.

**NOTE** May contain placeholders for iterations wrapped in `[[]]`,e.g. ``www.example.com/api/v[[api_version]]``.  
But in most cases you would set this up on the `endpoint_path` level.

The parameter `api_version` needs to be specified in the `user_parameters` or in the source data itself if the column is
set as an iteration parameter column.

### Retry Config

Here you can set parameters of the request retry in case of failure.

- `max_retries` --- Number of maximum retries before failure (DEFAULT `1`)
- `codes` --- List of HTTP codes to retry on, e.g. [503, 429] (DEFAULT `(500, 502, 504)`)
- `backoff_factor` --- backoff factor of the exponential backoff. (DEFAULT `0.3`)

```json
{
  "api": {
    "base_url": "https://example.com/api",
    "retry_config": {
      "max_retries": 5,
      "backoff_factor": 0.3,
      "codes": [
        500,
        429
      ]
    }
  }
}
```

### Default Query Parameters

Allows you to define default query parameters that are being sent with each request. This is useful for
instance for authentication purposes. This is mostly useful for creating Generic Writer templates and registered
components.

**NOTE** That you can reference parameters defined in `user_parameters` using the `{"attr":"SOME_KEY"}` syntax.

```json
{
  "api": {
    "base_url": "https://example.com/api",
    "default_query_parameters": {
      "content_type": "json",
      "token": {
        "attr": "#token"
      }
    }
  }
}
```

### Default Headers

Allows you to define default query parameters that are being sent with each req This is mostly useful for
creating Generic Writer templates and registered components.

**NOTE** That you can reference parameters defined in `user_parameters` using the `{"attr":"SOME_KEY"}` syntax.

```json
 {
  "api": {
    "base_url": "https://example.com/api",
    "default_headers": {
      "Authorization": {
        "attr": "#token"
      }
    }
  }
}
```

### Authentication

Some APIs require authenticated requests to be made. This section allows selecting from predefined auth methods.

The Authentication object is always in following format:

```json

{
  "type": "{SUPPORTED_TYPE}",
  "parameters": {
    "some_parameter": "test_user"
  }
}
```

**NOTE** Parameters may be also referenced from the `user_parameters` section using the `{"attr":""}` syntax,
see [example 025](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/025-simple-json-basic-http-auth-from-user-params)

#### BasicHttp

Basic HTTP authentication using username and password.

**Example**:

```json
"api": {
  "base_url": "http://localhost:8000",
  "authentication": {
        "type": "BasicHttp",
        "parameters": {
            "username": "test_user",
            "#password": "pass"
        }
    }
}
```

See [example 024](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/024-simple-json-basic-http-auth)

#### BearerToken

Authorization using the `Bearer token` in the header. E.g. each request will be sent with
header: `"authorization": "Bearer XXXX""`

**Example**:

```json
{
  "api": {
    "base_url": "http://localhost:8000",
    "authentication": {
      "type": "BearerToken",
      "parameters": {
        "#token": "XXXX"
      }
    }
  }
}
```

See [example 030](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/030-bearer-token-auth)

### SSL Verification

Allows turning of the SSL certificate verification. Use with caution. When set to false, the certificate verification is
turned off.

```json

{
  "api": {
    "base_url": "http://localhost:8000",
    "ssl_verification": false
  }
}
```

### Timeout

An optional parameter which allows you to define maximum timeout for each request. If not set, it uses the default requests value: None.

Possible values: (int, float)

For more information, refer to [requests docs](https://requests.readthedocs.io/en/stable/user/advanced/#timeouts).

## User Parameters

In this section you can defined user parameters to be used in various contexts, e.g. passwords. This is also
the place to use the [dynamic functions]().

It allows referencing another values from `user_parameters` referenced by `{"attr":"par"}` notation.

**NOTE** Any parameters prefixed by `#` will be encrypted in the Keboola platform on configuration save.

```json
{
  "user_parameters": {
    "#token": "Bearer 123456",
    "date": {
      "function": "concat",
      "args": [
        {
          "function": "string_to_date",
          "args": [
            "yesterday",
            "%Y-%m-%d"
          ]
        },
        "T"
      ]
    }
  }
}
```

### Referencing parameters

All parameters defined here can be then referenced using the `{"attr":"PARAMETER_KEY"}` syntax. You may reference them
in the following sections:

- in the `user_parameters` section itself.
- [`api.default_query_parameters`](/extend/generic-writer/configuration/#default-query-parameters)
- [`api.default_headers`](/extend/generic-writer/configuration/#default-headers)
- [`request_parameters.headers`](/extend/generic-writer/configuration/#headers)
- [`request_parameters.query parameters`](/extend/generic-writer/configuration/#query-parameters)

See
example [010](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/010-simple-json-user-parameters-various)

## Request Parameters

Define parameters of the HTTP request sent.

### Method

Request method - POST, PUT, UPDATE, DELETE etc.

Supported methods: `['GET', 'POST', 'PATCH', 'UPDATE', 'PUT', 'DELETE']`

```json
"request_parameters": {
    "method": "POST",
    ...
```

### Endpoint path

A relative path of the endpoint. The final request URL is `base_url` and `endpoint_path` combined.

e.g. when `base_url` is set to `https://example.com/api` and `endpoint_path` to `/customer` the resulting URL
is `https://example.com/api/customer`

**NOTE** That it is possible to change the `enpoint_path` dynamically
using [iteration columns](/extend/generic-writer/configuration/#iterate-by-columns) e.g. `/orders/[[id]]` as seen
in [example 005](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/005-json-iterations/)

```json
{
  "request_parameters": {
    "method": "POST",
    "endpoint_path": "/customer"
  }
}
```

### Headers

Allows you to define default query parameters that are being sent with each request.

**NOTE** That you can reference parameters defined in `user_parameters` using the `{"attr":"SOME_KEY"}` syntax.

```json
{
  "request_parameters": {
    "method": "POST",
    "endpoint_path": "/customer",
    "headers": {
      "Last-updated": 123343534
    }
  }
}
```

See [example 006](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/006-simple-json-custom-headers/)

### Query parameters

Allows you to define default query parameters that are being sent with each request.

**NOTE** That you can reference parameters defined in `user_parameters` using the `{"attr":"SOME_KEY"}` syntax.

```json
 {
  "request_parameters": {
    "method": "POST",
    "endpoint_path": "/customer/[[id]]",
    "query_parameters": {
      "dryRun": true,
      "date": {
        "attr": "date"
      }
    }
  }
}
```

See [example 009](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/009-simple-json-request-parameters/)

## Request Content

Defines how to process the input and how the sent content should look like.

### Content Type

 Defines how the input table is translated to a request:

- `JSON` - input table is converted into a JSON (see `json_mapping`) sent as `application/json` type.
  See [example 001](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/001-simple-json/)
- `JSON_URL_ENCODED` - input table is converted into a JSON and sent as `application/x-www-form-urlencoded`.
  See [example 021](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/021-simple-json-url-encoded-form/)
- `BINARY` - input table is sent as binary data (just like `curl --data-binary`).
  See [example](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/tests/functional/binary_simple/)
- `BINARY_GZ` - input is sent as gzipped binary data.
  See [example](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/tests/functional/binary_gz/)
- `EMPTY_REQUEST` - sends just empty requests. Usefull for triggerring webhooks, DELETE calls, etc. As many requests as
  there are rows on the input are sent. Useful with `iterate_by_columns` enabled to trigger multiple endpoints.
  See [example 022](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/022-empty-request-iterations-delete/)

```json

"request_content": {
    "content_type": "JSON",
....
```

### JSON Mapping

[REQUIRED for JSON based content type] This section defines the CSV 2 JSON conversion in case of JSON content type.

#### Nesting delimiter

A string that is used for nesting. e.g. `__`. This way you can define nested objects based on column names.

e.g. When set to `__` a column value `address__streed` will be converted to `{"address"{"street":"COLUMN_VALUE"}}`

```json
"request_content": {
    "content_type": "JSON",
    "json_mapping": {
        "nesting_delimiter": "_",
...
```

See
example [008](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/008-simple-json-nested-object-delimiter/)

#### Chunk size

Defines how many rows are being sent in a single request. When set to `1` a single object is sent `{}` (
see [example 002](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/002-simple-json-chunked-single/))
, when set to >1 an array of objects is sent `[{}, {}]` (
see [example 003](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/003-simple-json-chunked-multi/))

```json
"request_content": {
    "content_type": "JSON",
    "json_mapping": {
        "nesting_delimiter": "_",
        "chunk_size": 1,
...
```

#### Column datatypes

Optional configuration of column types. This version supports nesting (three levels) and three datatypes:

- `bool` - Boolean value case-insensitive conversion: `t`, `true`, `yes`, `1`,`"1"` to `True` and `f`, `false`, `no`
  to `False`
- `string` - String
- `number` - Number
- `object` - Object - valid JSON array or JSON object, e.g. ["1","2"], {"key":"val"}

##### Autodetect

Default value `true
`
Set this option to `true` to make the parser automatically detect the above datatypes. It may be used in combination
with
`datatype_override` option to force datatype to some columns.

##### Column datatype override

[OPTIONAL]

The `autodetect` option in most cases takes care of the datatype conversion properly. But there are some scenarios where
you want make sure that the datatype conversion is forced. E.g. for `phone_number` column to be treated as String a
mapping should be defined as `"phone_number":"string"`.

Below are options that can be used as a datatype values:

if you want the value to be always a string, use `string`, if you want the value to be numeric, use `number`. If you
want it to be Boolean, use `bool`
(case-insensitive conversion: `t`, `true`, `yes` to `True` and `f`, `false`, `no` to `False`)
If the value should be an array or object `object` - valid JSON array or JSON object, e.g. ["1","2"], {"key":"val"}

**Note** If the `autodetect` option is turned off all unspecified column will be treated as a string.

```json
{
  "request_content": {
    "content_type": "JSON",
    "json_mapping": {
      "nesting_delimiter": "_",
      "chunk_size": 1,
      "column_data_types": {
        "autodetect": true,
        "datatype_override": [
          {
            "column": "phone",
            "type": "string"
          },
          {
            "column": "rank",
            "type": "number"
          },
          {
            "column": "is_active",
            "type": "bool"
          }
        ]
      }
    }
  }
}
```

See [example 007](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/007-simple-json-force-datatype/)

#### Request Data Wrapper

[OPTIONAL]

A wrapper/mask of the parsed data. It needs to be json-encoded json. E.g

```json
"request_content": {
    "content_type": "JSON",
    "json_mapping": {
        "nesting_delimiter": "__",
        "chunk_size": 1,
        "request_data_wrapper": "{ \"data\": [[data]]}",
    ...
}
```

Given a single column `user__id` and `chunksize` = 2, the above will cause each request being sent as:

```json
{
  "data": [
    {
      "user": {
        "id": 1
      }
    },
    {
      "user": {
        "id": 2
      }
    }
  ]
}
```

See
examples: [012](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/012-simple-json-request-data-wrapper/)

#### Column names override

You may override specific column names using the `column_names_override` parameter to be able to generate fields with
characters not supported in Storage column names.

**NOTE** that this is applied **after** the column type definition, so refer to original name in the `column_types`
config.

**NOTE2** It is possible to rename nested objects as well. The rename is applied to the leaf node.
E.g. `"address___city":"city.address"`
with delimiter set to `___` will result in `{"address":{"city.address":"SOME_VALUE"}}`.
See [example 23](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/023-simple-json-nested-object-rename-column/)

**Example:**

```json
"request_content": {
    "content_type": "JSON",
        "json_mapping": {
            "nesting_delimiter": "_",
            "chunk_size": 1,
            "column_names_override": {
                "field_id": "field-id",
                "full_name": "FULL.NAME"
            }
    }
...
}
```

For more details refer to
examples: [20](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/020-simple-json-column-name-override/)
and [23](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/023-simple-json-nested-object-rename-column/)

### Iterate By Columns

This parameter allows performing the requests in iterations based on provided parameters within data. The user specifies
columns in the source table that will be used as parameters for each request. The column values may be then used instead
of placeholders within the `request_options`. The input table is iterated row by row, e.g. 1 row = 1 request.

```json
"request_content": {
    "content_type": "JSON",
        "iterate_by_columns": [
          "id", "date"
        ]
}

```

These will be injected in:

- `request_parameters.endpoint_path` if placeholder is specified, e.g.  `/user/[[id]]`
- `user_parameters` section, any existing parameters with a same name will be replaced by the value from the data. This
  allows for example for changing request parameters dynamically `www.example.com/api/user?date=xx` where the `date`
  value is specified like:

```json
{
  "request_parameters": {
    "method": "POST",
    "endpoint_path": "/customer/[[id]]",
    "query_parameters": {
      "date": {
        "attr": "date"
      }
    }
  }
}

```

**NOTE** The iteration columns may be specified for requests of any content type. The `chunk_size` parameter in JSON
mapping is overridden to `1`.

See the example configurations:

- [ex. 005](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/005-json-iterations/)
- Empty request with
  iterations [ex. 004](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/004-empty-request-iterations/)
  ,
  [ex. 22](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/022-empty-request-iterations-delete/)
- [ex. 011 placeholders in query parameters](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/docs/examples/011-simple-json-user-parameters-from-iterations/)

##### Example

Let's have this table on the input:

| id | date       | name  | email      | address |
|----|------------|-------|------------|---------|
| 1  | 01.01.2020 | David | d@test.com | asd     |
| 2  | 01.02.2020 | Tom   | t@test.com | asd     |

Consider following request options:

```json
{
  "request_parameters": {
    "method": "POST",
    "endpoint_path": "/user/[[id]]",
    "query_parameters": {
      "date": {
        "attr": "date"
      }
    }
  },
  "request_content": {
    "content_type": "JSON",
    "iterate_by_columns": [
      "id",
      "date"
    ]
  }
}

```

The writer will run in two iterations:

**FIRST** With data

| name  | email      | address |
|-------|------------|---------|
| David | d@test.com | asd     |

Sent to `www.example.com/api/user/1?date=01.01.2020`

**SECOND** with data

| name  | email      | address |
|-------|------------|---------|
| Tom   | t@test.com | asd     |

Sent to `www.example.com/api/user/2?date=01.02.2020`

## Dynamic Functions

The application support functions that may be applied on parameters in the configuration to get dynamic values.

Currently these functions work only in the `user_parameters` scope. Place the required function object instead of the
user parameter value.

The function values may refer to another user params using `{"attr": "custom_par"}`

**NOTE:** If you are missing any function let us know or place a PR to
our [repository](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/). It's as simple as adding an
arbitrary method into
the [UserFunctions class](https://bitbucket.org/kds_consulting_team/kds-team.wr-generic/src/master/src/user_functions.py#lines-7)

**Function object**

```json
{
  "function": "string_to_date",
  "args": [
    "yesterday",
    "%Y-%m-%d"
  ]
}
```

#### Function Nesting

Nesting of functions is supported:

```json
{
  "user_parameters": {
    "url": {
      "function": "concat",
      "args": [
        "http://example.com",
        "/test?date=",
        {
          "function": "string_to_date",
          "args": [
            "yesterday",
            "%Y-%m-%d"
          ]
        }
      ]
    }
  }
}

```

#### string_to_date

Function converting string value into a datestring in specified format. The value may be either date in `YYYY-MM-DD`
format, or a relative period e.g. `5 hours ago`, `yesterday`,`3 days ago`, `4 months ago`, `2 years ago`, `today`.

The result is returned as a date string in the specified format, by default `%Y-%m-%d`

The function takes two arguments:

1. [REQ] Date string
2. [OPT] result date format. The format should be defined as in http://strftime.org/

**Example**

```json
{
  "user_parameters": {
    "yesterday_date": {
      "function": "string_to_date",
      "args": [
        "yesterday",
        "%Y-%m-%d"
      ]
    }
  }
}
```

The above value is then available in [supported contexts](/extend/generic-writer/configuration/#referencing-parameters)
as:

```json
"to_date": {"attr": "yesterday_date"}
```

#### concat

Concatenate an array of strings.

The function takes an array of strings to concatenate as an argument

**Example**

```json
{
  "user_parameters": {
    "url": {
      "function": "concat",
      "args": [
        "http://example.com",
        "/test"
      ]
    }
  }
}
```

The above value is then available in supported contexts as:

```json
"url": {"attr": "url"}
```

#### base64_encode

Encodes string in BASE64

**Example**

```json
{
  "user_parameters": {
    "token": {
      "function": "base64_encode",
      "args": [
        "user:pass"
      ]
    }
  }
}
```

The above value is then available in contexts as:

```json
"token": {"attr": "token"}
```

## Debug

By setting the root parameter `debug` to `true`, it is possible to enable more verbose logging that will help debugging.

**CAUTION** Note that higher verbosity causes the writer to print parts of the actual content into the job log, so use with caution. 
Always make sure to turn this option off after debugging to prevent any issues.

```json
{
  "debug": true,
  "api": {
    "base_url": "http://test.com/api/"
  },
  "user_parameters": {},
  "request_parameters": {
    "method": "POST",
    "endpoint_path": "users/[[id]]"
  },
  "request_content": {
    "content_type": "BINARY"
  }
}
```
