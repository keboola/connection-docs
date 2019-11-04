---
title: Slack
permalink: /extractors/communication/slack/
---

* TOC
{:toc}

The Slack extractor uses the [Slack API](https://api.slack.com/methods) to fetch data from [Slack](https://slack.com/)
and to bring it to Keboola Connection (KBC).

## Create New Configuration
Find Slack in the list of extractors and create a new configuration. Name it (you can change the name any time).

{: .image-popup}
![Slack New Configuration](/extractors/communication/slack/01-new-configuration.png)

## Authorize Slack Account
Click **Authorize Account** to be redirected to Slack, and authorize the extractor to access a Slack account.

{: .image-popup}
![Slack Authorization](/extractors/communication/slack/02-authorization.png)

Select one of the two authorization methods:

{: .image-popup}
![Slack Authorization Types](/extractors/communication/slack/03-authorization.png)

 - **Instant** -- Use this if you have access to a Slack account; the authorization will be done immediately.
 - **External** -- If you need to authorize access to the service from someone who does not have an account in KBC,
 you can generate an external link, which will guide them through this process.

## Configuration Templates
To configure what data you want to extract, you can either select one of the configuration templates or switch to the JSON editor
for advanced extractions.

{: .image-popup}
![Slack Configuration Templates](/extractors/communication/slack/04-templates.png)

Select the template you wish to use:

- Smart Mode -- using this mode you always get just missing data (recommended), loads data [incrementally](/storage/tables/#incremental-loading)
- Full Mode -- using this mode you always get everything

You can download:

- Users
- Channels
- Messages

After you select one of the two templates, remember to **save** the configuration.

## Advanced Mode
For more features, switch the configuration to the Power User Mode by clicking the Switch to JSON editor link.
JSON configuration uses the [Generic extractor](https://developers.keboola.com/extend/generic-extractor/) format.

{: .image-popup}
![Slack Switch to JSON](/extractors/communication/slack/05-json.png)

