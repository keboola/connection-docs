---
title: Basic Authentication
slug: 'extend/generic-extractor/configuration/api/authentication/basic'
---

Basic Authentication provides the [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
method. It requires entering a username and password in the configuration and sends the encoded values in the 
`Authorization` header. 

### User Interface

In the user interface, you simply select the `Basic Authorization` method and enter the username and password.

### JSON 

A sample Basic authentication looks like this:

![Basic](/extend/generic-extractor/configuration/api/authentication/basic.png)

```json
{
    "api": {
        ...,
        "authentication": {
            "type": "basic"
        }
    },
    "config": {
        "#username": "JohnDoe",
        "#password": "secret"
    }
}
```

The `username` and `password` fields are part of the [`config` section](/extend/generic-extractor/configuration/config/). 
They are also prefixed by the hash `#` character, which means they are stored [encrypted](/overview/). 
If the API expects something else than a username and password in the `Authorization` header, or if it requires 
a custom authorization header, use the [Default Headers option](/extend/generic-extractor/configuration/api/#headers).

## Configuration Parameters
This `basic` type of authentication has no configuration parameters. The login and password must be provided in the 
[`config` section](/extend/generic-extractor/configuration/config/) of the Generic Extractor configuration.

## Basic Configuration Example
Assume you have an API which requires you to use the HTTP Basic authentication to send the login and password in 
the `Authorization` header. Assume that your login is `JohnDo` and password is `secret`. The following 
configuration solves the situation:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "debug": true,
            "#username": "JohnDoe",
            "#password": "secret",
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users"
                }
            ]
        }
    }
}
```

The following HTTP header will be sent:

    Authorization: Basic Sm9obkRvZTpzZWNyZXQ=

See [example [EX078]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/078-basic-auth).
