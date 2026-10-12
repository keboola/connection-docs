---
title: BigQuery policy tags
slug: 'storage/byodb/bigquery-policy-tags'
description: Keep BigQuery column-level access control on the copies Keboola makes of a protected table within your BigQuery backend.
---

BigQuery [policy tags](https://cloud.google.com/bigquery/docs/column-level-security-intro) restrict who can read a column.
You attach them in BigQuery.

Without this feature, Keboola copies a tagged column within your backend without its tag. The copy is unprotected, and
the only trace is a `storage.policyTagsNotPropagated` event in the project (see [Events](#events)).

With policy-tag support enabled on your backend, Keboola does three things:

- It keeps the policy tag on the copies it makes of a protected column within your BigQuery backend. The exceptions are
  listed in [What this feature does not cover](#what-this-feature-does-not-cover).
- It refuses a copy rather than produce an unprotected one.
- It reports each column's protection state in the table detail.

Keboola keeps tags that a source already carries. It never adds a tag to a table whose source has none.

The feature is available only on your own BigQuery backend ([BYODB](/storage/byodb/)). It is off by default, and Keboola
enables it for one backend at a time on request.

## How it works

Keboola carries the tag over whenever it copies data within your backend. Examples are copying a table in Storage and
loading a table into a workspace. The destination is created already protected, before any row reaches it.

Columns are matched by name. A column renamed in an input mapping keeps its tag under the new name.

When Keboola cannot keep the protection, the job fails and names the affected columns. Nothing is copied, and a table the
job was about to replace stays as it was. The job fails as a user error, so Keboola does not retry it. Typical reasons:

- The tag sits on a field inside a `STRUCT`, or a column carries more than one tag.
- The tag comes from a taxonomy in another region, or from a taxonomy other than the one enabled on the backend.
- The source is a view that renames, computes or joins a protected column, so Keboola cannot trace where the column
  comes from. A view that passes a protected column through under its own name is copied with the tag.
- Keboola cannot read the source, or the project's service account lacks a grant that the copy needs.

## What you grant

Keboola asks for permissions on the taxonomy that holds your policy tags, nothing more. The taxonomy is identified by its
resource name, `projects/{project}/locations/{location}/taxonomies/{taxonomyId}`.

| Who | Permission on the taxonomy | Why |
|---|---|---|
| The root service account of your Keboola backend | A custom role with `datacatalog.taxonomies.get` | Lets Keboola check the taxonomy. Granted onward, it lets project service accounts attach its tags. |
| The same root service account | A role with `datacatalog.taxonomies.getIamPolicy` and `datacatalog.taxonomies.setIamPolicy` | Lets Keboola grant the custom role to each project's service account |

Use a custom role that you name. Keboola refuses a predefined role in this position, because the role is granted to every
project service account on the backend. A role that holds only `datacatalog.taxonomies.get` is enough.

**Enablement never grants Keboola read access to protected values.** Reading a protected column requires the
Fine-Grained Reader role on the policy tag. Keboola never asks for it, and enablement only binds your custom role. The
policy rights above would technically let the root account add other bindings to the taxonomy; Keboola does not.

Copying a protected column still requires read access to it. Keboola never requests the Fine-Grained Reader role; if your
project service accounts do not hold it, copies of protected columns may fail. Granting it is your decision.

## Enable the feature

Contact Keboola support, one request per backend, and send:

- the taxonomy resource name;
- the name of the custom role;
- a policy tag from that taxonomy that Keboola may attach to a scratch table to test the setup.

Keboola then tests the setup end to end. It creates a scratch table, attaches the test tag, removes the table, and checks
that it can grant the custom role onward. It then grants the role to every project service account on the backend and
turns the feature on. If any step fails, Keboola does not turn the feature on, and support tells you what to fix.

### Plan for the first incremental load

A workspace table created before the feature was enabled carries no tags. The first incremental load into it from a
protected source fails before it writes any data, and names the columns.

To fix it, run that load once with the table overwritten. The table is re-created with the source's protection, and later
incremental loads work again. If you tag many columns, expect this right after enablement.

### The principal limit

A BigQuery IAM policy holds at most 1,500 principals. Every project service account on the backend becomes one member of
your taxonomy's policy. Once the policy is full, granting the role fails, and so does creating a project on the backend.

Keboola refuses to enable the feature if that would take the policy past 1,400, leaving room for your own bindings.
Keboola tries to remove a project's service account from the policy when the project is deleted. Members left behind by
deleted accounts are cleared when support re-runs the enablement. If you run many projects on one backend, check the
policy's size before you ask for enablement.

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
| `storage.policyTagsNotPropagated` | A protected column was copied without its tag, because Keboola could not carry the protection over on this copy. Usually the feature is not enabled on this backend. | Ask for enablement if copies must stay protected, and check who can read the copy. |
| `storage.policyTagPropagationFailed` | Keboola tried to keep the tag, failed, and copied nothing. | Read the error in the event, fix its cause, and run the job again. |
| `storage.workspacePolicyTagMismatch` | An incremental load was refused, because the existing workspace table is less protected than its source. | Run the load once with the table overwritten. |

## One taxonomy per backend

Each backend works with one taxonomy. If a source column carries a tag from a different taxonomy, Keboola cannot attach
it, and the copy fails. Support for several taxonomies on one backend is planned.

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
