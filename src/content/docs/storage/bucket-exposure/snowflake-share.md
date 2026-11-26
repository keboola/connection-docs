---
title: Share a bucket with other Snowflake accounts (share mode)
lastUpdated: 2026-11-27
slug: 'storage/bucket-exposure/snowflake-share'
sidebar:
  label: Snowflake Share Mode
description: 'Create a share-mode bucket exposure on Snowflake: which accounts can consume it, the SQL the consumer runs, repairing shares, and removing access.'
---

Share mode of [Bucket Exposure](/storage/bucket-exposure/) publishes one bucket to **other Snowflake accounts** through Snowflake Secure Data
Sharing. Use it when a team or a partner works in its own Snowflake account and should query
the bucket there, without a writer that copies the data.

<!-- How-to-type page. Source: the "Snowflake Share Mode" section of the Bucket Exposure page as it stood on main before the split. Structure checked 2026-11-19, facts not re-verified. -->

## Before you start

- **A Snowflake backend that is your own account** ([BYODB](/storage/byodb/)) or an account Keboola runs for your organization alone, the same requirement as [grant mode](/storage/bucket-exposure/snowflake-grant/).
- **Bucket Exposure enabled for the project.** It is in beta; Keboola Support turns it on, as the note at the top of the [Bucket Exposure overview](/storage/bucket-exposure/) says.
- **The share-mode project feature.** Share mode needs its own feature, because each share makes the bucket readable from another account. Contact Keboola Support to have it enabled.
- **Manage access to the bucket**, the same permission you need to [share a bucket](/catalog/share-and-link/) inside Keboola.
  <!-- VERIFY(nikita): moved over from the generic create page; confirm the Snowflake modes need the same permission (organization member or the Share role). -->
