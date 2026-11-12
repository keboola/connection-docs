---
title: Merge Requests
slug: 'components/branches/merge-requests'
description: Review, approve, and merge development branch changes into production using merge requests.
---

A **merge request** is the controlled way to bring the configuration changes you made in a
[development branch](/components/branches/) back into production. Instead of merging directly,
you submit your branch for review: reviewers can inspect a diff of every changed configuration,
approve or reject the changes, and only then are they merged into production.

Merge requests give you the review, approval, and audit workflow that teams expect from modern
Git-based development — while keeping everything inside your Keboola project.

:::caution[Branches 2.0]
Merge requests are part of the **Branches 2.0** feature. If you don't see them in your project,
enable Branches 2.0 in your **project settings** or contact **Keboola support** to have it turned on.
:::

:::tip
If your project does **not** require any approvals, a merge request is still created, but it is
auto-approved the moment you submit it, so you can merge immediately. You get the diff and the
audit trail without the review overhead. See [Requiring Review](#requiring-review-branch-protection).
:::

## The Merge Request Lifecycle

Every merge request moves through a set of states, shown as filters at the top of the
**Merge Requests** list:

- **In Review** — submitted and waiting for the required number of approvals.
- **Ready to Merge** — approved and ready to be merged into production (either manually or automatically).
- **Merged** — the changes have been applied to production.
- **Rejected** — a reviewer requested changes; go back to the branch, adjust, and resubmit.
- **Closed** — the request was cancelled without merging.

You can reach the list at any time from the branch switcher (**Merge Requests**) or from the project menu.

![Screenshot - Merge Requests list](/components/branches/merge-requests/figures/merge-requests-list.png)

Each row shows the request name and description, its status, who created it and when, a link to the
changed configurations, and the reviews collected so far.

## Reviewing Your Branch Changes

Before you submit anything, switch into your development branch and open **Changes** from the
branch switcher. **Pull from Prod** in the same menu lets you first bring the latest production
state into your branch.

![Screenshot - Branch switcher with Changes and Pull from Prod](/components/branches/merge-requests/figures/branch-changes-menu.png)

The **Changes** view compares your branch against production and lists every configuration that
differs, together with its status (for example, *Updated in branch*).

![Screenshot - Changes between branch and production](/components/branches/merge-requests/figures/branch-changes.png)

Expand any configuration to see a side-by-side diff of the underlying configuration between the
production version and your branch version. Additions are highlighted in green and removals in red,
so you can confirm exactly what will be merged.

![Screenshot - Configuration diff](/components/branches/merge-requests/figures/configuration-diff.png)

## Creating a Merge Request

When you are happy with the changes, click **Send for review** in the **Changes** view. Fill in:

- **Name** — a short, descriptive title for the request (required).
- **Internal ID** *(optional)* — a reference to an external tracker (Jira, Asana, Trello, Notion, …).
- **Branch Description** *(optional)* — supports Markdown; pre-filled from the branch notes.
- **Optional Reviewers** — invite specific colleagues to review. If your project requires approvals,
  the required reviewers are enforced here; if none are required, you can still invite reviewers or
  leave it empty for auto-approval.
- **Merge behavior** — tick **Merge automatically after review** to have the branch merged as soon as
  it is approved (see [Auto-merge](#merging-to-production)).

![Screenshot - Send for review dialog](/components/branches/merge-requests/figures/send-for-review.png)

Submitting creates the merge request. If no reviewers are required on the project, the request is
auto-approved immediately and is ready to merge.

## Reviewing and Approving

When a project [requires approvals](#requiring-review-branch-protection), a submitted request enters
the **In Review** state and the invited reviewers are notified. Reviewers open the request, inspect
the configuration diff, and then either:

- **Approve** — once the required number of approvals is reached, the request becomes **Ready to Merge**.
- **Reject** — the request is sent back so the author can make further changes in the branch and resubmit.

Approvals and rejections are recorded on the merge request, giving you a complete audit trail of who
signed off on which changes.

## Merging to Production

Open an approved merge request to merge it. From the request detail you can:

- **Merge Now** — apply the changes to production immediately. You are asked to confirm; after that,
  new [configuration versions](/components/#configuration-versions) are created in production with the
  merge as their change description.
- **Schedule Merge** — enable **Merge automatically after review** so the request merges on its own the
  moment it is approved, without anyone having to click *Merge Now*.
- **Cancel Request** — close the request without merging (the branch stays and can be resubmitted).
- **Changelog** — download a record of what was merged.

![Screenshot - Merge request detail](/components/branches/merge-requests/figures/merge-request-detail.png)

Clicking **Merge Now** asks you to confirm before anything reaches production:

![Screenshot - Merge to production confirmation](/components/branches/merge-requests/figures/merge-confirm.png)

To merge automatically once the request is approved, enable **Merge automatically after review**:

![Screenshot - Schedule (automatic) merge](/components/branches/merge-requests/figures/schedule-merge.png)

:::caution
As with a direct branch merge, **only configurations are merged, not data.** Branch storage is
isolated; after merging, run your configurations in production to populate production Storage. See
[Development Branches](/components/branches/) for how branched storage works.
:::

## Merge Conflicts

A conflict occurs when a configuration was changed **both** in production and in your branch after
the branch was created, so the branch can no longer be merged cleanly. Keboola detects this and can
notify you (see [notifications](#requiring-review-branch-protection)). The affected configuration is
marked **Conflicting configuration** in the **Changes** view, and the request cannot be sent for review
or merged until every conflict is resolved.

![Screenshot - Conflicting configuration](/components/branches/merge-requests/figures/conflict-detected.png)

You resolve each conflicting configuration directly from the row:

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

## After a Merge

A merged request is kept in the [list](#the-merge-request-lifecycle) with the **Merged** status, and you
can **Download Changelog** from its row for a record of exactly what was applied.

Because a merge produces new [configuration versions](/components/#configuration-versions) in production,
no configuration change is lost: if a merged change causes problems, you can open the affected configuration
and roll it back to its previous version, restoring the pre-merge state.

A successful merge also **deletes the development branch**, including its buckets, tables, and workspaces.
Only the configuration changes reach production; if you still need data from the branch, export it before
you merge.

## Merge Requests in Kai, the MCP Server, and the CLI

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

## Requiring Review (Branch Protection)

Whether review is required — and who may review — is configured per project in
**Project Settings → Branch Protection**.

![Screenshot - Branch Protection settings](/components/branches/merge-requests/figures/branch-protection.png)

- **Required approvals** — the number of approvals a merge request needs before it can be merged.
  Set it to `0` to let anyone merge without review (requests are auto-approved on submit).
- **Reviewers** — by default **all** project users can review branches. You can restrict reviewing to
  a chosen set of colleagues.
- **Your Notifications** — choose when you receive an email: when a review is requested, when a review
  is submitted, when a conflict is detected, and when a branch is merged. **Only notify me when I'm
  directly involved** limits notifications to requests you created or were asked to review.

Once review requirements are in place, every merge request must collect the required approvals before
it can reach production.
