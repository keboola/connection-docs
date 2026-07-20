---
title: Pagination Tutorial
slug: 'components/extractors/generic-extractor/tutorial/pagination'
redirect_from:
    - /extend/generic-extractor/tutorial/pagination/
---


Pagination breaks a result with a large number of items into separate pages and is used very commonly in 
many API calls. 

In the previous part of the tutorial, you [fetched campaigns from 
the MailChimp API](/components/extractors/generic-extractor/tutorial/). If you created a new account, chances are that you probably have 
only one campaign. You should now create some more campaigns (you do not have to configure them anyhow).

If the API has consistent pagination for all resources (which the
[MailChimp API has](https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#Parameters)),
then the pagination is defined in the `Pagination` section of the endpoint configuration (or in the `api` section in the underlying JSON).

## Preparation
The MailChimp API uses the [`offset` pagination method](https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#Parameters),
which means that each page has a fixed `limit` (by default 10 items), and you need to use the offset to move 
that fixed-size page over the next set of results. For the first page, the `offset` is 0, for the second 
page, the `offset` is 10. This is the same kind of pagination as in SQL.

The offset pagination method is configured with the following basic properties:

- `method` --- for MailChimp, set this property to `offset`.
- `offsetParam` --- name of the API parameter which defines the [page offset](https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#Parameters)
- `limitParam` -- name of the API parameters which define the [page size (limit)](https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#Parameters)

So, for MailChimp, configure the pagination this way:

- Click `Create New Pagination` in the Endpoint's Pagination section:

![Create pagination.png](/components/extractors/generic-extractor/tutorial/img.png)

- Name your pagination and select the Offset method:

![Pagination](/components/extractors/generic-extractor/tutorial/pagination.png)

### JSON

The resulting JSON configuration will look like this:

```json
"api": {
    "baseUrl": "https://us13.api.mailchimp.com/3.0/",
    "authentication": {
      "type": "basic"
    },
    "pagination": {
      "method": "multiple",
      "scrollers": {
        "default": {
          "method": "offset",
          "limit": 100,
          "limitParam": "count",
          "offsetParam": "offset",
          "firstPageParams": true,
          "offsetFromJob": false
        }
      }
    }
}

```

Alternatively, you can use a single pagination method instead of a scroller when configuring manually:

```json
"api": {
    "baseUrl": "https://us13.api.mailchimp.com/3.0/",
    "authentication": {
        "type": "basic"
    },
    "pagination": {
        "method": "offset",
        "offsetParam": "offset",
        "limitParam": "count"
    }
},
```

The entire Generic Extractor configuration will look like this:

```json
{
  "api": {
    "baseUrl": "https://us13.api.mailchimp.com/3.0/",
    "authentication": {
      "type": "basic"
    },
    "pagination": {
      "method": "multiple",
      "scrollers": {
        "default": {
          "method": "offset",
          "limit": 100,
          "limitParam": "count",
          "offsetParam": "offset",
          "firstPageParams": true,
          "offsetFromJob": false
        }
      }
    }
  },
  "config": {
    "outputBucket": "ge-tutorial",
    "incrementalOutput": false,
    "jobs": [
      {
        "__NAME": "campaigns",
        "endpoint": "campaigns",
        "method": "GET",
        "dataType": "campaigns",
        "dataField": {
          "path": ".",
          "delimiter": "."
        }
      }
    ],
    "__AUTH_METHOD": "basic",
    "username": "dummy",
    "#password": "c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13"
  }
}
```

***Note:** The `__` prefixed parameters are for internal use by the UI and should not be modified. 
Also, they have no effect on component functionality.*

## Running

Now, make sure that you have more than one campaign in your account. 

## Testing
Because you probably have fewer than ten (the default page size) campaigns in your MailChimp account, 
there is no way to tell whether the pagination works. Let's make sure by setting the `limit` 
to 1 and turning the `debug` mode on so that you can see all the requests sent by Generic Extractor.

Run the configuration and review the events produced by the job. You should see something like this:

![Screenshot - Debug Events](/components/extractors/generic-extractor/tutorial/job-2.png)

The oldest events are at the bottom, so you can see that the extractor started by sending an HTTP request:

    GET /3.0/campaigns/?count=1&offset=0

Then, it continued with 

    GET /3.0/campaigns/?count=1&offset=1
    GET /3.0/campaigns/?count=1&offset=2

and so on. You should also see a warning that the `dataField 'campaigns' contains no data`. 
This is expected because Generic Extractor tries bigger offsets until the number of returned items is 
less than the page size. With the page size set to 1, this means that the last page will contain no data.

## Summary
In this part of the tutorial, you learned how to set up simple pagination. This is very important
because most APIs use some sort of pagination and without proper setting you would be 
getting incomplete data. The next two parts of our tutorial deal with setting up jobs and mapping:

- [Jobs](/components/extractors/generic-extractor/tutorial/jobs/) --- describe the API endpoints 
		(resources) to be extracted.
- [Mapping](/components/extractors/generic-extractor/tutorial/mapping/) --- describes how the JSON 
		response is converted into CSV files that will be imported into Storage.
