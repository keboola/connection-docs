---
title: Publish Generic Extractor
slug: 'extend/generic-extractor/publish'
redirect_from:
    - /extend/generic-extractor/registration/
---


It is possible to publish a Generic Extractor configuration as a completely separate component.
This enables sharing the API extractor between various projects and simplifies its further configuration.

## Configuration Considerations
Before converting your configuration to a universally available component, consider
what values in the configuration should be provided by the end-user (typically authentication values).
Then design a [configuration schema](/extend/component/ui-options/configuration-schema/) for setting
those values. You can [test the schema online](http://jeremydorn.com/json-editor/) ([alternative](https://mozilla-services.github.io/react-jsonschema-form/)).
The values obtained from the end user will be stored in the [`config` property](/extend/generic-extractor/configuration/config/).
Modify your configuration to read those values from there.

Do not forget that if you prefix a value with a hash `#`, it will be
[encrypted](/overview/encryption/) once the configuration is saved.
Also, try to make the extractor [work incrementally](/extend/generic-extractor/incremental/)
if possible.

## Publishing
To publish your Generic Extractor configuration, you need to [create a new component](/extend/component/tutorial/) in
the [Developer Portal](https://components.keboola.com/). Choose an appropriate name and the type `extractor`. Once you
have created the component, edit it, and fill in the following details:

- **Repository**
    - **Type** --- AWS ECR
    - **Image Name** -- `147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/ex-generic-v2`
    - **Tag** -- see the [Generic Extractor GitHub repository](https://github.com/keboola/generic-extractor/releases)
    - **Region** -- leave empty
- **UI options** --- set to `genericTemplatesUI`

For a list of available tags, see the [Generic Extractor GitHub repository](https://github.com/keboola/generic-extractor/). It is also possible to use the `latest` tag, which points to the highest available tag. However,
we recommend that you configure your component with a specific tag and update it manually to avoid problems with breaking changes
in future Generic Extractor releases.

Because the UI is assumed to be `genericTemplatesUI`, provide a
[**configuration schema**](/extend/component/ui-options/configuration-schema/) and
a **template** to be used in conjunction with the schema. Optionally, the template UI may also contain an interface to
negotiate [OAuth authentication](/extend/generic-extractor/configuration/api/authentication/#oauth).
An example of the template UI is shown in the picture below.

![Screenshot - Generic templates UI](/extend/generic-extractor/template-1.png)

The `Config` section of the templates UI is defined by the configuration schema you provide.
The `Template` section contains at least one template. A template is simply a configuration of
Generic Extractor.

For example, you might want to provide one configuration for incremental loading
and a different configuration for full loading. The template UI also has the option to
`Switch to JSON editor`, which displays the configuration JSON and allows the end user to modify it.
Notice that the JSON editor allows modification only to the [`config`](/extend/generic-extractor/configuration/config/)
section. Other sections, such as [`api`](/extend/generic-extractor/configuration/api/) or
[`authorization.oauth_api`](/extend/generic-extractor/configuration/api/authentication/#oauth), may not be modified by the end user.

You can review existing templates in their [GitHub repository](https://github.com/keboola/kbc-ui-templates/tree/master/resources).
If you feel confident, you can send a pull request with your templates, otherwise submit it when requesting the
[publication of your component](/extend/publish/).

## Example
Let's say you have the following working API configuration
(see [example [EX111]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/111-templates-example)):

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "token",
                    "headers": {
                        "Authorization": {
                            "function": "base64_encode",
                            "args": [
                                "JohnDoe:TopSecret"
                            ]
                        }
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-Api-Auth": "auth.token"
                    }
                }
            },
            "default": {
                "http": {
                    "params": {
                        "accountId": 123
                    }
                }
            }
        },
        "config": {
            "incrementalOutput": true,
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "type": "active"
                    }
                },
                {
                    "endpoint": "orders",
                    "dataType": "orders"
                }
            ]
        }
    }
}
```

and you identify that four values of that configuration need to be specified by the end user:
`JohnDoe`, `TopSecret`, `123`, and `active`.

For each of the values, create a parameter of the appropriate type:

- `JohnDoe` --- a string parameter `login`
- `TopSecret` --- a string parameter `#password` (it will be encrypted)
- `123` --- a numeric parameter `accountId`
- `active` --- an enumeration parameter `userType` with values `active`, `inactive`, `all`

