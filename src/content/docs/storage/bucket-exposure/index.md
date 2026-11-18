---
title: Bucket Exposure
description: 'Share a bucket with people outside your project in their own BigQuery: when to use it, creating and managing exposures, Snowflake grant and share modes, FAQ.'
slug: 'storage/bucket-exposure'
---

:::caution
Important: This feature is currently available in BETA for BigQuery projects and for
Snowflake projects on your own Snowflake account ([BYODB](/storage/byodb/)) or on an
account Keboola runs for your organization alone.
Contact Keboola support to have it enabled for your project.
:::



**Bucket Exposure** lets you share data from a Keboola bucket with people outside your
Keboola project — directly inside their own Google BigQuery environment. No exports, no
data copies, no manual handoffs.

You pick a bucket, give it a friendly name, and list who should have access. Those people
or teams see the data appear in their BigQuery, and they can query it just like any other
dataset. The data is **always live**: as soon as it changes in Keboola, the new version is
visible to them.

On **Snowflake**, an exposure either gives existing roles in your own Snowflake account read
access to the bucket ([Snowflake Grant Mode](#snowflake-grant-mode)), or shares the bucket with
other Snowflake accounts ([Snowflake Share Mode](#snowflake-share-mode)).

## When to Use Bucket Exposure

Bucket Exposure is the right choice when:

- You want to share **prepared, governed data** with a partner, a client, or another team
  in your organization — and they work in **BigQuery**, not in Keboola.
- You want a **single source of truth**: instead of emailing CSVs or running nightly
  exports, your consumers always see the latest version of the data.
- You want **control and visibility**: you decide who has access, you can revoke it at any
  time from Keboola, and every change is auditable.

Typical scenarios:

- The **Marketing team** maintains a curated customer segmentation in Keboola. The
  **BI team** consumes it directly in their BigQuery workspace, in real time.
- A **data provider** sells a cleaned, enriched dataset to **paying customers**. Each
  customer gets access to the same dataset in their own GCP project — no replication, no
  staging buckets.
- A **finance team** needs to give their **external auditors** a read-only view of
  specific reconciliation data, with the ability to revoke access at the end of the audit.

## How It Differs From Other Sharing Features

| Feature | What it does | Who can access |
|---------|--------------|----------------|
| [**Data Catalog**](/catalog/) | Share a bucket with another **Keboola project** in the same organization. | Keboola users only. |
| [**External Datasets**](/storage/byodb/external-buckets/) | Register a BigQuery dataset **you already own** as a bucket inside Keboola. | Keboola users only. |
| **Bucket Exposure** | Share a Keboola-owned bucket **out into BigQuery** for people who don't use Keboola. | Anyone with a Google account or Google Group. |

Bucket Exposure and Data Catalog sharing are independent — you can do both on the same
bucket if you want.

## What Your Subscribers See

Your subscribers do **not** need a Keboola account. Everything happens for them inside the
**Google Cloud Console**:

1. They open **BigQuery → Analytics Hub** in the GCP Console.
2. They go to **Search listings** and find your exposure by name.
3. They click **Subscribe**, pick a destination project, and choose a name for the linked
   dataset.
4. A **linked dataset** appears in their BigQuery project. From their point of view, it
   behaves like any normal BigQuery dataset — they can query it, join it with their own
   tables, use it in dashboards, etc. — except they cannot modify it.

The data they see is always live. Whenever the data in your Keboola bucket changes (a new
load, a transformation, a deletion), their queries reflect it on the next run. There is no
copy of the data on their side — it stays in your project.

## Things to Keep in Mind

- **One exposure per bucket.** Each bucket can have at most one exposure. If you need to
  share different slices of data with different audiences, create separate buckets.
- **Read-only.** Subscribers can query but never write. They cannot change, delete, or
  re-share the data.
- **Regular buckets only.** You can expose buckets that Keboola owns. You cannot expose
  [linked buckets](/catalog/) (already shared from another Keboola project) or
  [external datasets](/storage/byodb/external-buckets/) (registered from BigQuery).
- **BigQuery, and Snowflake on your own account.** On Snowflake, an exposure grants roles
  in your account read access ([Snowflake Grant Mode](#snowflake-grant-mode)) or shares the
  bucket with other Snowflake accounts ([Snowflake Share Mode](#snowflake-share-mode)).
- **Manage subscribers from Keboola.** If you or someone else edits the listing's
  permissions directly in the GCP Console, those changes will be overwritten the next time
  the exposure is updated from Keboola. Keboola is the single source of truth.
- **Costs.** There is no extra storage cost — the data is not copied. Your subscribers
  pay for the queries they run in their own GCP project; you continue to pay for the
  storage in yours.

## FAQ

**Q: Is the data copied to my subscriber's project?**
No. Analytics Hub uses zero-copy sharing. Your subscribers see a live link to the original
data — there is no duplication and no extra storage to pay for.

**Q: Is the shared data always up to date?**
Yes. Subscribers always see the latest version. There is no refresh, no sync, no delay.

**Q: Can I share the same bucket with different groups at different access levels?**
Not directly. Each exposure has a single subscriber list and everyone on it gets the same
read-only access. If you need different access tiers, split the data into separate
buckets, each with its own exposure.

**Q: What happens if I delete the bucket?**
The exposure is removed automatically and your subscribers lose access. No leftover state
in BigQuery.

**Q: Can I take away access from a single subscriber?**
Yes. Open the exposure detail, click **Edit**, remove the subscriber from the list, and
save. The change is immediate.

**Q: Will this work for Snowflake projects?**
Yes, for projects on your own Snowflake account. The exposure either gives roles in that
account read access to the bucket ([Snowflake Grant Mode](#snowflake-grant-mode)) or shares
the bucket with other Snowflake accounts in the same region and cloud
([Snowflake Share Mode](#snowflake-share-mode)).

**Q: What do my subscribers need on their side?**
A Google account or a Google Group that you've added as a subscriber, and access to any
GCP project where they can create a linked dataset. They do not need any Keboola license
or special Analytics Hub permissions — Keboola grants them everything they need to view
the listing and subscribe to it.
