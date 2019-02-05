---
title: Adform
permalink: /extractors/marketing-sales/adform/
---

* TOC
{:toc}

This extractor uses the [Adform API](http://api.adform.com/Services/Documentation/Index.htm) to import data, such as campaigns,
advertisers, and users, from [Adform](https://site.adform.com/).

## Create New Configuration
Find Adform in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - New configuration](/extractors/marketing-sales/adform/01-new_configuration.png)

## Provide Credentials
To configure this extractor, you need to provide your Adform account username and password.

{: .image-popup}
![Screenshot - Adform Credentials](/extractors/marketing-sales/adform/02-credentials.png)

Then click **Next: Select Template** to continue.

## Select Data
To configure what data you want to extract, choose one of the configuration templates. 
You can extend the chosen template or switch to another one later if you decide to download more or different data.

{: .image-popup}
![Screenshot - Template](/extractors/marketing-sales/adform/03-template.png)

There are three templates available: 

- **Basic** -- fetches advertisers and campaigns.
- **Full** -- fetches advertisers, campaigns, and users.
- **Empty** -- allows you to configure what you want to fetch by yourself.

When done, click **Create Extractor**.

Your next steps depend on what template you selected.

### Basic & Full Mode
If your selected template is Basic or Full and you do not wish to make any changes to it, just click **Save** and run the extractor.

If you do want to add a few adjustments, the code is **pre-filled** for you based on the chosen template.

{: .image-popup}
![Screenshot - Prefilled JSON](/extractors/marketing-sales/adform/04-prefilled-json.png)

*Note: The resource configuration expects a **jobs** array configured according 
to the [Generic Extractor documentation](https://developers.keboola.com/extend/generic-extractor/configuration/config/jobs/). 
Details about the Adform API are available in the [Adform API documentation](https://api.adform.com/Services/Documentation/Index.htm).
All properties prefixed with the # sign will be encrypted on save. Already encrypted strings will persist.*

**Save** and run the extractor.

### Empty Mode
If you selected the **Empty** mode, start configuring from scratch.

{: .image-popup}
![Screenshot - Empty JSON](/extractors/marketing-sales/adform/05-empty-json.png)

*Note: The resource configuration expects a **jobs** array configured according 
to the [Generic Extractor documentation](https://developers.keboola.com/extend/generic-extractor/configuration/config/jobs/). 
Details about the Adform API are available in the [Adform API documentation](https://api.adform.com/Services/Documentation/Index.htm).
All properties prefixed with # sign will be encrypted on save. Already encrypted strings will persist.*

Again, when finished, **save** the configuration before you run the extraction.

## Change Template
In case you change your mind and decide to use another template, simply click the *Configure from template* link, 

{: .image-popup}
![Screenshot - Change template](/extractors/marketing-sales/adform/06-change-template.png)

and continue as described above.


{: .image-popup}
![Screenshot - Change template detail](/extractors/marketing-sales/adform/07-change-template-detail.png)

