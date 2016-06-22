---
title: Pingdom
permalink: /extractors/pingdom/
---

* TOC
{:toc}

This extractor helps you extract data from [Pingdom](https://www.pingdom.com/).

Pingdom is a service for monitoring the uptime and performance of your websites or web applications.

## Configuring Extractor
Before you start, have a working Pingdom account and get a Pingdom API Key.

#### Create new Application API key

Log in to your account on the [Pingdom](https://www.pingdom.com/) site.

Go to **Integrations / The Pingdom Api** [section](https://my.pingdom.com/account/appkeys) and use the **Register application** button.

{: .image-popup}
![Pingdom Api key list](/extractors/pingdom/03-pingdom-api.png)

Fill the required fields of the registration form.

- **Application name** -- Set the name of your application key, for example: `Keboola Pingdom Extractor`
- **Application description** -- Fill some description
- **Application type** select the `Public` option
- **Platform**: select the `Server` option

{: .image-popup}
![Pingdom API registration](/extractors/pingdom/04-pingdom-api-form.png)

When registration is finished, take not of the Application Key, which you will use when creating an extractor configuration in KBC.

{: .image-popup}
![Pingdom API key](/extractors/pingdom/05-pingdom-api-key.png)

### Setup Extractor
In the Extractors section, find Pingdom and create a new configuration.

{: .image-popup}
![Pingdom New Configuration](/extractors/pingdom/01-new-configuration.png)


Provide credentials of your Pingdom account and Application Key.

- **Email address** -- It is your account login name
- **Password**
- **Application API key**

{: .image-popup}
![Pingdom Credentials](/extractors/pingdom/02-credentials.png)

### Select data

Choose one of the **data periods** to start fetching data for

- `24 hours ago`;
- `Last 3O days` -- *Pingdom API provides history only for up to 30 days before the current day*

Finally, select one of the data mapping **templates** and click on **Save configuration**.

{: .image-popup}
![Pingdom Data Mapping](/extractors/pingdom/06-template.png)


## Extraction Output Tables

### 1 -- Checks

This table contains overview of all checks:

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the check. |
| `name` | Check name.|
| `type` |  Type of the check (`tcp`, `https`, `dns`, etc.) |
| `lasterrortime` | If some error was occured, this field will contain the unix timestamp of last error |
| `lasttesttime` | If the check was already tested, this field will contain the unix timestamp of last test |
| `lastresponsetime` | Response time (in milliseconds) of last test |
| `status` | Current status of check (`up`, `down`, `unconfirmed_down`, `unknown`, `paused`) |
| `resolution` | Number of minutes, how often should the check be tested |
| `hostname` | Target hostname |
| `use_legacy_notifications` | Use legacy (UP/DOWN) notifications (`1` if enabled) |
| `alert_policy` | Alert policy identifier |
| `alert_policy_name` | Alert policy name |
| `created` | Unix timestame of check creation |
| `ipv6` | Use ipv6 instead of ipv4 |

### 2 -- Checks-detailed

This table contains detailed information of all checks:

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the check |
| `name` | Check name.|
| `hostname` | Target hostname |
| `status` | Current status of check (`up`, `down`, `unconfirmed_down`, `unknown`, `paused`) |
| `resolution` | Number of minutes, how often should the check be tested |
| `sendtoemail` | Send alerts as email (`1` if enabled) |
| `sendtosms` |  Send alerts as SMS (`1` if enabled) |
| `sendtotwitter` | Send alerts through Twitter (`1` if enabled) |
| `sendtoiphone` | Send alerts to iPhone (`1` if enabled) |
| `sendtoandroid` | Send alerts to Android (`1` if enabled) |
| `sendnotificationwhendown` |  Send notification when down `n` times (integer) |
| `notifyagainevery` | Notify again every `n` result (integer)|
| `notifywhenbackup` | Notify when back up again (`1` if enabled) |
| `lasterrortime` | If some error was occurred, this field will contain the unix timestamp of last error |
| `lasttesttime` | If the check was already tested, this field will contain the unix timestamp of last test |
| `lastresponsetime` | Response time (in milliseconds) of last test |
| `created` | Unix timestamp of check creation |
| `ipv6` | Use ipv6 instead of ipv4 |

### 3 -- Checks-tags

The table contains a list of all checks tags:

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

This table contains all contact data:

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the check |
| `name` | Contact name	 |
| `email` | Contact email |
| `cellphone` | Contact cellphone |
| `countryiso` | Cellphone country ISO code |
| `defaultsmsprovider` | Default SMS provider |
| `directtwitter` | Send Twitter messages as Direct Messages |
| `twitteruser` | Twitter username |
| `paused` | `1` if contact is paused |

### 6 -- Probes

The Pingdom probe servers list:

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the probe |
| `name` | Probe name |
| `countryiso` | Country ISO code |
| `city` | City |
| `region` | Region of probe (`NA` for North America, `EU` for Europe, etc) |
| `hostname` | DNS name	 |
| `ip` | IP address |
| `ipv6` | IPV6 address  |
| `active` | `1` if is  the probe currently active |

### 7 -- Results

This table contains raw test results for all checks:

| Column | Description |
| `probes_pk` [PK] | Probe identifier |
| `checks_pk` [PK] | Check identifier |
| `time` [PK] | Time when test was performed as unix timestamp |
| `status` | Result status (`up`, `down`, `unconfirmed_down`, `unknown`, `paused`) |
| `responsetime` | Response time (in milliseconds) (Will be 0 if no response was received) |
| `statusdesc` | Short result status description |
| `statusdesclong` | Long result status description |
| `analysis_pk` | Analysis identifier |

### 8 -- Credits

This table has information about current plan limits, SMS credits and SMS auto-refilling:

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

This table contains detailed information on generated alerts:

| Column | Description |
| `checks_pk` [PK] | Identifier of check |
| `contacts_pk` [PK] | Identifier of alerted contact |
| `time` [PK] | Unix timestamp of alert creation |
| `via` [PK] | Alert medium	(`email`, `sms`, `twitter`, `iphone` or `android`) |
| `contactname` | Name of alerted contact |
| `status` | Alert status (`sent`, `delivered`, `error`, `notdelivered` or `nocredits`) |
| `messageshort` | Short description of message |
| `sentto` | Target address, phone number etc. |
| `charged` | `1` if account was charged for this message |
