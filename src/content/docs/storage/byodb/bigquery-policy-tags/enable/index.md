---
title: Enable BigQuery policy tags
slug: 'storage/byodb/bigquery-policy-tags/enable'
description: What you need in Google Cloud to enable BigQuery policy tags on your backend, and how to ask Keboola for it.
---

[BigQuery policy tags](/storage/byodb/bigquery-policy-tags/) are available on BYODB BigQuery backends only and are off by
default. To enable them, contact Keboola support or your account executive. Repeat this for each backend that needs the
feature.

## What you need

- **Your BigQuery backend and the taxonomy your policy tags live in.** We send you a step-by-step guide, or a Terraform
  module, with your values filled in. A backend uses one taxonomy, in the backend's BigQuery location, because a policy
  tag only protects a column in its own taxonomy's location.
- **A test policy tag in that taxonomy.** Keboola attaches it to scratch tables to test the setup. Keep it apart from the
  tags that classify your data.
- **One custom role granted on that taxonomy.** It holds only `datacatalog.taxonomies.get` and is bound for the
  service account your backend is registered with (the "Keboola Main Service Account" from
  [connecting BigQuery](/storage/byobq/#4-create-a-service-account)) and for the service accounts in your backend's
  folder (`principalSet://cloudresourcemanager.googleapis.com/folders/{folder id}/type/ServiceAccount`). Projects created
  later are covered automatically. The role must be a custom role; Keboola refuses a predefined one. It lets Keboola set
  tags but not read protected data, and it does not let Keboola change your taxonomy's access policy. See
  [What you grant](/storage/byodb/bigquery-policy-tags/#what-you-grant).
- **A list of the projects to switch on.** Tags are carried over only in projects that have the feature switched on, so
  you can start with one pilot project and add more later. The backend needs at least one project, because Keboola tests
  the setup as one of its projects.
- **If your taxonomy enforces fine-grained access control, a read grant for each of those projects.**
  `roles/datacatalog.categoryFineGrainedReader` on the taxonomy for each project allowed to see the data
  (`principalSet://cloudresourcemanager.googleapis.com/projects/{project number}/type/ServiceAccount`). Without it,
  cloning, copying, branch pulls, previews, exports and incremental loads of a tagged table fail in that project with
  `storage.backend.policyTagAccessDenied`. Keboola never grants this role itself. See
  [Fine-grained access](/storage/byodb/bigquery-policy-tags/#fine-grained-access).

## What Keboola does

Once your grants are in place, Keboola tests the setup end to end, twice: once as the backend's service account and once
as the service account of one project. Each test creates a scratch table, attaches the test tag, reads it back and
removes the table. Only then does Keboola enable the backend and switch on the projects you named. If a test fails,
Keboola does not enable the backend and tells you what to fix.

To add a project later, ask Keboola to switch it on. If your taxonomy enforces fine-grained access, grant that project the
read role first; Keboola warns when it is missing.

## Incremental loads into existing workspace tables

Keboola attaches tags to a workspace table only when it creates the table. A table that was already in a workspace before
the feature was switched on therefore has no tags.

If a load adds rows from a tagged source to such a table incrementally, Keboola refuses it. Adding protected rows to an
unprotected table would expose them. The job fails before it writes anything, names the affected columns, and the project
records a `storage.workspacePolicyTagMismatch` event.

To fix it, run that load once with incremental loading turned off. Keboola then replaces the workspace table with a new
one that carries the source's tags, and incremental loads work again from the next run. This happens once per table. If
you tag many columns, expect several such failures right after the feature is switched on.

## Changing the setup later

- **A different taxonomy or role.** Ask Keboola. It disables the backend first, records the new values and tests them
  again.
- **Turning it off.** Keboola can disable the backend immediately. Nothing changes on your taxonomy; the grants stay
  until you remove them.
- **Removing grants.** Keboola does not detect a grant removed after enablement. Copies of protected columns then fail.
