---
title: Mailchimp
permalink: /components/extractors/marketing-sales/mailchimp/
redirect_from:
    - /extractors/marketing-sales/mailchimp/
---

* TOC
{:toc}

The Mailchimp data source connector uses the [Mailchimp API](https://mailchimp.com/developer/) to extract data from
mailing lists sent by the [Mailchimp](https://mailchimp.com/) service. It downloads configured reports for all specified accounts,
importing data such as list and members, campaigns, automations, reports, reports with click details, member activity, etc.

Before you start, have a working [Mailchimp](https://login.mailchimp.com/signup/) account filled with [data](https://us13.admin.mailchimp.com/campaigns/)
and an API key.

## Get API Key
To gain access to the Mailchimp API, log in to [Mailchimp](https://mailchimp.com/), go to your Account detail, and under Extras find the option to [generate your API Key](https://mailchimp.com/help/about-api-keys/).
It will look like this: c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Mailchimp** connector.

Fill in the **data center** for your account, your account **username** and the **API key**:
Optionally name the **storage bucket** where your results will be stored.

To configure what data you want to extract, select the **configuration template** you want to use.

{: .image-popup}
![Mailchimp Configuration](/components/extractors/marketing-sales/mailchimp/mailchimp-1.png)

Available templates:

- List and members -- get lists and their members.
- Campaigns -- get campaign and their feedback.
- Automations -- get automations and the associated emails.
- Reports -- get reports and domain performance.
- Reports with click details -- get reports and domain performance with member click details.
- List member activity -- get lists, their members and activity of each individual member. This template may take some hours to complete.
- All campaigns (all status) -- get campaigns (draft, sent, scheduled, paused).

**Save** the configuration before you run the extraction.

You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).

## API Limits
Each user account is permitted up to 10 simultaneous connections, and you’ll receive an error message if you reach the limit.
Mailchimp does not throttle based on volume.

*Note: currently there are no options to raise that limit on a per-customer basis.*

