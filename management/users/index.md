---
title: Users
permalink: /management/users/
---

* TOC
{:toc}

To be able to work with KBC, each user needs

- Platform wide KBC account
- Access to a specific project

Once users can access a project, they gain full administrative access to that project. 
Each user is, system-wide, **identified by their email address**.
This means that you need to enter correct email addresses for existing users. 
Be especially careful about company aliases; from KBC point of view, they are different users.

## Inviting a User
If you want to add a new user to the project, go to the **Users & Settings** page in the project and 
click the **Add new user** button:

{: .image-popup}
![Screenshot -- User list](/management/users/users-list-1.png)

Enter the user's email:

{: .image-popup}
![Screenshot -- User list](/management/users/invite-project-1.png)

The user is added to the project:

{: .image-popup}
![Screenshot -- User list with added user](/management/users/users-list-2.png)

### New User
If the user does not yet have a platform wide KBC account, their user list names will be shown as 
`Not activated yet` and they will receive an invitation email:

{: .image-popup}
![Screenshot -- Invitation email to create account](/management/users/invite-project-2.png)

When they follow the link, they will be taken to an activation form:

{: .image-popup}
![Screenshot -- Activation form](/management/users/register-2.png)

After that the users will be taken to the [login form](todo) and they can immediately login to KBC 
and see the project they have been invited to.
In the User list, you will see their chosen screen name:

{: .image-popup}
![Screenshot -- User joined](/management/users/users-list-3.png)

### Existing User
If the added user already has a KBC account, you will immediately see their screen name in the user list:

{: .image-popup}
![Screenshot -- User joined](/management/users/users-list-3.png)

Verify the screen name if you intend to invite an existing user. 
If you see `Not activated yet` instead of the screen name, it means that there is no KBC account associated with the email address. 
The user can than immediately enter the project and they will also receive an email invitation:

{: .image-popup}
![Screenshot -- Invitation email to create account](/management/users/invite-project-3.png)

The link will simply take them to the login form (or the project list if already logged in).

## Registering Manually
It is also possible to create a KBC account manually by following the [Sign Up](https://connection.keboola.com/admin/auth/register) link
from the login page:

{: .image-popup}
![Screenshot -- Registration link](/management/users/register-0.png)

Then fill the registration form:

{: .image-popup}
![Screenshot -- Registration form](/management/users/register-1.png)

You will then receive a confirmation email with a link to activate the new KBC account.

{: .image-popup}
![Screenshot -- Confirmation email](/management/users/register-3.png)

If you have a Gmail account, then simply go the login page and then straight to *Sign in with Google*:

{: .image-popup}
![Screenshot -- Login Page](/management/users/login-1.png)

Once you authorize KBC in your Google account, a KBC account will be created for you automatically.

**Important:** If you register to KBC manually, you cannot actually do anything unless someone invites you to a project.

{: .image-popup}
![Screenshot -- Project list](/management/users/project-list.png)

## Removing a User
You may remove a user from a project by clicking the **Remove** button in the user list. 
The user will receive a notification email about being removed from the project. 
Removing a user from a project has no effect on the data in the project; 
everything that particular user did in the project stays untouched. 
You can also leave a project voluntarily by pressing the **Leave** button. 

**Important:** However, you will not be able to re-join the project unless someone invites you again.

## Authentication
There are three options to KBC account authentication:

- google account
- combination of an email address and a chosen password
- combination of an email address and a chosen password with Multi-factor authentication

### Using Google Account
If you are using Google Account (Gmail), then you can use to to authenticate to KBC. 
Simply use the respective button on the login page

{: .image-popup}
![Screenshot -- Login Page](/management/users/login-1.png)

and follow the Google instructions to authorize KBC. 
No configuration in KBC is necessary to enable Google Account login.
Bear in mind, however, that the Google Account email must match the email you are using in KBC.

### Using Multi-factor Authentication (MFA)
We highly recommend enabling the Multi-factor authentication on your account as it greatly increases the account security.
You need to have a device with [Google Authenticator App](https://support.google.com/accounts/answer/1066447?hl=en) or
a compatible MFA application. To enable MFA, go to Account Settings either from the project list

{: .image-popup}
![Screenshot -- Account Settings](/management/users/profile-setting-1.png)

or from the project detail:

{: .image-popup}
![Screenshot -- Account Settings](/management/users/profile-setting-2.png)

Click the Enable MFA button:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 1](/management/users/enable-mfa-1.png)

Setup the [Google Authenticator App](https://support.google.com/accounts/answer/1066447?hl=en), scan the
QR code with your camera and enter the obtained code:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 2](/management/users/enable-mfa-2.png)

Once you click the **Activate** button, the MFA will be enabled. After you login with your email and password, 
you will be prompted to enter the MFA code obtained from your device:

{: .image-popup}
![Screenshot -- Login Page MFA](/management/users/login-3.png)

You can review the state of MFA for any user in the user list:

{: .image-popup}
![Screenshot -- User joined](/management/users/users-list-3.png)

### Keboola Users
When requested, Keboola employees may join your project without being formally invited by you through the *Users & Setting* page.
Keboola employees may enter your project only in response to a support ticket and they are marked by the Keboola badge:

{: .image-popup}
![Screenshot -- User joined](/management/users/users-list-5.png)

Keboola Support users are always expiring accounts, have a reason to enter the project and they have MFA enabled. 
Keboola Support users do not count towards the project limits.

## Authorization
All users listed in the *Users & Settings* page are project administrators which means they can do all operations
within that project. If you need to limit authorization to certain operations or data, there are two options:

1. Use [Storage Tokens](/storage/tokens/) instead, or
2. Split the project into multiple projects.
