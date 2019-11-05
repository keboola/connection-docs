---
title: Generic Extractor
permalink: /components/extractors/other/generic/
redirect_from:
    - /extractors/other/generic/
---

Generic Extractor is quite a special component. As its name suggests, it can **extract data from many APIs**:

- Probably any [REST (Restful) API](https://en.wikipedia.org/wiki/Representational_state_transfer) 
- A lot of other APIs

Setting Generic Extractor to retrieve data from an API is a matter of writing the right **JSON configuration**. 
Because you have to write it yourself, we made the
[Generic Extractor guide](https://developers.keboola.com/extend/generic-extractor/) a part of our [Developers 
Documentation](https://developers.keboola.com/extend/). 

No other programming or software engineering skills are necessary. Even though configuring the extractor may seem quite 
complex at first, once you understand the concept, you will be able to extract desired data within (tens of) minutes. 

We strongly recommend you configure your first Generic Extractor using [our 
tutorial](https://developers.keboola.com/extend/generic-extractor/tutorial/).

To understand what specific parts of an existing configuration do, check the 
[Configuration Map](https://developers.keboola.com/extend/generic-extractor/map/).

## Template Mode
Generic extractor is used as the base for many extractors. These components allows you to select pre-defined configurations 
-- templates -- without the need to configure Generic extractor manually.

{: .image-popup}
![Generic Extractor - template](/components/extractors/other/generic-1.png)

These components can be heavily customized simply be using the **Switch to JSON editor** button.
If you select the template and want to specify more details using the advanced mode, don’t forget to click Save first. 
The code will be pre-filled for you based on that template.

{: .image-popup}
![Generic Extractor - template](/components/extractors/other/generic-2.png)

When finished editing, save the configuration. You can also always switch back to templates, but you'll lose your customizations.
