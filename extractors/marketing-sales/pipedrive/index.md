---
title: Pipedrive
permalink: /extractors/marketing-sales/pipedrive/
---

* TOC
{:toc}

This extractor uses the [Pipedrive API](https://developers.pipedrive.com/docs/api/v1/) to import data 
from [Pipedrive](https://www.pipedrive.com/).

## Create New Configuration
Find Pipedrive in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - New configuration](/extractors/marketing-sales/pipedrive/01-new_configuration.png)

## Provide API Token
To configure this extractor, you need to provide an **API token**. You can get it by clicking the *Get API Token* link. 
Then enter your **company domain**.

{: .image-popup}
![Screenshot - API token](/extractors/marketing-sales/pipedrive/02-token.png)

## Select Data
To configure what data you want to extract, you can either select one of the configuration templates, 
or [switch to the JSON editor](/extractors/marketing-sales/pipedrive/#advanced-mode) for advanced extractions.  

{: .image-popup}
![Screenshot - Template](/extractors/marketing-sales/pipedrive/03-template.png)

The only template available at the moment is **Basic**. This option downloads organizations, persons, users, pipelines, 
activities, stages, etc.

When done, **save** the configuration and **run** it.

## Advanced Mode 
For more features, switch the configuration to the Power User Mode by clicking the *Switch to JSON editor* link.
JSON configuration uses the [Generic extractor](https://developers.keboola.com/extend/generic-extractor/) format.

{: .image-popup}
![Screenshot - Advanced mode](/extractors/marketing-sales/pipedrive/04-advanced-mode.png)

If you select the template and want to specify more details using the advanced mode, don't forget to click
**Save** first. The code will be pre-filled based on that particular template.

{: .image-popup}
![Screenshot - Pre-filled JSON](/extractors/marketing-sales/pipedrive/05-prefilled-json.png)

When finished, **save** the configuration again and then run the extraction.

**Important:** Data are always imported incrementally.