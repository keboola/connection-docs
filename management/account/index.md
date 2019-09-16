---
title: Account Management
permalink: /management/account/
---

* TOC
{:toc}

Account management allows you to configure your own account.
You can reach your account settings from two places:

1. Keboola Connection home page
2. Projects

Go to the Keboola Connection home page and select **Account Settings** in the little drop down box on the right:

{: .image-popup}
![Screenshot -- Account Settings](/management/account/account-setting-1.png)

Or, find the **Account Settings** page from any of your projects:

{: .image-popup}
![Screenshot -- Account Settings](/management/account/account-setting-2.png)

On the **Account Settings** page, you can do the following:

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

First you need to enter your old password. Remember you cannot change your email address
because it is considered an identifier; you have to create a new account.

## Multi-Factor Authentication
We highly recommend enabling the multi-factor authentication (MFA) on your account, as it greatly increases its security.

We support two types of MFA: 

1. **Time-based one-time password** (TOTP) --- a **software**-based authentication technique. 
When logging into a site supporting TOTP, the authenticator app generates a six-digit one-time password 
that you must enter in addition to your usual login details. You can use a phone or another device 
as a virtual multi-factor authentication (TOTP) device. Follow the [instructions](#totp-multi-factor-authentication). 

2. **Universal 2nd Factor** (U2F) --- a **hardware** device. When signing in, activate your security key as suggested in 
its documentation (e.g., by pressing a button) rather than typing in a verification code.
For using security keys, use the [FIDO U2F](https://fidoalliance.org/) standard.
Follow the [instructions](#u2f-multi-factor-authentication).

### TOTP 
[TOTP](https://en.wikipedia.org/wiki/Time-based_One-time_Password_algorithm)
is **software-based authentication**. 
You need to have a device with the [Google Authenticator app](https://support.google.com/accounts/answer/1066447?hl=en) or
a compatible MFA application (MFA using SMS is not supported). To enable MFA, go to **Account & Security** and 
click the **Enable MFA** button:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 1](/management/account/enable-mfa-1.png)

Then click on **Enable TOTP**:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 2](/management/account/enable-totp-1.png)

Set up the [Google Authenticator app](https://support.google.com/accounts/answer/1066447?hl=en), scan the
QR code with your camera, and enter the obtained code:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 3](/management/account/enable-mfa-2.png)

Once you click the **Activate** button, the MFA will be enabled. You can then download the MFA
**Recovery Codes** or reconfigure the MFA to another device:

{: .image-popup}
![Screenshot -- MFA Enabled](/management/account/enable-mfa-3.png)

Every time you log in with your email and password,
you will be prompted to enter the MFA code obtained from your device:

{: .image-popup}
![Screenshot -- Login Page MFA](/management/account/login-3.png)

### U2F 
[U2F](https://en.wikipedia.org/wiki/Universal_2nd_Factor) is **a hardware device** that can be used as your second factor 
of authentication. It currently works on most modern browsers:
<table>
  <tr>
    <td>Browser:</td>
    <td>Chrome</td>
    <td>Firefox</td>
    <td>Opera</td>
    <td>Safari</td>
    <td>Edge</td>
    <td>IE</td>
  </tr>
  <tr>
    <td>Supported version:</td>
    <td> >= 41 </td>
    <td> >= 67 </td>
    <td> >= 42 </td>
    <td> Not Supported </td>
    <td> Not Supported </td>
    <td> Not Supported </td>
  </tr>
</table>

When signing in, press the button on the device rather than typing in a verification code.
Security keys use the [FIDO U2F](https://fidoalliance.org/) standard.

To enable U2F, go to **Account & Security** and click the **Enable MFA** button:

{: .image-popup}
![Screenshot -- Enable MFA -- Step 1](/management/account/enable-mfa-1.png)

Then click the **Enable U2F** button:

{: .image-popup}
![Screenshot -- Enable U2F -- Step 2](/management/account/enable-u2f-1.png)

Enter a **name** for your U2F device and click **Add**: 

{: .image-popup}
![Screenshot -- Enable U2F -- Step 3](/management/account/enable-u2f-2.png)

Then activate your security key as recommended in its documentation (e.g., press the button):

{: .image-popup}
![Screenshot -- Enable U2F -- Step 4](/management/account/enable-u2f-3.png)

Once you are redirected, you will get the following notification: `The new u2f device "my-u2f-device" was added.` 
You will also see that `Multi-factor authentication is enabled` and that `You have configured 1 device`:

{: .image-popup}
![Screenshot -- Enable U2F -- Step 5](/management/account/enable-u2f-4.png)

You can manage your **U2F devices** when clicking on **View or change settings**:

{: .image-popup}
![Screenshot -- Enable U2F -- Step 6](/management/account/enable-u2f-5.png)

Every time you log in with your email and password, you will be asked to activate your security key.
To do that, follow the key's documentation (e.g., press the button):

{: .image-popup}
![Screenshot -- Enable U2F -- Step 7](/management/account/enable-u2f-6.png)

## Invitations
The **Invitations** page shows a project or a list of projects you have been [invited](/management/project/users/#inviting-a-user) to.
When you accept an invitation, you'll become a user of the project and will be redirected there. 
When you decline the invitation, you'll lose the opportunity to enter the project.

{: .image-popup}
![Screenshot -- Promo codes](/management/account/invitations.png)

## Tokens
On the **Access Tokens** page, you can create tokens for the [Management API](https://keboolamanagementapi.docs.apiary.io/#).
Do not confuse them with [Storage API tokens](/management/project/tokens/), which are used for operations
within a project. Management tokens are used for project-independent operations such as creating and moving projects,
creating organizations and projects monitoring. This means that the Management API offers some features which are
not available from the UI yet. Unless you need the features or have other reasons to work with
the Management API, there is no need to create a management token.

To create a management token, click the **New Token** button in the **Access Tokens** section:

{: .image-popup}
![Screenshot -- Manage Tokens](/management/account/manage-tokens.png)

Fill in an arbitrary token name and click the **Create Token** button:

{: .image-popup}
![Screenshot -- Create Manage Token](/management/account/manage-token-create.png)

The token will be shown to you.

**Important:** Be sure to note it --- it cannot be retrieved!

{: .image-popup}
![Screenshot -- Manage Token Created](/management/account/manage-token-created.png)

Despite the fact that management tokens always expire, we advise you to delete the ones you are not using.

## Notifications
Notifications are announcements sent by Keboola employees in case of important platform changes which
are affecting any of your projects. These mostly include deprecation of old components and migration reminders.
All of these changes are announced in advance on the [status page](http://status.keboola.com/).
Notifications are also sent when the [project limits](/management/project/limits/) are exceeded.

{: .image-popup}
![Screenshot -- Notifications](/management/account/notifications.png)

On the **Notifications** page, you can mark notifications as read. Unread notifications show as a bell with a
red dot.

## Promo Codes
You may receive promotional codes to create a new project. They are not applied to existing
projects but are typically used for ad-hoc projects, hackathons, and PoCs.

{: .image-popup}
![Screenshot -- Promo codes](/management/account/promo-codes.png)
