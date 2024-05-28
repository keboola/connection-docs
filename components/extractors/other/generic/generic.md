---
title: Generic Extractor
permalink: /components/extractors/other/generic/
redirect_from:
    - /extractors/other/generic/
---

Generic Extractor is quite a special component. As its name suggests, it can **extract data from many APIs**:

- Probably any [REST (Restful) API](https://en.wikipedia.org/wiki/Representational_state_transfer) 
- A lot of other APIs

## Convenient UI

Recently, we created a convenient user interface that allows you to build a configuration for the Generic Extractor without needing to write JSON code. 
Similar to other popular API development tools, you can set up and test the connection in just a few clicks.

Features such as cURL import, request tests, output mapping generator, and dynamic function templates and evaluation make the configuration process easier. 

{: .image-popup}
![Generic Extractor - UI Animation](/components/extractors/other/generic/animation.gif)

Because you have to write it yourself, we included the
[Generic Extractor guide](https://developers.keboola.com/extend/generic-extractor/) in our [Developer 
Documentation](https://developers.keboola.com/extend/). 

No other programming or software engineering skills are necessary. Even though configuring the Generic Extractor may seem quite 
complex at first, once you understand the concept, you can extract desired data within (tens of) minutes. 

We strongly recommend configuring your first Generic Extractor using [our 
tutorial](https://developers.keboola.com/extend/generic-extractor/tutorial/), which will guide you through the visual builder and underlying JSON configuration.


### JSON Configuration

Underneath the UI, the configurations are formed as **JSON**.

Even though the UI is intuitive, it is beneficial to understand what specific parts of an existing configuration JSON do. To do so, you may check the 
[Configuration Map](https://developers.keboola.com/extend/generic-extractor/map/).

## Template Mode
Generic Extractor is used as the base for many data source connectors. These components allow you to select pre-defined configurations 
-- templates -- without the need to configure Generic Extractor manually.

{: .image-popup}
![Generic Extractor - template](/components/extractors/other/generic/generic-1.png)

The components can be heavily customized using the **Switch to JSON editor** button.
If you select the template and want to specify more details using the advanced mode, don’t forget to click **Save** first. 
The code will be pre-filled for you based on that template.

{: .image-popup}
![Generic Extractor - template](/components/extractors/other/generic/generic-2.png)

When finished editing, save the configuration. You can always switch back to the templates, but you'll lose your customizations.
