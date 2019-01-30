---
title: Babelforce
permalink: /extractors/marketing-sales/babelforce/
---

* TOC
{:toc}

This extractor uses the babelforce [REST API](https://www.babelforce.com/rest-api-power/) to import data from [babelforce](http://babelforce.com/), a cloud call center platform.

## Create New Configuration
Find babelforce in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - New configuration](/extractors/marketing-sales/babelforce/01-new_configuration.png)

## Provide API Token
To configure this extractor, you need to provide an API Access ID, and an API token.

{: .image-popup}
![Screenshot - API token](/extractors/marketing-sales/babelforce/02-token.png)

## Select Data
To configure what data you want to extract, you can either select one of the configuration templates, or [switch to the JSON editor](/extractors/marketing-sales/babelforce/#advanced-mode) for advanced extractions.  

{: .image-popup}
![Screenshot - Template](/extractors/marketing-sales/babelforce/03-template.png)

The only template available at the moment is **Basic**. This option downloads all call data from your babelforce profile.

When done, **save** the configuration and **run** it.

## Advanced Mode 
For more features, switch the configuration to the Power User Mode by clicking the *Switch to JSON editor* link.
JSON configuration uses the [Generic extractor](https://developers.keboola.com/extend/generic-extractor/) format.

{: .image-popup}
![Screenshot - Advanced mode](/extractors/marketing-sales/babelforce/04-advanced-mode.png)

If you select a template and want to specify more details using the advanced mode, don't forget to click
**Save** first. The code will be pre-filled based on that particular template.

{: .image-popup}
![Screenshot - Pre-filled JSON](/extractors/marketing-sales/babelforce/05-prefilled-json.png)

When finished, **save** the configuration again and then run the extraction.

**Important:** Data are always imported incrementally.