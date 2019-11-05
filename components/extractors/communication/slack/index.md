---
title: Slack
permalink: /components/extractors/communication/slack/
redirect_from:
    - /extractors/communication/slack/
---

* TOC
{:toc}

The Slack extractor uses the [Slack API](https://api.slack.com/methods) to fetch data from [Slack](https://slack.com/)
and to bring it to Keboola Connection.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Slack** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Select the template you wish to use:

- Smart Mode -- using this mode you always get just missing data (recommended), loads data [incrementally](/storage/tables/#incremental-loading)
- Full Mode -- using this mode you always get everything

You can download:

- Users
- Channels
- Messages

After you select one of the two templates, remember to **save** the configuration.

{: .image-popup}
![Slack Configuration](/components/extractors/communication/slack/slack-1.png)

You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).
