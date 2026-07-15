---
title: Generic Extractor Parameter Map
slug: 'extend/generic-extractor/map'
---

*To configure your first Generic Extractor, follow our [tutorial](/extend/generic-extractor/tutorial/).*

Use the following sample configuration to navigate among various **configuration options**:

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


