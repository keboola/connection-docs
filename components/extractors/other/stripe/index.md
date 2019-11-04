---
title: Stripe
permalink: /components/extractors/other/stripe/
redirect_from:
    - /extractors/other/stripe/

---

* TOC
{:toc}

This extractor uses the [Stripe API](https://stripe.com/docs/api) to import almost all data from [Stripe](https://www.stripe.com/).

## Create New Configuration
Find Stripe in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - New Configuration](/components/extractors/other/stripe/01-new_configuration.png)

## Provide API Token
To configure this extractor, you need to provide an [API token](https://stripe.com/docs/api#authentication).
You can get it in the [Stripe dashboard](https://dashboard.stripe.com/login?redirect=%2Faccount%2Fapikeys). 

{: .image-popup}
![Screenshot - API Token](/components/extractors/other/stripe/02-token.png)

## Select Data
To configure what data you want to extract, you can either select one of the configuration templates, 
or you can [switch to the JSON editor](/components/extractors/other/stripe/#advanced-mode) for advanced extractions.  

{: .image-popup}
![Screenshot - Template](/components/extractors/other/stripe/03-template.png)

There are two templates available: 

- Only Charges -- FULL LOAD
- Almost ALL Data -- FULL LOAD

When done, **save** the configuration and **run** it.

## Advanced Mode 
For more features, switch the configuration to the Power User Mode by clicking the *Switch to JSON editor* link.
JSON configuration uses the [Generic extractor](https://developers.keboola.com/extend/generic-extractor/) format.

{: .image-popup}
![Screenshot - Advanced Mode](/components/extractors/other/stripe/04-advanced-mode.png)

If you select a template and want to specify more details using the advanced mode, don't forget to click
**Save** first. The code will be pre-filled based on that particular template.

{: .image-popup}
![Screenshot - JSON pre-filled](/components/extractors/other/stripe/05-json-prefilled.png)

When finished, **save** the configuration again and then run the extraction.