---
title: Market Vision
permalink: /components/extractors/marketing-sales/market-vision/
redirect_from:
    - /extractors/marketing-sales/market-vision/
---

* TOC
{:toc}

This extractor uses the [Market Vision API](https://reporting.marketvision-spring.com/api/v1/documentation) to
extract Market Vision [projects](https://reporting.marketvision-spring.com/api/v1/documentation#List_of_Projects_150)
and their corresponding Forms, Questions, Categories, and Fieldsets.

The data is extracted incrementally, so only data that has been changed since the last run is fetched. 
The component has backfill implemented, meaning that if not all data could be fetched in the first run due to large 
amounts of data, it will be fetched in the following runs.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Market Vision** extractor.
Then fill in the **Access/API Token** to authorize the configuration. The process to get the Access Token is 
done via an [API request](https://reporting.marketvision-spring.com/api/v1/documentation#Generate_token_18).

{: .image-popup}
![Screenshot - Api Version](/components/extractors/marketing-sales/market-vision/auth.png)


Once the API Token is filled in, save the configuration and you can run the component. If you have a lot of data in
Market Vision, it might take a couple of runs to extract all the data. You can see that the backfill has finished by not seeing
the message "MAX RUNTIME of component has almost been reached, saving data. Rerun the component to let backfill fetch all of your data"


## Data output

The data is extracted into the following tables:

[Table Form Details](https://reporting.marketvision-spring.com/api/v1/documentation#Form_Detail_231):
 - project_form_detail_questions
 - project_form_detail_index
 - project_form_detail

[Project Form Fieldsets](https://reporting.marketvision-spring.com/api/v1/documentation#Fieldsets_Structure_515):
 - project_form_fieldsets
   
[Project Form Categories](https://reporting.marketvision-spring.com/api/v1/documentation#Categories_Structure_465):
 - project_form_categories

[Project Form Questions](https://reporting.marketvision-spring.com/api/v1/documentation#Questions_Structure_317):
 - project_form_questions

