---
title: YouTube Reporting
permalink: /components/extractors/social/youtube-reporting/
redirect_from:
    - /extractors/social/youtube-reporting/

---

* TOC
{:toc}


This data source component is using [YouTube Reporting API](https://developers.google.com/youtube/reporting/v1/reports/) 
to create and run reports that give you insights into the performance of your YouTube
content. Automate data retrieval from the [YouTube Analytics](https://developers.google.com/youtube/analytics/).

## Configuration

1. Log into your account using the `Authorize Account` button..
2. If applicable, you may check the `Use Content Owner ID` checkbox and specify the `Content Owner ID` parameter.
    - This parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on
      behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content
      partners that own and manage many different YouTube channels. It allows content owners to authenticate once and
      get access to all their video and channel data, without having to provide authentication credentials for each
      individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube
      content owner.
3. Select the desired reports in the configuration. For full list of supported reports see
   the [Supported reports](#supported-reports) section.

## Supported reports

The connector allows you to run the following reports. The full list of supported reports is available in
the [YouTube Reporting API documentation](https://developers.google.com/youtube/reporting/v1/reports/).

### Channel reports

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

### Content owner reports

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

- The component is using the [YouTube Reporting API](https://developers.google.com/youtube/reporting/v1/reports/) to
  create and run reports that measure results of YouTube advertising campaigns.
- All reports are downloaded incrementally and "upserted" into the destination table.
- **IMPORTANT:** The reporting service creates standardised reports every 24hrs. There is one job for each report type.
  There may be
  more reports (versions) associated with a job. Each report consists of data for one 24hour period. System may
  generate more than one report for each 24hour period. It makes sense to consider only the latest (report's createTime)
  report associated with specific 24hour period.
    - During the first execution, if there is no Job for specified report_type yet, the job is created and no data is
      downloaded. **It may take up to 24hrs for the first report to be available.**

