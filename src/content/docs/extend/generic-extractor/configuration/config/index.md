---
title: Extraction Configuration
slug: 'extend/generic-extractor/configuration/config'
---


*To configure your first Generic Extractor, follow our [tutorial](/extend/generic-extractor/tutorial/).*
*Use [Parameter Map](/extend/generic-extractor/map/) to help you navigate among various
configuration options.*

The `config` section of Generic Extractor configuration **describes the actual extraction**, including properties of HTTP requests,
and mapping between source JSON and target CSV.

A sample `config` configuration can look like this:

```json
{
    ...,
    "config": {
        "debug": false,
        "outputBucket": "ge-tutorial",
        "incrementalOutput": false,
        "compatLevel": 2,
        "jobs": [
            ...
        ],
        "mappings": {
            ...
        },
        "http": {
            ...
        },
        "userData": {
            ...
        }
    }
}
```

Apart from the properties listed below, the `config` section can contain any number of
other properties which are not used by Generic Extractor itself, but may be referenced
from within [functions](/extend/generic-extractor/functions/).

The keys prefixed by the hash character `#` are [automatically encrypted](/overview/) when the
configuration is saved. It is advisable to store sensitive information in such fields. Note, however, they
are not automatic aliases to un-encrypted fields. That means that when using a `#password` field, you
must always refer to it as `#password` (for instance, in [functions](/extend/generic-extractor/functions)).
Also, you cannot encrypt any Generic Extractor configuration fields (such as `jobs`, `mappings`, ...).

## Jobs
The Jobs configuration describes the API endpoints (resources) which will be extracted. This
includes configuring the HTTP method and parameters. The `jobs` configuration is
**required** and is described in a [separate article](/extend/generic-extractor/configuration/config/jobs/).

