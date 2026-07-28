---
title: Generic Extractor Configuration
slug: 'components/extractors/generic-extractor/configuration'
redirect_from:
    - /extend/generic-extractor/configuration/
---


*To configure your first Generic Extractor, follow our [tutorial](/components/extractors/generic-extractor/tutorial/).*

To get an overall idea of what to expect when configuring Generic Extractor, look at the following **overview** of various configuration sections.

Then review a [sample configuration](#configuration-map) featuring all configuration options and their
nesting. The **configuration map** is also available as a [separate article](/components/extractors/generic-extractor/map/).

### User Interface

:::caution[Public Beta]
This feature is currently in public beta. Please provide feedback using the feedback button in your project.
:::

Recently, we created a convenient user interface that allows you to build a configuration for the Generic Extractor without writing JSON code. 
You can set up and test the connection in a few clicks, just like you are used to in some other popular API development tools. 

Features such as cURL import, request tests, output mapping generator, or dynamic function templates and evaluation make the configuration process as easy as ever.

You can switch between the JSON representation and the user interface in the upper right corner of the configuration editor.

![UI Switch](/components/extractors/generic-extractor/configuration/ui_switch.png)

#### Backward compatibility

The new user interface is mostly backward compatible with the old JSON configuration. However, some features are not yet supported in the new UI. 
In such cases, you will be notified in the UI what sections are not supported.

***NOTE:** The new UI does not affect the functionality of old configurations. All configurations will continue to work. 
However, in some cases, you might need to perform some manual adjustments in order to make the UI compatible.*

### JSON Configuration Sections
*Click on the section names if you want to learn more.*

- **parameters**
    - [**api**](/components/extractors/generic-extractor/configuration/api/) --- sets the basic properties of the API.
        - [**baseUrl**](/components/extractors/generic-extractor/configuration/api/#base-url) --- defines the URL to which the
        API requests should be sent.
        - [**caCertificate**](/components/extractors/generic-extractor/configuration/api/#ca-certificate) --- defines custom certificate authority bundle in `crt`/`pem` format.
        - [**#clientCertificate**](/components/extractors/generic-extractor/configuration/api/#client-certificate) --- defines client certificate and private key in `crt`/`pem` format.
        - [**pagination**](/components/extractors/generic-extractor/configuration/api/pagination/) --- breaks a result with many items into separate pages.
        - [**authentication**](/components/extractors/generic-extractor/configuration/api/authentication/) --- needs to be
        configured for any API which is not public.
        - [**retryConfig**](/components/extractors/generic-extractor/configuration/api/#retry-configuration) --- automatically
        and repeatedly, retries failed HTTP requests.
        - [**http**](/components/extractors/generic-extractor/configuration/api/#default-http-options) --- sets the timeouts, default
        headers, and parameters sent with each API call.
    - **aws**
      - [**signature**](/components/extractors/generic-extractor/configuration/aws-signature) --- defines AWS credentials for signature request
    - [**config**](/components/extractors/generic-extractor/configuration/config/) --- describes the actual extraction.
        - [**debug**](/components/extractors/generic-extractor/running/#debug-mode) --- shows all HTTP requests sent by
        Generic Extractor.
        - [**outputBucket**](/components/extractors/generic-extractor/configuration/config/#output-bucket) --- defines the name
        of a Storage Bucket in which the extracted tables will be stored.
        - [**http**](/components/extractors/generic-extractor/configuration/config/#http) --- sets the HTTP headers sent with
        every request.
        - [**jobs**](/components/extractors/generic-extractor/configuration/config/jobs/) --- describes the API endpoints
        (resources) to be extracted.
        - [**mappings**](/components/extractors/generic-extractor/configuration/config/#mappings) --- describes how the JSON
        response is converted into CSV files that will be imported into Storage.
        - [**incrementalOutput**](/components/extractors/generic-extractor/incremental/) ---  loads the extracted data into
        Storage incrementally.
        - [**userData**](/components/extractors/generic-extractor/configuration/config/#user-data) --- adds arbitrary data to
        extracted records.
        - [**sshProxy**](/components/extractors/generic-extractor/configuration/ssh-proxy/) --- securely access HTTP(s) endpoints inside your private Network.
        - [**iterations**](/components/extractors/generic-extractor/configuration/iterations/) --- executes a configuration multiple times, each time
  with different values.
- [**authorization**](/components/extractors/generic-extractor/configuration/api/authentication/#oauth) --- allows injecting OAuth authentication.

There are also simple pre-defined [**functions**](/components/extractors/generic-extractor/functions/) available, adding extra
flexibility when needed.

Generic Extractor can be run from within the [**Keboola user interface**](/components/extractors/generic-extractor/running/) (only
configuration [JSON](/components/extractors/generic-extractor/tutorial/json/) is needed), or [**locally**](/components/extractors/generic-extractor/running/#running-locally)
(Docker is needed).

### Configuration Map
The following sample configuration shows various configuration options and their nesting.
You can use the map to navigate between them. The parameter map is also available
[separately](/components/extractors/generic-extractor/map/), and we recommend pinning it to your toolbar for quick reference.

```json
{
    "parameters": {
        "api": {
            "baseUrl": "https://example.com/v3.0/",
            "caCertificate": "-----BEGIN CERTIFICATE-----\nMIIFaz....",
            "pagination": {
                "method": "multiple",
                "scrollers": {
                    "offset_scroll": {
                        "method": "offset",
                        "offsetParam": "offset",
                        "limitParam": "count"
                    }
                }
            },
            "authentication": {
                "type": "basic"
            },
            "retryConfig": {
                "maxRetries": 3
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
        },
        "aws": {
            "signature": {
                "credentials": {
                    "accessKeyId": "testAccessKey",
                    "#secretKey": "testSecretKey",
                    "serviceName": "testService",
                    "regionName": "testRegion"
                }
            }
        },
        "config": {
            "debug": true,
            "username": "dummy",
            "#password": "secret",
            "outputBucket": "ge-tutorial",
            "incrementalOutput": true,
            "compatLevel": 2,
            "http": {
                "headers": {
                    "X-AppKey": "ThisIsSecret"
                }
            },
            "jobs": [
                {
                    "endpoint": "users",
                    "method": "get",
                    "dataField": "items",
                    "dataType": "users",
                    "params": {
                        "type": {
                            "attr": "userType"
                        }
                    },
                    "responseFilter": "additional.address/details",
                    "responseFilterDelimiter": "/",
                    "scroller": "offset_scroll",
                    "children": [
                        {
                            "endpoint": "users/{user_id}/orders",
                            "dataField": "items",
                            "recursionFilter": "id>20",
                            "placeholders": {
                                "user_id": "id"
                            }
                        }
                    ]
                }
            ],
            "mappings": {
                "content": {
                    "parent_id": {
                        "type": "user",
                        "mapping": {
                            "destination": "campaign_id",
                            "primaryKey": true
                        }
                    },
                    "name": {
                        "type": "column",
                        "mapping": {
                            "destination": "text"
                        }
                    },
                    "address": {
                        "type": "table",
                        "destination": "addresses",
                        "tableMapping": {
                            "street": {
                                "type": "column",
                                "mapping": {
                                    "destination": "streetName"
                                }
                            }
                        }
                    },
                    "created.date": {
                        "delimiter": "/",
                        "type": "column",
                        "mapping": {
                            "destination": "createdDate"
                        }
                    }
                }
            },
            "userData": {
                "tag": "development"
            }
        },
        "iterations": [
            {
                "userType": "active"
            },
            {
                "userType": "inactive"
            }
        ],
        "sshProxy": {
            "host": "proxy.example.com",
            "user": "proxy",
            "port": 22,
            "#privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
        }
    },
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"refresh_token\": \"1234abcd5678efgh\"}",
                "appKey": "someId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
```

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Api
    $("span:contains('\"baseUrl\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#base-url'></a>");
    $("span:contains('\"caCertificate\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#ca-certificate'></a>");
    $("span:contains('\"retryConfig\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#retry-configuration'></a>");
    $("span:contains('\"http\"')").first().wrap("<a href='/components/extractors/generic-extractor/configuration/api/#default-http-options'></a>");
    $("span:contains('\"headers\"')").first().wrap("<a href='/components/extractors/generic-extractor/configuration/api/#headers'></a>");
    $("span:contains('\"params\"')").first().wrap("<a href='/components/extractors/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span:contains('\"defaultOptions\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span:contains('\"requiredHeaders\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#required-headers'></a>");
    $("span:contains('\"ignoreErrors\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#ignore-errors'></a>");
    $("span:contains('\"connectTimeout\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#connect-timeout'></a>");
    $("span:contains('\"requestTimeout\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/#request-timeout'></a>");
    $("span:contains('\"pagination\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/pagination/'></a>");
    $("span:contains('\"scrollers\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/pagination/multiple/'></a>");
    $("span:contains('\"method\"')").first().wrap("<a href='/components/extractors/generic-extractor/configuration/api/pagination/#paging-strategy'></a>");
    $("span:contains('\"authentication\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/authentication'></a>");

    // AWS Signature
    $("span:contains('\"signature\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/aws-signature'></a>");
    $("span:contains('\"credentials\"')").first().wrap("<a href='/components/extractors/generic-extractor/configuration/aws-signature#aws-signature-credentials'></a>");

    // Jobs
    $("span:contains('\"endpoint\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#endpoint'></a>");
    $("span:contains('\"params\"')").last().wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#request-parameters'></a>");
    $("span:contains('\"method\"')").last().wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#method'></a>");
    $("span:contains('\"dataField\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#data-field'></a>");
    $("span:contains('\"dataType\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#data-type'></a>");
    $("span:contains('\"responseFilter\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span:contains('\"responseFilterDelimiter\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span:contains('\"scroller\"')").last().wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#scroller'></a>");

    // Child jobs
    $("span:contains('\"children\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/#children'></a>");
    $("span:contains('\"recursionFilter\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/children/#filter'></a>");
    $("span:contains('\"placeholders\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/children/#placeholders'></a>");

    // Config root
    $("span:contains('\"api\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/'></a>");
    $("span:contains('\"config\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/'></a>");
    $("span:contains('\"sshProxy\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/ssh-proxy/'></a>");
    $("span:contains('\"iterations\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/iterations/'></a>");

    // Configuration
    $("span:contains('\"debug\"')").wrap("<a href='/components/extractors/generic-extractor/running/#debug-mode'></a>");
    $("span:contains('\"incrementalOutput\"')").wrap("<a href='/components/extractors/generic-extractor/incremental/'></a>");
    $("span:contains('\"jobs\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/jobs/'></a>");
    $("span:contains('\"mappings\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/mappings/'></a>");
    $("span:contains('\"outputBucket\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/#output-bucket'></a>");
    $("span:contains('\"http\"')").last().wrap("<a href='/components/extractors/generic-extractor/configuration/config/#http'></a>");
    $("span:contains('\"userData\"')").last().wrap("<a href='/components/extractors/generic-extractor/configuration/config/#user-data'></a>");
    $("span:contains('\"compatLevel\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/#compatibility-level'></a>");

    // Mappings
    $("span:contains('\"column\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span:contains('\"user\"')").first().wrap("<a href='/components/extractors/generic-extractor/configuration/config/mappings/#user-mapping'></a>");
    $("span:contains('\"table\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    $("span:contains('\"mapping\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span:contains('\"tableMapping\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    $("span:contains('\"delimiter\"')").wrap("<a" +
        " href='/components/extractors/generic-extractor/tutorial/mapping/#key-containing-a-dot-character'></a>");

    // Authorization
    $("span:contains('\"authorization\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span:contains('\"oauth_api\"')").wrap("<a href='/components/extractors/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span:contains('\"credentials\"')").last().wrap("<a href='/components/extractors/generic-extractor/configuration/api/authentication/#oauth'></a>");
}, false);
</script>
<style>
pre a {
    border-bottom: 1px dashed navy;
}
</style>
