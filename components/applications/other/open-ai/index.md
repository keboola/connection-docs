---
title: OpenAI
permalink: /components/applications/other/open-ai/
---

* TOC
{:toc}
  
This OpenAI app enables you to query [OpenAI Text Completion service](https://platform.openai.com/docs/guides/completion/introduction) with data provided from your KBC project.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **OpenAI** application.
- Get your API key from [OpenAI platform settings](https://platform.openai.com/account/api-keys), then fill in your API Key in the API key field in the Extracor Configuration field.
- Click **ADD ROW** button and select a name for the row configuration. This name serves for identification purposes only.

{: .image-popup}
![OpenAI Extractor Configuration - 1](/components/applications/other/open-ai/1.png)

- Select which type of model You want to use. Either **predefined** or **custom**.
- To get a list of available models, use **RE-LOAD AVAILABLE MODELS** button. Then, select the desired model.
- You have an option to use default Model Options or customize them in the **Model Options** window.

{: .image-popup}
![OpenAI Extractor Configuration - 2](/components/applications/other/open-ai/2.png)

- The Prompt field is used for defining the prompt and data input pattern. Refer to input column using placeholder**[[INPUT_COLUMN]]**. The input table must contain the referenced column.
- In Destination window you can select desired Storage Name and whether to use Incremental Load. If you define Primary keys, the rows in destination table will be updated. If not, new rows will be appended.

{: .image-popup}
![OpenAI Extractor Configuration - 3](/components/applications/other/open-ai/3.png)

