---
title: UKG HR
slug: 'components/extractors/other/ukg-hr'
description: Extract requests, employees, employee documents, organizations and users from UKG HR Service Delivery into Storage, with incremental loading.
---


[UKG HR Service Delivery](https://www.ukg.com/) (HRSD) is UKG's HR case management and employee document platform. The UKG HR data source connector reads its API v2 and writes HR resources to Storage.

<!-- Reference-type page. Source: the component registry copy of `keboola.ukg-hr` (/v2/storage longDescription, configurationDescription and config schema), verified 2026-10-12. -->

:::caution[Experimental]
This connector is experimental. Its configuration and output may still change. Send feedback using the feedback button in your project.
:::

One configuration row extracts one resource:

- **requests**: People Assist requests and cases. Incremental by `updated_at`, `created_at` or `closed_at`.
- **employees**: the employee directory. Incremental by `created_at`.
- **employee_documents**: employee document metadata. Incremental by `created_at`. The document files themselves are not downloaded.
- **organizations**: the company structure. Full load only, because the API has no date filter.
- **users**: user profiles. Full load only.

## Prerequisites

The connector authenticates with the OAuth2 client-credentials flow and obtains and refreshes access tokens itself. From your UKG HR tenant you need:

- the application ID and application secret,
- the client ID,
- the deployment region: EU, US, ATL (UltiPro) or TOR (UltiPro Canada).

The credentials are stored encrypted. No Keboola OAuth broker or partner registration is needed.

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **UKG HR** data source connector.

### Connection

| Field | Description |
|---|---|
| Application ID | Application identifier from the UKG HR service. |
| Application secret | Application secret from the UKG HR service. |
| Client ID | Client identifier for the OAuth2 token requests. |
| Region | Deployment region of the tenant: `eu`, `us`, `atl` or `tor`. |

Click **Test connection**, then save.

### Row configuration

Click **Add Row** and configure one row per resource:

| Field | Description |
|---|---|
| Resource | `requests`, `employees`, `employee_documents`, `organizations` or `users`. The filter fields change with the resource. |
| Load type | **Incremental load** (default) extracts the records changed since the last run and upserts them by primary key. **Full load** replaces the table. Organizations and users are full load only. |

Incremental options for requests, employees and employee documents:

| Field | Description |
|---|---|
| Date field | Requests only: `updated_at` (default), `created_at` or `closed_at`. Employees and employee documents always filter by `created_at`. |
| Start date | Lower bound of the first incremental run: an ISO 8601 datetime such as `2026-01-01T00:00:00+00:00`, or a relative phrase such as `yesterday` or `3 days ago`. |
| Overlap margin (seconds) | Seconds subtracted from the last watermark, so a small window is read again and late-arriving records are caught. The primary key makes the overlap idempotent. |

Filters by resource:

- **Requests:** status, priority, organization IDs, embed related objects (creator, employee, closed by), full-text query.
- **Employees:** organization IDs, terminated (true for terminated only, false for active only, empty for all), synchronization date.
- **Employee documents:** document type ID, organization IDs, expired, trashed.
- **Organizations:** parent organization ID, recursive, full-text query.
- **Users:** active users only, role ID, organization ID, email.

The API has no field-selection parameter, so each resource always returns its full object shape.

## Output

Each row produces one table with `id` as the primary key. Nested objects are flattened into underscore-separated columns; lists and arrays of objects are stored as JSON strings. Datetime fields are typed as `TIMESTAMP`. The connector follows the API's RFC 5988 `link` pagination headers.
