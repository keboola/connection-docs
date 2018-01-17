---
title: Account Management
permalink: /management/account/
---

* TOC
{:toc}

Account management allows you to configure your own account. You can reach account settings from two
places --- either from the Keboola Connection home page:

{: .image-popup}
![Screenshot -- Account Settings](/management/account/account-setting-1.png)

or from any project:

{: .image-popup}
![Screenshot -- Account Settings](/management/account/account-setting-2.png)

At the account settings page you can:

- [Change your password](#changing-password)
- Enable or disable [Multi-factor Authentication](#multi-factor-authentication)
- Review [notifications](#notifications)
- Use [Promo Codes](#promo-codes)
- Create Managment [Tokens](#tokens)
- Work with [organizations and maintainers](/management/organization/)

## Changing Password
To change your password, go to to your account settings and *Account & Security* section.

{: .image-popup}
![Screenshot -- Account Settings](/management/account/change-password.png)

To change your password, you need to enter the old one. Note that it is not possible to change your email address.
The email address is considered as an identifier and cannot be changed, you have to create a new account.

## Multi-factor Authentication
We highly recommend enabling the Multi-factor authentication (MFA) on your account as it greatly increases the account security.
You need to have a device with [Google Authenticator App](https://support.google.com/accounts/answer/1066447?hl=en) or
a compatible MFA application (MFA using SMS is not supported). To enable MFA, go to *Account & Security* and click the Enable MFA button:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 1](/management/account/enable-mfa-1.png)

Setup the [Google Authenticator App](https://support.google.com/accounts/answer/1066447?hl=en), scan the
QR code with your camera and enter the obtained code:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 2](/management/account/enable-mfa-2.png)

Once you click the **Activate** button, the MFA will be enabled. Everytime you login with your email and password, 
you will be prompted to enter the MFA code obtained from your device:

{: .image-popup}
![Screenshot -- Login Page MFA](/management/account/login-3.png)

## Notifications
Notifications are annoucements sent by Keboola employees in case of important platform changes which
are affecting any of your projects. These mostly include deprecation of old components and migration reminders.
All of these changes are announcet in advance at the [Status page](http://status.keboola.com/).
Notifications are also sent when the [project limits](/management/project/limits/) are exceeded.

{: .image-popup}
![Screenshot -- Notifications](/management/account/notifications.png)

At the notifications page, you can mark notifications as read. Unread notification show as a bell with 
red dot in the UI.

## Promo Codes
Promo codes are promotional codes you may receive to create a new project, these are typically used 
for ad-hoc projects, hackatons or PoCs. Promo codes are not applied to existing projects.

{: .image-popup}
![Screenshot -- Promo codes](/management/account/promo-codes.png)

## Tokens
At the *Access Tokens* page, you can create tokens for the [Management API](https://keboolamanagementapi.docs.apiary.io/#). These should not be confused with
[Storage API tokens](/management/project/tokens/) which are used for operations within a project.
Manage tokens are used for project-independent operations such as creating and moving projects, creating organizations and projects monitoring. This means that the manage API offers some features which are 
not available from the UI yet. Unless you need those features or you have other reasons to work with
the Manage API, there is no need to create Manage API token.

To create a Manage API token, click the *New Token* button in *Access Tokens* section:

{: .image-popup}
![Screenshot -- Manage Tokens](/management/account/manage-tokens.png)

Fill in an arbitrary token name and click the *Create Token* button:

{: .image-popup}
![Screenshot -- Create Manage Token](/management/account/manage-token-create.png)

The token will be shown to you, be sure to note it, as there is no way to retrieve a manage token.

{: .image-popup}
![Screenshot -- Manage Token Created](/management/account/manage-token-created.png)

Manage tokens always expire but we also advise you to delete any manage tokens you are not using.
