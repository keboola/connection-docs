---
title: BigQuery policy tags
slug: 'storage/byodb/bigquery-policy-tags'
description: Keep BigQuery column-level access control on the copies Keboola makes of a protected table within your BigQuery backend.
---

BigQuery [policy tags](https://cloud.google.com/bigquery/docs/column-level-security-intro) restrict who can read a column.
You attach them in BigQuery.

Without this feature, Keboola copies a tagged column within your backend without its tag. The copy is unprotected, and
the only trace is a `storage.policyTagsNotPropagated` event in the project (see [Events](#events)).

With policy-tag support turned on, Keboola does three things:

- It keeps the policy tag on the copies it makes of a protected column within your BigQuery backend. The exceptions are
  listed in [What this feature does not cover](#what-this-feature-does-not-cover).
- When it cannot keep the tag on one of those copies, it refuses to make the copy.
- It reports each column's protection state in the table detail.

Keboola keeps tags that a source already carries. It never adds a tag to a table whose source has none.

The feature is available only on your own BigQuery backend ([BYODB](/storage/byodb/)). It is off by default. See
[Enable BigQuery policy tags](/storage/byodb/bigquery-policy-tags/enable/).

## Backend and projects

The feature is switched on at two levels, and Keboola support handles both on request:

- **The backend.** You grant one custom role on your taxonomy, and Keboola verifies the grant and enables the backend.
  This is done once per backend.
- **Each project.** Tags are carried over only in projects where Keboola also turns on the project feature
  `bigquery-policy-tags`. The other projects on the backend keep the previous behavior: a copy loses its tag, and a
  `storage.policyTagsNotPropagated` event names the exposed columns. You can start with one project and add more later;
  adding a project needs nothing on your side beyond asking for it.

For a linked bucket, the project that decides is the one that makes the copy, not the one that shares the data. Turning
the feature on in a project affects the next copy; tables already copied without tags are not re-tagged.

## How it works

Keboola carries the tag over when it copies a table in Storage, pulls it into a development branch, or loads it into a
workspace within your backend. Other paths, such as snapshot restore, are listed in
[What this feature does not cover](#what-this-feature-does-not-cover). The destination is created already protected,
before any row reaches it.

Columns are matched by name. A column renamed in an input mapping keeps its tag under the new name.

When Keboola cannot keep the protection, the job fails and names the affected columns. Nothing is copied, and a table the
job was about to replace stays as it was. The job fails as a user error, so Keboola does not retry it. Typical reasons:

- The tag sits on a field inside a `STRUCT`, or a column carries more than one tag.
- The tag comes from a taxonomy in another region, or from a taxonomy other than the one enabled on the backend.
- The source is a view that renames, computes or joins a protected column, so Keboola cannot trace where the column
  comes from. A view that passes a protected column through under its own name is copied with the tag.
- Keboola cannot read the source, or the project's service account lacks a grant that the copy needs.

## What you grant

You grant one custom role on the taxonomy that holds your tags. The role holds a single permission,
`datacatalog.taxonomies.get`, and you bind it to two principals:

| Principal | Why |
|---|---|
| The service account your backend is registered with | Keboola uses it to test the setup before it enables the backend. |
| `principalSet://cloudresourcemanager.googleapis.com/folders/{folder}/type/ServiceAccount`, the backend's folder | The service accounts of your Keboola projects use it to attach your tags to the tables they create. |

The folder principal set covers every service account in every project under the backend's folder, including projects
created later, so you make this binding once. Keboola makes no change to your taxonomy's access policy, neither at
enablement nor when projects are created or deleted, and it does not ask for the right to change that policy.

The role must be a custom role. Keboola refuses a predefined role, because the role reaches every service account in
the folder. Attaching a tag also needs the BigQuery permission `bigquery.tables.setCategory`, which project service
accounts already hold on their own data.

These grants do not let anyone read protected values. Reading a protected column is a separate grant, described in
[Fine-grained access](#fine-grained-access).

## Fine-grained access

If your taxonomy enforces fine-grained access control, BigQuery lets only principals with the Fine-Grained Reader role
(`roles/datacatalog.categoryFineGrainedReader`) read a tagged column. Keboola's copies run as the project's service
account, so the project needs that role to copy tagged data.

Without it, the project cannot:

- clone or copy a table with a tagged column, or pull it into a development branch;
- preview or export it;
- load it incrementally, because the merge reads the tagged column. Only a full load succeeds.

Each of these fails with the error `storage.backend.policyTagAccessDenied`. The error names the policy tag, the column
where BigQuery reports it, and the role to ask for. A job that fails this way is not retried.

Neither enabling the backend nor turning on the project feature grants this role. They only let Keboola attach tags.
Which projects may see protected data is your decision: grant the role per project, on the taxonomy, to the principal set
of the project's data project, named by project number:

```
principalSet://cloudresourcemanager.googleapis.com/projects/{project number}/type/ServiceAccount
```

When Keboola turns on `bigquery-policy-tags` in a project of an enforcing taxonomy, it checks this grant and warns when it
is missing. It still turns the feature on. The check reads the grant on the taxonomy's test tag, so a role bound per tag
rather than on the taxonomy can cause a warning that does not apply to your data tags. Binding on the taxonomy avoids
that.

## Column protection in the table detail

Each column of a BigQuery table reports a `policyTagState` in the Storage API table detail (`definition.columns`). The
bucket listing does not carry it, and workspace tables report no state.

- `protected`: Keboola observed a policy tag on the column.
- `unprotected`: Keboola observed the column and it had no tag.
- `unknown`: Keboola has not observed the table yet, or the column's protection cannot be stated, for example a tag inside
  a `STRUCT`. Columns of a view are always `unknown`, because a view's own schema never carries a tag.

The state reflects what Keboola last observed, not what BigQuery says right now. If you change a tag directly in
BigQuery, refresh the bucket's table information to update it. The refresh runs a small query that is billed to the
project.

## Events

Keboola records an event in the project when a policy tag affects a copy within your BigQuery backend. Each event names
the source table, the destination table and the columns involved.

| Event | What happened | What to do |
|---|---|---|
| `storage.policyTagsNotPropagated` | A protected column was copied without its tag, because Keboola could not carry the protection over on this copy. Usually the backend is not enabled, or the project does not have the feature turned on. | Ask for the feature if copies must stay protected, and check who can read the copy. |
| `storage.policyTagPropagationFailed` | Keboola tried to keep the tag, failed, and copied nothing. | Read the error in the event, fix its cause, and run the job again. |
| `storage.workspacePolicyTagMismatch` | An incremental load was refused, because the existing workspace table is less protected than its source. | Run that load once with incremental loading turned off; the workspace table is replaced with one that carries the tags. See [Known gaps](#known-gaps). |

## What this feature does not cover

Policy-tag support keeps protection on the copies Keboola makes within your BigQuery backend. It does not cover:

- **Per-user access inside a project.** BigQuery sees each project's service account, not individual Keboola users. Every
  user with access to a project acts through the same account.
- **Loading into a Snowflake workspace.** A protected BigQuery table loaded into a Snowflake workspace carries no tag, and
  Keboola records no event.
- **Snapshot restore.** A table restored from a snapshot carries no tag.
- **Data Apps.** Data Apps are not covered.
- **Data leaving BigQuery.** Keboola does not stop protected values from leaving through components such as the Google
  Sheets writer, through a Storage API table export, or through the data preview in the UI, if the project service
  account can read them.
- **Approved access.** Granting a person access to protected data after a legal or compliance approval is not part of
  this feature.
- **Row-level security.** BigQuery row access policies are a separate mechanism from policy tags and are outside this
  feature. A clone-based copy keeps them; a copy Keboola has to rebuild (a source that cannot be cloned, or a COPY load
  into a workspace) does not.
- **Grants removed after enablement.** Keboola does not detect or prevent changes to the grants on your taxonomy. If you
  remove them, copies of protected columns fail.

## Known gaps

- **An incremental load into an existing workspace table can be refused.** This concerns one case only: an incremental
  load from Storage into a workspace table that already exists, as in a persistent workspace or an incremental input
  mapping. Full loads, clone loads and workspace tables created after the feature was switched on are not affected, so
  most transformation input mappings never see it.

  Keboola attaches tags to a workspace table only when it creates the table. A table that existed before the feature was
  switched on has no tags, and adding protected rows to it would expose them, so Keboola refuses the load. The job fails
  before it writes anything, names the affected columns, and the project records a `storage.workspacePolicyTagMismatch`
  event. The same happens when a source gets tagged after the workspace table that receives it incrementally was
  created.

  To fix it, run that load once with incremental loading turned off. Keboola replaces the workspace table with one that
  carries the source's tags, and incremental loads work again from the next run. A fix that tags the existing table
  instead of refusing the load is planned.
- **A workspace can remove or replace a tag on its own tables.** A workspace's service account owns the tables in its
  workspace, so it can remove a carried-over tag from one of them, or replace it with another tag from your taxonomy. If
  your taxonomy enforces fine-grained access, the workspace can then read that column of its copy. This exposes nothing
  beyond what the project could already read when the project holds the Fine-Grained Reader role, but the copy is no
  longer protected, for example when it is exported. A fix is planned.
- **Anyone allowed to read a tagged column can copy it without the tag.** A policy tag restricts reading, not copying.
  A principal that holds the Fine-Grained Reader role, inside or outside Keboola, can write the values to a new table that
  carries no tag. This is how BigQuery policy tags work, and Keboola cannot prevent it.

## Limits

- **One taxonomy per backend.** If a source column carries a tag from a different taxonomy, Keboola cannot attach it, and
  the copy fails. Support for several taxonomies on one backend is planned.
