---
title: Create and manage a bucket exposure for BigQuery
slug: 'storage/bucket-exposure/create'
sidebar:
  label: BigQuery Exposures
description: 'Create a bucket exposure for BigQuery subscribers, then find, edit or delete it. Covers the dialog fields, the listing ID and who may create one.'
---

Share a bucket through [Bucket Exposure](/storage/bucket-exposure/) from the bucket detail in **Storage**, then change or remove the exposure under **Data Catalog**. The dialog described here is the BigQuery one. On a Snowflake project it asks for other fields: see [Snowflake grant mode](/storage/bucket-exposure/snowflake-grant/) and [Snowflake share mode](/storage/bucket-exposure/snowflake-share/).

<!-- How-to-type page. Source: the "Creating an Exposure" and "Managing Your Exposures" sections of the Bucket Exposure page as it stood on main before the split. Structure checked 2026-11-19, facts not re-verified. -->

Bucket Exposure is in beta and has to be enabled for your project: see the note at the top of the [Bucket Exposure overview](/storage/bucket-exposure/).

## Create an exposure

**Goal:** make one bucket available to subscribers in BigQuery Analytics Hub.

1. Open the bucket you want to share in **Storage**. On the bucket detail page, either click
   the **Disabled (click to enable)** link next to *Bucket exposure*, or open the **⋯** menu
   in the top right and choose **Create bucket exposure**.

   ![Open the Create bucket exposure action from the bucket detail](/storage/bucket-exposure/figures/bucket-detail.png)

2. A dialog opens. Fill in:

   ![Create bucket exposure dialog](/storage/bucket-exposure/figures/bucket-exposure-create-modal.png)

   - **Exposure name** — what your consumers will see when they look up the dataset in
     BigQuery. Use a friendly name like *Sales Dataset Q1* or *Customer Segments — Production*.
   - **Description** *(optional)* — a short explanation of what the data is. Your consumers
     will see this too.
   - **BigQuery listing ID** — a technical identifier (lowercase letters, digits and
     underscores). This **cannot be changed later**, so pick something stable. If you're not
     sure, it's safe to derive it from the exposure name, e.g. `sales_dataset_q1`.
   - **Subscribers** *(optional)* — the people or groups who should have access. For each
     entry, pick whether it is a **User** (a single Google account, e.g.
     `john.doe@example.com`) or a **Group** (a Google Group, e.g.
     `analytics-team@example.com`). You can add subscribers later from the exposure detail.

3. Click **Create**.

**Result:** The exposure is created in the background — you will see a job in
Keboola tracking its progress. Once the job finishes, the bucket is live in BigQuery
Analytics Hub and your subscribers can start using it.

:::note
**Who can create an exposure?** Anyone with **manage** access to the bucket — the same
permission required to share a bucket inside Keboola.
:::

## Find an exposure

**Goal:** see every exposure of the project and open the detail of one.

1. Go to **Data Catalog → Bucket exposures**. All your exposures live there.

   ![Bucket exposures list](/storage/bucket-exposure/figures/bucket-exposure-listing.png)

   Each row shows the friendly name, the source bucket, the BigQuery listing ID, and the
   number of subscribers.

2. Click a row to see details.

   ![Bucket exposure detail](/storage/bucket-exposure/figures/bucket-exposure-detail.png)

**Result:** The detail page lists everyone who has access and gives you **Edit** and **Delete** buttons.

## Edit an exposure

**Goal:** change the exposure name, description, or the list of subscribers.

1. Click **Edit** on the detail page.

   ![Edit bucket exposure dialog](/storage/bucket-exposure/figures/bucket-exposure-edit-modal.png)

2. Change the exposure name, description, or the list of subscribers, and save.
   <!-- VERIFY(Nikita): name the control that saves the edit dialog (the create dialog uses **Create**). -->
   The **BigQuery listing ID** is shown but cannot be edited — changing it would break the
   connection for everyone already subscribed.

**Result:** Adding or removing a subscriber takes effect immediately — new people gain
access right away, removed people lose access right away.

## Delete an exposure

**Goal:** remove the exposure entirely.

1. Click **Delete** on the detail page.

**Result:** All current subscribers immediately lose access to the data in BigQuery.

If you delete the **bucket itself** in Storage, the exposure is cleaned up automatically —
you don't need to remove it manually first.

---

**Next:** [Snowflake grant mode →](/storage/bucket-exposure/snowflake-grant/)
