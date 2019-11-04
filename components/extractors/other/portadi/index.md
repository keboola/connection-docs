---
title: Portadi
permalink: /components/extractors/other/portadi/
redirect_from:
    - /extractors/other/portadi/

---

* TOC
{:toc}

This extractor uses the [Portadi API](http://docs.portadi.apiary.io/) to import data (your activities) 
from [Portadi](https://www.portadi.com/). 

## Create New Configuration
Find Portadi in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Portadi New Configuration](/components/extractors/other/portadi/01-new_configuration.png)

## Provide API Token
To configure this extractor, you need to provide an admin [API token](https://app.portadi.com/#!/settings).
You can get it by clicking the *Get your API Key* link. 

{: .image-popup}
![Screenshot - Portadi API Token](/components/extractors/other/portadi/02-token.png)

## Select Data
To configure what data you want to extract, you can either select one of the configuration templates, or [switch to the JSON editor](/components/extractors/other/portadi/#advanced-mode) for advanced extractions.  

{: .image-popup}
![Screenshot - Portadi Template](/components/extractors/other/portadi/03-template.png)

The only template available at the moment is **AuditEvents -- FULL**. This option downloads every single activity 
from your Portadi profile.

When done, **save** the configuration and **run** it.

## Advanced Mode 
For more features, switch the configuration to the Power User Mode by clicking the *Switch to JSON editor* link.
JSON configuration uses the [Generic extractor](https://developers.keboola.com/extend/generic-extractor/) format.

{: .image-popup}
![Screenshot - Portadi Advanced Mode](/components/extractors/other/portadi/04-advanced-mode.png)

If you select a template and want to specify more details using the advanced mode, don't forget to click
**Save** first. The code will be pre-filled based on that particular template.

{: .image-popup}
![Screenshot - Portadi JSON pre-filled](/components/extractors/other/portadi/05-json-prefilled.png)

When finished, **save** the configuration again and then run the extraction.

