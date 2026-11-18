---
title: Share a bucket with other Snowflake accounts (share mode)
slug: 'storage/bucket-exposure/snowflake-share'
description: 'Share one bucket with other Snowflake accounts through a share-mode exposure: account rules, the consumer SQL steps, repairing shares, deleting.'
---

This page shows how to use a [bucket exposure](/storage/bucket-exposure/) in Snowflake share mode.

## Snowflake Share Mode

Share mode publishes one bucket to **other Snowflake accounts** through Snowflake Secure Data
Sharing. Use it when a team or a partner works in its own Snowflake account and should query
the bucket there, without a writer that copies the data.

Share mode has the same backend requirement as [grant mode](#snowflake-grant-mode): your own
Snowflake account ([BYODB](/storage/byodb/)) or an account Keboola runs for your organization
alone. It also needs its own project feature, because each share makes the bucket readable
from another account. Contact Keboola support to have it enabled.

### What a Consumer Account Gets

Each consumer account gets **its own share**. The share contains:

- `USAGE` on the project database,
- the database role `BUCKET_SHARE_<number>`, which holds `USAGE` on the bucket's schema and
  `SELECT` on every table and view in the bucket. `<number>` is the bucket's internal numeric
  ID, the same number that ends the share name prefix.

The consumer sees only the exposed bucket's schema in the project database. The data is not
copied: the consumer queries your tables on its own warehouse, and the result is always the
current data in the bucket.

### Which Accounts Can Consume a Share

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

### Creating a Share-Mode Exposure

Open the bucket in **Storage** and create the exposure as described in
[Creating an Exposure](#creating-an-exposure). On a Snowflake bucket in a project with share
mode enabled, the dialog asks for:

- **Exposure name** and **Description** *(optional)* — shown in Keboola only.
- **Snowflake mode** — choose **Share with accounts**.
- **Consumer accounts** *(optional)* — the accounts that should read the bucket, one per line.

Consumer accounts must follow these rules:

- Use the `<ORGANIZATION>.<ACCOUNT>` form, for example `ACME.ANALYTICS_PROD`. Account locators
  (such as `xy12345`) are not accepted. Names are converted to upper case.
- At most 100 accounts per exposure.
- Check each identifier carefully. A typo that matches another organization's account in the
  same region and cloud shares the bucket with that account.

To find the identifier of an account, run this in that account:

```sql
SELECT CURRENT_ORGANIZATION_NAME() || '.' || CURRENT_ACCOUNT_NAME();
```

After the job finishes, the exposure detail shows the **Share name prefix**, such as
`KBC_EU_CENTRAL_1_BUCKET_SHARE_4521`. The share of each account is named exactly
`<prefix>_` followed by 16 hexadecimal characters.

Creating a share-mode exposure grants the project's Snowflake role the `CREATE SHARE` and
`MANAGE SHARE TARGET` privileges on the account. The grant stays after the exposure is deleted.

Keboola makes this grant with the backend's administrative role, which therefore needs both
privileges `WITH GRANT OPTION`. If your Snowflake account was connected to Keboola before they
were part of the setup, the job fails with an error that names that role:

- On **your own account** ([BYODB](/storage/byodb/)), an `ACCOUNTADMIN` of the account runs the
  two `GRANT ... WITH GRANT OPTION` statements the error shows, then you create the exposure
  again.
- On an account **Keboola runs for your organization**, contact Keboola support.

### What the Consumer Does

The consumer needs a role that can import shares, such as `ACCOUNTADMIN`. In the consumer
account:

1. Find the share. It is listed with `kind` `INBOUND`, your account in the `owner_account`
   column (`<ORGANIZATION>.<ACCOUNT>`), and a `name` that starts with the share name prefix:

   ```sql
   SHOW SHARES;
   ```

   A reader (managed) account does not list inbound shares here. In that case, give the
   consumer the full share name from your own `SHOW SHARES` output (see
   [Checking Shares in Snowflake](#checking-shares-in-snowflake)).

2. Create a database from the share, naming it as `<owner_account>.<name>`:

   ```sql
   CREATE DATABASE KEBOOLA_SALES FROM SHARE ACME.KEBOOLA_PROD.KBC_EU_CENTRAL_1_BUCKET_SHARE_4521_0123456789ABCDEF;
   ```

3. Find the database role the share carries. It is named `BUCKET_SHARE_<number>`, with the
   number that ends the share name prefix:

   ```sql
   SHOW DATABASE ROLES IN DATABASE KEBOOLA_SALES;
   ```

4. With the role that created the database, grant that database role to the roles that should
   read the data:

   ```sql
   GRANT DATABASE ROLE KEBOOLA_SALES.BUCKET_SHARE_4521 TO ROLE ANALYST;
   ```

The database holds the exposed bucket's schema with its tables and views. It is read-only.

### Adding Tables and Repairing a Share

Snowflake does not add new tables to a share on its own. Keboola adds the bucket's tables and
views to the shares when the exposure is created, every time you save it, and after a table or
persisted alias is created or replaced in the bucket.

If adding a new table to the shares fails, the table operation still succeeds, and the bucket's
events show a warning that the share sync failed.

To repair the shares, open the exposure, click **Edit** and **Save** with the account list
unchanged. A save that succeeds adds all current tables and views of the bucket to the shares.
While the list holds an account that Snowflake refuses, every save fails before this step (see
[Which Accounts Can Consume a Share](#which-accounts-can-consume-a-share)); remove that account
first.

### Changing Consumer Accounts

Click **Edit** and change the list. The list you save replaces the stored one:

- An **added** account gets its own share. Accounts that already have a share keep it
  untouched.
- A **removed** account's share is dropped. A database the consumer created from it stops
  working at once.

Adding an account needs share mode enabled for the project. Removing accounts, saving the list
unchanged and deleting the exposure work without it.

### Deleting a Share-Mode Exposure

Deleting the exposure, or the bucket, drops the share of every consumer account. Databases the
consumers created from the shares stop working at once. Data that a consumer already copied
into its own tables stays with the consumer.

### Checking Shares in Snowflake

To see the shares of an exposure, run in your account as a role that can see them, such as the
project's role or `ACCOUNTADMIN`:

```sql
SHOW SHARES LIKE 'KBC_EU_CENTRAL_1_BUCKET_SHARE_4521%';
```

In `LIKE`, `_` matches any character, so the result can also list shares of other buckets, such
as `..._BUCKET_SHARE_45210_...`. The exposure's shares are the rows whose `name` is exactly the
share name prefix, `_` and 16 hexadecimal characters; ignore the others.

Each outbound share lists its consumer account in the `to` column, and its `name` is the share
name the consumer uses. Whether a consumer has
created a database from the share is visible only in the consumer's account.

### Things to Keep in Mind in Share Mode

- **View definitions are visible.** Persisted aliases are shared as regular views, not secure
  views. A consumer can read the view definition, which names the source bucket's schema, the
  source table and the alias filter.
- **Aliases that read outside the project are not allowed**, as in grant mode.
- **Consumers pay for their queries.** Queries run on the consumer's warehouse. You keep
  paying for the storage.
- **Deleting does not recall copies.** Deleting the exposure ends access to the shared data,
  but not to data a consumer has already copied.

---

**Next:** [Data Streams →](/storage/data-streams/)
