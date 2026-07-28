---
title: Child Jobs
slug: 'components/extractors/generic-extractor/configuration/config/jobs/children'
redirect_from:
    - /extend/generic-extractor/configuration/config/jobs/children/
---


*If new to Generic Extractor, learn about [jobs in our tutorial](/components/extractors/generic-extractor/tutorial/jobs/) first.*
*Use [Parameter Map](/components/extractors/generic-extractor/map/) to help you navigate among various 
configuration options.*

Child jobs allow you to **iterate/traverse over sub-resources of an API resource**. Because child jobs may contain
other child jobs, you may query for sub-sub-resources in a virtually unlimited depth.

For instance, when downloading a list of users, you can download details of each user or a list of orders for each
user. See the Generic Extractor tutorial for a basic [example of using child
jobs](/components/extractors/generic-extractor/tutorial/jobs/#child-jobs).

Apart from two additional fields, `placeholders` and `recursionFilter`, configuring a child job is no different than
configuring [any other job](/components/extractors/generic-extractor/configuration/config/jobs).

<details>
  <summary>Click to see a sample job configuration.</summary>

```json
{
    ...,
    "config": {
        "jobs": [
            {
                "endpoint": "users",
                "method": "get",
                "dataField": "items",
                "dataType": "users",
                "params": {
                    "type": "active"
                },
                "responseFilter": "additional.address/details",
                "responseFilterDelimiter": "/",
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
        ]
    }
}
```
</details>
<br>

## Placeholders
In a child job, the `endpoint` configuration must contain a **placeholder** enclosed in curly braces `{}`.
For example, the following endpoint defines the placeholder **user-id**:

```json
{
    ...,
    "endpoint": "user/{user-id}"
}
```

The **placeholder name** is rather arbitrary (it should not contain any special characters though). To assign it
a value, use the `placeholders` configuration. It is an object whose properties are placeholder names. The value
of each `placeholders` object property is a **property path** in the parent job response.
The placeholder in the child `endpoint` will be replaced by the **value** of that parent property. The property
path is configured relative to the extracted object ([see an example](#accessing-deeply-nested-id)). The child
`endpoint` is configured relative to the [`api.baseUrl` configuration](/components/extractors/generic-extractor/configuration/api/#base-url), 
not relative to the parent endpoint.

The following configuration:

```json
{
    ...,
    "endpoint": "user/{user-id}",
    "placeholders": {
        "user-id": "userId"
    }
}
```

means that Generic Extractor sends as many requests to the `/user/XXX` endpoint as there
are result objects in the parent API response. The `XXX` will be replaced by the `userId` value
of each individual response. Placeholders must be used in child jobs so that each child job sends a different API request.

<!--
TODO: Un-comment this when this https://github.com/keboola/generic-extractor/issues/49 is fixed.

The `placeholders` object can be specified as an object whose values are strings with the paths. It is
also possible to use a more complicated structure where the value is another object with `path` property.
The following configuration is equivalent to the above one:

```json
{
    ...,
    "endpoint": "user/{user-id}",
    "placeholders": {
        "user-id": {
            "path": "userId"
        }
    }
}
```

This is useful when using [User Defined functions](/components/extractors/generic-extractor/user-functions/)
-->

**Note:** It is technically possible to define a child job without using `placeholders` configuration
or without having a placeholder in the `endpoint`. But then all the child requests would be the same and
that is usually not what you intend to do.

### Placeholder Level
Optionally, the placeholder name may be prefixed by a nesting **level**. Nesting allows you to
refer to properties in other objects than the direct parent. The level is written as the
placeholder name prefix, delimited by a colon `:`. For example, `2:user-id`.

The default level is 1, meaning that the placeholder `user-id` is equivalent to `1:user-id` and
that the property path will be searched in the direct parent of the child job. The level
is counted from the child 'upwards'. Therefore a placeholder `2:user-id` means that
the property path will be searched in the parent of the child parent (two levels up).
See the [corresponding examples](#nesting-level).

## Filter
The configuration option `recursionFilter` allows you to skip some child jobs. This can be
useful in these cases:

- Some resources are not accessible to you and querying them would cause an error in the extraction.
- Some resources return inconsistent or incomplete responses.
- You are not interested in some of the resources and want to speed up the extraction.

The `responseFilter` configuration contains a string expression with a filter condition composed of the following:

- Name of a property from the parent response
- Comparison operator: `<`, `>`, `<=`, `>=`, `==` (equal), `!=` (not equal), `~~` (like), `!~` (unlike)
- Value to compare
- Logical operators: `|` (or), `&` (and); optionally, they may be used to join multiple conditions.

An example response filter may be `type!=employee` or `product.value>150`. To test for an empty value (`null`, `false`, `""`, `0`) do not use any value -- e.g. `type!=` filter matches an empty value.

**Important:** The expression is whitespace sensitive. Therefore `type != employee` filters the `"type "` property
to not contain the value `" employee"` (which is probably not what you intended to do). String comparisons are always
**case sensitive**.

## Examples
This section contains a number of examples using child jobs.

### Basic Example
Let's say that you have an API with two endpoints:

- `/users/` --- Returns a list of users.
- `/user/?` --- Returns user details with a given user ID.

The `users` endpoint returns a response like this:

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

The `user/123` endpoint returns a response like this:

```json
{
    "id": 123,
    "name": "John Doe",
    "address": {
        "city": "London",
        "country": "UK",
        "street": "Whitehaven Mansions"
    }
}
```

Now use the following configuration, retrieving the user list and user
details for each user:

```json
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "children": [
                        {
                            "endpoint": "user/{user-id}",
                            "dataField": ".",
                            "placeholders": {
                                "user-id": "id"
                            }
                        }
                    ]
                }
            ]
        }
    }
}
```

The `jobs` section defines a single job for the `users` resource. This job has child jobs for
the `users/{user-id}` resource. The `user-id` placeholder in the endpoint URL is
replaced by the value of the `id` property of each user in the parent job response. This means that
Generic Extractor makes three API calls:

- `users`
- `users/123`
- `users/234`

The [`dataField`](/components/extractors/generic-extractor/configuration/config/jobs/#data-field) is set to a dot to retrieve the 
entire response as a single object. Running Generic Extractor produces the following tables:

users:

|id|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

user__user-id:

|id|name|address\_city|address\_country|address\_street|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|London|UK|Whitehaven Mansions|123|
|234|Jane Doe|St Mary Mead|UK|High Street|234|

Notice that the table representing child resources contains all the responses
merged into a single table; the [usual merging rules](/components/extractors/generic-extractor/configuration/config/jobs/#merging-response) apply.

Also notice that a new column --- `parent_id` was added, containing the **placeholder value** used
to retrieve the resource. The `parent_id` column is not always named `parent_id`.
Its name is created by joining the `parent_` prefix to the **placeholder path**.

To create a friendly name for the table, it is good to use the [dataType](/components/extractors/generic-extractor/configuration/config/jobs/#data-type) 
property (see the next example). The auto-generated name is rather ugly.

See [example [EX021]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/021-basic-child-job).

### Basic Job With Data Type
To avoid automatic table names, it is advisable to always use the `dataType` property for
child jobs:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "user-id": "id"
                }
            }
        ]
    }
]
```
In the above configuration, `dataType` is set to `user-detail`, hence you will obtain the
following tables:

users:

|id|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

user-detail:

|id|name|address\_city|address\_country|address\_street|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|London|UK|Whitehaven Mansions|123|
|234|Jane Doe|St Mary Mead|UK|High Street|234|

See [example [EX022]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/022-basic-child-job-datatype).

### Basic Job With Array Values
It is also possible that the main job returns objects which contain direct references 
to the children:

```json
[
    {
        "id": 123,
        "name": "John Doe",
        "children": ["a1", "a2"]
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "children": ["a3"]
    }
]
```

The following configuration is the same as in the 
[previous example](/components/extractors/generic-extractor/configuration/config/jobs/children/#basic-example):

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{child-id}",
                "dataField": ".",
                "placeholders": {
                    "child-id": "children"
                }
            }
        ]
    }
]
```

The child jobs will iterate both over the returned array of objects and
the array of each `children`. Therefore the following tables will be extracted:

users:

|id|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

user-child:

|id|name|address_city|address_country|address_street|parent_children|
|---|---|---|---|---|---|
|a1|John Doe|London|UK|Whitehaven Mansions|a1|
|a2|Jane Doe|St Mary Mead|UK|High Street|a2|
|a3|Jimmy Doe|Scaryville|Nowhere|Cemetery Lane|a3|

See [example [EX135]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/135-basic-child-job-array).

### Accessing Nested ID
If the placeholder value is nested within the response object, you can use
dot notation to access child properties of the response object. For instance, if the
parent response with a list of users returns a response similar to this:

```json
[
    {
        "name": "John Doe",
        "user-info": {
            "id": 123,
            "active": true
        }
    },
    {
        "name": "Jane Doe",
        "user-info": {
            "id": 234,
            "active": false
        }
    }
]
```

you have to modify the `placeholders` definition:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "user-id": "user-info.id"
                }
            }
        ]
    }
]
```

Setting the placeholder to `"user-id": "user-info.id"` means that the `user-id` placeholder
will be replaced by the value of the `id` property inside the `user-info` object in the parent response.
If you fail to set a correct path for the placeholder, you will receive an error:

    `No value found for user-id in the parent result. (level: 1)`

When you set the correct path, you will get the following tables:

users:

|name|user-info\_id|user-info\_active|
|---|---|---|
|John Doe|123|1|
|Jane Doe|234||

user detail:

|id|name|address\_city|address\_country|address\_street|parent\_user-info\_id|
|---|---|---|---|---|---|
|123|John Doe|London|UK|Whitehaven Mansions|123|
|234|Jane Doe|St Mary Mead|UK|High Street|234|

Notice that the parent reference column name is the concatenation of the `parent` prefix and
`user-info_id` placeholder path (with special characters replaced by the underscore `_`).

See [example [EX023]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/023-child-job-nested-id).

### Accessing Deeply Nested Id
The placeholder path is configured **relative to** the extracted object. Assume that the
parent endpoint returns a complicated response like this:

```json
{
    "active-users": {
        "items": [
            {
                "name": "John Doe",
                "user-info": {
                    "id": 123,
                    "active": true
                }
            },
            {
                "name": "Jane Doe",
                "user-info": {
                    "id": 234,
                    "active": true
                }
            }
        ],
        "description": "Active Users"
    },
    "inactive-users": {
        "items": [
            {
                "name": "Jimmy Doe",
                "user-info": {
                    "id": 345,
                    "active": false
                }
            }
        ],
        "description": "Inactive Users"
    }
}
```

The following job definition extracts the `active-users` array together with the details for each user:

```json
"jobs": [
    {
        "endpoint": "users",
        "dataField": "active-users.items",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "user-id": "user-info.id"
                }
            }
        ]
    }
]
```

Notice that the placeholder path remains set to `user-info.id` because it is relative to
the parent object, which itself is located at the path `active-users.items`. This
may be confusing because the endpoint property in that child job is set relative to the
`api.baseUrl` and not to the parent URL.

See [example [EX024]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/024-child-job-deeply-nested-id).

### Naming Conflict
Because a new column is added to the table representing child properties, it is possible that you
run into a naming conflict. That is, if the child response with user details looks like this:

```json
{
    "id": 123,
    "name": "John Doe",
    "parent_id": "admins",
    "address": {
        "city": "London",
        "country": "UK",
        "street": "Whitehaven Mansions"
    }
}
```

and you use the following job configuration:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "placeholders": {
                    "user-id": "id"
                }
            }
        ]
    }
]
```