## Output Bucket
The `outputBucket` option defines the name of the [Storage Bucket](/storage/buckets/)
in which the extracted tables will be stored. The configuration is **required** unless
the extractor is [published](/extend/generic-extractor/publish/) as a standalone component with the
[Default Bucket](/extend/common-interface/folders/#default-bucket) option.

The following configuration will make Generic Extractor put all extracted tables in the `ge-tutorial` bucket
(the names of the tables are defined by the [`dataType`](/extend/generic-extractor/configuration/config/jobs/#dataType) setting):

```json
{
    ...,
    "config": {
        "outputBucket": "ge-tutorial",
        ...
    }
}
```

If you omit the `outputBucket` configuration, you will receive an error similar to this:

    CSV file 'campaigns' file name is not a valid table identifier, either set output mapping for 'campaigns' or make sure that the file name is a valid Storage table identifier.

## Mappings
The Mappings configuration describes how the JSON response is converted into
CSV files that will be imported into Storage. The `mappings` configuration is **optional** and
is described in a [separate article](/extend/generic-extractor/configuration/config/mappings/).

## Debug
The `debug` boolean option allows you to turn on more verbose logging which shows
all HTTP requests sent by Generic Extractor. The default value is `false`.
Read more about running Generic Extractor in a [separate article](/extend/generic-extractor/running/).

## HTTP
The `http` option allows you to set the HTTP headers sent with every request. This primarily serves the purpose of providing values for [`api.http.requiredHeaders` option](/extend/generic-extractor/configuration/api/#required-headers).
It is also possible to use the `http` option without `api.http.requiredHeaders` in
which case it is essentially equal to [`api.http.headers`](/extend/generic-extractor/configuration/api/#default-headers).

```json
{
    ...,
    "config": {
        "http": {
            "headers": {
                "X-AppKey": "ThisIsSecret"
            }
        },
        ...
    }
}
```

See [example [EX074]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/074-http-headers).

## Incremental Output
The `incrementalOutput` boolean option allows you to load the extracted data into
[Storage](/storage/) incrementally. This flag in no way affects the data extraction.
When `incrementalOutput` is set to `true`, the contents of the target table in Storage will not be cleared.
The default value is `false`.

How to configure Generic Extractor to extract data in increments from an API
is described in a [dedicated article](/extend/generic-extractor/incremental/).

See [example [EX075]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/075-incremental-output).

## User Data
The `userData` option allows you to add arbitrary data to extracted records.
It is an object with arbitrary property names which are added as columns to all records extracted
from parent jobs. The property values are the columns values. It is also possible to use
[functions](/extend/generic-extractor/functions/) as `userData` property values.

The following configuration:

```json
{
    "config": {
        "userData": {
            "tag": "fullExtract",
            "mode": "development"
        }
    }
}
```

and the following response:

```json
[
    {
        "id": 123,
        "name": "John Doe"
    },
    {
        "id": 234,
        "name": "Jane Doe"
    }
]
```

will produce the following `users` table:

|id|name|tag|mode|
|123|John Doe|fullExtract|development|
|234|Jane Doe|fullExtract|development|

The `userData` values are added to the parent jobs only. They will not affect the
[child jobs](/extend/generic-extractor/configuration/config/jobs/children). If the result table contains
columns with the same names as the `userData` properties. If there is already a column with the same name,
the `userData` column will be renamed.

See [example [EX076]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/076-user-data).

## Compatibility Level
As we develop the Generic Extractor, some of the new features might lead to minor differences in extraction results.
When such a situation arises, a new *compatibility level* is introduced. The `compatLevel` setting allows
you to force the old compatibility level and **temporarily** maintain the old behavior. The current
compatibility level is **3**. The `compatLevel` setting is intended only to ease updates and migrations,
never use it in new configurations (any version of old behavior is considered unsupported).

When a new Level is introduced, the following will happen:

- Configurations that explicitly specify `compatLevel` will stay unchanged.
- All other configurations will automatically use the latest level.

Note that there is an exception: all configurations running before Level 3 was introduced will use compatibility
Level 1. This means that they use the legacy (Level 1) JSON parser, and you will see the following warning in
events: `Using legacy JSON parser, because it is in configuration state.`

### Level 2
Level 2 has different behavior in [`responseFilter`](/extend/generic-extractor/configuration/config/jobs/#response-filter) handling.
In current behavior (level 3 and above), a filtered JSON property consistently produces a valid JSON.
Previously (level 2 and below), a scalar value was not filtered. Given the data:

```json
[
    {
        "id": 1,
        "data": {
            "a": "b"
        }
    },
    {
        "id": 2,
        "data": "c"
    }
]
```

With `responseFilter` set to `data`, the level 2 version produces the following table:

|id|data|
|---|---|
|1|{"a":"b"}|
|2|c|

Level 3 and above produces:

|id|data|
|---|---|
|1|{"a":"b"}|
|2|"c"|

That means that the `data` column is always a valid JSON string.
Compare the results of examples
[EX121](https://github.com/keboola/generic-extractor/tree/master/doc/examples/121-inconsistent-object-legacy)
and
[EX122](https://github.com/keboola/generic-extractor/tree/master/doc/examples/122-multiple-filters-legacy).
using compatibility level 2 with the result produced by examples
[EX016](https://github.com/keboola/generic-extractor/tree/master/doc/examples/016-inconsistent-object)
and
[EX018](https://github.com/keboola/generic-extractor/tree/master/doc/examples/018-multiple-filters)
which use the current JSON parser.

### Level 1
Level 1 uses a JSON parser which cannot handle duplicate columns properly. This applies to a number of situations:

- The response contains properties which are evaluated to the same name, e.g.:
```json
{
    "some.property": "first",
    "some_property": "second"
}
```
- The response contains nested properties which are evaluated to the same name, e.g.:
```json
{
    "some_property": "first",
    "some": {
        "property": "second"
    }
}
```
- The response contains names which are generated internally by Generic Extractor (`parent_id`, `JSON_parentId`), e.g. -- in a child job:
```json
{
    "parent_id": 1,
    "name": "someName"
}
```
- The user data contains a column which is present in the response.

In either of these situations, the Level 1 extractor generates an empty column with hash, and
the original (or first encountered) column values are overwritten. In the current version
(Level 2 and above), both columns are retained. The second encountered column has a
numbered suffix. If you are upgrading from a Level 1 extractor, delete the column
with hash from the target Storage table, otherwise you'll get an error (`Some columns are missing in
the csv files`).

There are also some differences in the naming of very long columns. For example, a property
`data.modules.#DistributionGroups.outputs.groupCharacteristics.persistent` is shortened to
`d__m__DistributionGroups_outputs_groupCharacteristics_persistent` in a Level 1 extractor, and
to `DistributionGroups_outputs_groupCharacteristics_persistent` in Level 2 and above.

Compare the results of examples
[EX124](https://github.com/keboola/generic-extractor/tree/master/doc/examples/124-naming-conflict-legacy)
and
[EX125](https://github.com/keboola/generic-extractor/tree/master/doc/examples/125-user-data-legacy),
using compatibility level 1 with the result produced by examples
[EX025](https://github.com/keboola/generic-extractor/tree/master/doc/examples/025-naming-conflict)
and
[EX076](https://github.com/keboola/generic-extractor/tree/master/doc/examples/076-user-data)
which use the current JSON parser.