---
title: APIs
slug: 'overview/apis'
description: "Where Keboola's public APIs are documented, one portal per stack, how to authenticate, and how to find the endpoint of each service in your own stack."
redirect_from:
    - /overview/api/
---

<!-- Reference-type page. Merged from developers.keboola.com/overview/api/ (PRDCT-582); the API catalogue and the per-stack endpoint table were dropped, because the portal and the Storage index call are the source of truth and the table had already rotted. Portals, token header, apis.json and the index call verified live, 2026-09-09. -->

Every Keboola service has a public API. The documentation portal at [api.keboola.com](https://api.keboola.com/) 
covers the US Virginia AWS stack; every other stack has its own portal on the same pattern, and a token only 
works against the portal of its own stack:

| Stack | API documentation portal |
|---|---|
| US Virginia AWS | [api.keboola.com](https://api.keboola.com/) |
| US Virginia GCP | [api.us-east4.gcp.keboola.com](https://api.us-east4.gcp.keboola.com/) |
| EU Frankfurt AWS | [api.eu-central-1.keboola.com](https://api.eu-central-1.keboola.com/) |
| EU Ireland Azure | [api.north-europe.azure.keboola.com](https://api.north-europe.azure.keboola.com/) |
| EU Frankfurt GCP | [api.europe-west3.gcp.keboola.com](https://api.europe-west3.gcp.keboola.com/) |

Most calls take a [Storage API token](/management/project/tokens/) in the `X-StorageApi-Token` header and 
exchange JSON. Each service runs on its own host inside the stack, such as `queue.keboola.com` or 
`encryption.eu-central-1.keboola.com`. Use the hosts of your own stack: a token-authenticated call to 
another stack's host answers with an invalid-token error. 
The authoritative list of service URLs for your stack is the [Storage API](https://api.keboola.com/?service=storage) 
index call, `GET /v2/storage` (no token needed), in its `services` array. For tooling and AI agents, each portal also publishes a machine-readable index at 
`https://api.<stack domain>/apis.json`. It lists the services the portal documents, not every service in the 
stack, each with its `apiUrl` and a link to its OpenAPI specification; use `apiUrl` from the index as the base 
URL rather than the `servers` inside the spec, and take `openApiSpecUrl` exactly as given. A [Postman collection](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest) 
holds sample requests; for a worked call, see [running a job through the API](/management/jobs/api/).
