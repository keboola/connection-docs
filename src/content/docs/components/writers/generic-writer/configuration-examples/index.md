---
title: Generic Writer Configuration Examples
description: "This configuration sends the POST request to https://example.com/test/[[id]] where [[id]] is a column expected in the input table."
slug: 'components/writers/generic-writer/configuration-examples'
redirect_from:
    - /extend/generic-writer/configuration-examples/
---


### Configuration Example – Iterations

This configuration sends the POST request to `https://example.com/test/[[id]]` where `[[id]]` is a column expected in the input table. 
It will send as many requests as there are rows in the input table. Each request object is wrapped in `{"data":{}}` object.

```json
{
 "api": {
  "base_url": "https://example.com"
 },
 "user_parameters": {
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
  "endpoint_path": "/test/[[id]]",
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
   "nesting_delimiter": "_",
   "chunk_size": 1,
   "column_data_types": {
    "autodetect": true
   },
   "request_data_wrapper": "{ \"data\": [[data]]}",
   "column_names_override": {}
  },
  "iterate_by_columns": [
   "id"
  ]
 }
}
```

### Exponea Batch Events Writer

Write customer [events](https://documentation.bloomreach.com/engagement/reference/add-event) into the
[Bloomreach Engagement (formerly Exponea) tracking API](https://documentation.bloomreach.com/engagement/reference/welcome)
in [batches](https://documentation.bloomreach.com/engagement/reference/batch-commands-2) of `3` requests.

**Writer config:**

```json
{
 "debug": false,
 "api": {
  "base_url": "https://api-demoapp.exponea.com"
 },
 "user_parameters": {
  "#token": "12345",
  "token_encoded": {
   "function": "concat",
   "args": [
    "Basic ",
    {
     "function": "base64_encode",
     "args": [
      {
       "attr": "#token"
      }
     ]
    }
   ]
  }
 },
 "request_parameters": {
  "method": "POST",
  "endpoint_path": "/track/v2/projects/1234566/batch",
  "headers": {
   "Authorization": {
    "attr": "token_encoded"
   },
   "Content-type": "application/json"
  }
 },
 "request_content": {
  "content_type": "JSON",
  "json_mapping": {
   "nesting_delimiter": "__",
   "chunk_size": 3,
   "column_data_types": {
    "autodetect": true
   },
   "request_data_wrapper": "{\"commands\":[[data]]}"
  }
 }
}
```

**Input table:**

| name             | data__customer_ids__registered | data__properties__price | data__timestamp | data__event_type | data__properties__test |
|------------------|--------------------------------|-------------------------|-----------------|------------------|------------------------|
| customers/events | milan@test.com                 | 150                     | 123456.78       | testing_event    | a                      |
| customers/events | petr@test.com                  | 150                     | 123456.78       | testing_event    | a                      |
| customers/events | masha@test.com                 | 150                     | 123456.78       | testing_event    | a                      |

**Result request:**

```json
{
    "commands": [{
            "name": "customers/events",
            "data": {
                "customer_ids": {
                    "registered": "milan@test.com"
                },
                "properties": {
                    "price": 150,
                    "test": "a"
                },
                "timestamp": 123456.78,
                "event_type": "testing_event"
            }
        }, {
            "name": "customers/events",
            "data": {
                "customer_ids": {
                    "registered": "petr@test.com"
                },
                "properties": {
                    "price": 150,
                    "test": "a"
                },
                "timestamp": 123456.78,
                "event_type": "testing_event"
            }
        }, {
            "name": "customers/events",
            "data": {
                "customer_ids": {
                    "registered": "masha@test.com"
                },
                "properties": {
                    "price": 150,
                    "test": "a"
                },
                "timestamp": 123456.78,
                "event_type": "testing_event"
            }
        }
    ]
}

```

### Customer.io User Event

Update user events via the [Customer.io Track API](https://docs.customer.io/integrations/api/track/) based on the user_id column.

The API uses Basic http authentication.

**Writer config:**

```json
{
 "api": {
  "base_url": "https://track.customer.io",
  "authentication": {
        "type": "BasicHttp",
        "parameters": {
          "username": "test_user",
          "#password": "pass"
        }
      }
 },
 "user_parameters": {},
 "request_parameters": {
  "method": "POST",
  "endpoint_path": "/api/v1/customers/[[user_id]]/events",
  "headers": {
   "Content-type": "application/json"
  }
 },
 "request_content": {
  "content_type": "JSON",
  "json_mapping": {
   "nesting_delimiter": "_",
   "chunk_size": 1,
   "column_data_types": {
    "autodetect": true
   },
   "request_data_wrapper": "",
   "column_names_override": {}
  },
  "iterate_by_columns": [
   "user_id"
  ]
 }
}
```

**Input Table:**

| user_id        | data_price | data_date | name          |
|----------------|------------|-----------|---------------|
| a@test.com     | 150        | 1.1.20    | testing_event |
| petr@test.com  | 150        | 1.1.20    | testing_event |
| masha@test.com | 150        | 1.1.20    | testing_event |

**Json request:**

For each row in the input one request:

POST `https://track.customer.io/api/v1/customers/a@test.com/events`

```json
{"data": {"price": 150, "date": "1.1.20"}, "name": "testing_event"}
```

### Slack Notification

Send notifications to Slack channels via an API. Note that you need to create an app with appropriate permissions
at [api.slack.com/apps](https://api.slack.com/apps) and retrieve the API token.

**Input Table:**

| channel        | text       |
|----------------|------------|
| AC098098   | Hello        |
| AC092131   | World        |

**Configuration:**

```json
{
 "debug": false,
 "api": {
  "base_url": "https://slack.com"
 },
 "user_parameters": {
  "#token": "",
  "token_encoded": {
   "function": "concat",
   "args": [
    "Bearer ",
    {
     "attr": "#token"
    }
   ]
  }
 },
 "request_parameters": {
  "method": "POST",
  "endpoint_path": "/api/chat.postMessage",
  "headers": {
   "Authorization": {
    "attr": "token_encoded"
   },
   "Content-type": "application/json"
  }
 },
 "request_content": {
  "content_type": "JSON",
  "json_mapping": {
   "nesting_delimiter": "_",
   "chunk_size": 1,
   "column_data_types": {
    "autodetect": true
   },
   "request_data_wrapper": ""
  }
 }
}

```
