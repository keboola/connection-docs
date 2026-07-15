---
title: Bearer Token Authentication
slug: 'extend/generic-extractor/configuration/api/authentication/bearer_token'
---

Bearer token authentication sends a token in the `Authorization` header of each API request.

This method is available through UI. You can select the `Bearer Token` method and fill in the token.

![img.png](/extend/generic-extractor/configuration/api/authentication/bearer.png)

### JSON

In the underlying JSON, the Bearer Token is implemented as follows:

Place your token into the `config.#__BEARER_TOKEN` parameter. The `Authorization` header is then constructed using the `concat` function.

```json
{
    "api": {
        ...,
        "http": {
      "headers": {
        "Authorization": {
          "function": "concat",
          "args": [
            "Bearer ",
            {
              "attr": "#__BEARER_TOKEN"
            }
          ]
        }
      }
    }
    },
    "config": {
       "#__BEARER_TOKEN": "secret",
       "jobs": [...]
    }
}
```

