---
title: Mailchimp
permalink: /extractors/marketing-sales/mailchimp/
---

* TOC
{:toc}

The Mailchimp extractor uses the [Mailchimp API](http://developer.mailchimp.com/documentation/mailchimp/) to extract data from
mailing lists sent by the [Mailchimp](https://www.mailchimp.com/) service. It downloads configured reports for all specified accounts,
importing data such as list and members, campaigns, automations, reports, reports with click details, member activity, etc.

## Create New Configuration

Before you start, have a working [Mailchimp](https://login.mailchimp.com/signup/) account filled with [data](https://us13.admin.mailchimp.com/campaigns/)
and an API key.

### Get API Key
To gain access to the Mailchimp API, log in to [Mailchimp](https://www.mailchimp.com/), go to your Account detail, and under Extras find the option to [generate your API Key](http://kb.mailchimp.com/integrations/api-integrations/about-api-keys#Find-or-Generate-Your-API-Key).
It will look like this: c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13.

### Set Up Extractor
In the Extractors section, find Mailchimp and create a new configuration. Name it.

{: .image-popup}
![Mailchimp New Configuration](/extractors/marketing-sales/mailchimp/01-new-configuration.png)

Fill in the **data center** for your account, your account **username** and the **API key**:

{: .image-popup}
![Mailchimp API Key](/extractors/marketing-sales/mailchimp/02-api-key.png)

Then name the **storage bucket** where your results will be stored.

{: .image-popup}
![Mailchimp Output Bucket](/extractors/marketing-sales/mailchimp/03-output-bucket.png)

To configure what data you want to extract, select the **configuration template** you want to use.
Or [switch to the JSON editor](https://help.keboola.com/extractors/marketing-sales/mailchimp/#advanced-mode)
for advanced extractions.

{: .image-popup}
![Mailchimp Templates](/extractors/marketing-sales/mailchimp/04-templates.png)

Available templates:

- List and members -- get lists and their members.
- Campaigns -- get campaign and their feedback.
- Automations -- get automations and the associated emails.
- Reports -- get reports and domain performance.
- Reports with click details -- get reports and domain performance with member click details.
- List member activity -- get lists, their members and activity of each individual member. This template may take some hours to complete.
- All campaigns (all status) -- get campaigns (draft, sent, scheduled, paused).

**Save** the configuration before you run the extraction.

## Advanced Mode

For more features, switch the configuration to the Power User Mode by clicking the *Switch to JSON editor* link.
JSON configuration uses the [Generic extractor](https://developers.keboola.com/extend/generic-extractor/) format.

{: .image-popup}
![Mailchimp Advanced Mode](/extractors/marketing-sales/mailchimp/05-advanced-mode.png)

If you select a campaign (let's say *Reports*) and want to specify more details using the advanced mode, don't forget to click
**Save** first. The code will be pre-filled based on that particular template.

{: .image-popup}
![Mailchimp Advanced Mode pre-filled](/extractors/marketing-sales/mailchimp/06-prefilled-JSON.png)

## API Limits
Each user account is permitted up to 10 simultaneous connections, and you’ll receive an error message if you reach the limit.
Mailchimp does not throttle based on volume.

*Note: currently there are no options to raise that limit on a per-customer basis.*

