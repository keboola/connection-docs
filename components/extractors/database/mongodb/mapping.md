---
title: Mapping Examples
permalink: /components/extractors/database/mongodb/mapping/
redirect_from:
    - /extractors/database/mongodb/mapping/

---

* TOC
{:toc}

## Basic Mapping Without Nested Documents

<table class="table table-bordered">
<tr>
<td>Document</td>
<td>
{% highlight javascript %}
{
    "_id" : ObjectId("5716054bee6e764c94fa7ddd"),
    "name" : "MongoDB extractor"
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Document in Strict Mode</td>
<td>
{% highlight json %}
{
    "_id": {
        "$oid" : "5716054bee6e764c94fa7ddd"
    },
    "name": "MongoDB extractor"
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Mapping</td>
<td>
{% highlight json %}
{
    "_id.$oid": "id",
    "name": "name"
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Output</td>
<td>

extractors
<table>
<tr><th>id</th><th>name</th></tr>
<tr><td>5716054bee6e764c94fa7ddd</td><td>MongoDB extractor</td></tr>
</table>

</td>
</tr>
</table>

## Defining Primary Key

<table class="table table-bordered">
<tr>
<td>Document</td>
<td>
{% highlight javascript %}
{
    "_id" : ObjectId("5716054bee6e764c94fa7ddd")
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Document in Strict Mode</td>
<td>
{% highlight json %}
{
    "_id": {
        "$oid" : "5716054bee6e764c94fa7ddd"
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Mapping</td>
<td>
{% highlight json %}
{
    "_id.$oid": {
        "type": "column",
        "mapping": {
            "destination": "id",
            "primaryKey": true
        }
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Output</td>
<td>

extractors
<table>
<tr><th>id (marked as PK)</th></tr>
<tr><td>5716054bee6e764c94fa7ddd</td></tr>
</table>

</td>
</tr>
</table>

## With Nested Documents

<table class="table table-bordered">
<tr>
<td>Document</td>
<td>
{% highlight javascript %}
{
    "_id" : ObjectId("5716054bee6e764c94fa7ddd"),
    "name" : "MongoDB extractor",
    "revisions" : [
        {
            "id" : "1c6262e",
            "desc" : "First version"
        },
        {
            "id" : "68fc980",
            "desc" : "Second version"
        }
    ],
    "status" : {
        "isActive" : 1,
        "isDeleted" : 0
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Document in Strict Mode</td>
<td>
{% highlight json %}
{
    "_id": {
        "$oid" : "5716054bee6e764c94fa7ddd"
    },
    "name": "MongoDB extractor",
    "revisions": [
        {
            "id": "1c6262e",
            "desc": "First version"
        },
        {
            "id": "68fc980",
            "desc": "Second version"
        }
    ],
    "status": {
        "isActive": 1,
        "isDeleted": 0
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Mapping</td>
<td>
{% highlight json %}
{
    "_id.$oid": {
        "type": "column",
        "mapping": {
            "destination": "id",
            "primaryKey": true
        }
    },
    "name": "name",
    "status.isActive": "isActive",
    "status.isDeleted": "isDeleted",
    "revisions": {
        "type": "table",
        "destination": "extractors-revisions",
        "tableMapping": {
            "id": "id",
            "desc": "desc"
        }
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Output</td>
<td>

extractors
<table>
<tr><th>id (marked as PK)</th><th>name</th><th>isActive</th><th>isDeleted</th></tr>
<tr><td>5716054bee6e764c94fa7ddd</td><td>MongoDB extractor</td><td>1</td><td>0</td></tr>
</table>

extractors-revisions
<table>
<tr><th>id</th><th>desc</th><th>extractors_pk</th></tr>
<tr><td>1c6262e</td><td>First version</td><td>5716054bee6e764c94fa7ddd</td></tr>
<tr><td>68fc980</td><td>Second version</td><td>5716054bee6e764c94fa7ddd</td></tr>
</table>

As you can see, joining those two tables will be as easy as pie.

</td>
</tr>
<tr>
    
</table>


## Storing Nested Documents to Parent Table

<table class="table table-bordered">
<tr>
<td>Document</td>
<td>
{% highlight javascript %}
{
    "_id" : ObjectId("5716054bee6e764c94fa7ddd"),
    "name" : "MongoDB extractor",
    "revisions" : [
        {
            "id" : "1c6262e",
            "desc" : "First version"
        },
        {
            "id" : "68fc980",
            "desc" : "Second version"
        }
    ],
    "status" : {
        "isActive" : 1,
        "isDeleted" : 0
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Document in Strict Mode</td>
<td>
{% highlight json %}
{
    "_id": {
        "$oid" : "5716054bee6e764c94fa7ddd"
    },
    "name": "MongoDB extractor",
    "revisions": [
        {
            "id": "1c6262e",
            "desc": "First version"
        },
        {
            "id": "68fc980",
            "desc": "Second version"
        }
    ],
    "status": {
        "isActive": 1,
        "isDeleted": 0
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Mapping</td>
<td>
{% highlight json %}
{
    "_id.$oid": {
        "type": "column",
        "mapping": {
            "destination": "id",
            "primaryKey": true
        }
    },
    "name": "name",
    "status.isActive": "isActive",
    "status.isDeleted": "isDeleted",
    "revisions.0.desc": "revision0",
    "revisions.1.desc": "revision1"
}
{% endhighlight %}

Numbers after "revision" array define position of the object in the array. 0 is the first position.
</td>    
</tr>
<tr>
<td>Output</td>
<td>

extractors
<table>
<tr><th>id (marked as PK)</th><th>name</th><th>isActive</th><th>isDeleted</th><th>revision0</th><th>revision1</th></tr>
<tr><td>5716054bee6e764c94fa7ddd</td><td>MongoDB extractor</td><td>1</td><td>0</td><td>First version</td><td>Second version</td></tr>
</table>

As you can see, values from the "revisions" array are stored in the columns of the "extractors" table.

</td>
</tr>
</table>



## With Lists

<table class="table table-bordered">
<tr>
<td>Document</td>
<td>
{% highlight javascript %}
{
    "_id" : ObjectId("5716054bee6e764c94fa7ddd"),
    "name" : "MongoDB extractor",
    "tags" : [
        "keboola",
        "extractor",
        "mongodb"
    ]
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Document in Strict Mode</td>
<td>
{% highlight json %}
{
    "_id": {
        "$oid" : "5716054bee6e764c94fa7ddd"
    },
    "name": "MongoDB extractor",
    "tags": [
        "keboola", "extractor", "mongodb"
    ]
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Mapping</td>
<td>
{% highlight json %}
{
    "_id.$oid": {
        "type": "column",
        "mapping": {
            "destination": "id",
            "primaryKey": true
        }
    },
    "name": "name",
    "tags": {
        "type": "table",
        "destination": "extractors-tags",
        "tableMapping": {
            ".": {
                "mapping": {
                    "destination": "tag"
                }
            }
        }
    }
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Output</td>
<td>

extractors
<table>
<tr><th>id (marked as PK)</th><th>name</th></tr>
<tr><td>5716054bee6e764c94fa7ddd</td><td>MongoDB extractor</td></tr>
</table>

extractors-tags
<table>
<tr><th>tag</th><th>extractors_pk</th></tr>
<tr><td>keboola</td><td>5716054bee6e764c94fa7ddd</td></tr>
<tr><td>extractor</td><td>5716054bee6e764c94fa7ddd</td></tr>
<tr><td>mongodb</td><td>5716054bee6e764c94fa7ddd</td></tr>
</table>

</td>
</tr>
</table>


## Boolean values

<table class="table table-bordered">
<tr>
<td>Documents</td>
<td>
{% highlight javascript %}
[
    {
        "_id" : ObjectId("764c94fa7ddd5716054bee6e"),
        "name" : "MySQL extractor",
        "isActive" : false
    }
    {
        "_id" : ObjectId("5716054bee6e764c94fa7ddd"),
        "name" : "MongoDB extractor",
        "isActive" : true
    }
]
{% endhighlight %}
</td>
</tr>
<tr>
<td>Documents in Strict Mode</td>
<td>
{% highlight json %}
[
    {
        "_id": {
            "$oid" : "764c94fa7ddd5716054bee6e"
        },
        "name": "MySQL extractor",
        "isActive": false
    },
    {
        "_id": {
            "$oid" : "5716054bee6e764c94fa7ddd"
        },
        "name": "MongoDB extractor",
        "isActive": true
    }
]
{% endhighlight %}
</td>
</tr>
<tr>
<td>Mapping</td>
<td>
{% highlight json %}
{
    "_id.$oid": {
        "type": "column",
        "mapping": {
            "destination": "id",
            "primaryKey": true
        }
    },
    "isActive": "isActive"
}
{% endhighlight %}
</td>
</tr>
<tr>
<td>Output</td>
<td>

extractors
<table>
<tr><th>id (marked as PK)</th><th>name</th><th>isActive</th></tr>
<tr><td>764c94fa7ddd5716054bee6e</td><td>MySQL extractor</td><td>(empty string)</td></tr>
<tr><td>5716054bee6e764c94fa7ddd</td><td>MongoDB extractor</td><td>1</td></tr>
</table>

</td>
</tr>
</table>