The parameter names are completely arbitrary. However, they must not conflict with existing
configuration properties of [Generic Extractor](/extend/generic-extractor/configuration/config/) (e.g., `jobs`, `mappings`).
Now create a [configuration schema](/extend/component/ui-options/configuration-schema/) for the four parameters.

```json
{
  "title": "Person",
  "type": "object",
  "properties": {
    "login": {
      "type": "string",
      "title": "Login:",
      "description": "Your API user name",
      "minLength": 4
    },
    "#password": {
      "type": "string",
      "title": "Password:",
      "description": "Your API password",
      "minLength": 4
    },
    "accountId": {
      "type": "integer",
      "title": "Account ID",
      "description": "See in-app help for obtaining Account Id"
    },
    "userType": {
      "title": "User type:",
      "type": "string",
      "enum": [
        "active",
        "inactive",
        "all"
      ],
      "default": "active",
      "description": "Specify which users to obtain"
    }
  },
  "required": [
     "login", "#password", "accountId", "userType"
  ]
}
```

When you test the [schema online](http://jeremydorn.com/json-editor/) ([alternative](https://mozilla-services.github.io/react-jsonschema-form/)), it will produce a
configuration JSON:

![Screenshot - Schema Test](/extend/generic-extractor/schema-test.png)

```json
{
  "login": "JohnDoe",
  "#password": "TopSecret",
  "accountId": 123,
  "userType": "inactive"
}
```

The above properties will be merged into the [`config` section](/extend/generic-extractor/configuration/config/). Now
modify the configuration so that it reads them from there using [functions and references](/extend/generic-extractor/functions/).

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "token",
                    "headers": {
                        "Authorization": {
                            "function": "base64_encode",
                            "args": [
                                {
                                    "function": "concat",
                                    "args": [
                                        {
                                            "attr": "username"
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
                },
                "apiRequest": {
                    "headers": {
                        "X-Api-Auth": "auth.token"
                    }
                }
            }
        },
        "config": {
            "incrementalOutput": true,
            "username": "JohnDoe",
            "#password": "TopSecret",
            "accountId": 123,
            "userType": "active",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "accountId": {
                            "attr": "accountId"
                        },
                        "type": {
                            "attr": "userType"
                        }
                    }
                },
                {
                    "endpoint": "orders",
                    "dataType": "orders",
                    "params": {
                        "accountId": {
                            "attr": "accountId"
                        }
                    }
                }
            ]
        }
    }
}
```

The argument to the `base64_encode` function is now the
[`concat` function](/extend/generic-extractor/functions/#concat), which joins together the
values of the `username` and `#password` fields. The `accountId` parameter needs to be moved to the
`jobs` section because the `http.defaultOptions.params` section does not support function calls (yet!).
The `type` parameter was changed to a reference to the `userType` field
(see [example [EX111]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/111-templates-example)).

When you handled the configuration parameters, turn the configuration into a template. Place
the `api` section to a separate, individual `api.json` file:

```json
{
    "baseUrl": "http://example.com/",
    "authentication": {
        "type": "login",
        "loginRequest": {
            "endpoint": "token",
            "headers": {
                "Authorization": {
                    "function": "base64_encode",
                    "args": [
                        {
                            "function": "concat",
                            "args": [
                                {
                                    "attr": "username"
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
        },
        "apiRequest": {
            "headers": {
                "X-Api-Auth": "auth.token"
            }
        }
    }
}
```

Once you make sure that the extractor works as it did before,
remove the user provided values (`username`, `#password`, `accountId`, `userType`) from
the `config` section, put it in a `data` section and add `name` and `description` to it.
Save the file into a separate `template.json` file. The template file therefore contains
`name`, `description` and `data` nodes.

```json
{
    "name": "Basic",
    "description": "Basic incremental template",
    "data": {
        "incrementalOutput": true,
        "jobs": [
            {
                "endpoint": "users",
                "dataType": "users",
                "params": {
                    "accountId": {
                        "attr": "accountId"
                    },
                    "type": {
                        "attr": "userType"
                    }
                }
            },
            {
                "endpoint": "orders",
                "dataType": "orders",
                "params": {
                    "accountId": {
                        "attr": "accountId"
                    }
                }
            }
        ]
    }
}
```

Create as many `template.json` files as you wish. However, all of them need to share the same `api.json`
configuration. When you want to publish your component, attach the `api.json` and all `template.json` files.
