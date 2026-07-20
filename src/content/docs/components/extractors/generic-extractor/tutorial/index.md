---
title: Generic Extractor Tutorial
slug: 'components/extractors/generic-extractor/tutorial'
redirect_from:
    - /extend/generic-extractor/tutorial/
---


In this tutorial, we will guide you through configuring Generic Extractor for a new API.
In our case, MailChimp --- an email marketing service.

Even though there already is a MailChimp extractor available in Keboola as a
[component](/components/extractors/generic-extractor/publish/) based on Generic Extractor,
the [MailChimp](https://mailchimp.com/) API is ideal for this tutorial because it is fairly
easy to understand and has excellent documentation.

## Prepare
There are a few things you need to do before you start:

1. Read our [quick introduction to REST](/components/extractors/generic-extractor/tutorial/rest/) for a basic understanding of
**HTTP requests** and **REST API**.
2. Read our [quick introduction to JSON](/components/extractors/generic-extractor/tutorial/json/) to learn how to write **JSON
configurations**.
3. [Create your MailChimp account](https://login.mailchimp.com/signup/), free of charge, if you do not have one
already.
4. Follow the MailChimp wizard or [help](https://us13.admin.mailchimp.com/campaigns/) and **fill the account with
data**:
	- Create a new Campaign (choose the *regular type*).
	- Create a new List and add some addresses to it (preferably yours).
	- Go back to Campaigns, select your campaign and hit "Next" in the bottom right corner.
	- Design a test email and send it.
	- Check that you have received the email and read it.
5. To gain access to the MailChimp API, go to your Account detail and under Extras find the option to
[generate your API Key](https://mailchimp.com/help/about-api-keys/#Find-or-Generate-Your-API-Key).
It will look like this: `c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13`.

## Get Started
Let's take a closer look at the [MailChimp API](https://mailchimp.com/developer/) now.
There are plenty of documentation guides available. To explore the API and review what information is in
each resource, use, for example, the [Playground](https://us1.api.mailchimp.com/playground/).

The basic properties of the API are outlined in the
[Getting Started Guide](https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#resources).
The following are the crucial parts for our use-case:

- The root API URL is `https://<dc>.api.mailchimp.com/3.0`, where `<dc>` refers to a data center for your
account. The data center is the last part of the API key; if the API key is
`c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13`, the root URL is `https://us13.api.mailchimp.com/3.0`.
- API Authentication can be done using **HTTP Basic Authentication** where you use **any string** (text) for
username and the API key for password.

Now, go straight to the documentation of the
[**Campaign** resource](https://mailchimp.com/developer/reference/campaigns/).
Because you intend to extract data from MailChimp, the only part you are interested in is the **Read Method**.

![Screenshot - Read Campaign Documentation](/components/extractors/generic-extractor/tutorial/mailchimp-api-docs-1.png)

The documentation lists the URL (`/campaigns`) of the **Campaign Resource**, and the query string
parameters (these go into the URL), such as `fields`, `count`, etc. It also lists example
requests and responses. The response body is in [JSON](/components/extractors/generic-extractor/tutorial/json) format and starts like this:

```json
{
  "campaigns": [
    {
      "id": "42694e9e57",
      "type": "regular",
      "create_time": "2015-09-15T14:40:36+00:00",
      ...
```

## Next Steps
Now you have everything you need to actually start extracting the data. Continue with your Generic Extractor
configuration here:

- [Basic configuration](/components/extractors/generic-extractor/tutorial/basic/) --- sets the basic properties of the API and describes the actual extraction.
- [Pagination](/components/extractors/generic-extractor/tutorial/pagination/) --- breaks a result with a
		large number of items into separate pages.
- [Jobs](/components/extractors/generic-extractor/tutorial/jobs/) --- describes the API endpoints
		(resources) to be extracted.
- [Mapping](/components/extractors/generic-extractor/tutorial/mapping/) --- describes how the JSON
		response is converted into CSV files that will be imported into Storage.