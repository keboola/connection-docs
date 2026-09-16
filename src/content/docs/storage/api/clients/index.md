---
title: Storage API Clients
slug: 'storage/api/clients'
description: The client libraries for working with Keboola Storage from Python, PHP, R or the command line, and which one to pick.
---

Rather than calling the [Storage API](https://api.keboola.com/?service=storage) over HTTP yourself,
use a client library. Each one handles authentication, multipart uploads, and the asynchronous
import/export jobs for you, so you do not have to manage CSV staging by hand.

## Choosing a client

| Client | Use it when |
| --- | --- |
| [Python client](/storage/api/clients/python-client/) | You are writing Python — in a transformation, a data app, or your own tooling. This is the client to reach for by default. |
| [PHP client](/storage/api/clients/php-client/) | You are writing PHP, or you need the most complete API coverage. |
| [Docker CLI client](/storage/api/clients/docker-cli/) | You want to import or export from a shell script and have Docker available, without installing a language runtime. |
| [R client](/storage/api/clients/r-client/) | You are working in R. Note this client is in limited maintenance — prefer the Python or PHP client for new work. |

All four clients talk to the same API, so anything one of them can do, you can also do with a
direct API call. See [Storage API](/storage/api/) for the API itself, and the
[Storage API Importer service](/storage/api/importer/) for a simpler import-only endpoint.

## Authentication

Every client authenticates with a [Storage API token](/management/project/tokens/), passed in the
`X-StorageApi-Token` header. Create the token in your project settings and give it only the buckets
it needs — tokens are scoped per project and per stack, and a token from one
[stack](/overview/api/#stacks-and-endpoints) will not work against another.
