---
title: Keboola Support
permalink: /management/support/
---

* TOC
{:toc}


### Obtaining Support
There are multiple ways to obtain support from within your project.
First, and foremost, in the navigation on the left is a Support link which will open a form to fill-in to create a ticket which will reach your Maintainer.

{: .image-popup}
![Screenshot -- User joined](/management/support/support-link.png)

Secondly, if you happen to trigger a server error while working with Keboola Connection, there will be a button to contact Support in the error alert message.

{: .image-popup}
![Screenshot -- User joined](/management/support/support-error.png)

### Keboola Support Users
It may be the case that in order to solve the issue or to gain context regarding an application exception a technical support member may require access to your project.
By default, Keboola support staff may join your project when requested and they will appear in the Member's list marked by the Keboola badge:

{: .image-popup}
![Screenshot -- User joined](/management/support/users.png)

Keboola Support members will always have MFA enabled, are always accounts that expire, and they are required to have a reason to enter the project.
They also do not count towards the project limits.

### Require Approval for Support Access
Some organizations may prefer to have a starker demarcation for their projects with regard to access by the support team.
To facilitate this transparency we've introduced the ability to require approval for all temporary access by Keboola Support accounts.
The setting can be found in the [organization details](/management/organization/) in the accounts section:

{: .image-popup}
![Screenshot -- User joined](/management/support/organization-allow-auto-join-on.png)

To disable auto-join and require approval for Support accounts, click on the `Change` link to open the dialog and uncheck the Auto Join checkbox.

{: .image-popup}
![Screenshot -- User joined](/management/support/auto-join-modal.png)

The description for Support Access will reflect the current setting.

{: .image-popup}
![Screenshot -- User joined](/management/support/organization-allow-auto-join-off.png)

With auto-join off, a joining support account will require approval by an existing project member in order to gain access.
When a support member requests access each active project member will receive an email notification

{: .image-popup}
![Screenshot -- User joined](/management/support/access-request-mail.png)

The requesting user will appear in the user's list as shown below.  Any active project member can use the links provided in the requesting user's row to either approve or reject the application for access.

{: .image-popup}
![Screenshot -- User joined](/management/support/approve-user-list.png)
