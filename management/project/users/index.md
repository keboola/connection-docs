---
title: Project Users
permalink: /management/project/users/
redirect_from:
  - /management/users/
---

* TOC
{:toc}

To be able to work with KBC, each user needs the following:

- Platform wide KBC account
- Access to a specific project

Once users can access a project, they gain full administrative access to that project. 
Each user is, system-wide, **identified by their email address**.
This means that you need to enter correct email addresses for existing users. 
Be especially careful about company aliases; from KBC's point of view, they are different users.

All operations done by a user are technically done using the 
[master token](/management/project/tokens/#master-tokens). This is important for 
[tracing operations](/management/project/tokens/#token-events) done by that user.

## Inviting a User
If you want to add a new user to the project, go to **Users & Settings** in the project and 
click the **Add new user** button:

{: .image-popup}
![Screenshot -- User list](/management/project/users/users-list-1.png)

Enter the user's email:

{: .image-popup}
![Screenshot -- User list](/management/project/users/invite-project-1.png)

The user is added to the project:

{: .image-popup}
![Screenshot -- User list with added user](/management/project/users/users-list-2.png)

### New User
If the user does not yet have a platform wide KBC account, their user list names will be shown as 
`Not activated yet` and they will receive an invitation email:

{: .image-popup}
![Screenshot -- Invitation email to create account](/management/project/users/invite-project-2.png)

When they follow the link, they will be taken to the activation form:

{: .image-popup}
![Screenshot -- Activation form](/management/project/users/register-2.png)

After that, the users will be taken to the [login form](/management/project/users/#authen
tication). They can immediately login to KBC 
and see the project they have been invited to.
In the User list, you will see their chosen screen name:

{: .image-popup}
![Screenshot -- User joined](/management/project/users/users-list-3.png)

### Existing User
If the added user already has a KBC account, you will immediately see their screen name in the user list:

{: .image-popup}
![Screenshot -- User joined](/management/project/users/users-list-3.png)

Verify the screen name if you intend to invite an existing user. 
If you see `Not activated yet` instead of the screen name, it means that there is no KBC account associated with the email address. 
The user can then immediately enter the project, and they will also receive an email invitation:

{: .image-popup}
![Screenshot -- Invitation email to create account](/management/project/users/invite-project-3.png)

The link will simply take them to the login form (or the project list if already logged in).

## Registering Manually
It is also possible to create a KBC account manually by following the [Sign Up](https://connection.keboola.com/admin/auth/register) link
from the login page:

{: .image-popup}
![Screenshot -- Registration link](/management/project/users/register-0.png)

Then fill the registration form:

{: .image-popup}
![Screenshot -- Registration form](/management/project/users/register-1.png)

You will then receive a confirmation email with a link to activate the new KBC account.

{: .image-popup}
![Screenshot -- Confirmation email](/management/project/users/register-3.png)

If you have a Gmail account, go to the login page and then straight to *Sign in with Google*:

{: .image-popup}
![Screenshot -- Login Page](/management/project/users/login-1.png)

Once you authorize KBC in your Google account, a KBC account will be created for you automatically.

**Important:** If you register to KBC manually, you cannot actually do anything unless someone invites you to a project.

{: .image-popup}
![Screenshot -- Project list](/management/project/users/project-list.png)

## Removing a User
You may remove a user from a project by clicking the **Remove** button in the user list. 
The user will receive a notification email about being removed from the project. 
The removal is effective immediately. Any following operations will 
be unauthorized, regardless of whether the use was currently logged in or not.
Removing a user from a project has no effect on the data in the project; 
everything that particular user did in the project stays untouched. 
You can also leave a project voluntarily by pressing the **Leave** button. 

**Important:** However, you will not be able to re-join the project unless someone invites you again.

## Authentication
There are three options for authenticating a KBC account:

- Google account
- Combination of an email address and a chosen password
- Combination of an email address and a chosen password with multi-factor authentication

The options are described in detail below.

### Google Account
If you have a Google Account (Gmail), you can use it to authenticate to KBC. 
Simply click the respective button on the login page

{: .image-popup}
![Screenshot -- Login Page](/management/project/users/login-1.png)

and follow the Google instructions to authorize KBC. 
No configuration in KBC is necessary to enable Google Account login.
Bear in mind, however, that the Google Account email must match the email you are using in KBC.

### Multi-Factor Authentication 
Enable multi-factor authentication (MFA) in your [account settings](/management/account/#multi-factor-authentication).
You can review the state of MFA for any user in the user list:

{: .image-popup}
![Screenshot -- User joined](/management/project/users/users-list-3.png)

## Authorization
All users listed on the **Users & Settings** page are project administrators. 
This means they can do all operations within the project. If you need to limit authorization 
to certain operations or data, there are two options to choose from:

1. Split the project into multiple projects, or
2. Use [Storage Tokens](/management/project/tokens/) instead of full user accounts.
