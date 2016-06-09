---
title: Google Adwords Reports
permalink: /extractors/google-adwords-reports/
---

* TOC
{:toc}

## Create New Configuration

Create new configuration and give it some name as usual

{: .image-popup}
![](/extractors/google-adwords-reports/ui_adwords2.png)

## Authorize Account

Clicking on the button will redirect you to Google and ask for authorization to download your AdWords data

## Fill Parameters Section

It is in json format and must contain AdWords developer token, customer id, bucket where you want the data to be saved and configuration of queries. Optionally it may contain parameters since and until to specify dates interval for stats (it is "-1 day" i.e. "yesterday" by default)

{: .image-popup}
![](/extractors/google-adwords-reports/ui_adwords3.png)

- **developer_token** - Your developer token
- **customer_id** - Instructions to get it are here: https://support.google.com/adwords/answer/1704344?hl=en
- **bucket** - Name of bucket where the data will be saved
- **since** *(optional)* - start date of downloaded stats (default is "-1 day")
- **until** *(optional)* - end date of downloaded stats (default is "-1 day")
- **queries** - Array of reports to download as Ad-hoc report. Reports are always imported incrementaly to storage. Each item must contain:
    - **name** - Name of query, data will be saved to table `[bucket].[name]`.
    *Note that `customers` and `campaigns` are reserved names, thus cannot be used as query names.*
    - **query** - AWQL query for downloading Ad-hoc report (see [https://developers.google.com/adwords/api/docs/guides/awql]). You should pick columns to download from allowed report values and FROM clause from allowed report types
    - **primary** - Array of columns to be used as primary key. _You must use **Display Name** of the columns as defined in reports types documentation [https://developers.google.com/adwords/api/docs/appendix/reports]_ and replace spaces with underscores (e.g. for *CampaignId* use *Campaign_ID* and for *Date* use *Day*)

{: .image-popup}
![](/extractors/google-adwords-reports/ui_adwords4.png)


Example:
{% highlight json %}
{
    "developer_token": "...",
    "customer_id": "91165040",
    "bucket": "in.c-ex-adwords",
    "queries": [
        {
            "name": "campaign-performance",
            "query": "SELECT CampaignId,Date,AverageCpc,AverageCpm,AveragePosition,Clicks,Cost,Impressions,AdNetworkType1 FROM CAMPAIGN_PERFORMANCE_REPORT",
            "primary": ["Campaign_ID", "Day"]
        }
    ]
}
{% endhighlight %}
