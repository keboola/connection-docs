---
title: Give Snowflake roles read access to a bucket (grant mode)
slug: 'storage/bucket-exposure/snowflake-grant'
sidebar:
  label: Snowflake Grant Mode
description: 'Create a grant-mode bucket exposure on Snowflake: the rules for grantee roles, changing the role list, what a revoke removes, and how to check access.'
---

On a Snowflake project, [Bucket Exposure](/storage/bucket-exposure/) gives **roles that already exist in your Snowflake
account** read access to one bucket. Use it when a tool outside Keboola — a Databricks
federated query, a BI tool, your own data warehouse users — should read one bucket directly,
instead of copying the data out with a writer or giving it the project's read-only role,
which sees the whole project.

<!-- How-to-type page. Source: the "Snowflake Grant Mode" section of the Bucket Exposure page as it stood on main before the split. Structure checked 2026-11-19, facts not re-verified. -->

Grant mode is available only when the project's Snowflake backend is **your own account**
([BYODB](/storage/byodb/)), or an account Keboola runs for your organization alone. It is not
available on Keboola's shared Snowflake accounts or in Snowflake Partner Connect projects.

To share the bucket with other Snowflake accounts instead, use [share mode](/storage/bucket-exposure/snowflake-share/).

## Create a grant-mode exposure

**Goal:** give roles in your Snowflake account read access to one bucket.

1. Open the bucket in **Storage** and create the exposure as described in
   [Create an exposure](/storage/bucket-exposure/create/#create-an-exposure).
2. On a Snowflake bucket, the dialog asks for:

   - **Exposure name** and **Description** *(optional)* — shown in Keboola only.
   - **Snowflake mode** — shown only when [share mode](/storage/bucket-exposure/snowflake-share/) is enabled for the
     project. Choose **Grant to roles**.
   - **Grantee roles** *(optional)* — the roles that should read the bucket, one per line.

3. Click **Create**.

Grantee roles must follow these rules:

- The role must **already exist** in the account. Keboola does not create roles. If a role
  is missing, the job fails, names the role, and grants nothing.
- Use **unquoted** role names: letters, digits, `_` and `$`, starting with a letter or `_`
  (not with a digit or `$`).
  Names are converted to upper case, which matches every role created without quotes.
  Quoted, case-sensitive role names such as `"analyst"` are not supported.
- At most 100 roles per exposure.
- These roles are refused: `PUBLIC`, the Snowflake system roles (`ACCOUNTADMIN`, `ORGADMIN`,
  `SECURITYADMIN`, `SYSADMIN`, `USERADMIN`, `GLOBALORGADMIN`), the roles Keboola creates in
  the account (project, read-only, workspace and share roles, all named with the stack's
  prefix), and the backend's administrative role.

**Result:** After the job finishes, the exposure detail shows the **Snowflake object**: the granted
schema as `"<DATABASE>"."<SCHEMA>"`. Give that name and the role to the people who will
query the data.

### What a grantee role gets

For every role in the list, Keboola runs these grants as the project's role:

- `USAGE` on the project database and on the bucket's schema.
- `SELECT` on every table and view in the bucket.
- `SELECT` on **future** tables and views in the bucket, so tables created, replaced or
  restored later are readable without another change.

The data stays where it is. Queries run on the warehouse of whoever runs them, under their
role, and you see them in your account's query history.

## Change grantee roles

**Goal:** add roles to an exposure or take roles off it.

1. Open the exposure and click **Edit**.
2. Change the list and save.

**Result:** The list you save replaces the stored one: Keboola
grants access to every listed role and revokes it from every role you removed.

If a job fails part-way (for example because one role does not exist), the other roles are
still processed and the error names the roles that failed. Fix the list and save again; the
next save also finishes any revoke that the failed job did not run.

After you create a missing role in Snowflake, save the exposure again with the list
unchanged: every save re-applies the grants to all listed roles.

## End a role's access

**Goal:** stop a role from reading the bucket.

Do one of the following:

- Remove the role from the list, as in [Change grantee roles](#change-grantee-roles).
- Delete the exposure, as in [Delete an exposure](/storage/bucket-exposure/create/#delete-an-exposure).
- Delete the bucket.

**Result:** Removing a role, deleting the exposure, or deleting the bucket revokes from that role:

- `SELECT` on every table and view in the bucket,
- the future grants on the bucket's schema,
- `USAGE` on the bucket's schema.

:::caution[Revoke is not selective]
The revoke covers the whole bucket schema. If you or an administrator also granted that role
privileges on the same schema by hand, outside Keboola, those grants are removed too.
:::

**`USAGE` on the project database stays.** Keboola never revokes it, because another
exposure in the same project may still need it. A removed role can therefore see that the
project database exists, but it cannot read any table or view in the exposed bucket. The
database, and the grant with it, is removed when the project is purged.

## Check access in Snowflake

**Goal:** see what a role can read.

Run in Snowflake as the role itself or as an administrator role
such as `SECURITYADMIN`:

```sql
SHOW GRANTS TO ROLE DATABRICKS_READER;
SHOW FUTURE GRANTS TO ROLE DATABRICKS_READER;
```

**Result:** While the role is a grantee, the first statement lists `USAGE` on the project database and
on the bucket schema and `SELECT` on each table and view in the bucket; the second lists the
future `SELECT` grants on tables and views in the schema. After you remove the role, the
only grant this exposure leaves behind is `USAGE` on the project database.

## Things to keep in mind on Snowflake

- **Ending access means deleting the exposure.** Disabling or deleting a project does not
  revoke grants until the project is purged. Delete the exposure first if access must end now.
- **Persisted aliases are exposed as views.** Grantees can read the alias's rows and its
  view definition, which names the source table and the alias filter.
- **Aliases that read outside the project are not allowed.** A bucket cannot be exposed
  while it holds an alias whose source chain leaves the project's database — through a
  linked bucket from another project or an external source, directly or through another
  alias. Such an alias cannot be added to an exposed bucket either.
- **Consumers' queries are theirs.** Grantees run queries on their own warehouses; the
  queries are not tagged by Keboola.
- **Subscriptions are BigQuery only.** The *Subscriptions* view of an exposure does not
  apply to Snowflake.
- **One mode per exposure.** You pick grant mode or share mode when you create the exposure,
  and you cannot change it later. To switch, delete the exposure and create a new one.

---

**Next:** [Snowflake share mode →](/storage/bucket-exposure/snowflake-share/)
