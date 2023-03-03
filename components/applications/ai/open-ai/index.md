---
title: OpenAI
permalink: /components/applications/ai/open-ai/
---

* TOC
{:toc}
  
This OpenAI app enables you to query the [OpenAI Text Completion service](https://platform.openai.com/docs/guides/completion/introduction) with data from your Keboola Connection project.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **OpenAI** application.
- Get your API key from the [OpenAI platform settings](https://platform.openai.com/account/api-keys), then fill in your API key in the *API Key* field in the *Data Source Configuration* window.
- Click the **Add Row** button and select a name for the row configuration. This name will be used for identification purposes only.

{: .image-popup}
![OpenAI Extractor Configuration - 1](/components/applications/ai/open-ai/1.png)

- Select which type of model you want to use. Either predefined or custom.
- To get a list of available models, use the **Re-Load Available Models** button. Then, select the desired model in the *Model* field.
- You can use the default model options or customize them in the *Model Options* window.

{: .image-popup}
![OpenAI Extractor Configuration - 2](/components/applications/ai/open-ai/2.png)

- The *Prompt* field is used for the purpose of defining the prompt and data input pattern. Refer to the input column using a placeholder [[INPUT_COLUMN]]. The input table must contain the referenced column.
- In the *Destination* window you can select your desired Storage table name and, optinally, incremental load. If you define primary keys, the rows in the destination table will be updated. If not, new rows will be appended.

{: .image-popup}
![OpenAI Extractor Configuration - 3](/components/applications/ai/open-ai/3.png)

