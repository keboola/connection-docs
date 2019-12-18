---
title: Organizations
permalink: /management/organization/
---

* TOC
{:toc}

Keboola Connection projects are grouped into **organizations**. Each organization is assigned to a **maintainer** (either Keboola or
Keboola Partner), who is also primarily responsible for L1 support unless agreed otherwise.
[Keboola Connection projects](/management/#project-status), organizations
and maintainers are therefore organized into a hierarchy:

{: .image-popup}
![Screenshot - Project Hierarchy](/management/organization/organizations-maintainers.png)

Although projects, organizations and maintainers form a hierarchy, their users do not. Each unit has a completely
independent set of users. That means organization users are not automatically users of the projects
within organizations and -- vice-versa -- project users are not automatically users of the organization.
This distinction is important, for example when [sharing buckets](/catalog/#sharing-types).

Depending on your contract details and permissions, the `Organizations` feature may or may not be available to you.

{: .image-popup}
![Screenshot - Organizations](/management/organization/organization-1.png)

*Note: If you do not see the `Organizations` section in your account settings,
you are not a member of any organization.*

To see the organization a project is assigned to, go to **Users & Settings** --- the tab
[**Settings**](/management/project/).
<br> To see all organizations you are a member of, go to [**Account Settings**](/management/account/).

{: .image-popup}
![Screenshot - Project Settings](/management/organization/project-detail.png)

## Manage Members
All organization members are full members and as such can **add and remove** other members.
As mentioned above, being a member of a project in an organization does not make you automatically
a member of the organization. That means each organization member has to be added or removed manually.
The same goes for maintainers.

{: .image-popup}
![Screenshot - Organizations Users](/management/organization/organization-2.png)

Newly added organization members get an email confirmation, and if without a Keboola Connection account,
they are [invited to create one](/management/project/users/#new-user).
Removed members receive an email notification.

Apart from adding and removing other members, each organization member is also allowed to do the following:

- Leave the organization; there is no way back without someone else's invitation.
- Leave and re-enter all existing projects in the organization.
- View and edit billing details.
- Manage [shared buckets](/catalog/#sharing-types).
- Create [new projects](#manage-projects).
- Change [organization settings](#organization-settings)
- Allow [Keboola Support](/management/support/#require-approval-for-support-access) to join your projects.

## Manage Projects
To create a new project, click the **New Project** button, enter the project's name and select a **project template**.
Project templates differ mainly in the project expiration time. Some may be subject to billing.

{: .image-popup}
![Screenshot - Organizations Projects](/management/organization/organization-3.png)

## Organization Settings

### Auto Join
Some organizations may prefer to explicitly approve [access](/management/project/users/#who-can-access-a-project) 
to their project by the [support team](/management/support/#require-approval-for-support-access). 
To disable Auto Join and require approval for support accounts, click the **Change** link to modify the settings:

{: .image-popup}
![Screenshot -- Auto Join On](/management/organization/organization-4.png)

Uncheck the **Auto Join** checkbox and **Update** the settings.

{: .image-popup}
![Screenshot -- Auto Join Change](/management/organization/organization-5.png)

The description for support access will reflect the current setting.

{: .image-popup}
![Screenshot -- Auto Join Off](/management/organization/organization-6.png)

### Require MFA
It is possible to set [Multi-factor Authentication](/management/account/#multi-factor-authentication) requirement
for all projects in the organization. When MFA is required for entire organization, users without MFA enabled
can still log in to Keboola Connection, but they cannot access any projects in the organization. The list of users
without MFA is shown when enabling MFA requirement for entire organization.

{: .image-popup}
![Screenshot -- Require MFA](/management/organization/organization-7.png)

The organization page will show that MFA is required:

{: .image-popup}
![Screenshot -- MFA Required](/management/organization/organization-8.png)
