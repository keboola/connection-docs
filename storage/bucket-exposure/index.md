---
title: Bucket Exposure
permalink: /storage/bucket-exposure/
---

{: .alert.alert-warning}
Important: This feature is currently available in BETA and only for BigQuery projects. It is
gated behind the `bucket-exposure` project feature flag — contact Keboola support to enable it.

* TOC
{:toc}

**Bucket Exposure** lets you publish data from a Keboola bucket directly to external consumers
through [Google BigQuery Analytics Hub](https://cloud.google.com/bigquery/docs/analytics-hub-introduction).
Subscribers you specify get **read-only, zero-copy** access to the data in their own BigQuery
environment — no exports, no data duplication, no manual handoffs.

The data is always live: subscribers see the latest version of the dataset every time they
query it.

## What Is Bucket Exposure?

Exposure is a property of a regular Keboola-owned [bucket](/storage/buckets/) on a BigQuery
project. When you expose a bucket, Keboola publishes its underlying BigQuery dataset as an
**Analytics Hub listing**. The people or groups you nominate as subscribers can then "subscribe"
to that listing in their own GCP project and receive a **linked dataset** — a live, read-only
view of the data.

```
Keboola bucket (BigQuery dataset)
        ↓ exposed via Analytics Hub
    Listing (visible to subscribers)
        ↓ subscriber clicks "Subscribe"
    Linked dataset (in subscriber's BigQuery project)
        ↓
    Subscriber queries the data (always up to date)
```

### Who is it for?

- **Data teams** that need to share processed datasets with partners, clients, or other
  departments that work directly in BigQuery.
- **Organizations** that want a governed, auditable way to distribute data without copying
  it into separate projects.

### How does it differ from other sharing features?

- [**Data Catalog**](/catalog/) shares buckets between Keboola projects within the same
  organization. Bucket Exposure shares **outside** Keboola, directly into a subscriber's
  BigQuery project.
- [**External Datasets**](/storage/byodb/external-buckets/) register a BigQuery dataset you
  already own as a Keboola bucket. Bucket Exposure is the opposite direction — it publishes
  a Keboola-owned dataset to external BigQuery consumers.
- Exposure and Catalog sharing are independent and can be used on the same bucket
  simultaneously.

## Creating an Exposure

In the Keboola UI, open a bucket detail and use the **Expose Bucket** action. You will be
asked for:

| Field | Description |
|-------|-------------|
| **Exposure Name** | A human-readable name for the dataset (e.g. *Sales Dataset Q1*). This is what subscribers will see when browsing Analytics Hub. Max 63 characters. |
| **Description** *(optional)* | A description of the data being shared. Max 2000 characters. |
| **Listing ID** | A unique identifier for the listing (e.g. `sales_dataset_q1`). Lowercase letters, digits and underscores only. **Cannot be changed after creation.** |
| **Subscribers** | A list of email addresses or Google Groups that should have access. Each entry must be prefixed with `user:` or `group:` (see [Managing Subscribers](#managing-subscribers)). |

The operation runs asynchronously — you will see a job in the Keboola UI tracking its
progress. Once the job completes, the bucket is exposed and subscribers can find the listing
in BigQuery Analytics Hub.

{: .alert.alert-info}
**Note:** You need **manage** access to the bucket (the same permission level required for
[sharing a bucket between Keboola projects](/catalog/)).

## Managing Subscribers

Each subscriber entry must be prefixed so that Google can correctly route the grant — Google
cannot tell a personal email from a group email automatically:

| Prefix | Example | Meaning |
|--------|---------|---------|
| `user:` | `user:analyst@company.com` | A single Google account |
| `group:` | `group:data-team@company.com` | A Google Group; all members of the group inherit access |

Adding a subscriber later (via the **Update** action) takes effect immediately — the new
subscriber can subscribe to the listing in the GCP Console without waiting. Removing a
subscriber also takes effect immediately and revokes access to the listing.

{: .alert.alert-warning}
**Keboola is the single source of truth** for subscriber access. If someone manually edits
permissions on the listing in the GCP Console, those changes will be overwritten the next
time the exposure is updated from Keboola.

## What the Subscriber Sees in BigQuery

The subscriber experience is entirely within the **Google Cloud Console** — subscribers do
**not** need a Keboola account.

1. Open **BigQuery** > **Analytics Hub** in the GCP Console.
2. Go to **Search listings**.
3. Find the listing by name (the **Exposure Name** you set in Keboola).
4. Click **Subscribe** on the listing.
5. Choose a destination project and dataset name for the linked dataset.
6. Click **Subscribe**.

A **linked dataset** appears in the subscriber's BigQuery project. This is a read-only,
zero-copy view of the original data — queries run against it read directly from the source
dataset in real time.

Subscribers see the **listing name** and **description** you provided when creating the
exposure. The linked dataset behaves like any other BigQuery dataset — they can query it,
join it with their own tables, and use it in dashboards or pipelines.

## Updating an Exposure

You can update the **Exposure Name**, **Description**, or **subscriber list** at any time
from the bucket detail in the Keboola UI. The **Listing ID** cannot be changed — it would
break existing subscriber references.

Updates run asynchronously — you will see a job in the Keboola UI.

## Deleting an Exposure

Deleting an exposure removes the listing from Analytics Hub entirely. Existing subscribers
lose access immediately and their linked datasets stop returning data.

Deletion also runs asynchronously.

If you delete the **bucket itself**, the exposure is cleaned up automatically — the listing
is removed from Analytics Hub and subscribers lose access. You do not need to remove the
exposure first.

## Rules and Limitations

| Rule | Reason |
|------|--------|
| The bucket must be a **regular bucket** (not [linked](/catalog/), not [external](/storage/byodb/external-buckets/)) | You can only expose data that Keboola owns and controls. |
| Each bucket can have **at most one exposure** | One listing per bucket keeps the model simple and avoids confusion. |
| Exposure and internal bucket sharing are **independent** | Sharing a bucket between Keboola projects ([Data Catalog](/catalog/)) and exposing it externally via Analytics Hub are separate features that do not interfere with each other. |
| The **Listing ID** is immutable after creation | Changing it would break existing subscriber references. |
| **Keboola is the single source of truth** for subscriber access | Manual edits to the listing's IAM policy in the GCP Console will be overwritten by the next update from Keboola. |
| **BigQuery only** | The initial release supports BigQuery via Analytics Hub. Snowflake support (via Secure Data Sharing or role grants) is planned. |
| Requires the `bucket-exposure` **feature flag** | Gradual rollout — contact Keboola support to enable it on your project. |

## FAQ

**Q: Does this copy the data?**
No. Analytics Hub uses zero-copy sharing. The subscriber's linked dataset reads directly from
the original BigQuery dataset. There is no data duplication and no additional storage cost
for the subscriber.

**Q: Is the data always up to date?**
Yes. The linked dataset is a live reference. Any changes to the data in the Keboola bucket
(via transformations, loads, etc.) are immediately visible to subscribers.

**Q: What happens if I delete the bucket?**
The exposure is automatically cleaned up — the listing is removed from Analytics Hub and
existing subscribers lose access.

**Q: Can I expose the same bucket to different groups with different permissions?**
Not directly — each bucket has a single exposure with a single subscriber list. All
subscribers on the list get the same read-only access. If you need different access levels,
consider creating separate buckets with different data subsets.

**Q: Will this work with Snowflake?**
Not yet. The initial release supports BigQuery only. The feature is designed to support
additional backends (like Snowflake via Secure Data Sharing) in the future without changing
the user-facing workflow.

**Q: What permissions do I need in Keboola?**
You need **manage** access to the bucket (the same permission level required for [sharing a
bucket](/catalog/)).

**Q: What does the subscriber need on the GCP side?**
The subscriber needs access to a GCP project where they can create a subscription (linked
dataset). No special Analytics Hub roles are needed — Keboola grants the necessary
`roles/analyticshub.subscriber` role on the listing automatically.

**Q: Who pays for queries against the linked dataset?**
The **subscriber** pays the BigQuery compute cost in their own GCP project. Storage of the
underlying data is still billed to the project that owns the Keboola bucket.
