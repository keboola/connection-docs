---
title: Babelforce
permalink: /components/extractors/marketing-sales/babelforce/
redirect_from:
    - /extractors/makreting-sales/babelforce/
---

* TOC
{:toc}

This extractor uses the Babelforce [REST API](https://www.babelforce.com/rest-api-power/) to import data from [Babelforce](https://www.babelforce.com/), a cloud call center platform.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Babelforce** extractor.

To configure this extractor, you need to provide an API **Access ID**, and an **API token**.
Select the **configuration template** and save the configuration. 
There is only one Google Calendar template available so far -- *Basic*. This option downloads all call data from your Babelforce profile
You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).

{: .image-popup}
![Screenshot - API token](/components/extractors/marketing-sales/babelforce/babelforce-1.png)

**Important:** Data are always imported incrementally.
