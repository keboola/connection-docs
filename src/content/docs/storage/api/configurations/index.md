---
title: Component Configurations API
slug: 'storage/api/configurations'
redirect_from:
    - /integrate/storage/api/configurations/
---


[Configurations](/storage/configurations/) are an important part of a Keboola project. Most operations are
available in the UI. Use the API if you want to manipulate the configurations programmatically.

Configurations represent component **instances** in a project. Each Keboola component has different configuration
options and requirements, which must be respected. As such, Keboola configurations provide a general framework for configuring
components, while the specific implementation details are left to the components themselves.

When working with the [Component Configurations API](https://api.keboola.com/?service=storage#tag--Component-Configurations),
you need to know the `componentId` of the component being configured.
You can see a list of public components in [the Developer Portal](https://components.keboola.com/components), or you can get
a list of all available components with the [API index call](https://api.keboola.com/?service=storage#get-/v2/storage).
See our [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb).

It will give you something like this:

```json
{
    "host": "4edece0b0052",
    "api": "storage",
    "version": "v2",
    "revision": "21fb56a0f6d61a307f350247a45950b1e4049625",
    "documentation": "https://connection.keboola.com/api/storage/doc.json",
    "components": [
        {
            "id": "keboola.ex-aws-s3",
            "type": "extractor",
            "name": "AWS S3",
            "description": "AWS Simple Storage Service",
            "longDescription": "Download ... from AWS S3 and upload them to Storage.",
            "version": 23,
            "hasUI": false,
            "hasRun": false,
            "ico32": "https://ui.keboola-assets.com/.../keboola.ex-aws-s3/32/20.png",
            "ico64": "https://ui.keboola-assets.com/.../keboola.ex-aws-s3/64/20.png",
            "data": {
                "definition": {
                    "type": "aws-ecr",
                    "uri": "147946154733.../keboola.ex-aws-s3",
                    "tag": "v3.0.0",
                    "repository": {
                        "region": "us-east-1"
                    }
                },
                "vendor": {
                    "contact": [
                        "Keboola",
                        "Křižíkova 488/115\n186 00 Prague 8\nCzech Republic",
                        "support@keboola.com"
                    ],
                    "licenseUrl": "https://github.com/keboola/aws-s3-extractor/blob/master/LICENSE"
                },
                "configuration_format": "json",
                "network": "bridge",
                "memory": "512m",
                "forward_token": false,
                "forward_token_details": false,
                "default_bucket": true,
                "default_bucket_stage": "in",
                "staging_storage": {
                    "input": "local"
                }
            },
            "flags": [
                "genericDockerUI",
                "genericDockerUI-processors",
                "appInfo.dataIn"
            ],
            "configurationSchema": {},
            "emptyConfiguration": {},
            "uiOptions": {},
            "configurationDescription": null,
            "documentationUrl": "https://help.keboola.com/extractors/other/aws-s3/"
        }
    ],
    "services": [...],
    "urlTemplates": {...}
}
```

From here, you can see all available information about a particular component. In the following examples, we
will use `keboola.ex-aws-s3` --- the AWS S3 extractor.

## Configuration Structure
Component configurations are largely dependent on the actual component being configured. This makes creating configurations manually
a bit tricky. Rather than starting from scratch, we recommend creating a configuration through the UI and then modifying it when you understand it.

### Inspecting Configuration
To obtain an existing configuration, you can either use the list of configurations above or
the [Configuration Detail](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-)
API call. See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) for obtaining a
configuration of the `keboola.ex-aws-s3` component. You will receive a response similar to this:

```json
{
    "id": "364479526",
    "name": "test",
    "description": "",
    "created": "2018-03-08T14:54:19+0100",
    "creatorToken": {
        "id": 27865,
        "description": "ondrej.popelka@keboola.com"
    },
    "version": 5,
    "changeDescription": "Table first table edited",
    "isDeleted": false,
    "configuration": {
        "parameters": {
            "accessKeyId": "AKIAIBZYEEXQILP46FCA",
            "#secretAccessKey": "KBC::ComponentProjectEncrypted==p5gvUw4RSGiVJjT2ayVORpqS7yiKhExi7NnQECntVm8haHaHtFNVDMT8X8b+htnixpXhPIQ9yV+ETrvr+hNeYfh+Ex+UpC//QPWnLcEOC8XOLgmQN8BNgRGSERWUziK0"
        }
    },
    "rowsSortOrder": [],
    "rows": [
        {
            "id": "364481153",
            "name": "first table",
            "description": "",
            "configuration": {
                "parameters": {
                    "bucket": "travis-php-db-import-tests-s3filesbucket-vm9zhtm5jd7s",
                    "key": "tw_accounts.csv",
                    "saveAs": "first-table",
                    "includeSubfolders": false,
                    "newFilesOnly": true
                },
                "processors": {
                    "after": [
                        {
                            "definition": {
                                "component": "keboola.processor-move-files"
                            },
                            "parameters": {
                                "direction": "tables",
                                "addCsvSuffix": true
                            }
                        },
                        {
                            "definition": {
                                "component": "keboola.processor-create-manifest"
                            },
                            "parameters": {
                                "delimiter": ",",
                                "enclosure": "\"",
                                "incremental": false,
                                "primary_key": [],
                                "columns": [],
                                "columns_from": "header"
                            }
                        },
                        {
                            "definition": {
                                "component": "keboola.processor-skip-lines"
                            },
                            "parameters": {
                                "lines": 1
                            }
                        }
                    ]
                }
            },
            "isDisabled": false,
            "version": 3,
            "created": "2018-03-08T14:58:33+0100",
            "creatorToken": {
                "id": 27865,
                "description": "ondrej.popelka@keboola.com"
            },
            "changeDescription": "Table first table edited",
            "state": {
                "lastDownloadedFileTimestamp": "1511176959",
                "processedFilesInLastTimestampSecond": [
                    "tw_accounts.csv"
                ]
            }
        }
    ],
    "state": {},
    "currentVersion": {
        "created": "2018-03-08T23:27:37+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": "Table first table edited"
    }
}
```

The actual component configuration is split into three parts:

- `configuration` node, containing an arbitrary component configuration
- `state` node, containing a component [state file](/extend/common-interface/config-file/#state-file)
- `rows` node, containing iterations of `configuration` and `state`

The important part is the ID of the configuration you want to work with. In the following examples, we will use
`364479526`.

### Configuration
The `configuration` node maps to the [configuration file](/extend/common-interface/config-file/#configuration-file-structure).
It can contain the `storage`, `parameters`, `processors` and `authorization` child nodes (the `image_parameters` and `action` nodes found in the config file
are injected at runtime and are not stored in the configuration). The `authorization` node is set in the configuration only when
[credentials injection](/extend/common-interface/oauth/#credentials-injection) should be used, otherwise it is also set during the runtime.
The `processors` node defines the [processors and their configuration](/extend/component/processors/).
The most common sub-nodes stored in the `configuration` node are therefore `parameters` (containing an arbitrary component configuration)
and `storage` (containing [input](/extend/component/tutorial/input-mapping/) and [output mapping](/extend/component/tutorial/output-mapping/)).
Both are transferred to the
configuration file without modification; that means that the [`storage` configuration](/extend/common-interface/config-file/#configuration-file-structure)
is directly usable in the `configuration` node. The `parameters` node is fully dependent on the component and has no universal specification or rules.

In the above example, the `configuration` node contains the following:

```json
"parameters": {
    "accessKeyId": "AKIAIBZYEEXQILP46FCA",
    "#secretAccessKey": "KBC::ComponentProjectEncrypted==p5gvUw4RSGiVJjT2ayVORpqS7yiKhExi7NnQECntVm8haHaHtFNVDMT8X8b+htnixpXhPIQ9yV+ETrvr+hNeYfh+Ex+UpC//QPWnLcEOC8XOLgmQN8BNgRGSERWUziK0"
}
```

That means that the component is not using input mapping nor output mapping. The allowed contents of `parameters` are described
in the [AWS S3 extractor code documentation](https://github.com/keboola/aws-s3-extractor#configuration-options).

### Configuration Rows
The `rows` node contains iterations of the configuration. The interpretation of configuration rows is again dependent on the
component implementation. In the presented case of the `keboola.ex-aws-s3` component, each row corresponds to a single extracted table.
When `rows` node is non-empty, the component behavior is slightly modified. It behaves as if it were executed as many times as
there are rows. For each row, the `configuration` node from `root` and the `configuration` node from `rows` are merged, with
the latter overwriting the former in the case of conflict.

Given the above configuration, the **effective configuration** passed to the component
[configuration file](/extend/common-interface/config-file/#configuration-file-structure) will be as follows:

```json
{
    "parameters": {
        "accessKeyId": "AKIAIBZYEEXQILP46FCA",
        "#secretAccessKey": "KBC::ComponentProjectEncrypted==p5gvUw4RSGiVJjT2ayVORpqS7yiKhExi7NnQECntVm8haHaHtFNVDMT8X8b+htnixpXhPIQ9yV+ETrvr+hNeYfh+Ex+UpC//QPWnLcEOC8XOLgmQN8BNgRGSERWUziK0"
        "bucket": "travis-php-db-import-tests-s3filesbucket-vm9zhtm5jd7s",
        "key": "tw_accounts.csv",
        "saveAs": "first-table",
        "includeSubfolders": false,
        "newFilesOnly": true
    }
}
```

The first two parameters (`accessKeyId` and `#secretAccessKey`) are taken from the root `configuration`, the other
parameters are taken from the first rows' `configuration`. The `processors` node is never passed to the configuration file.
With the above configuration, the component will be executed only once, because there is one row. If there are no rows, the
component will still be executed once. If there were two rows, the component would be executed twice.

If the component is executed more than once, the operations are executed in the following order:

- input mapping for the first row
- run with the first row configuration (merged with root configuration)
- output mapping for the first row
- input mapping for the second row
- run with the second row configuration (merged with root configuration)
- output mapping for the second row

All of these are executed in a single [job](/integrate/jobs/). However, even though multiple rows are executed in a single
job, the actual executions are still completely isolated. I.e., there is no way to share anything between the rows
(apart from the common `configuration`). It also means that the outputs of the first row are available in the Keboola project before
the second row starts, and the inputs for the second row are read only after the first row finishes processing.

What is considered 'first' and 'second' -- i.e. the order of rows -- is defined by the order of items in the `rows` array.
See [below](#modifying-a-configuration) for an example of modifying the row order.

Theoretically, configuration rows are supported for every component as long as the effective configuration matches what
the component expects. Configuration rows can be used to split the configuration into a common part (typically credentials) and an
iterable part which is repeated many times. Keep in mind that configurations heavily modified through the API might **not be supported
in the UI**.

### State
The `state` node contains the content of the [state file](/extend/common-interface/config-file/#state-file). The
`state` is read from the state file and then supplied to the state file on the next run. In the above configuration,
the state is:

```json
{
    "lastDownloadedFileTimestamp": "1511176959",
    "processedFilesInLastTimestampSecond": [
        "tw_accounts.csv"
    ]
}
```

`State` is considered an internal property of a component and you should avoid modifying it. The only reasonable modification of
`state` is to delete it -- in that case, the configuration will run as if it were run for the first time. To delete the `state`, set it to `{}`.
If configuration rows are used, then the `state` is stored separately for each row and the `state` node in configuration root is
not used.

## Working with Configurations
Here, the most common operations done with configurations are described in examples. Feel free to go through the
[API reference](https://api.keboola.com/?service=storage#tag--Component-Configurations) for a full authoritative list of configuration features.

### List Configurations
To obtain configuration details, use the [List Configs call](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/components/-componentId-/configs),
which will return all the configuration details. This means

- the configuration itself (`configuration`) --- [section on configuration](#modifying-a-configuration) follows;
- configuration rows (`rows`) --- additional data of the configuration; and
- configuration state (`state`) --- [component state](/extend/common-interface/config-file/#state-file).

Please note that the contents
of the `configuration`, `rows` and `state` sections depend purely on the component itself. See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb).

A sample result for the AWS S3 extractor looks like this:

```json
[
    {
        "id": "364479526",
        "name": "test",
        "description": "",
        "created": "2018-03-08T14:54:19+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "version": 4,
        "changeDescription": "Table first table edited",
        "isDeleted": false,
        "configuration": {
            "parameters": {
                "accessKeyId": "AKIAIBZYEEXQILP46FCA",
                "#secretAccessKey": "KBC::ComponentProjectEncrypted==p5gvUw4RSGiVJjT2ayVORpqS7yiKhExi7NnQECntVm8haHaHtFNVDMT8X8b+htnixpXhPIQ9yV+ETrvr+hNeYfh+Ex+UpC//QPWnLcEOC8XOLgmQN8BNgRGSERWUziK0"
            }
        },
        "rowsSortOrder": [],
        "rows": [
            {
                "id": "364481153",
                "name": "first table",
                "description": "",
                "configuration": {...},
                "isDisabled": false,
                "version": 2,
                "created": "2018-03-08T14:58:33+0100",
                "creatorToken": {
                    "id": 27865,
                    "description": "ondrej.popelka@keboola.com"
                },
                "changeDescription": "Table first table edited",
                "state": {}
            }
        ],
        "state": {},
        "currentVersion": {
            "created": "2018-03-08T15:21:28+0100",
            "creatorToken": {
                "id": 27865,
                "description": "ondrej.popelka@keboola.com"
            },
            "changeDescription": "Table first table edited"
        }
    }
]
```

### Modifying Configuration
**Note: Configurations modified through the API might not be editable in the Keboola UI.** They can be run or used in an orchestration without any problems.

Modifying a configuration means that a new version of that configuration is created.
For modifying a configuration, use the
[Update Configuration](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-) API call.
See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) in which the
configuration is modified to the following to set new credentials:

```json
{
	"parameters": {
		"accessKeyId": "a",
		"#secretAccessKey": "b"
	}
}
```

Notice that the configuration must be sent in the form field `configuration` as the endpoint does not accept pure JSON (yet).
Take great care to pass **only the contents** of the `configuration` node as in the above example. The configuration **must not be wrapped** in the
`configuration` node, otherwise the component will not
receive the configuration it expects. Also take care to properly escape the JSON using [URL encoding](https://en.wikipedia.org/wiki/Percent-encoding),
otherwise it may be misinterpreted. The raw HTTP request should look similar to this:

    curl --request PUT \
    --url https://connection.keboola.com/v2/storage/components/keboola.ex-aws-s3/configs/364479526 \
    --header "Content-Type: application/json" \
    --header 'X-StorageAPI-Token: {{token}}' \
    --data-binary "{
        \"configuration\": {
            \"parameters\": {
                \"accessKeyId\": \"a\",
                \"#secretAccessKey\": \"b\"
            }
        }
    }"

Also note that the entire configuration must be always sent, there is no way to patch only part of it.
The same way the `configuration` is modified, other properties can be modified too. For example, you may want to
reset `state` by setting it to `{}`, or you can change the order of the configuration rows by setting the `rowsSortOrder` property.
The `rowsSortOrder` is an array of row ids -- see an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) (Set Row order of S3 extractor)
for the exact example request.

### Modifying Configuration Row
Very similar to modifying a configuration, modifying a configuration **row** means that a new version of
the **entire configuration** is created. For modifying a configuration row, use the
[Update Row](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-/rows/-rowId-) API call.

See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) in which the
configuration row is modified to:

```json
{
    "parameters": {
        "bucket": "some-bucket",
        "key": "sample.csv",
        "includeSubfolders": false,
        "newFilesOnly": true
    }
}
```

The rules for updating a configuration row are the same as for [updating a configuration](#modifying-a-configuration). Also note that
a configuration row is never evaluated alone, it is always merged with the root `configuration`. If the same properties are defined
in the root `configuration` and row `configuration`, the values from the row are used. There is also an
[example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) of how to reset the row
state by setting `state` to `{}`.

### Configuration Versions
When you [update a configuration](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-),
a new configuration version is actually created. In the above calls, only the last (active/published) configuration
is returned. To obtain a list of all recorded versions, use the
[List Versions API call](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-/versions).
See this [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb)
which would give you an output similar to the one below:

```json
[
    {
        "version": 4,
        "created": "2018-03-08T15:21:28+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": "Table first table edited",
        "isDeleted": false,
        "name": "test",
        "description": ""
    },
    {
        "version": 3,
        "created": "2018-03-08T14:58:33+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": "Table first table added",
        "isDeleted": false,
        "name": "test",
        "description": ""
    },
    {
        "version": 2,
        "created": "2018-03-08T14:55:50+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": "AWS Credentials edited",
        "isDeleted": false,
        "name": "test",
        "description": ""
    },
    {
        "version": 1,
        "created": "2018-03-08T14:54:19+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": "",
        "isDeleted": false,
        "name": "test",
        "description": ""
    }
]
```

The field `version` represents the `version_id` in the following API example.

### Rollback Configuration
After choosing a particular version, you can revert to that version by
[rolling back](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-/versions/-versionId-/rollback),
i.e., making a new version identical to the chosen one.  See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#2050856a-66b3-4120-9552-d1278a96621e)
of how to rollback the configuration `364479526` of the `keboola.ex-aws-s3` component to version `3`.

It will create a new version of the configuration and return the ID of the version:
```json
{
  "version": "26"
}
```

### Creating Configuration Copy
After choosing a particular version, you can create a new independent
[configuration copy](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs/-configurationId-/versions/-versionId-/create)
of it. See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb)
of how to create a new configuration called `test-copy` from version `3` of the `364479526` configuration
for the `keboola.ex-aws-s3` component.

It will return the ID of the newly created configuration:
```json
{
    "id": "364494012"
}
```

