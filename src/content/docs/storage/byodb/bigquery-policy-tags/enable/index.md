---
title: Enable BigQuery policy tags
slug: 'storage/byodb/bigquery-policy-tags/enable'
description: Grant Keboola access to your policy-tag taxonomy and ask support to enable BigQuery policy tags on your backend.
---

Use this guide to turn on [BigQuery policy tags](/storage/byodb/bigquery-policy-tags/) for one BYODB BigQuery backend.
Repeat it for each backend that needs the feature.

## Before you start

- Find the resource name of the taxonomy that holds your policy tags:
  `projects/{project}/locations/{location}/taxonomies/{taxonomyId}`.
- Check how many principals your taxonomy's IAM policy holds. Every project service account on the backend adds one, and
  Keboola refuses to enable the feature past 1,400. See [Limits](/storage/byodb/bigquery-policy-tags/#limits).

## 1. Grant access on the taxonomy

Grant both roles on the taxonomy to the service account your Keboola backend is registered with. That is the
"Keboola Main Service Account" from [connecting BigQuery](/storage/byobq/#4-create-a-service-account), the account whose
key you used to register the backend.

| Role | Permissions | Why |
|---|---|---|
| A custom role that you name (the setter role) | `datacatalog.taxonomies.get` | Lets Keboola check the taxonomy. Granted onward, it lets project service accounts attach its tags. |
| A role for distribution (custom recommended) | `datacatalog.taxonomies.getIamPolicy` and `datacatalog.taxonomies.setIamPolicy` | Lets Keboola grant the setter role to each project's service account. |

The setter role must be a custom role. Keboola refuses a predefined role there, because the role is granted to every
project service account on the backend. A role that holds only `datacatalog.taxonomies.get` is enough.

For distribution, a custom role with just these two permissions is the narrowest grant. A broader predefined role that
includes them also works, but gives more than Keboola needs.

These grants do not give Keboola read access to protected values. See
[Access Keboola holds](/storage/byodb/bigquery-policy-tags/#access-keboola-holds).

## 2. Ask support to enable it

Contact Keboola support and send:

- the taxonomy resource name;
- the name of the setter role;
- a policy tag from that taxonomy that Keboola may attach to a scratch table to test the setup.

Keboola then tests the setup end to end. It creates a scratch table, attaches the test tag, removes the table, and checks
that it can grant the setter role onward. It then grants the role to every project service account on the backend and
turns the feature on. If any step fails, Keboola does not turn the feature on, and support tells you what to fix.

## 3. Fix the first incremental loads

A workspace table created before the feature was enabled carries no tags. The first incremental load into it from a
protected source fails before it writes any data, and names the columns.

Run that load once with the table overwritten. The table is re-created with the source's protection, and later
incremental loads work again. If you tag many columns, expect this right after enablement.
