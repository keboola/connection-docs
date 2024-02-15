---
title: Keboola Support
permalink: /management/support/
---

* TOC
{:toc}

There are multiple ways to obtain support from within your project.
First and foremost, there is a button at the bottom right of your project. Click it, select **Support**, and fill in the form
to create a ticket, which will reach your maintainer.

{: .image-popup}
![Screenshot -- User joined](/management/support/help-support-new-widget.png)

Secondly, if you happen to trigger a server error while working with Keboola Connection, there will be
a button to contact our support in the error alert message.

{: .image-popup}
![Screenshot -- User joined](/management/support/support-error.png)

## Keboola Support Users
In order to solve an issue or gain context regarding an application error, a technical support member
may require access to your project. By default, Keboola support staff [may join](/management/project/users/#who-can-access-a-project) your project when
requested, and they will appear in the member's list marked by the Keboola badge:

{: .image-popup}
![Screenshot -- User joined](/management/support/users.png)

Keboola technical support users are marked with the **octopus badge**. Maintainer users are not marked.
Both will always have MFA enabled, their accounts always expire, and they are
required to have a reason to enter the project. They also do not count towards the project limits.

## Require Approval for Support Access
Some organizations may prefer to have a starker demarcation for their projects with regard to access by
the support team. To facilitate this transparency, we have introduced the option to require approval for
all temporary access by Keboola support accounts and maintainers.
The setting can be found in the [organization settings](/management/organization/#organization-settings) 
on the **Account Settings** page:

{: .image-popup}
![Screenshot -- User joined](/management/support/organization-allow-auto-join-on.png)

With Auto Join off, a joining support account will require approval by an existing project user in
order to gain access. When a support user requests access, each active project user will receive an
email notification:

{: .image-popup}
![Screenshot -- Notification](/management/support/access-request-mail.png)

The requesting user will appear in the user's list as shown below. Any active project user can use
the links provided in the requesting user's row to either approve or reject the access request.

{: .image-popup}
![Screenshot -- User request access](/management/support/approve-user-list.png)

When the request is approved or rejected, the requester receives an email notification.
If the request is approved, the requester becomes a user of the project. The list then shows both the
reason stated in the request and also which project user approved the request.

{: .image-popup}
![Screenshot -- User approved](/management/support/approve-user-list-2.png)

### Organization Changes
When [Auto Join](#require-approval-for-support-access) is disabled, it limits
[who can access the projects](/management/project/users/#who-can-access-a-project) in the organization. It also means
that neither [the maintainer](/management/organization/), nor Keboola Support can join the organization itself.

In other words, when Auto Join is turned off for an organization, only the organization users and project users may
access its projects. Every new user of the organization must be explicitly invited. Every new user of any of its projects
must either be explicitly invited or be a user of the organization.
