---
title: REST HTTP API Introduction
slug: 'extend/generic-extractor/tutorial/rest'
---


An [API (Application Programming Interface)](https://en.wikipedia.org/wiki/Application_programming_interface) is 
an [interface](https://en.wikipedia.org/wiki/Interface_(computing)) to an application, or a **service**
designed for machine access. It can be seen as the UI (User Interface) of an application designed
for machines (other applications). 

So that another application can be programmed to consume the API, it has to have some sort of specification.
A common specification for communicating on the web is the [HTTP protocol](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol). 
Used by web browsers and other API clients, it defines how two parties (client and server) ought to communicate:

- Client creates an HTTP **request** and sends it to the server over the network.
- Server processes the request, creates a **response**, and sends it to the client over the network.

## HTTP Request
An HTTP request is composed of:

- URL
- HTTP Method
- HTTP Headers
- Optional Body

### URL
A [URL (Uniform Resource Locator)](https://en.wikipedia.org/wiki/URL) is the address you see in your web browser 
address bar. It allows you to **locate a resource**. Each URL has several parts, and it is important to know them.
For example, the address

    https://www.example.com:8080/customers/acme/order/?show=deleted&fields=all

is composed of:

- `https` --- **Protocol** (HTTP or HTTPS),
- `www.example.com` --- **Host** --- network address of the HTTP server,
- `8080` --- **port** --- Optional network identifier within the target server; its default value is `80`.
- `/customers/acme/order/` --- Optional **path** to a **resource** we wish to obtain; its default value is `\`.
- `show=deleted&fields=all` --- Optional **request parameters** (also called **query string** or **query
string parameters**), separated by the character `&` (ampersand); the actual parameters are:
    - `show` with the value `deleted`, and
    - `fields` with the value `all`.

Because the URL contains a number of special characters (`?`, `&`, `/` and many others), when these parameters
need to be part of the URL, they must be encoded (URL encoded, urlencoded, escaped). Therefore a URL:

    http://example.com/this address & special

will be actually sent to the server as:

    http%3A%2F%2Fexample.com%2Fthis+address+%26+special

The web browser (and Generic Extractor too) will normally do this conversion for you. However, you might run into
the encoded format in Generic Extractor events. There are plenty of [online tools to decode](https://urldecode.org/) 
this encoded format.

Sometimes, you may also encounter the term [URI (Uniform Resource Identifier)](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier). 
It is used when a single **Resource** may be accessed through multiple URLs. For example, the web page 
`http://example.com` may display the same content as `http://example.com/home`. In such case one of the URLs 
(probably the second one) is chosen as an identifier, and becomes URI. For our use, there is no important 
difference between URI and URL.

An API **end-point** is identified by its URL, or URI, and should represent a distinct **resource** (users, 
invoices etc.). ***Important:** The terms end-point, resource, URL and URI are used interchangeably throughout the 
tutorial because they ultimately refer to the same thing.*

### Method
An HTTP **Method** describes a type of the request to make. It also called an **HTTP Verb** because it 
describes what to do with the **resource**. Common HTTP verbs are:

- `GET` --- Obtain a resource.
- `POST` and `PATCH` --- Update a resource.
- `PUT` --- Create a resource.
- `DELETE` --- Delete a resource.

Since Generic Extractor only reads data from another API, you will mostly use the `GET` method (and sometimes the 
`POST` method). The other HTTP methods are not important for us. 

### Headers
An HTTP request can contain [**headers**](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_Headers), 
which include additional information about the request and response. A typical example of a header is 
`Content-type`. For instance, for a web page, `Content-Type: text/html` would be used because an 
[HTML page](https://en.wikipedia.org/wiki/HTML) is being transferred. For an API request, it is commonly set 
to `Content-type: application/json` because we are transferring [JSON data](http://www.json.org/). 

Apart from standard headers, there are also non-standard headers; these are marked with the prefix `X-`. An 
example is the `X-StorageAPIToken` header used with Keboola [Storage API](/integrate/storage/api/).

### Body
The `POST`, `PUT` and `PATCH` requests can send parameters the same way as the `GET` requests in the URL. 
But they can also send them in the request **body**. These are sometimes called **POST data/postdata**.

## HTTP Response
An HTTP response is composed of:

- Response Headers --- same as the request headers (only sent by the server)
- Response Body --- actual content of the resource
- Status Code --- status of the request

#### HTTP Status
The HTTP Status and [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) represent 
a standardized way of describing the response state. For example, the status `200 OK` (200 is the status code) 
is associated with a successful response. There are many HTTP Statuses, but the following rules apply:

- Status codes `2xx` (e.g., 200) represent success.
- Status codes `3xx` represent [redirection](https://en.wikipedia.org/wiki/URL_redirection).
- Status codes `4xx` represent a client error (the request is wrong).
- Status codes `5xx` represent a server error (the server failed to create the response).

## REST API
[REST (Representational state transfer)](https://www.restapitutorial.com/lessons/whatisrest.html) (or RESTful) 
is an API which follows a set of [loosely defined](http://restcookbook.com/Miscellaneous/rest-and-http/) principles:

- The API URLs (or URIs) represent individual **resources**. Each API endpoint should represent a resource of 
a *single type*. For example, it represents a list of users, and not a list of users and their invoices.
- Each resource is **represented** in a structured format ([JSON](http://www.json.org/) or 
[XML](https://en.wikipedia.org/wiki/XML)). The data is not transferred, for instance, as ordinary text or a web 
page.
- **Messages** (request and response) are transferred using various HTTP methods (`GET`, `POST`, etc.). 
For example, for obtaining data, the `GET` method should be used. Also the `GET` method
should not cause any modifications of data.
- The entire communication is **stateless**. This means that multiple requests can be called in an
arbitrary order and must yield the same results. It is not correct for an API to have endpoints such as 
`setFilter` and`getFilteredResult` because they imply that any state (a filter) is retained between those API 
endpoints.

## Summary
The above describes the basic concepts of an API, HTTP protocol and HTTP REST API. When you 
understand these concepts (and the associated jargon), you can use Generic Extractor 
to get responses from virtually any HTTP REST API. Since the REST rules are not rigidly specified, it 
is not possible to ensure that Generic Extractor will be capable of reading 100% of APIs, 
even when declared as RESTful by someone.

