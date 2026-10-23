---
title: Enable BigQuery policy tags
slug: 'storage/byodb/bigquery-policy-tags/enable'
description: Grant access on your policy-tag taxonomy and ask support to enable BigQuery policy tags on your backend and projects.
---

Use this guide to turn on [BigQuery policy tags](/storage/byodb/bigquery-policy-tags/) for one BYODB BigQuery backend.
Repeat it for each backend that needs the feature. Keboola support can also send you this guide with your backend's
values filled in, as `gcloud` commands or as a Terraform module.

## Before you start

- Find the resource name of the taxonomy that holds your policy tags:
  `projects/{project}/locations/{location}/taxonomies/{taxonomyId}`. A backend uses one taxonomy, and it must be in the
  backend's BigQuery location, because a policy tag only protects a column in its own taxonomy's location.
- Find the ID of the backend's folder, the one you created when [connecting BigQuery](/storage/byobq/#1-create-a-folder).
- Make sure the backend has at least one project. Keboola tests the setup as one of its projects.
- In the taxonomy, create a policy tag that Keboola may attach to a scratch table to test the setup, for example
  `keboola-probe`. Keep it apart from the tags that classify your data.

## 1. Create the setter role

Create a custom role with a single permission, `datacatalog.taxonomies.get`, in the project that owns the taxonomy:

```shell
gcloud iam roles create kbcPolicyTagSetter --project={project} \
  --title="Keboola policy tag setter" \
  --permissions=datacatalog.taxonomies.get
```

The role must be a custom role; Keboola refuses a predefined one. A role created in a project can be granted only on
resources of that project, so create it in the taxonomy's project.

## 2. Grant the setter role on the taxonomy

Bind the role on the taxonomy to the service account your backend is registered with, the "Keboola Main Service Account"
from [connecting BigQuery](/storage/byobq/#4-create-a-service-account), and to every service account in the backend's
folder:

```shell
gcloud data-catalog taxonomies add-iam-policy-binding {taxonomy} \
  --member=serviceAccount:{backend service account} \
  --role=projects/{project}/roles/kbcPolicyTagSetter

gcloud data-catalog taxonomies add-iam-policy-binding {taxonomy} \
  --member=principalSet://cloudresourcemanager.googleapis.com/folders/{folder}/type/ServiceAccount \
  --role=projects/{project}/roles/kbcPolicyTagSetter
```

The folder binding covers the projects Keboola creates later, so you make it once. Keboola does not change your
taxonomy's access policy and does not ask for the right to. These grants do not let anyone read protected values. See
[What you grant](/storage/byodb/bigquery-policy-tags/#what-you-grant).

## 3. Grant fine-grained access to the projects that may read the data

Skip this step only if your taxonomy does not enforce fine-grained access control.

With enforcement on, a project can copy, preview, export or incrementally load a tagged table only if its service
account holds the Fine-Grained Reader role. Without it, those operations fail with `storage.backend.policyTagAccessDenied`.
Enabling the backend and the project feature does not grant this role. Grant it to each project that may see the
protected data, on the taxonomy, to the principal set of the project's data project named by project number:

```shell
gcloud data-catalog taxonomies add-iam-policy-binding {taxonomy} \
  --member=principalSet://cloudresourcemanager.googleapis.com/projects/{project number}/type/ServiceAccount \
  --role=roles/datacatalog.categoryFineGrainedReader
```

`gcloud projects describe {project id} --format='value(projectNumber)'` returns a project's number. See
[Fine-grained access](/storage/byodb/bigquery-policy-tags/#fine-grained-access).

## 4. Ask support to enable it

Contact Keboola support and send:

- the taxonomy resource name;
- the name of the setter role;
- the test policy tag;
- the Keboola projects in which tags should be carried over.

Keboola then tests the setup end to end, twice: once as the backend's service account and once as the service account of
one project. Each test creates a scratch table, attaches the test tag, reads it back and removes the table. Only then does
Keboola enable the backend, and it turns on the project feature `bigquery-policy-tags` in the projects you named. If a
test fails, Keboola does not enable the backend, and support tells you what to fix.

To add a project later, ask support to turn the feature on in it. If your taxonomy enforces fine-grained access, grant
that project the Fine-Grained Reader role first (step 3); Keboola warns when it is missing.

## 5. Fix the first incremental loads

A workspace table created before the feature was turned on carries no tags. The first incremental load into it from a
protected source fails before it writes any data, and names the columns.

Run that load once as a full, non-incremental load that replaces the workspace table. The table is re-created with the
source's protection, and later incremental loads work again. If you tag many columns, expect this right after enablement.

## Changing the setup later

- **A different taxonomy or role.** Ask support. Keboola disables the backend first, records the new values and tests
  them again.
- **Turning it off.** Support can disable the backend immediately. Nothing changes on your taxonomy; the grants stay until
  you remove them.
- **Removing grants.** Keboola does not detect a grant removed after enablement. Copies of protected columns then fail.
