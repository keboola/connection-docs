---
title: Slack
slug: 'components/extractors/communication/slack'
description: 'Fetch Slack users, channels and messages into Keboola after you authorize, in Smart Mode for incremental loads or Full Mode for everything.'
redirect_from:
    - /extractors/communication/slack/
---



The connector calls the [Slack API](https://api.slack.com/methods).

<!-- How-to-type page. Source: keboola/connection-docs history; classified 2026-10-13. -->

## Create New Configuration
[Create a new configuration](/components/configurations/#create-a-configuration) of the **Slack** connector.
Then click **Authorize Account** to [authorize the configuration](/components/authorization/). 

Select the template you wish to use:

- Smart Mode -- using this mode you always get just missing data (recommended), loads data [incrementally](/storage/tables/#incremental-loading).
- Full Mode -- using this mode you always get everything.

You can download:

- Users
- Channels
- Messages

After you select one of the two templates, remember to **save** the configuration.

![Slack Configuration](/components/extractors/communication/slack/slack-1.png)

You can also [switch to the JSON editor](/components/extractors/generic-extractor/#template-mode).
