---
title: Google Calendar
permalink: /components/extractors/communication/google-calendar/
redirect_from:
    - /extractors/communication/google-calendar/
---

* TOC
{:toc}

The Google Calendar data source connector uses the [Google Calendar API](https://developers.google.com/calendar/) to download all
calendars available in your account, including events and their details (organizer, location, attendees, reminders,
notifications, attachments, description, etc.). It can also be used for downloading Google owned calendars with all national holidays.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Google Calendar** connector.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

{: .image-popup}
![Google Calendar - Authorize Account](/components/extractors/communication/google-calendar/google-calendar-1.png)

Select the **configuration template** and save the configuration. 
There is only one Google Calendar template available so far -- *Get data from Google Calendar*. All your Google Calendar data will be downloaded.
You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).

{: .image-popup}
![Google Calendar - Save Configuration](/components/extractors/communication/google-calendar/google-calendar-2.png)

## API Limits
The Google Calendar API has a courtesy limit of 1,000,000 queries per day. If you need more, the limit can be [changed](https://developers.google.com/calendar/pricing).
