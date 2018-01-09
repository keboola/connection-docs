---
title: YouTube
permalink: /extractors/social/youtube/
---

* TOC
{:toc}

This extractor uses the [YouTube Data API](https://developers.google.com/youtube/v3/docs/) to extract data
about your YouTube channels or your YouTube activity.

For analytics and reporting use [Google Analytics Extractor](/extractors/marketing-sales/google-analytics/) or [YouTube Reporting Extractor](https://github.com/blueskydigital/keboola-ex-youtube-reporting/blob/master/README.md).

## Create New Configuration
Find **YouTube** in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/social/youtube/ui_new_config.png)

**Authorize Account** to be redirected to Google, and authorize the extractor to access your YouTube data.

## Configuration
Either choose one of predefined templates or define your own configuration directly using the JSON editor. The extractor runs on Generic Extractor so consult its [documentation](https://developers.keboola.com/extend/generic-extractor/) for more details.

A simple example is getting info about your own channel. The configuration looks like this:

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

If you don't know how to find out the correct endpoint, look to the API documentation and browse e.g. for *Channels: list*. Choose one of the predefined use cases, e.g. *list (my channel)* and switch the example to CURL. The endpoint is under `# HTTP URL:` where you omit base url `https://www.googleapis.com/youtube/v3/`.

{: .image-popup}
![Screenshot - Create configuration](/extractors/social/youtube/api_sample.png)

You can use other Generic's functionality like nesting too. This example downloads your channel, iterates through its playlists and gets all their videos:

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