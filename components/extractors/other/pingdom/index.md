---
title: Pingdom
permalink: /components/extractors/other/pingdom/
redirect_from:
    - /extractors/other/pingdom/
---

* TOC
{:toc}

This data source connector helps you import data from [Pingdom](https://www.pingdom.com/).

Pingdom is a service for monitoring the uptime and performance of your servers, websites, and web applications.

## Create a New Application API Key
Before you can start configuring your Pingdom connector, you must obtain an application key. To do that, log in to your account on the [Pingdom](https://www.pingdom.com/) site.

Then, continue to the **Integrations > The Pingdom Api** [section](https://my.pingdom.com/account/appkeys) and click the **Register Application** button.

{: .image-popup}
![Pingdom Api key list](/components/extractors/other/pingdom/03-pingdom-api.png)

Fill in the required fields of the registration form.

- **Application name** -- Name your application -- for example, `Keboola Pingdom Connector`.
- **Description** -- Enter a description.
- **Application type** -- Select the `Public` option.
- **Platform** -- Select the `Server` option.

{: .image-popup}
![Pingdom API registration](/components/extractors/other/pingdom/04-pingdom-api-form.png)

When registration is finished, copy the Application Key and save it. You will need it when creating your connector configuration 
in Keboola.

{: .image-popup}
![Pingdom API key](/components/extractors/other/pingdom/05-pingdom-api-key.png)

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Pingdom** data source.
Provide credentials of your Pingdom account and the Application Key.

- **Email address** -- your account login name
- **Password**
- **Application API key**

{: .image-popup}
![Screenshot - Pingdom Configuration](/components/extractors/other/pingdom/pingdom-1.png)

Choose the **period** you want to fetch data for.

- `Last 24 hours`
- `Last 3O days` -- *Pingdom API provides history only for up to 30 days before the current day*

And finally, select the data **Basic** template and click on **Save**.
You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).

## Extraction Output Tables

### 1 -- Checks

This table contains an overview of all checks:

| Column | Description |
| `id` [PK] | Integer representation of the unique identifier for the check |
| `name` | Check name|
| `type` |  Check type (`tcp`, `https`, `dns`, etc.) |
| `lasterrortime` | Unix timestamp of the last error, in case an error occurs |
| `lasttesttime` | Unix timestamp of the last test, in case the check was already tested |
| `lastresponsetime` | Response time of the last test (in milliseconds) |
| `status` | Current status of the check (`up`, `down`, `unconfirmed_down`, `unknown`, `paused`) |
| `resolution` | Number of minutes, how often should the check be tested |
| `hostname` | Target hostname |
| `use_legacy_notifications` | Use legacy (UP/DOWN) notifications (`1` if enabled) |
| `alert_policy` | Alert policy identifier |
| `alert_policy_name` | Alert policy name |
| `created` | Unix timestamp of check creation |
| `ipv6` | Use ipv6 instead of ipv4 |

### 2 -- Checks-detailed

Detailed information of all checks:

| Column | Description |
| `id` [PK] | Integer representation of the unique identifier for the check |
| `name` | Check name|
| `hostname` | Target hostname |
| `status` | Current status of the check (`up`, `down`, `unconfirmed_down`, `unknown`, `paused`) |
| `resolution` | Number of minutes, how often a check should be tested |
| `sendtoemail` | Send alerts as an email (`1` if enabled) |
| `sendtosms` |  Send alerts as SMS (`1` if enabled) |
| `sendtotwitter` | Send alerts through Twitter (`1` if enabled) |
| `sendtoiphone` | Send alerts to iPhone (`1` if enabled) |
| `sendtoandroid` | Send alerts to Android (`1` if enabled) |
| `sendnotificationwhendown` |  Send notification when down `n` times (integer) |
| `notifyagainevery` | Notify again every `n` result (integer)|
| `notifywhenbackup` | Notify when back up again (`1` if enabled) |
| `lasterrortime` | Unix timestamp of the last error in case an error occurs |
| `lasttesttime` | Unix timestamp of the last test in case the check was already tested |
| `lastresponsetime` | Response time (in milliseconds) of the last test |
| `created` | Unix timestamp of check creation |
| `ipv6` | Use ipv6 instead of ipv4 |

### 3 -- Checks-tags

All checks tags:

| Column | Description |
| `name` | Tag name |
| `type` | Type of the tag (`u` tagged by user, `a` auto tagged by system) |
| `count` | Number of this tag in check |
| `checks_detailed_pk` | Check identifier |

### 4 -- Checks-contacts

This table represents relations between checks and contacts:

| Column | Description |
| `contacts_pk` | Contact identifier |
| `checks_detailed_pk` | Check identifier |

### 5 -- Contacts

All contact data:

| Column | Description |
| `id` [PK] | Integer representation of the unique identifier for the check |
| `name` | Contact name	 |
| `email` | Contact email |
| `cellphone` | Contact cellphone |
| `countryiso` | Cellphone country ISO code |
| `defaultsmsprovider` | Default SMS provider |
| `directtwitter` | Send Twitter messages as Direct Messages |
| `twitteruser` | Twitter username |
| `paused` | `1` if the contact is paused |

### 6 -- Probes

The Pingdom probe servers list:

| Column | Description |
| `id` [PK] | Integer representation of the unique identifier for the probe |
| `name` | Probe name |
| `countryiso` | Country ISO code |
| `city` | City |
| `region` | Region of probe (`NA` for North America, `EU` for Europe, etc) |
| `hostname` | DNS name	 |
| `ip` | IP address |
| `ipv6` | IPV6 address  |
| `active` | `1` if probe currently active |

### 7 -- Results

Raw test results for all checks:

| Column | Description |
| `probes_pk` [PK] | Probe identifier |
| `checks_pk` [PK] | Check identifier |
| `time` [PK] | Time when the test was performed as unix timestamp |
| `status` | Result status (`up`, `down`, `unconfirmed_down`, `unknown`, `paused`) |
| `responsetime` | Response time (in milliseconds) (Will be 0 if no response received) |
| `statusdesc` | Short result status description |
| `statusdesclong` | Long result status description |
| `analysis_pk` | Analysis identifier |

### 8 -- Credits

Information about current plan limits, SMS credits and SMS auto-refilling:

| Column | Description |
| `availablesms` | SMS credits remaining |
| `availablesmstests` | SMS provider tests remaining |
| `autofillsms` | Automatically refill your SMS credits (`1` if enabled) |
| `autofillsms_amount` | Number of credits to refill |
| `autofillsms_when_left` | Automatically refill when `n` SMS credits left |
| `defaultchecklimit` | Checks: Total slots |
| `availabledefaultchecks` | Checks: Remaining free slots |
| `useddefault` | Checks: Number of used slots |

### 9 -- Alerts

Detailed information on generated alerts:

| Column | Description |
| `checks_pk` [PK] | Identifier of the check |
| `contacts_pk` [PK] | Identifier of the alerted contact |
| `time` [PK] | Unix timestamp of alert creation |
| `via` [PK] | Alert medium	(`email`, `sms`, `twitter`, `iphone` or `android`) |
| `contactname` | Name of the alerted contact |
| `status` | Alert status (`sent`, `delivered`, `error`, `notdelivered` or `nocredits`) |
| `messageshort` | A short description of the message |
| `sentto` | Target address, phone number etc. |
| `charged` | `1` if the account was charged for this message |
