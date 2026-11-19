---
title: Merge Requests
slug: 'components/branches/merge-requests'
description: 'Review the changes in a development branch, send them as a merge request, approve and merge it, resolve conflicts, and require review with branch protection.'
---

A **merge request** is the controlled way to bring the configuration changes you made in a
[development branch](/components/branches/) back into production. Instead of merging directly,
you submit your branch for review: reviewers can inspect a diff of every changed configuration,
approve or reject the changes, and only then are they merged into production.

Merge requests give you the review, approval, and audit workflow that teams expect from modern
Git-based development — while keeping everything inside your Keboola project.

<!-- How-to-type page. Source: this page as it was before the 2026-11-19 rework (screenshots from July 2026). Text reshaped into tasks; facts not re-checked against the product. -->

This page has the steps. The states a request moves through and what a merge leaves behind are explained in
[The merge request lifecycle](/components/branches/#the-merge-request-lifecycle) and
[After a merge](/components/branches/#after-a-merge). To create or close the branch itself, see
[Manage development branches](/components/branches/manage/).

:::caution[Branches 2.0]
Merge requests are part of the **Branches 2.0** feature. If you don't see them in your project,
enable Branches 2.0 in your **project settings** or contact **Keboola support** to have it turned on.
:::

:::tip
If your project does **not** require any approvals, a merge request is still created, but it is
auto-approved the moment you submit it, so you can merge immediately. You get the diff and the
audit trail without the review overhead. See [Require review](#require-review-branch-protection).
:::

## Review your branch changes

**Goal:** see what your branch would change in production before you submit anything.

1. Switch into your development branch and open **Changes** from the
   branch switcher. **Pull from Prod** in the same menu lets you first bring the latest production
   state into your branch.

   ![Screenshot - Branch switcher with Changes and Pull from Prod](/components/branches/merge-requests/figures/branch-changes-menu.png)

2. The **Changes** view compares your branch against production and lists every configuration that
   differs, together with its status (for example, *Updated in branch*).

   ![Screenshot - Changes between branch and production](/components/branches/merge-requests/figures/branch-changes.png)

3. Expand any configuration to see a side-by-side diff of the underlying configuration between the
   production version and your branch version. Additions are highlighted in green and removals in red.

   ![Screenshot - Configuration diff](/components/branches/merge-requests/figures/configuration-diff.png)

**Result:** you can confirm exactly what will be merged.

## Create a merge request

**Goal:** submit the changes in your branch for review.

1. When you are happy with the changes, click **Send for review** in the **Changes** view.
2. Fill in:

   - **Name** — a short, descriptive title for the request (required).
   - **Internal ID** *(optional)* — a reference to an external tracker (Jira, Asana, Trello, Notion, …).
   - **Branch Description** *(optional)* — supports Markdown; pre-filled from the branch notes.
   - **Optional Reviewers** — invite specific colleagues to review. If your project requires approvals,
     the required reviewers are enforced here; if none are required, you can still invite reviewers or
     leave it empty for auto-approval.
   - **Merge behavior** — tick **Merge automatically after review** to have the branch merged as soon as
     it is approved (see [Auto-merge](#merge-to-production)).

   ![Screenshot - Send for review dialog](/components/branches/merge-requests/figures/send-for-review.png)

3. Submit the dialog.

**Result:** submitting creates the merge request. If no reviewers are required on the project, the request is
auto-approved immediately and is ready to merge.

## Review and approve a merge request

**Goal:** decide, as a reviewer, whether the changes may reach production.

When a project [requires approvals](#require-review-branch-protection), a submitted request enters
the **In Review** state and the invited reviewers are notified.

1. Reviewers open the request and inspect
   the configuration diff.
2. Then they either:

   - **Approve** — once the required number of approvals is reached, the request becomes **Ready to Merge**.
   - **Reject** — the request is sent back so the author can make further changes in the branch and resubmit.

**Result:** approvals and rejections are recorded on the merge request, giving you a complete audit trail of who
signed off on which changes.

## Merge to production

**Goal:** apply an approved merge request to production.

1. Open an approved merge request to merge it. From the request detail you can:

   - **Merge Now** — apply the changes to production immediately. You are asked to confirm; after that,
     new [configuration versions](/components/configurations/#see-the-version-history) are created in production with the
     merge as their change description.
   - **Schedule Merge** — enable **Merge automatically after review** so the request merges on its own the
     moment it is approved, without anyone having to click *Merge Now*.
   - **Cancel Request** — close the request without merging (the branch stays and can be resubmitted).
   - **Changelog** — download a record of what was merged.

   ![Screenshot - Merge request detail](/components/branches/merge-requests/figures/merge-request-detail.png)

2. Clicking **Merge Now** asks you to confirm before anything reaches production:

   ![Screenshot - Merge to production confirmation](/components/branches/merge-requests/figures/merge-confirm.png)

To merge automatically once the request is approved, enable **Merge automatically after review**:

![Screenshot - Schedule (automatic) merge](/components/branches/merge-requests/figures/schedule-merge.png)

**Result:** the changes are applied to production and the request moves to **Merged**. What happens to the branch and its data is described in [After a merge](/components/branches/#after-a-merge).

:::caution
As with a direct branch merge, **only configurations are merged, not data.** Branch storage is
isolated; after merging, run your configurations in production to populate production Storage. See
[Development Branches](/components/branches/) for how branched storage works.
:::

## Resolve merge conflicts

**Goal:** make a branch mergeable again after the same configuration changed in production.

A conflict occurs when a configuration was changed **both** in production and in your branch after
the branch was created, so the branch can no longer be merged cleanly. Keboola detects this and can
notify you (see [notifications](#require-review-branch-protection)).

1. Open the **Changes** view. The affected configuration is
   marked **Conflicting configuration** there, and the request cannot be sent for review
   or merged until every conflict is resolved.

   ![Screenshot - Conflicting configuration](/components/branches/merge-requests/figures/conflict-detected.png)

2. You resolve each conflicting configuration directly from the row:

   - **Resolve** opens a three-way **Merge Conflict Resolution** view (see below).
   - The dropdown next to it offers a one-click shortcut, **Keep production version**, which discards your
     branch change for that configuration and takes what is currently in production.

   ![Screenshot - Resolve conflict options](/components/branches/merge-requests/figures/conflict-resolve.png)

### Three-way merge resolution

**Resolve** opens the configuration side by side in three panes — **Production** (the current production
version), an editable **Merge Result** in the middle, and your **Branch** version. Conflicting lines are
highlighted; use the arrows to pull a line from either side into the merge result, or edit the merge
result directly. When no conflicts remain, click **Save changes** to store the reconciled configuration
in your branch.

![Screenshot - Three-way merge conflict resolution](/components/branches/merge-requests/figures/conflict-resolution-3way.png)

### Which options work in which state

Production can change at any time before the merge, so a conflict can also appear after the request was
sent for review or approved. What you can use depends on the state of the request:

- **Resolve** and **Keep production version** work in every state, including **In Review** and
  **Ready to Merge**. They update only the conflicting configuration in your branch.
- **Pull from Prod** and editing configurations yourself need a writable branch. While the request is
  **In Review** or **Ready to Merge**, the branch is read-only. To make it writable again, have a reviewer
  **Reject** the request, or **Cancel Request** and submit a new one when you are done. Then use
  **Pull from Prod** in the branch switcher, reconcile the affected configurations, and submit the merge
  request again.

**Result:** when no conflict remains, the request can be sent for review or merged again.

## Merge requests in Kai, the MCP Server, and the CLI

**Goal:** create, review and merge a request without the UI.

The same flow is available outside the UI:

- **Kai** — in your development branch, ask Kai to create a merge request for your changes. If the project
  requires no approvals, Kai can merge it right away. While a merge request is **In Review** or approved
  (**Ready to Merge**), the branch is read-only and Kai is not available in it; open Kai in production to
  approve, request changes, resolve conflicts, and merge.
- **MCP Server** — the [merge request tools](/ai/mcp-server/#available-tools) list, create, review, approve,
  and merge requests and resolve their conflicts. They appear only in projects with Branches 2.0. Anyone can
  read merge requests. With a Storage API token, creating or updating a request, requesting or giving a review,
  resolving conflicts, and merging require the **Admin** or **Share**
  [project role](/management/project/users/#user-roles). With OAuth sign-in, the MCP server does not check the
  role and your permissions in the project apply. Creating a
  request needs a session scoped to the
  [development branch](/ai/mcp-server/#development-branches); the other operations also work from a
  production session when you name the merge request. See the
  [tool reference](https://github.com/keboola/mcp-server/blob/main/TOOLS.md) for the full list.
- **Keboola Agent CLI** — `kbagent merge-request` offers the same workflow from the command line. The
  request is opened for the current branch: the one you pinned with `kbagent branch use`, or the one you
  pass with `--branch <id>`. Without either, `create` has no source branch. A typical run:
  `kbagent merge-request create --title "..."` opens the request, `kbagent merge-request request-review`
  sends it for review, a reviewer runs `kbagent merge-request approve` where approvals are required, and
  `kbagent merge-request merge` merges it. Run `kbagent merge-request --help` for the full list, or see
  the [kbagent repository](https://github.com/keboola/cli).

**Result:** the merge request goes through the same flow as one you handle in the UI.

## Require review (branch protection)

**Goal:** set whether merge requests need approval, and who may give it.

1. Whether review is required — and who may review — is configured per project in
   **Project Settings → Branch Protection**. Open it.

   ![Screenshot - Branch Protection settings](/components/branches/merge-requests/figures/branch-protection.png)

2. Set the options:

   - **Required approvals** — the number of approvals a merge request needs before it can be merged.
     Set it to `0` to let anyone merge without review (requests are auto-approved on submit).
   - **Reviewers** — by default **all** project users can review branches. You can restrict reviewing to
     a chosen set of colleagues.
   - **Your Notifications** — choose when you receive an email: when a review is requested, when a review
     is submitted, when a conflict is detected, and when a branch is merged. **Only notify me when I'm
     directly involved** limits notifications to requests you created or were asked to review.

**Result:** once review requirements are in place, every merge request must collect the required approvals before
it can reach production.

---

**Next:** [IP addresses →](/components/ip-addresses/)
