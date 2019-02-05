---
title: Papertrail
permalink: /extractors/other/papertrail/
---

* TOC
{:toc}

This extractor uses the Papertrail [Search API](https://help.papertrailapp.com/kb/how-it-works/search-api)
to import events matching the specified query from [Papertrail](https://papertrailapp.com/) 
(logs from apps, servers, and cloud services).

## Create New Configuration
Find Papertrail in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - New configuration](/extractors/other/papertrail/01-new_configuration.png)

## Configure Extractor
To configure the extractor, you need to provide a Papertrail API token, enter a search query and select a retention period.
Then select data you wish to extract.

### Get API Key
First, provide a Papertrail [API token](https://help.papertrailapp.com/kb/how-it-works/http-api#authentication).
You can get it in your [profile](https://papertrailapp.com/account/profile).

{: .image-popup}
![Screenshot - API token](/extractors/other/papertrail/02-token.png)

### Enter Search Query
Then enter your [search query](https://help.papertrailapp.com/kb/how-it-works/search-syntax/#quick-reference). 
And finally, select a desired **retention period** from the dropdown menu (from 1 day to 1 month).

{: .image-popup}
![Screenshot - Search query](/extractors/other/papertrail/03-query.png)

### Select Data
To configure what data you want to extract, you can either select one of the configuration templates, 
or you can [switch to the JSON editor](/extractors/other/papertrail/#advanced-mode) for advanced extractions.  

{: .image-popup}
![Screenshot - Template](/extractors/other/papertrail/04-template.png)

The only template available at the moment is **Basic**. 
This option downloads all records matching the query within the retention period. It incrementally adds new records each run.

When done, **save** the configuration and **run** it.

## Advanced Mode 
For more features, switch the configuration to the Power User Mode by clicking the *Switch to JSON editor* link.
JSON configuration uses the [Generic extractor](https://developers.keboola.com/extend/generic-extractor/) format.

{: .image-popup}
![Screenshot - Advanced mode](/extractors/other/papertrail/05-advanced-mode.png)

If you select the template and want to specify more details using the advanced mode, don't forget to click
**Save** first. The code will be pre-filled for you based on that particular template, search query and selected retention period.

{: .image-popup}
![Screenshot - Pre-filled JSON](/extractors/other/papertrail/06-prefilled-json.png)

When finished, **save** the configuration again and then run the extraction.

**Important:** Data are always imported incrementally.