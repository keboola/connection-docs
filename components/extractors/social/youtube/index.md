---
title: YouTube Data API
permalink: /components/extractors/social/youtube/
redirect_from:
    - /extractors/social/youtube/

---

* TOC
{:toc}

The YouTube Data API source connector uses the [YouTube Data API](https://developers.google.com/youtube/v3/docs/) to extract data
about your YouTube channels or your YouTube activity. It is ideal for obtaining basic information about your channels, playlists, and videos.

***Note:** This connector is not designed for analytics and reporting. Use the
[YouTube Reporting](/components/extractors/social/youtube-reporting/) or the [Google Analytics](/components/extractors/marketing-sales/google-analytics/) data source connectors for such purposes.*

## Configuration
To begin, [create a new configuration](/components/#creating-component-configuration) for the **YouTube** connector.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 

Select one of the two available **templates**: 

- Channels: Provides information about your channels.
- Videos: Offers details about your playlists and their associated videos. 

{: .image-popup}
![Screenshot - Create configuration](/components/extractors/social/youtube/youtube-1.png)

You can [switch to the JSON editor](/components/extractors/other/generic/#template-mode) for more advanced configurations.

### Advanced Configuration
To give a simple example, the configuration for details about your channel looks like this:

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

To learn what is the correct endpoint, look to YouTube's [API documentation](https://developers.google.com/youtube/v3/docs/) and browse for, e.g., *Channels: list*. 
Choose one of the predefined use cases, for instance, *list (my channel)*, and switch the example to CURL. 
The endpoint is under `# HTTP URL:`, where you omit the base URL `https://www.googleapis.com/youtube/v3/`.

{: .image-popup}
![Screenshot - YouTube API](/components/extractors/social/youtube/api_sample.png)

You can use other [Generic Extractor's](/components/extractors/other/generic/) functionality, too, including nesting. This example downloads your channel, iterates through its playlists, and gets all their videos:

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
