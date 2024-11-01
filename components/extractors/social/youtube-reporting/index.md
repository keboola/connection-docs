---
title: YouTube Reporting
permalink: /components/extractors/social/youtube-reporting/
redirect_from:
    - /extractors/social/youtube-reporting/

---

* TOC
{:toc}


This data source connector uses the [YouTube Reporting API](https://developers.google.com/youtube/reporting/v1/reports/) 
to create and run reports that provide insights into the performance of your YouTube
content. It enables the automation of data retrieval from [YouTube Analytics](https://developers.google.com/youtube/analytics/).

## Configuration

1. Log in to your account using the **Authorize Account** button.
2. If applicable, check the `Use Content Owner ID` checkbox and specify the `Content Owner ID` parameter.
    - This parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on
      behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content
      partners who own and manage many YouTube channels. It allows content owners to authenticate once and
      get access to all their video and channel data without providing authentication credentials for each
      channel. The CMS account the user authenticates with must be linked to the specified YouTube
      content owner.
3. Select the desired reports in the configuration. For a complete list of supported reports, see
   the [Supported Reports](#supported-reports) section.

## Supported Reports

The connector allows you to run the following reports. The full list of supported reports is available in
the [YouTube Reporting API documentation](https://developers.google.com/youtube/reporting/v1/reports/).

### Channel Reports

- [Video reports](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-reports)
    - [User activity](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-user-activity)
    - [User activity by province](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-province)
    - [Playback locations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-playback-locations)
    - [Traffic sources](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-traffic-sources)
    - [Device type and operating system](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-device-type-and-operating-system)
    - [Viewer demographics](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-viewer-demographics)
    - [Content sharing by platform](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-content-sharing)
    - [Annotations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-annotations)
    - [Cards](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-cards)
    - [End screens](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-end-screens)
    - [Subtitles](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-subtitles)
    - [Combined](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-combined)
- [Playlist reports](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-reports)
    - [User activity](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-user-activity)
    - [User activity by province](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-province)
    - [Playback locations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-playback-locations)
    - [Traffic sources](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-traffic-sources)
    - [Device type and operating system](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-device-type-and-operating-system)
    - [Combined](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-combined)

### Content Owner Reports

- [Video reports](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-reports)
    - [User activity](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-user-activity)
    - [User activity by province](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-province)
    - [Playback locations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-playback-locations)
    - [Traffic sources](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-traffic-sources)
    - [Device type and operating system](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-device-type-and-operating-system)
    - [Viewer demographics](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-viewer-demographics)
    - [Content sharing by platform](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-content-sharing)
    - [Annotations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-annotations)
    - [Cards](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-cards)
    - [End screens](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-end-screens)
    - [Subtitles](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-subtitles)
    - [Combined](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#video-combined)
- [Playlist reports](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-reports)
    - [User activity](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-user-activity)
    - [User activity by province](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-province)
    - [Playback locations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-playback-locations)
    - [Traffic sources](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-traffic-sources)
    - [Device type and operating system](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-device-type-and-operating-system)
    - [Combined](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#playlist-combined)
- [Ad rate reports](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#ad-rate-reports)
- [Estimated revenue reports](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#estimated-revenue-reports)
    - [Estimated video revenue](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#estimated-revenue-videos)
    - [Estimated asset revenue](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#estimated-revenue-assets)
- [Asset reports](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-reports)
    - [User activity](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-user-activity)
    - [User activity by province](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-province)
    - [Video playback locations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-playback-locations)
    - [Traffic sources](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-traffic-sources)
    - [Device type and operating system](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-device-type-and-operating-system)
    - [Viewer demographics](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-viewer-demographics)
    - [Content sharing by platform](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-content-sharing)
    - [Annotations](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-annotations)
    - [Cards](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-cards)
    - [End screens](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-end-screens)
    - [Combined](https://developers.google.com/youtube/reporting/v1/reports/channel_reports#asset-combined)

## Functionality Notes

- The component uses the [YouTube Reporting API](https://developers.google.com/youtube/reporting/v1/reports/) to
  create and run reports that measure the results of YouTube advertising campaigns.
- All reports are downloaded incrementally and "upserted" into the destination table.
- **IMPORTANT:** The reporting service creates standardised reports every 24 hours. Each report type has one job associated with it.
  Multiple report versions may be associated with a single job. Each report covers data for one 24-hour period. More than one report may be
  generated for each 24-hour period. It is advisable to only consider the most recent report (based on the report's createTime)
  for each 24-hour period.
    - During the first execution, if there is no job for the specified report_type yet, the job is created and no data is
      downloaded. **The first report may take up to 24 hours to be available.**