the output for the child job will contain the column `parent_id`. At the same time, Generic Extractor will attempt
to create the column `parent_id` with the placeholder value, overwriting the original column. That column will be lost.

See [example [EX025]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/025-naming-conflict).

### Nesting Level
By default, the placeholder value is taken from the object retrieved in the parent job. As long as the child
jobs are nested only one level deep, there is no other option anyway. Let's see what happens with a deeper nesting.

Assume that you have an API with the following endpoints:

- `/users/` --- Returns a list of users.
- `/user/?` --- Returns user details with given user ID.
- `/user/?/orders` --- Returns a list of user orders.
- `/user/?/orders/?` --- Returns order detail with given user and order ID.

The `users` endpoint returns a response like this:

```json
[
    {
        "userId": 123,
        "name": "John Doe"
    },
    {
        "userId": 234,
        "name": "Jane Doe"
    }
]
```

The `user/123` endpoint returns a response like this:

```json
{
    "userId": 123,
    "name": "John Doe",
    "description": "Good ol' father John"
}
```

The `user/123/orders` endpoint returns a response like this:

```json
[
    {
        "orderId": "1234",
        "price": "$12"
    },
    {
        "orderId": "1345",
        "price": "$1212"
    }
]
```

The `user/123/order/1234` endpoint returns a response like this:

```json
{
    "orderId": 1234,
    "price": "$12",
    "timestamp": "2017-05-06 8:21:45",
    "state": "cancelled"
}
```

Then you can create a job configuration with three nested children to retrieve all the API resources:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{1:user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "1:user-id": "userId"
                },
                "children": [
                    {
                        "endpoint": "user/{2:user-id}/orders",
                        "dataType": "orders",
                        "placeholders": {
                            "2:user-id": "userId"
                        },
                        "children": [
                            {
                                "endpoint": "user/{3:user-id}/order/{1:order-id}",
                                "dataType": "order-detail",
                                "dataField": ".",
                                "placeholders": {
                                    "3:user-id": "userId",
                                    "1:order-id": "orderId"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```

The `jobs` configuration retrieves all users from the `users` API endpoint. The first child retrieves
details for each user (from `user/?` endpoint) and stores them in the `user-detail` table. The second
child retrieves each user orders (from `user/?/orders` endpoint) and stores them in the `orders` table.
Finally, the deepest nested child returns details of each order (for each user) from the
`user/?/order/?` endpoint and stores them in the `order-detail` table. Therefore the following four tables
will be produced:

users:

|userId|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

user-detail:

|userId|name|description|parent\_userId|
|---|---|---|---|
|123|John Doe|Good ol' father John|123|
|234|Jane Doe|Good young mommy Jenny|234|

orders:

|orderId|price|parent\_userId|
|---|---|---|
|1234|$12|123|
|1345|$1212|123|
|2345|$42|234|

order-detail:

|orderId|price|timestamp|state|parent\_userId|parent\_orderId|
|---|---|---|---|---|---|
|1234|$12|2017-05-06 8:21:45|cancelled|123|1234|
|1345|$1212|2017-12-24 12:30:53|delivered|123|1345|
|2345|$42|2017-01-12 2:12:43|cancelled|234|2345|

Notice that each table contains additional columns with the placeholder property path prefixed with `parent_`.

See [example [EX026]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/026-basic-deeper-nesting).

### Nesting Level Alternative
Because the required user and order IDs are present in multiple requests (in the list and in the detail), there
are multiple ways how the jobs may be configured. For example, the following configuration produces the
exact same result as the above configuration:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "user-id": "userId"
                },
                "children": [
                    {
                        "endpoint": "user/{user-id}/orders",
                        "dataType": "orders",
                        "children": [
                            {
                                "endpoint": "user/{user-id}/order/{order-id}",
                                "dataType": "order-detail",
                                "dataField": ".",
                                "placeholders": {
                                    "order-id": "orderId"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```

Even though the above configuration is less explicit and not really recommended, it is still acceptable.
Placeholders are defined globally, which means that the second nested child job to `user/{user-id}/orders` does
not define any because it relies on those defined by its parent job (which happen to be correct). Also the
deepest child defines only the `order-id` placeholder because, again, the `user-id` placeholder was defined in
some of its parents. 

Although the placeholders are defined globally, the ones defined in child jobs override the ones in the parent
jobs. For example, in the following (probably **very incorrect**) configuration, the `1:user-id` placeholder in 
the deepest child will really contain the `orderId` value.

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{1:user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "1:user-id": "userId"
                },
                "children": [
                    {
                        "endpoint": "user/{2:user-id}/orders",
                        "dataType": "orders",
                        "placeholders": {
                            "2:user-id": "userId"
                        },
                        "children": [
                            {
                                "endpoint": "user/{1:user-id}/order/{2:order-id}",
                                "dataType": "order-detail",
                                "dataField": ".",
                                "placeholders": {
                                    "1:user-id": "orderId",
                                    "2:order-id": "userId"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```

See [example [EX027]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/027-basic-deeper-nesting-alternative).

### Deep Job Nesting
Let's look at how to retrieve more nested API resources:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{1:user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "1:user-id": "id"
                },
                "children": [
                    {
                        "endpoint": "user/{2:user-id}/orders",
                        "dataType": "orders",
                        "placeholders": {
                            "2-user-id": "id"
                        },
                        "children": [
                            {
                                "endpoint": "user/{3:user-id}/order/{1:order-id}",
                                "dataType": "order-detail",
                                "dataField": ".",
                                "placeholders": {
                                    "3:user-id": "id",
                                    "1:order-id": "id"
                                },
                                "children": [
                                    {
                                        "endpoint": "user/{4:user-id}/order/{2:order-id}/items",
                                        "dataType": "order-items",
                                        "placeholders": {
                                            "4:user-id": "id",
                                            "2:order-id": "id"
                                        },
                                        "children": [
                                            {
                                                "endpoint": "user/{5:user-id}/order/{3:order-id}/item/{1:item-id}",
                                                "dataType": "item-detail",
                                                "dataField": ".",
                                                "placeholders": {
                                                    "5:user-id": "id",
                                                    "3:order-id": "id",
                                                    "1:item-id": "id"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```

The above configuration assumes that all API resources simply have an `id` property (unlike in the
previous example, where the users had `userId` and the orders had `orderId`). This makes the configuration look
rather cryptic. Read the deepest child placeholder configuration

    "5:user-id": "id",
    "3:order-id": "id",
    "1:item-id": "id"

as:

- Go five levels up, pick the `id` property from the response and put it in place of the `user-id` in the endpoint URL.
- Go three levels up, pick the `id` property from the response and put it in place of the `order-id` in the endpoint URL.
- Go one level up, pick the `id` property from the response and put it in place of the `item-id` in the endpoint URL.

**Important:** Once you run into using placeholders with the same property path, their order becomes important.
This is because the property path is used as the name of an additional column in the extracted table. Because
the property path is `id` in all cases, it will lead to the column `parent_id` in all cases, and therefore it
will get overwritten. With the above configuration, the following `item-detail` table will be produced:

|id|code|name|parent_id|
|---|---|---|---|
|345|PA10|Pick Axe|345|
|456|TB20|Tooth Brush|456|

where the `parent_id` column refers to the `1:item-id` placeholder. If you used this placeholder configuration:

```json
"placeholders": {
    "1:item-id": "id",
    "3:order-id": "id",
    "5:user-id": "id"
}
```

you would obtain the following `item-detail` table:

|id|code|name|parent_id|
|---|---|---|---|
|345|PA10|Pick Axe|123|
|456|TB20|Tooth Brush|123|

where the `parent_id` column refers the `5:user-id` placeholder.

See [example [EX028]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/028-advanced-deep-nesting).

### Nested Array

Suppose now that the endpoint `/users` returns a more complicated response:

```json
{
    "members": {
        "description": "Active System Members",
        "tags": [
            "active",
            "crm"
        ],
        "count": "2",
        "items": [
            {
                "name": "John Doe",
                "user-info": {
                    "id": 123,
                    "active": true
                }
            },
            {
                "name": "Jane Doe",
                "user-info": {
                    "id": 234,
                    "active": false
                }
            }
        ]
    }
}
```

The API also has an endpoint `/user/{userId}` which returns details about a specific user. If 
you want to obtain all the fields from the above response and also the details about each user, 
you have to create a rather tricky configuration. Even though you may be tempted to start with 
the following job configuration:

```json
{
    "endpoint": "users",
    "dataField": "."
}
```

this is not possible because the root of the response in the `members` field is not 
an array and therefore it cannot create child jobs. For that reason the job configuration must start with:

```json
{
    "endpoint": "users",
    "dataField": "members.items",
}
```

The `members.items` is an array which now can be used as a source for child jobs:

```json
{
    "endpoint": "users",
    "dataField": "members.items",
    "dataType": "users",
    "children": [
        {
            "endpoint": "user/{user-id}",
            "dataField": ".",
            "dataType": "user-detail",
            "placeholders": {
                "user-id": "user-info.id"
            }
        }
    ]
}
```

Notice that the placeholder path (`user-info.id`) is entered relative to the `dataField` setting
(`members.items`). Now, to extract the other fields from the `/users` response (other than `member.items`), 
create another job:

```json
{
    "endpoint": "users",
    "dataField": ".",
    "dataType": "users-2"
}
```

Note that the `dataType` must be different than in the first job because the structure of the response is different.
You will receive a number of tables:

users (first job):

|name|user-info\_id|user-info\_active|
|---|---|---|
|John Doe|123|1|
|Jane Doe|234||

user-detail (first job children):

|id|name|address\_city|address\_country|address\_street|parent\_user-info\_id|
|---|---|---|---|---|---|
|123|John Doe|London|UK|Whitehaven Mansions|123|
|234|Jane Doe|St Mary Mead|UK|High Street|234|

users-2 (second job):

|members\_description|members\_tags|members\_count|members\_items|
|---|---|---|---|
|Active System Members|users-2.members\_c6eb0647a7f2fb2cbe02ba62d56e3312|2|users-2.members\_c6eb0647a7f2fb2cbe02ba62d56e3312|

users-2\_members\_items (second job, generated from array node `items`):

|name|user-info\_id|user-info\_active|JSON\_parentId|
|---|---|---|---|
|John Doe|123|1|users-2.members_c6eb0647a7f2fb2cbe02ba62d56e3312|
|Jane Doe|234||users-2.members_c6eb0647a7f2fb2cbe02ba62d56e3312|

The `users-2\_members\_items` contains the same results as the `users` table, but it also contains the 
`JSON\_parentId` column which allows you to link the user list to the list description in the `users-2` table.
This makes the response in the `users` table quite useless, but the job is still required to generate
the child jobs to obtain the `user-detail` table. See [example [EX106]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/106-child-jobs-array).

### Simple Filter
Let's assume that you have an API which has two endpoints:

- `users` --- Returns a list of users.
- `users/?` --- Returns a user detail.

The `users` endpoint returns a response like this:

```json
[
    {
        "id": 123,
        "name": "John Doe",
        "role": "parent",
        "type": "admin"
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "role": "parent",
        "type": "administrator"
    },
    {
    	"id": 345,
    	"name": "Jimmy Doe",
    	"role": "child",
    	"type": "user"
    },
    {
    	"id": 456,
    	"name": "Janet Doe",
    	"role": "child",
    	"type": "user"
    }
]
```

The `user/123` endpoint returns a response like this:

```json
{
    "id": 123,
    "name": "John Doe",
    "userRole": "parent",
    "userType": "admin",
    "description": "Father John"
}
```

A simple child filter can be then set up using the following `jobs` configuration:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "placeholders": {
                    "user-id": "id"
                },
                "recursionFilter": "role==parent"
            }
        ]
    }
]
```

The `recursionFilter` setting will cause Generic Extractor to query only the sub-resources for which the
filter evaluates to true. The filter property name `type` refers to the parent response, but it
filters only the children. So, the following tables will be returned:

users:

|id|name|role|type|
|---|---|---|---|
|123|John Doe|parent|admin|
|234|Jane Doe|parent|administrator|
|345|Jimmy Doe|child|user|
|456|Janet Doe|child|user|

user-detail:

|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|parent|admin|Father John|123|
|234|Jane Doe|parent|administrator|Mother Jane|234|

You can see from the above tables that the filter is applied to the child results only so that
the details are retrieved only for the desired users.

See [example [EX029]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/029-simple-filter).

### Not Like Filter
Apart from the standard comparison operators, the recursive filter allows to use
a **like** comparison operator `~`. It expects that the value contains a placeholder `%`,
which matches any number of characters. The following configuration:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "recursionFilter": "type!~%min%",
                "dataType": "user-detail",
                "placeholders": {
                    "user-id": "id"
                }
            }
        ]
    }
]
```

filters out all child resources not containing the string `min` in their parent type property.
The expression `%min%` matches any string which contains any number of characters (including none)
before and after the string `min`. The operator `!~` is negative like, therefore the
following `user-detail` table will be extracted:

|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|345|Jimmy Doe|child|user|Sonny Jimmy|345|
|456|Janet Doe|child|user|Missy Jennie|456|

See [example [EX030]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/030-not-like-filter).

### Combining Filters
Multiple filters can be combined using the
[logical](https://en.wikipedia.org/wiki/Boolean_algebra#Basic_operations) `&` (and) and `|` (or) operators.
For example, the following configuration retrieves details for users who have
both `id < 400` and `role = child`:

```json
"jobs": [
    {
        "endpoint": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "dataType": "user-detail",
                "recursionFilter": "id<400&role==child",
                "placeholders": {
                    "user-id": "id"
                }
            }
        ]
    }
]
```

The following `user-detail` will be produced:

|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|345|Jimmy Doe|child|user|Sonny Jimmy|345|

See [example [EX031]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/031-combined-filter).

### Multiple Filter Combinations
Although you can join a multiple filter expression with logical operators as in the
above example, there is no support for parentheses. The following configuration
combines multiple filters:

```json
"jobs": [
    {
        "endpoint": "users",
        "recursionFilter": "role=parent|id>300&id<400",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataField": ".",
                "placeholders": {
                    "user-id": "id"
                }
            }
        ]
    }
]
```

The precedence of logical operators is defined so that the first operator occurring in the
expression takes precedence over the second. That is to say that the condition `role=parent|id>300&id<400`
is interpreted as `role=parent|(id>300&id<400)` because the operator `|` takes precedence
over the `&` operator. The condition `id>300&id<400|role==parent` is interpreted as
`id>300&(id<400|role==parent)` because the `&` operator takes precedence over the `|` operator.

With the above configuration, the following `user-detail` table will be produced:

|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|parent|admin|Father John|123|
|234|Jane Doe|parent|administrator|Mother Jane|234|
|345|Jimmy Doe|child|user|Sonny Jimmy|345|

Because the described system of operator precedence may lead to rather unusual behaviour,
we recommend that you keep the recursive filter simple.

See [example [EX032]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/032-multiple-combined-filter).
