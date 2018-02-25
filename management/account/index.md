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

On the account settings page, you can do the following:

- [Change your password](#changing-password)
- Enable or disable [multi-factor authentication](#multi-factor-authentication)
- Review [notifications](#notifications)
- Use [promo codes](#promo-codes)
- Create management [tokens](#tokens)
- Work with [organizations and maintainers](/management/organization/)

## Changing Password
To change your password, go to your account settings --- the **Account & Security** section.

{: .image-popup}
![Screenshot -- Account Settings](/management/account/change-password.png)

First you need to enter your old password. Note that you cannot change your email address 
because it is considered as an identifier; you have to create a new account.

## Multi-Factor Authentication
We highly recommend enabling the multi-factor authentication (MFA) on your account as it greatly increases the account security.
You need to have a device with the [Google Authenticator app](https://support.google.com/accounts/answer/1066447?hl=en) or
a compatible MFA application (MFA using SMS is not supported). To enable MFA, go to **Account & Security** and click the **Enable MFA** button:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 1](/management/account/enable-mfa-1.png)

Set up the [Google Authenticator app](https://support.google.com/accounts/answer/1066447?hl=en), scan the
QR code with your camera and enter the obtained code:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 2](/management/account/enable-mfa-2.png)

Once you click the **Activate** button, the MFA will be enabled. Every time you login with your email and password, 
you will be prompted to enter the MFA code obtained from your device:

{: .image-popup}
![Screenshot -- Login Page MFA](/management/account/login-3.png)

## Notifications
Notifications are announcements sent by Keboola employees in case of important platform changes which
are affecting any of your projects. These mostly include deprecation of old components and migration reminders.
All of these changes are announced in advance on the [Status page](http://status.keboola.com/).
Notifications are also sent when the [project limits](/management/project/limits/) are exceeded.

{: .image-popup}
![Screenshot -- Notifications](/management/account/notifications.png)

On the notifications page, you can mark notifications as read. Unread notification show as a bell with a
red dot in the UI.

## Promo Codes
Promo codes are promotional codes you may receive to create a new project. They are not applied to existing 
projects but are typically used for ad hoc projects, hackatons, and PoCs.

{: .image-popup}
![Screenshot -- Promo codes](/management/account/promo-codes.png)

## Tokens
On the **Access Tokens** page, you can create tokens for the [Management API](https://keboolamanagementapi.docs.apiary.io/#). 
Do not confuse them with [Storage API tokens](/management/project/tokens/), which are used for operations 
within a project. Management tokens are used for project-independent operations such as creating and moving projects, 
creating organizations and projects monitoring. This means that the Management API offers some features which are 
not available from the UI yet. Unless you need the features or you have other reasons to work with
the Management API, there is no need to create a Management API token.

To create a Management API token, click the **New Token** button in the **Access Tokens** section:

{: .image-popup}
![Screenshot -- Manage Tokens](/management/account/manage-tokens.png)

Fill in an arbitrary token name and click the **Create Token** button:

{: .image-popup}
![Screenshot -- Create Manage Token](/management/account/manage-token-create.png)

The token will be shown to you. Be sure to note it as there is no way to retrieve a management token.

{: .image-popup}
![Screenshot -- Manage Token Created](/management/account/manage-token-created.png)

Management tokens always expire. However, we also advise you to delete any management tokens you are not using.
