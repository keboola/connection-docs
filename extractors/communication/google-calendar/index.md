---
title: Google Calendar
permalink: /extractors/communication/google-calendar/
---

* TOC
{:toc}


The Google Calendar extractor uses the [Google Calendar API](https://developers.google.com/calendar/) to download all 
calendars available in your account, including events and their details (organizer, location, attendees, reminders, 
notifications, attachments, description, etc.). It can also be used for downloading Google owned calendars with all national holidays.

## Create New Configuration

Find Google Calendar in the Extractors section, create a new configuration and name it.

{: .image-popup}
![Google Calendar - add configuration](/extractors/communication/google-calendar/01-add-configuration.png)

Then click **Authorize Account** to be redirected to Google, and authorize the extractor to access your Google account. 

{: .image-popup}
![Google Calendar - authorize account](/extractors/communication/google-calendar/02-authorize-account.png)

Select one of the two authorization methods:

{: .image-popup}
![Google Calendar - select authorization method](/extractors/communication/google-calendar/03-authorization-methods.png)

- **Instant**: Use this method if you have access to a Google account; the authorization will be done immediately.
- **External**: If you need to authorize access to the service from someone who does not have an account in Keboola Connection (KBC),
you can generate an external link, which will guide them through this process.

To configure what data you want to extract, select the **configuration template** you want to use. 
Or, [switch to the JSON editor](/extractors/communication/google-calendar/#advanced-mode)
for advanced extractions.

{: .image-popup}
![Google Calendar - select template](/extractors/communication/google-calendar/04-template.png)

There is only one Google Calendar template available so far -- *Get data from Google Calendar*. All your Google Calendar data will be downloaded.

**Save** the configuration before you run the extraction.

## Advanced Mode

For more features, switch the configuration to the Power User Mode by clicking the *Switch to JSON editor* link. 
JSON configuration uses the Generic extractor format.

{: .image-popup}
![Google Calendar Advanced Mode](/extractors/communication/google-calendar/05-advanced-mode.png)

If you select the template and want to specify more details using the advanced mode, don't forget to click 
**Save** first. The code will be pre-filled for you based on that template. 

{: .image-popup}
![Google Calendar Advanced Mode pre-filled](/extractors/communication/google-calendar/06-prefilled-JSON.png)

When finished, save the configuration again, and run the extractor.

## API Limits
The Google Calendar API has a courtesy limit of 1,000,000 queries per day. If you need more, the limit can be [changed](https://developers.google.com/calendar/pricing).