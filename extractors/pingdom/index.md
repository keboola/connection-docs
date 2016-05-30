---
title: Pingdom
permalink: /extractors/pingdom/
---

* TOC
{:toc}

This extractor helps you to extract data from [Pingdom](link https://www.pingdom.com/).

Pingdom is service for monitoring the uptime and performance of your websites or web applications

## Configuring Extractor
In the Extractors section, find Pingdom and create new configuration.

{: .image-popup}
![Pingdom New Configuration](/extractors/pingdom/01-new-configuration.png)

### 1 -- Setup API credentials

You must provide credentials of your Pingdom account and App Key

- **Email address** -- It is your account login name to
- **Password**
- **Application API key**

{: .image-popup}
![Pingdom Credentials](/extractors/pingdom/02-credentials.png)

#### Create new Application API key

Log in to you account on [Pingdom](link https://www.pingdom.com/) site

Go to **Integrations / The Pingdom Api** [section](https://my.pingdom.com/account/appkeys) and use **Register application** button

{: .image-popup}
![Pingdom Api key list](/extractors/pingdom/03-pingdom-api.png)

Fill required fields of register form.

- **Application name** -- Set name of your application key, for example: `Keboola Pingdom Extractor`
- **Application description** -- Fill some description
- **Application type** select `Public` option
- **Platform**: select `Server` option

{: .image-popup}
![Pingdom API registration](/extractors/pingdom/04-pingdom-api-form.png)

When registration is finished, copy your key to extractor configuration in KBC

{: .image-popup}
![Pingdom API key](/extractors/pingdom/05-pingdom-api-key.png)

### 2 -- Selecting data

todo

## Extraction Output Tables

### 1 -- Checks

Table contains overview of all checks

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
| `use_legacy_notifications` | ? |
| `alert_policy` | ? |
| `alert_policy_name` | ? |
| `acktimeout` | ? |
| `autoresolve` | ? |
| `created` | Unix timestame of check creation |
| `ipv6` | Use ipv6 instead of ipv4 |

### 2 -- Checks-detailed

Table contains detailed informations of all checks

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the check. |
| `name` | Check name.|
| `hostname` | Target hostname |
| `status` | Current status of check (`up`, `down`, `unconfirmed_down`, `unknown`, `paused`) |
| `resolution` | Number of minutes, how often should the check be tested |
| `sendtoemail` | ? |
| `sendtosms` | ? |
| `sendtotwitter` | ? |
| `sendtoiphone` | ? |
| `sendtoandroid` | ? |
| `sendnotificationwhendown` | ? |
| `notifyagainevery` | ? |
| `notifywhenbackup` | ? |
| `lasterrortime` | If some error was occured, this field will contain the unix timestamp of last error |
| `lasttesttime` | If the check was already tested, this field will contain the unix timestamp of last test |
| `lastresponsetime` | Response time (in milliseconds) of last test |
| `created` | Unix timestame of check creation |
| `ipv6` | Use ipv6 instead of ipv4 |

### 3 -- Checks-tags

Table contains detailed informations of all checks

| Column | Description |
| `name` | ? |
| `type` | ? |
| `count` | ? |
| `checks_detailed_pk` | Use ipv6 instead of ipv4 |

### 4 -- Checks-contacts

Table contains detailed informations of all checks

| Column | Description |
| `contacts_id` | ? |
| `checks_detailed_pk` | ? |

### 5 -- Contacts

Table contains detailed informations of all checks

| Column | Description |
| `id` [PK] | ? |
| `name` | ? |
| `email` | ? |
| `cellphone` | ? |
| `countryiso` | ? |
| `defaultsmsprovider` | ? |
| `directtwitter` | ? |
| `twitteruser` | ? |
| `paused` | ? |

### 6 -- Probes

Table contains detailed informations of all checks

| Column | Description |
| `id` [PK] | ? |
| `country` | ? |
| `city` | ? |
| `name` | ? |
| `active` | ? |
| `hostname` | ? |
| `ip` | ? |
| `countryiso` | ? |
| `ipv6` | ? |
| `region` | ? |

### 7 -- Results

Table contains detailed informations of all checks

| Column | Description |
| `probeid` [PK] | ? |
| `time` [PK] | ? |
| `status` | ? |
| `responsetime` | ? |
| `statusdesc` | ? |
| `statusdesclong` | ? |
| `analysisid` | ? |
| `checks_pk` [PK] | ? |


### 8 -- Credits

Table contains detailed informations of all checks

| Column | Description |
| `checklimit` [PK] | ? |
| `defaultchecklimit` | ? |
| `transactionchecklimit` | ? |
| `availablechecks` | ? |
| `availabledefaultchecks` | ? |
| `availabletransactionchecks` | ? |
| `useddefault` | ? |
| `availablesms` | ? |
| `availablesmstests` | ? |
| `autofillsms` | ? |
| `autofillsms_amount` | ? |
| `autofillsms_when_left` | ? |
| `max_sms_overage` | ? |
| `availablerumsites` | ? |
| `usedrumsites` | ? |
| `maxrumfilters` | ? |
| `maxrumpageviews` | ? |
| `maxalertingfullusers` | ? |
| `availablealertingfullusers` | ? |
| `autofillsms_amount` | ? |


### 9 -- Settings

Table contains detailed informations of all checks

| Column | Description |
| `firstname` | ? |
| `lastname` | ? |
| `company` | ? |
| `description` | ? |
| `email` | ? |
| `billing_email` | ? |
| `phone` | ? |
| `cellphone` | ? |
| `address` | ? |
| `address2` | ? |
| `zip` | ? |
| `location` | ? |
| `state` | ? |
| `vatcode` | ? |
| `accountcreated` | ? |
| `external_reference` | ? |
| `publicreportscode` | ? |
| `settingssaved` | ? |
| `autologout` | ? |
| `numberformatid` | ? |
| `datetimeformatid` | ? |
| `cellphonecountryiso` | ? |
| `phonecountryiso` | ? |
| `country_iso` | ? |
| `country_countryid` | ? |
| `regionid` | ? |
| `timezone_id` | ? |
| `timezone_description` | ? |
| `timezone_timezoneid` | ? |
| `timezone_offset` | ? |
| `dateformat` | ? |
| `timeformat` | ? |
| `numberformat` | ? |
| `numberexample` | ? |
| `publicreports_customdesign` | ? |
| `publicreports_textcolor` | ? |
| `publicreports_backgroundcolor` | ? |
| `publicreports_logourl` | ? |
| `publicreports_months` | ? |
| `publicreports_showoverview` | ? |
| `publicreports_customdomain` | ? |

### 9 -- Alerts

Table contains detailed informations of all checks

| Column | Description |
| `contactname` | ? |
| `contactid` [PK] | ? |
| `checkid` [PK] | ? |
| `time` [PK] | ? |
| `via` [PK] | ? |
| `status` | ? |
| `messageshort` | ? |
| `sentto` | ? |
| `charged` | ? |