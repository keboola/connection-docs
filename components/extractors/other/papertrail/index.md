---
title: Papertrail
permalink: /components/extractors/other/papertrail/
redirect_from:
    - /extractors/other/papertrail/

---

* TOC
{:toc}

This extractor uses the Papertrail [Search API](https://help.papertrailapp.com/kb/how-it-works/search-api)
to import events matching the specified query from [Papertrail](https://www.papertrail.com/) 
(logs from apps, servers, and cloud services).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Twitter** extractor.

To configure the extractor, you need to provide a Papertrail API token, enter a search query and select a retention period.
Then select the data you wish to extract.

First, provide a Papertrail [API token](https://help.papertrailapp.com/kb/how-it-works/http-api#authentication).
You can get it in your [profile](https://papertrailapp.com/account/profile).

Then enter your [search query](https://help.papertrailapp.com/kb/how-it-works/search-syntax/#quick-reference). 
And finally, select a desired **retention period** from the dropdown menu (from 1 day to 1 month).

To configure what data you want to extract, select the configuration template. The only template available at the moment is **Basic**. 
This option downloads all records matching the query within the retention period. It incrementally adds new records each run.

{: .image-popup}
![Screenshot - Papertrail configuration](/components/extractors/other/papertrail/papertrail-1.png)

When done, **Save** the configuration.
You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).

**Important:** Data is always imported incrementally.
