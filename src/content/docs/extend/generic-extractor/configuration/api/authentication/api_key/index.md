---
title: API Key Authentication
slug: 'extend/generic-extractor/configuration/api/authentication/api_key'
---

API Key token authentication sends a token in either a header or query parameter of each API request.

E.g., Headers: `X-StorageApi-Token:your_token`

This method is available through UI. You can select the `Api Key Auth` method and fill in the token.

![Api Key](/extend/generic-extractor/configuration/api/authentication/api_key.png)

### Configuration parameters

- `Key` - arbitrary name of the header or query parameter key, e.g., `X-StorageApi-Token`
- `Token` - the actual token value
- `Add to` - where to add the token, either to the headers or query parameters

### JSON

In the underlying JSON, the API Key is implemented as follows:

Place your token into the `config.#__AUTH_TOKEN` parameter. The `Authorization` header is then constructed using the `concat` function.

**Header section**

```json
{
    "api": {
        ...,
        "http": {
      "http": {
          "headers": {
            "X-StorageApi-Token": {
              "attr": "#__AUTH_TOKEN"
            }
          }
        }
      }
    },
    "config": {
       "#__AUTH_TOKEN": "secret",
       "jobs": [...]
    }
}
```

**Query section**

```json
{
    "api": {
        ...,
        "http": {
      "http": {
          "params": {
            "X-StorageApi-Token": {
              "attr": "#__AUTH_TOKEN"
            }
          }
        }
      }
    },
    "config": {
       "#__AUTH_TOKEN": "secret",
       "jobs": [...]
    }
}
```

