---
title: YouTube
permalink: /extractors/social/youtube/
---

* TOC
{:toc}

This extractor uses the [YouTube Data API](https://developers.google.com/youtube/v3/docs/) to extract data
about your YouTube channels or your YouTube activity.

For analytics and reporting, use the [Google Analytics extractor](/extractors/marketing-sales/google-analytics/) or the 
[YouTube Reporting extractor](https://github.com/blueskydigital/keboola-ex-youtube-reporting/blob/master/README.md).

## Create New Configuration
Find **YouTube** in the list of extractors, and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/social/youtube/ui_new_config.png)

**Authorize the account** to be redirected to Google, and authorize the extractor to access your YouTube data.

## Configuration
To configure the extractor, choose one of the two predefined **templates**: 

- Channels -- returning info about your own channels
- Videos -- returning info about your playlists and all their videos 

You can also define your **own** configuration directly using the **JSON editor**. 
The extractor runs on [Generic Extractor](https://developers.keboola.com/extend/generic-extractor/).

To give a simple example, the configuration to get info about your own channel looks like this:

{% highlight json %}
{
  "jobs": [
    {
      "endpoint": "channels?mine=true&part=snippet,contentDetails,statistics",
      "dataType": "channels",
      "dataField": "items"
    }
  ]
}
{% endhighlight %}

If you do not know how to find out the correct endpoint, look to YouTube's [API documentation](https://developers.google.com/youtube/v3/docs/) and browse for, e.g., *Channels: list*. 
Choose one of the predefined use cases, for instance, *list (my channel)*, and switch the example to CURL. 
The endpoint is under `# HTTP URL:`, where you omit the base url `https://www.googleapis.com/youtube/v3/`.

{: .image-popup}
![Screenshot - Create configuration](/extractors/social/youtube/api_sample.png)

You can use other Generic Extractor's functionality too, including nesting. This example downloads your channel, iterates through its playlists and gets all their videos:

{% highlight json %}
{
  "jobs": [
    {
      "endpoint": "channels?mine=true&part=id,snippet",
      "dataType": "channels",
      "dataField": "items",
      "children": [
        {
          "endpoint": "playlists?channelId={channelId}&part=id,snippet",
          "dataType": "playlists",
          "dataField": "items",
          "placeholders": {
            "channelId": "id"
          },
          "children": [
            {
              "endpoint": "playlistItems?playlistId={playlistId}&part=id,snippet",
              "dataType": "videos",
              "dataField": "items",
              "placeholders": {
                "playlistId": "id"
              }
            }
          ]
        }
      ]
    }
  ]
}
{% endhighlight %}