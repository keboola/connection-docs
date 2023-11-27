---
title: Project Users
permalink: /management/project/users/
redirect_from:
  - /management/users/
---

* TOC
{:toc}

To be able to work with Keboola Connection, each user needs to have the following:

- Platform-wide Keboola Connection account
- Access to a specific project

Each user is, system-wide, **identified by their email address**.
This means that you need to enter correct email addresses for existing users.
Be especially careful about company aliases; from Keboola Connection's point of view, they are different users.

All operations performed by a user are technically done using the
[master token](/management/project/tokens/#master-tokens). This is important for
[tracing operations](/management/project/tokens/#token-events) done by that user.

## User Roles

There are four user roles available:

- **Share** -- the user has full administrative access to the project, including sharing data in the [Data Catalog](/catalog/).
    _Note: The Share role can only be granted by an [organization member](/management/organization/)._
- **Admin** -- the user has full administrative access to the project.
- **Guest** -- the user can access all project data, but **cannot** 
    - change project settings _(name, description, etc.)_,
    - delete the project,
    - manage users,
    - manage [API tokens](/management/project/tokens/),
    - permanently remove configurations in [Trash](/components/#delete-configuration),
    - create a new [orchestration](/orchestrator/), 
    - create an external authorization link, and
    - change the name, the schedule and the disabled status of an existing orchestration.
- **ReadOnly** -- the user can view all project data, but **cannot**
    - create, modify or delete configurations of [components](/components/), [orchestrations](/orchestrator/) and [transformations](/transformations/),
    - run any components, orchestrations and transformations,
    - import and modify data in [Storage](/storage/),
    - use [Data Catalog](/catalog/),
    - change project settings _(name, description, etc.)_,
    - create an external authorization link,
    - delete the project,
    - manage users, and
    - manage [API tokens](/management/project/tokens/).
- **Developer** -- the user can write to any development branch but **cannot**
    - **edit** the production branch.
- **Reviewer** -- the user extends the Developer role with the right to
    - **approve** merge requests (except for their own requests).
- **Production Manager** -- the user has following rights:
    - **merge** the merge requests.
    - **manage** configuration state in the production branch.
    - **link/unlink**  a bucket.
    - **manage** production credentials (in variable storre).
    - **manage** triggers.
    - **run** jobs.
    - **manage** notifications (for flows).
    - but **cannot make changes** in development branches (edit configurations etc.).

_Note: The ReadOnly role is currently available on all stacks for projects with feature `queuev2`_

_Note: The Developer, Reviewer and Production Manager roles are currently only available when the feature of Governed Change Management is active._

_Note: If the production manager is also an organization admin, they can invite new members to the project and assign them the production manager role._


## Inviting User
If you want to add a new user to the project, go to **Users & Settings** in the project and
click the **Invite User** button:

{: .image-popup}
![Screenshot -- User list](/management/project/users/users-list-1.png)

Enter the user's email and grant them a role in the project:

{: .image-popup}
![Screenshot -- User list](/management/project/users/invite-project-1.png)

The user is listed among the project users with a pending invitation.

{: .image-popup}
![Screenshot -- User list with invitation](/management/project/users/users-list-2.png)

If you delete an invitation before it is accepted by the invitee or if the invitee declines it, 
they will never become a member of the project.
The steps that follow an invitation differ depending on whether the user already exists or is new.

### New User
If the user does not have a platform-wide Keboola Connection account yet, their name in the user list will be
labelled as `Not activated yet`:

{: .image-popup}
![Screenshot -- User invited](/management/project/users/users-list-4.png)

They will receive an invitation email:

{: .image-popup}
![Screenshot -- Invitation email to create account](/management/project/users/invite-project-2.png)

When they click the **Activate Your Account** button, they will be taken to the activation form:

{: .image-popup}
![Screenshot -- Activation form](/management/project/users/register-2.png)

After filling it in, the [login form](/management/project/users/#authentication) appears.
They can immediately login to Keboola Connection and see their invitation to the project they have been invited to.
Once they accept it, you will see their chosen screen name in the user list:

{: .image-popup}
![Screenshot -- User joined](/management/project/users/users-list-3.png)

### Existing User
If the added user already has a Keboola Connection account, you will see their screen name in the user list right away:

{: .image-popup}
![Screenshot -- User joined](/management/project/users/users-list-2.png)

*Note: If you intend to invite an existing user, it is a good idea to verify the screen name.
If you see `Not activated yet` instead of the screen name, it means that there is no Keboola Connection account associated with the email address.*

The user will receive an email invitation:

{: .image-popup}
![Screenshot -- Invitation email to create account](/management/project/users/invite-project-3.png)

The link leads to the [account settings](/management/account/) where the user can see their pending invitations:

{: .image-popup}
![Screenshot -- Invitations on account settings](/management/project/users/invitation-2.png)

Invitations are also shown on the welcome screen with the project list:

{: .image-popup}
![Screenshot -- Invitations on project list](/management/project/users/invitation-1.png)

Until the user accepts the invitation, they are not allowed to enter the project:

{: .image-popup}
![Screenshot -- Project access denied](/management/project/users/invitation-3.png)

Once the invitation is accepted, the user becomes a member of the project:

{: .image-popup}
![Screenshot -- User joined](/management/project/users/users-list-3.png)

## Removing User
You may remove a user from a project by clicking the **Remove** button in the user list.
The user will receive a notification email about being removed from the project.
The removal is effective immediately. Any following operations will
be unauthorized, regardless of whether the user will be logged in at the moment or not.
Removing a user from a project has no effect on the data in it;
everything the particular user did there stays untouched.
You can also leave a project voluntarily by pressing the **Leave** button.

**Important:** However, you will not be able to re-join the project unless
someone invites you again or unless you are a member of the project [organization](/management/organization/).

## Who Can Access Project
It is important to understand the concept of [organizations](/management/organization/) to asses what persons might be able to
access a specific project. For a quick overview, here is a complete list of persons able to access a given project:

- Active users of the project (listed on the *Users* tab of the *Settings* page)
- Users invited to the project (listed on the *Users* tab of the *Settings* page with the note **Invited**)
- Users of the [organization](/management/organization/) to which the project belongs
- Users of the [maintainer](/management/organization/) to which the project organization belongs, provided that [**Auto Join**](/management/support/#require-approval-for-support-access) is **enabled**
- Keboola support staff, provided that [**Auto Join**](/management/support/#require-approval-for-support-access) is **enabled**

No other user can enter the project. If Auto Join is disabled, maintainer users and Keboola Support staff can
see the name of the project and request access which must be approved by a current member of the project.

## Authentication
There are three options for authenticating a Keboola Connection account:

- Google account
- Combination of an email address and the associated password
- Combination of an email address and the associated password with multi-factor authentication

The options are described in detail below.

### Google Account
If you have a Google Account (Gmail), you can use it to authenticate to Keboola Connection.
Click the respective button on the login page:

{: .image-popup}
![Screenshot -- Login Page](/management/project/users/login-1.png)

Then follow the Google instructions to authorize Keboola Connection.
No configuration in Keboola Connection is necessary to enable Google Account login.
Bear in mind, however, that the Google Account email must match the email you are using in Keboola Connection.

### Multi-Factor Authentication
Enable multi-factor authentication (MFA) in your [account settings](/management/account/#multi-factor-authentication).
You can review the state of MFA for any user in the user list:

{: .image-popup}
![Screenshot -- User joined](/management/project/users/users-list-3.png)

## Authorization
All users listed on the **Users & Settings** page are project administrators.
This means they can perform all operations within the project. If you need to limit authorization
to certain operations or data, there are two options to choose from:

1. Split the project into multiple projects.
2. Use [Storage Tokens](/management/project/tokens/) instead of full user accounts.