- **The consumer accounts' identifiers** in the `<ORGANIZATION>.<ACCOUNT>` form. The accounts must be in the same Snowflake region and cloud as yours: see [Which accounts can consume a share](#which-accounts-can-consume-a-share).
- **`CREATE SHARE` and `MANAGE SHARE TARGET` with grant option** for the backend's administrative role. An account connected to Keboola before these were part of the setup lacks them: see [Privileges the project's role gets](#privileges-the-projects-role-gets).

## Create a share-mode exposure

**Goal:** give other Snowflake accounts a share of one bucket.

1. Open the bucket in **Storage** and create the exposure as described in
   [Create an exposure](/storage/bucket-exposure/create/#create-an-exposure).
2. On a Snowflake bucket in a project with share mode enabled, the dialog asks for:

   - **Exposure name** and **Description** *(optional)* — shown in Keboola only.
   - **Snowflake mode** — choose **Share with accounts**.
   - **Consumer accounts** *(optional)* — the accounts that should read the bucket, one per line.

   Consumer accounts must follow these rules:

   - Use the `<ORGANIZATION>.<ACCOUNT>` form, for example `ACME.ANALYTICS_PROD`. Account locators
     (such as `xy12345`) are not accepted. Names are converted to upper case.
   - At most 100 accounts per exposure.
   - Check each identifier carefully. A typo that matches another organization's account in the
     same region and cloud shares the bucket with that account.

   Snowflake also refuses some accounts: see [Which accounts can consume a share](#which-accounts-can-consume-a-share).

   To find the identifier of an account, run this in that account:

   ```sql
   SELECT CURRENT_ORGANIZATION_NAME() || '.' || CURRENT_ACCOUNT_NAME();
   ```

   You pick the mode once: see [One mode per exposure](/storage/bucket-exposure/#things-to-keep-in-mind).

3. Click **Create**.

**Result:** After the job finishes, the exposure detail shows the **Share name prefix**, such as
`KBC_EU_CENTRAL_1_BUCKET_SHARE_4521`. The share of each account is named exactly
`<prefix>_` followed by 16 hexadecimal characters. If the job fails with an error that names the
backend's administrative role, see [Privileges the project's role gets](#privileges-the-projects-role-gets).

**Check:** in your Snowflake account, `SHOW SHARES LIKE '<prefix>%'` lists one outbound share for each consumer account, as shown in [Check shares in Snowflake](#check-shares-in-snowflake).

## Use the share in the consumer account

**Goal:** query the shared bucket from the consumer's own Snowflake account.

The consumer needs a role that can import shares, such as `ACCOUNTADMIN`. In the consumer
account:

1. Find the share. It is listed with `kind` `INBOUND`, your account in the `owner_account`
   column (`<ORGANIZATION>.<ACCOUNT>`), and a `name` that starts with the share name prefix:

   ```sql
   SHOW SHARES;
   ```

   A reader (managed) account does not list inbound shares here. In that case, give the
   consumer the full share name from your own `SHOW SHARES` output (see
   [Check shares in Snowflake](#check-shares-in-snowflake)).

2. Create a database from the share, naming it as `<owner_account>.<name>`:

   ```sql
   CREATE DATABASE KEBOOLA_SALES FROM SHARE ACME.KEBOOLA_PROD.KBC_EU_CENTRAL_1_BUCKET_SHARE_4521_0123456789ABCDEF;
   ```

   In this example, `KEBOOLA_SALES` is the name you choose for the new database, `ACME.KEBOOLA_PROD` is the
   `owner_account` and `KBC_EU_CENTRAL_1_BUCKET_SHARE_4521_0123456789ABCDEF` is the `name` from step 1.
   Replace all three with your own values.

3. Find the database role the share carries. It is named `BUCKET_SHARE_<number>`, with the
   number that ends the share name prefix:

   ```sql
   SHOW DATABASE ROLES IN DATABASE KEBOOLA_SALES;
   ```

   Use your database name in place of `KEBOOLA_SALES`.

4. With the role that created the database, grant that database role to the roles that should
   read the data:

   ```sql
   GRANT DATABASE ROLE KEBOOLA_SALES.BUCKET_SHARE_4521 TO ROLE ANALYST;
   ```

   Replace `KEBOOLA_SALES` with your database, `BUCKET_SHARE_4521` with the database role from step 3,
   and `ANALYST` with the role that should read the data.

**Result:** The database holds the exposed bucket's schema with its tables and views. It is read-only.

**Check:** as a role you granted the database role to, `SHOW TABLES IN DATABASE KEBOOLA_SALES;` lists the bucket's tables. Use your database name in place of `KEBOOLA_SALES`.

## Add tables and repair a share

**Goal:** get every current table and view of the bucket into the shares after a share sync failed.

Snowflake does not add new tables to a share on its own. Keboola adds the bucket's tables and
views to the shares when the exposure is created, every time you save it, and after a table or
persisted alias is created or replaced in the bucket.

If adding a new table to the shares fails, the table operation still succeeds, and the bucket's
events show a warning that the share sync failed.

To repair the shares:

1. Open the exposure and click **Edit**.
2. Click **Save** with the account list unchanged.

**Result:** A save that succeeds adds all current tables and views of the bucket to the shares.

While the list holds an account that Snowflake refuses, every save fails before this step (see
[Which accounts can consume a share](#which-accounts-can-consume-a-share)); remove that account
first.

**Check:** in the consumer account, `SHOW TABLES IN DATABASE` for the database created from the share lists the table that was missing.

## Change consumer accounts

**Goal:** add consumer accounts to an exposure or remove them from it.

1. Open the exposure and click **Edit**.
2. Change the list and save.

**Result:** The list you save replaces the stored one:

- An **added** account gets its own share. Accounts that already have a share keep it
  untouched.
- A **removed** account's share is dropped. A database the consumer created from it stops
  working at once.

Adding an account needs share mode enabled for the project. Removing accounts, saving the list
unchanged and deleting the exposure work without it.

**Check:** `SHOW SHARES LIKE '<prefix>%'` in your account lists one share for each account in the saved list, with the account in the `to` column.

## Delete a share-mode exposure

**Goal:** end the access of every consumer account.

1. Delete the exposure, as in [Delete an exposure](/storage/bucket-exposure/create/#delete-an-exposure), or delete the bucket.

**Result:** Deleting the exposure, or the bucket, drops the share of every consumer account. Databases the
consumers created from the shares stop working at once. Data that a consumer already copied
into its own tables stays with the consumer.

**Check:** `SHOW SHARES LIKE '<prefix>%'` in your account no longer lists any share of the exposure.

## Check shares in Snowflake

**Goal:** list the shares of an exposure and the account each one goes to.

Run in your account as a role that can see them, such as the
project's role or `ACCOUNTADMIN`:

```sql
SHOW SHARES LIKE 'KBC_EU_CENTRAL_1_BUCKET_SHARE_4521%';
```

Replace `KBC_EU_CENTRAL_1_BUCKET_SHARE_4521` with the share name prefix of your exposure.

In `LIKE`, `_` matches any character, so the result can also list shares of other buckets, such
as `..._BUCKET_SHARE_45210_...`. The exposure's shares are the rows whose `name` is exactly the
share name prefix, `_` and 16 hexadecimal characters; ignore the others.

**Check:** each outbound share lists its consumer account in the `to` column, and its `name` is the share
name the consumer uses. Whether a consumer has created a database from the share is visible only in the consumer's account.

## Shares, accounts and privileges

These details apply to every share-mode exposure. The tasks above link here where they matter.

### Privileges the project's role gets

Creating a share-mode exposure grants the project's Snowflake role the `CREATE SHARE` and
`MANAGE SHARE TARGET` privileges on the account. The grant stays after the exposure is deleted.

Keboola makes this grant with the backend's administrative role, which therefore needs both
privileges `WITH GRANT OPTION`. If your Snowflake account was connected to Keboola before they
were part of the setup, the job fails with an error that names that role:

- On **your own account** ([BYODB](/storage/byodb/)), an `ACCOUNTADMIN` of the account runs the
  two `GRANT ... WITH GRANT OPTION` statements the error shows, then you create the exposure
  again:

  ```sql
  GRANT CREATE SHARE ON ACCOUNT TO ROLE <ROLE> WITH GRANT OPTION;
  GRANT MANAGE SHARE TARGET ON ACCOUNT TO ROLE <ROLE> WITH GRANT OPTION;
  ```

  Replace `<ROLE>` with the administrative role the error names (typically `KEBOOLA_STORAGE`).
- On an account **Keboola runs for your organization**, contact Keboola support.

<!-- Checked 2026-11-20: statements match the Data Gateway setup page (components/applications/data-gateway/index.md); the error text itself is not public. -->

### What a consumer account gets

Each consumer account gets **its own share**. The share contains:

- `USAGE` on the project database,
- the database role `BUCKET_SHARE_<number>`, which holds `USAGE` on the bucket's schema and
  `SELECT` on every table and view in the bucket. `<number>` is the bucket's internal numeric
  ID, the same number that ends the share name prefix.

The consumer sees only the exposed bucket's schema in the project database. The data is not
copied: the consumer queries your tables on its own warehouse, and the result is always the
current data in the bucket.

### Which accounts can consume a share

Snowflake refuses to add some accounts to a share. Keboola does not override these limits:

- **The account must exist.** An identifier that names no account is refused.
- **Same region and cloud.** A consumer account must be in the same Snowflake region and on the
  same cloud as the project's Snowflake account.
- **Business Critical.** If the project's Snowflake account is on the Business Critical
  edition, the consumer account must be Business Critical too.

If Snowflake refuses an account, the job fails and its error names the account:

- When you **create** the exposure, no account gets a share and the exposure is not created.
  Fix the list and create it again. If Keboola cannot drop the shares it already set up, the
  exposure is kept and shown as not provisioned; deleting it drops the leftover shares.
- When you **edit** the exposure, the other added accounts still get their shares. The refused
  account stays in the list, so every later save fails on it until you remove it.

## Things to keep in mind in share mode

- **View definitions are visible.** Persisted aliases are shared as regular views, not secure
  views. A consumer can read the view definition, which names the source bucket's schema, the
  source table and the alias filter.
- **Aliases that read outside the project are not allowed**, as in [grant mode](/storage/bucket-exposure/snowflake-grant/#things-to-keep-in-mind-on-snowflake).
- **Consumers pay for their queries.** Queries run on the consumer's warehouse. You keep
  paying for the storage.
- **Deleting does not recall copies.** Deleting the exposure ends access to the shared data,
  but not to data a consumer has already copied.
- **One mode per exposure** applies to both Snowflake modes: see
  [Things to keep in mind](/storage/bucket-exposure/#things-to-keep-in-mind) on the overview.

---

**Next:** [Data Streams →](/storage/data-streams/)
