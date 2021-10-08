---
title: Available Metrics
permalink: /components/extractors/marketing-sales/adform-dsp-reports/available-metrics
---



Note that this list can be retrieved also via this [API call](https://api.adform.com/help/guides/how-to-report-on-campaigns/reporting-stats/metrics):


```json
{
    "metricsMetadata": [
        {
            "key": "videoCompleteCount",
            "category": "Engagement",
            "displayName": "Video Completions",
            "displayFormat": "n0",
            "description": "This metric shows the number of times a video banner or in-stream video was played to 100% completion.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "deliveredClicksPercent",
            "category": "Mediaplan",
            "displayName": "Delivered Clicks (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of delivered clicks in relation to booked clicks. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in clicks.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "deliveredConversionsPercent",
            "category": "Mediaplan",
            "displayName": "Delivered Conversions (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of delivered conversions in relation to booked conversions. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in conversions.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "deliveredImpressionsPercent",
            "category": "Mediaplan",
            "displayName": "Delivered Impressions (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of delivered impressions in relation to booked impressions. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in impressions.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "newVisitsPercent",
            "category": "Site Tracking",
            "displayName": "% New Visits",
            "displayFormat": "0.00%",
            "description": "This metric shows a percentage of new visits in relation to all registered visits on an advertiser's website for the selected tracking setup.",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "overdeliveredPercent",
            "category": "Mediaplan",
            "displayName": "Overdelivered (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of units delivered over the booked volume, in relation to booked units. Could be used to monitor under-/overdelivery. TIP: Use with Buy Type dimension to discern units, e.g., impressions.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "uniqueClicksPercent",
            "category": "Delivery",
            "displayName": "Clicks Unique (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of unique clicks in relation to all registered clicks.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "uniqueImpressionsPercent",
            "category": "Delivery",
            "displayName": "Impressions Unique (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of unique impressions in relation to all registered impressions.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "viewImpressionsPercentIAB",
            "category": "Viewability",
            "displayName": "Viewable Rate (%) for IAB Viewability",
            "displayFormat": "0.00%",
            "description": "This metric shows the part of measured impressions that were actually in the users' screens, calculated as the percentage of viewable impressions in relation to measurable impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "viewImpressionsPercentCustom1",
            "category": "Viewability",
            "displayName": "Viewable Rate (%) for Custom Viewability #1",
            "displayFormat": "0.00%",
            "description": "This metric shows the part of measured impressions that were actually in the users' screens, calculated as the percentage of viewable impressions in relation to measurable impressions. Note: viewable impression custom thresholds #1 and #2 can be defined in the Ad Viewability Settings in Campaign Details. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "viewImpressionsPercentCustom2",
            "category": "Viewability",
            "displayName": "Viewable Rate (%) for Custom Viewability #2",
            "displayFormat": "0.00%",
            "description": "This metric shows the part of measured impressions that were actually in the users' screens, calculated as the percentage of viewable impressions in relation to measurable impressions. Note: viewable impression custom thresholds #1 and #2 can be defined in the Ad Viewability Settings in Campaign Details. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "mpAmount",
            "category": "Mediaplan",
            "displayName": "Amount",
            "displayFormat": "n2",
            "description": "This metric shows the spent amount visible in the Mediaplan. It can be set to show gross amount, net amount or net amount 2. Could be used to report on the cost and fee breakdown of a campaign.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "mpAmountType",
                    "displayName": "Amount Type",
                    "description": "Display selected amount level",
                    "specValuesMetadata": [
                        {
                            "key": "net",
                            "displayName": "Net",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "net2",
                            "displayName": "Net 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "gross",
                            "displayName": "Gross",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "avgBrandExposureDuration",
            "category": "Viewability",
            "displayName": "Avg. Brand Exposure Duration (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average amount of time that a user was exposed to an advertisement, taking into account the % of user's screen covered by the banner and its time in the user's screen. TIP: Check documentation for more details.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "avgEngagementTime",
            "category": "Engagement",
            "displayName": "Avg. Engagement Time (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average engagement time of visible banners. A banner is visible when at least X % of its area is visible in user's screen. X parameter is collected from Campaign Details page. Three timed events are considered during calculation - mouse-over time, video play time, and expansion time. Measurement is based on sampled data.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "avgExpansionTime",
            "category": "Engagement",
            "displayName": "Avg. Expansion Time (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average amount of time that a viewable expanding banner has been in its expanded state. Could be used to evaluate user exposure.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "avgFrequency",
            "category": "Delivery",
            "displayName": "Avg. Frequency",
            "displayFormat": "n2",
            "description": "This metric shows the average number of impressions to which a user has been exposed. Tip: In order to see average frequency for unique user (all duplications excluded), use Campaign Unique setting for this metric.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "avgMouseoverTime",
            "category": "Engagement",
            "displayName": "Avg. Mouse Over Time (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average mouse-over time on visible banners. A banner is visible when at least X % of its area is visible in user's screen. X parameter is collected from Campaign Details page. Only mouse-overs, which lasted 1 second or more, are considered.  Measurement is based on sampled data.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "avgPageDuration",
            "category": "Site Tracking",
            "displayName": "Avg. Page Duration (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average time spent on a tracked page. Measured in seconds.",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "avgOrderSales",
            "category": "Site Tracking",
            "displayName": "Avg. Sales",
            "displayFormat": "n2",
            "description": "This metric shows the sales value divided from number of conversions for the selected dimensions.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "avgVideoPlayTime",
            "category": "Engagement",
            "displayName": "Avg. Video Play Time (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average amount of time that a viewable video banner played. Only user-initiated video plays are considered. Could be used to evaluate user engagement.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "avgViewabilityTime",
            "category": "Viewability",
            "displayName": "Avg. Viewability Time (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average amount of time that users actually saw a viewable banner in their screen. TIP: A viewable impression is defined in the Ad Viewability settings, visible in the Campaign Details.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "avgVisitDepth",
            "category": "Site Tracking",
            "displayName": "Avg. Visit Depth",
            "displayFormat": "n2",
            "description": "This metric shows the average number of visited pages per visit (session).",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "avgVisitDuration",
            "category": "Site Tracking",
            "displayName": "Avg. Visit Duration (sec.)",
            "displayFormat": "n2",
            "description": "This metric shows the average time spent on a tracked website per visit (session). Measured in seconds.",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "blockedImpressions",
            "category": "Delivery",
            "displayName": "Blocked Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the number of impressions, which were blocked according to campaign's Brand Safety settings. Impression blocking in Brand Safety means that a blank, non-clickable image is displayed instead of actual banner for brand protection purpose.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "blockedImpressionsPercent",
            "category": "Delivery",
            "displayName": "Blocked Impressions (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the proportion of Brand Safety blocked impressions in total number of impressions. Impression blocking in Brand Safety means that a blank, non-clickable image is displayed instead of actual banner for brand protection purpose.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "booked",
            "category": "Mediaplan",
            "displayName": "Booked",
            "displayFormat": "n2",
            "description": "This metric shows the number of booked units for a media placement (line item). Tip: use this metric with the Buy Type dimension to be able to discern units e.g. impressions.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "bookedClicks",
            "category": "Mediaplan",
            "displayName": "Booked Clicks",
            "displayFormat": "n0",
            "description": "This metric shows the number of booked clicks for a media placement. Clicking means interacting with an advertisement by engaging a mouse button (usually the left) while the mouse pointer is hovering over the advertisement.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "bookedConversions",
            "category": "Mediaplan",
            "displayName": "Booked Conversions",
            "displayFormat": "n0",
            "description": "This metric shows the number of booked conversions for the selected dimension. Any tracked page can be defined as a Conversion - usually a page where a sign-up is confirmed or a sale is made.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "bookedImpressions",
            "category": "Mediaplan",
            "displayName": "Booked Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the number of booked impressions for the selected dimension. An impression occurs when a user is exposed to an advertisement.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "bookedTime",
            "category": "Mediaplan",
            "displayName": "Booked Time",
            "displayFormat": "n2",
            "description": "This metric shows the number of booked time units for the selected dimension.",
            "specsMetadata": [
                {
                    "key": "timeScope",
                    "displayName": "Time Scope",
                    "description": "Displays statistics in selected time units.",
                    "specValuesMetadata": [
                        {
                            "key": "days",
                            "displayName": "Days",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "weeks",
                            "displayName": "Weeks",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "months",
                            "displayName": "Months",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "years",
                            "displayName": "Years",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "bounceRate",
            "category": "Site Tracking",
            "displayName": "Bounce Rate (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of bounces in relation to registered visits on a client's website for the selected tracking setup.",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "bounces",
            "category": "Site Tracking",
            "displayName": "Bounces",
            "displayFormat": "n0",
            "description": "This metric shows the number of bounces for the selected dimension. Bounces are such visits on a advertiser's website, when only one tracked page is visited during the entire visit (session).",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "clicks",
            "category": "Delivery",
            "displayName": "Clicks",
            "displayFormat": "n0",
            "description": "This metric shows the number of clicks for the selected dimension. A click occurs when a user interacts with the advertisement by engaging a mouse button (usually the left) while the mouse pointer is hovering over the advertisement.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "clicksToLandingPage",
            "category": "Site Tracking",
            "displayName": "Clicks to Landing Page",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of clicks ending up as visits on the landing page for the selected dimension.",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "conversions",
            "category": "Site Tracking",
            "displayName": "Conversions",
            "displayFormat": "n0",
            "description": "A tracked page can be defined as a Conversion - usually a page where a sign-up is confirmed or a sale is made. This metric shows the number of all Conversion pageviews, displayed as a sum for all tracked conversion pages. It has predefined Uniqueness of 'No Repeat', which means that Conversion pageviews, generated by the same user within 15 minutes, are excluded.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "conversionsAll",
            "category": "Site Tracking",
            "displayName": "Conversions (All)",
            "displayFormat": "n0",
            "description": "A tracked page can be defined as a Conversion - usually a page where a sign-up is confirmed or a sale is made. This metric shows the number of all Conversion pageviews   displayed as a sum for all tracked conversion pages.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "conversionsSpecs",
            "category": "Site Tracking",
            "displayName": "Conversions (Specs)",
            "displayFormat": "n0",
            "description": "A tracked page can be defined as a Conversion - usually a page where a sign-up is confirmed or a sale is made. This metric shows the number of all Conversion pageviews   displayed as a sum for all tracked conversion pages. There is a possibility to change uniqueness setting for this metric.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "cost",
            "category": "Cost",
            "displayName": "Cost",
            "displayFormat": "n2",
            "description": "This metric shows the cost value for the selected dimension (usually on a media, placement (line item) level). Please check documentation for more details.",
            "specsMetadata": [
                {
                    "key": "costDataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "costNonView",
            "category": "Cost",
            "displayName": "Cost (Non-Viewable)",
            "displayFormat": "n2",
            "description": "This metric shows the cost value taking into account the percentage of non-viewable and undetermined impressions. TIP: Check documentation for more details.",
            "specsMetadata": [
                {
                    "key": "viewSettings",
                    "displayName": "View. settings",
                    "description": "Display statistics according to selected ad viewability setting",
                    "specValuesMetadata": [
                        {
                            "key": "viewSettings1",
                            "displayName": "View. settings 1",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "viewSettings2",
                            "displayName": "View. settings 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "viewSettings3",
                            "displayName": "View. settings 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "costPostClick",
            "category": "Cost",
            "displayName": "Cost (Post Click)",
            "displayFormat": "n2",
            "description": "This metric shows the post click conversions cost.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "costView",
            "category": "Cost",
            "displayName": "Cost (Viewable)",
            "displayFormat": "n2",
            "description": "This metric shows the cost value taking into account the percentage of viewable impressions. TIP: Check documentation for more details.",
            "specsMetadata": [
                {
                    "key": "viewSettings",
                    "displayName": "View. settings",
                    "description": "Display statistics according to selected ad viewability setting",
                    "specValuesMetadata": [
                        {
                            "key": "viewSettings1",
                            "displayName": "View. settings 1",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "viewSettings2",
                            "displayName": "View. settings 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "viewSettings3",
                            "displayName": "View. settings 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "costBySales",
            "category": "Cost",
            "displayName": "Cost/Sales",
            "displayFormat": "n2",
            "description": "This metric shows Cost value divided by Sales value. Cost is either booked or accumulated cost for the selected dimension, or RTB Budget Spent in case of Real Time Bidding campaign. Sales is a system variable and represents the returned value of a campaign.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "cov",
            "category": "Site Tracking",
            "displayName": "COV (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the conversion rate for the selected dimension. Calculated as conversions divided from clicks, in percent.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "covVisitsPercent",
            "category": "Site Tracking",
            "displayName": "COV (Visits, %)",
            "displayFormat": "0.00%",
            "description": "This metric shows the visit conversion rate for the selected dimension. Calculated as conversions divided from visits, in percent.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ctrView",
            "category": "Delivery",
            "displayName": "CTR (Viewable, %)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of impressions that resulted in a click, taking into account only those impressions that were actually in the users' screens.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ctr",
            "category": "Delivery",
            "displayName": "CTR (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows click-through rate for the selected dimension. It is a percentage of users who have been exposed to an advertisement and then clicked. Calculated as clicks divided from impressions, in percent.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ctrAdjusted",
            "category": "Delivery",
            "displayName": "CTR (%) (adjusted)",
            "displayFormat": "0.00%",
            "description": "This metric shows click-through rate for the selected dimension. It is a percentage of users who have been exposed to an advertisement and then clicked. Calculated as clicks divided from impressions, in percent. This metric considers all tag serving types such as Impressions, Invisible, Offile, etc. except for Clicks in order to assure consistent metric values.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ctrUnique",
            "category": "Delivery",
            "displayName": "CTR Unique (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows unique click-through rate for the selected dimension. It is a percentage of unique users who have been exposed to an advertisement and then clicked. Calculated as campaign unique clicks divided from campaign impressions, in percent.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "delivered",
            "category": "Mediaplan",
            "displayName": "Delivered",
            "displayFormat": "n2",
            "description": "This metric shows the number of units delivered by a publisher. Could be used to monitor under-/overdelivery. TIP: Use with Buy Type dimension to discern units, e.g., impressions.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "deliveredPercent",
            "category": "Mediaplan",
            "displayName": "Delivered (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of units delivered by a publisher in relation to planned units. Could be used to monitor under-/overdelivery. TIP: Use with Buy Type dimension to discern units, e.g., impressions.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "deliveredClicks",
            "category": "Mediaplan",
            "displayName": "Delivered Clicks",
            "displayFormat": "n0",
            "description": "This metric shows the number of times that users clicked on a banner and were directed to an advertiser's destination. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in clicks.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "deliveredConversions",
            "category": "Mediaplan",
            "displayName": "Delivered Conversions",
            "displayFormat": "n0",
            "description": "This metric shows the number of times that users took the desired action  on an advertiser's website, e.g., purchased an item, subscribed to a newsletter. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in conversions.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "deliveredCostPercent",
            "category": "Mediaplan",
            "displayName": "Delivered Cost (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of cost delivered until now (using max cost, fixed price method) in relation to the net amount (or net amount 2, based on client settings), or RTB cost in relation to RTB budget. Could be used to monitor under-/overdelivery.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost Type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "deliveredImpressions",
            "category": "Mediaplan",
            "displayName": "Delivered Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the number of times that an advertisement was shown on a publisher's site. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in impressions.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "deliveredTime",
            "category": "Mediaplan",
            "displayName": "Delivered Time",
            "displayFormat": "n2",
            "description": "This metric shows the number of time units delivered by a publisher. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in time units.",
            "specsMetadata": [
                {
                    "key": "timeScope",
                    "displayName": "Time Scope",
                    "description": "Displays statistics in selected time units.",
                    "specValuesMetadata": [
                        {
                            "key": "days",
                            "displayName": "Days",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "weeks",
                            "displayName": "Weeks",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "months",
                            "displayName": "Months",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "years",
                            "displayName": "Years",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ecpa",
            "category": "Cost",
            "displayName": "eCPA",
            "displayFormat": "n2",
            "description": "This metric shows effective Cost per Conversion with the conversion pages listed as a sum. Cost is either booked or accumulated cost for the selected dimension, or RTB Budget Spent in case of Real Time Bidding campaign.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "seCPA",
            "category": "Cost",
            "displayName": "eCPA (SE)",
            "displayFormat": "n2",
            "description": "This metric shows effective Cost per Conversion with the conversion pages listed as a sum. Used for Search Engine campaigns, when Search Engine calculates cost, but Adform tracks conversions.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ecpc",
            "category": "Cost",
            "displayName": "eCPC",
            "displayFormat": "n2",
            "description": "This metric shows cost per click for the selected dimension. Cost is either booked or accumulated cost for the selected dimension, or RTB Budget Spent in case of Real Time Bidding campaign.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ecpi",
            "category": "Cost",
            "displayName": "eCPI",
            "displayFormat": "n2",
            "description": "This metric shows cost per impression for the selected dimension. Cost is either booked or accumulated cost for the selected dimension, or RTB Budget Spent in case of Real Time Bidding campaign.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ecpm",
            "category": "Cost",
            "displayName": "eCPM",
            "displayFormat": "n2",
            "description": "This metric shows cost per mille (thousand impressions) for the selected dimension.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ecpmv",
            "category": "Cost",
            "displayName": "eCPM (Viewable)",
            "displayFormat": "n2",
            "description": "This metric shows the effective cost value of a thousand viewable impressions. TIP: Check documentation for more details.",
            "specsMetadata": [
                {
                    "key": "viewSettings",
                    "displayName": "View. settings",
                    "description": "Display statistics according to selected ad viewability setting",
                    "specValuesMetadata": [
                        {
                            "key": "viewSettings1",
                            "displayName": "View. settings 1",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "viewSettings2",
                            "displayName": "View. settings 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "viewSettings3",
                            "displayName": "View. settings 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ecpp",
            "category": "Cost",
            "displayName": "eCPP",
            "displayFormat": "n2",
            "description": "This metric shows effective cost per pageview for the selected dimension. Cost is either booked or accumulated cost for the selected dimension, or RTB Budget Spent in case of Real Time Bidding campaign. All tracking points are taken into acount when calculating this metric.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "engagementRate",
            "category": "Engagement",
            "displayName": "Engagement Rate (%)",
            "displayFormat": "0.00%",
            "description": "This metric is calculated as Engaging impressions / Impressions * 100 %. Engaging impressions stand for the sum of impressions, where at least one engagement occurred during each impression. Engagements are tracked as user-initiated banner events for Rich Media, Flash and Image banner types. Examples of user-initiated banner events are mouse-over (only if > 1 sec.), video play button press, close button press, etc.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "engagements",
            "category": "Engagement",
            "displayName": "Engagements",
            "displayFormat": "n0",
            "description": "This metric shows the count of user interactions with a banner. User interactions are tracked as user-initiated banner events for Rich Media, Flash and Image banner types. Examples of user-initiated banner events are mouse-over (only if &gt; 1 sec.), video play button press, close button press, etc. Not user-initiated banner events are not included into this metric, except for auto-expand event. Examples of not user-initiated banner event are Floating Banner Shown, 25% of Video Play, etc.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "engagingImpressions",
            "category": "Engagement",
            "displayName": "Engaging Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the sum of impressions, where at least one engagement occurred during each impression. Engagements are tracked as user-initiated banner events for Rich Media, Flash and Image banner types. Examples of user-initiated banner events are mouse-over (only if &gt; 1 sec.), video play button press, close button press, etc.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "entrances",
            "category": "Site Tracking",
            "displayName": "Entrances",
            "displayFormat": "n0",
            "description": "This metric shows the number of session entries for the selected dimension. A session entry occurs when a user enters a website and starts browsing. Tip: use with dimension Page in order to see number of entries for each tracked page seperately.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "events",
            "category": "Engagement",
            "displayName": "Events",
            "displayFormat": "n0",
            "description": "This metric shows how many times an event has been invoked in a banner. Events can be implemented in flash banners in order to track user interactions with banners, such as expands, clicks on play button, etc. Tip: use with dimension Event Name if several different events are implemented.",
            "specsMetadata": [
                {
                    "key": "eventType",
                    "displayName": "Event type",
                    "description": "Display statistics for selected banner event type only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "allExpands",
                            "displayName": "All expands",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "firstExpand",
                            "displayName": "First expand",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "otherExpands",
                            "displayName": "Other expands",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "customEvent1",
                            "displayName": "Custom event 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "customEvent2",
                            "displayName": "Custom event 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "customEvent3",
                            "displayName": "Custom event 3",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "customEvent4",
                            "displayName": "Custom event 4",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "customEvent5",
                            "displayName": "Custom event 5",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mouseOver",
                            "displayName": "Mouse over",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "videoPlayStart",
                            "displayName": "Video play start",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "exits",
            "category": "Site Tracking",
            "displayName": "Exits",
            "displayFormat": "n0",
            "description": "This metric shows the number of session exits for the selected dimension. A session exit occurs when a user leaves a website (either due to literally leaving the site or due to the session time-out). Tip: use with dimension Page in order to see number of exits for each tracked page seperately.",
            "specsMetadata": [
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "expansionRate",
            "category": "Engagement",
            "displayName": "Expansion Rate (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the ratio of banner expansions to the number of impressions. The Expansion rate is calculated as All Expands / Impressions * 100%. Data from automatically expanding banners is excluded.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "impressions",
            "category": "Delivery",
            "displayName": "Tracked Ads",
            "displayFormat": "n0",
            "description": "This metric shows the number of tracked ads (formerly known as impressions) and includes both rendered and served-but-not-rendered ads.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "measurableImpressions",
            "category": "Viewability",
            "displayName": "Measurable Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that were measured for viewability. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "measurableImpressionsPercent",
            "category": "Viewability",
            "displayName": "Impression Distribution (Measurable, %)",
            "displayFormat": "0.00%",
            "description": "This metric shows the part of eligible impressions that were measured for viewability, calculated as the percentage of measurable impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "mouseOverRate",
            "category": "Engagement",
            "displayName": "Mouse Over Rate (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the ratio of mouse overs to the number of impressions. The Mouse Overs are counted when a user hovers his/her mouse pointer over a banner. Only mouse overs which lasted 1 second or more are counted.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "mouseovers",
            "category": "Engagement",
            "displayName": "Mouse Overs",
            "displayFormat": "n2",
            "description": "This metric shows the number of mouse overs on banner. Only mouse overs, which lasted 1 second or more, are registered.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "mpPrice",
            "category": "Mediaplan",
            "displayName": "Price",
            "displayFormat": "n2",
            "description": "This metric shows the price paid per booked unit visible in the Mediaplan. It can be set to show gross price, net price or net price 2. Could be used to report on the cost and fee breakdown of a campaign.",
            "specsMetadata": [
                {
                    "key": "mpPriceType",
                    "displayName": "Price Type",
                    "description": "Display selected price level",
                    "specValuesMetadata": [
                        {
                            "key": "net",
                            "displayName": "Net",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "net2",
                            "displayName": "Net 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "gross",
                            "displayName": "Gross",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "overdelivered",
            "category": "Mediaplan",
            "displayName": "Overdelivered",
            "displayFormat": "n2",
            "description": "This metric shows the number of units delivered over the booked volume. Could be used to monitor under-/overdelivery. TIP: Use with Buy Type dimension to discern units, e.g., impressions.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "overdeliveredClicks",
            "category": "Mediaplan",
            "displayName": "Overdelivered Clicks",
            "displayFormat": "n0",
            "description": "This metric shows the number of clicks delivered over the booked volume. Could be used to monitor under-/overdelivery. TIP: Values are only displayed for line items booked in clicks.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "overdeliveredImpressions",
            "category": "Mediaplan",
            "displayName": "Overdelivered Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the number of impressions delivered over the booked volume.  Could be used to monitor under-/overdelivery.TIP: Values are only displayed for line items booked in impressions.",
            "specsMetadata": [
                {
                    "key": "mpCalculationTime",
                    "displayName": "Calculation Time",
                    "description": "Displays statistics for selected period.",
                    "specValuesMetadata": [
                        {
                            "key": "reportingPeriod",
                            "displayName": "Rep. period",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "total",
                            "displayName": "Total",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "pageviews",
            "category": "Site Tracking",
            "displayName": "Pageviews",
            "displayFormat": "n0",
            "description": "This metric shows the number of all tracked pages (tracking points) pageviews, displayed as a sum for all tracked pages. It has predefined Uniqueness of 'No Repeat', which means that pageviews, generated by the same user within 15 minutes, are excluded.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "pageviewsAll",
            "category": "Site Tracking",
            "displayName": "Pageviews (All)",
            "displayFormat": "n0",
            "description": "This metric shows the number of all tracked pages (tracking points) pageviews, displayed as a sum for all tracked pages.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "pageviewsSpecsTemp",
            "category": "Site Tracking",
            "displayName": "Pageviews (Specs)",
            "displayFormat": "n0",
            "description": "This metric shows the number of all tracked pages (tracking points) pageviews, displayed as a sum for all tracked pages.  There is a possibility to change uniqueness setting for this metric.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "roi",
            "category": "Cost",
            "displayName": "ROI (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the return of investment. A positive value corresponds to capital growth, a negative value corresponds to capital decay, and a value of 0% corresponds to no change. It is calculated as (Sales - Cost) / Cost * 100%, or as (Sales - RTB Budget Spent) / RTB Budget Spent * 100% in case of Real Time Bidding campaign.",
            "specsMetadata": [
                {
                    "key": "costDataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "rtbBids",
            "category": "Delivery",
            "displayName": "RTB Bids",
            "displayFormat": "n0",
            "description": "This metric shows the number of offers done by Adform in attempt to win an impression on an ad exchange auction.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbWinRate",
            "category": "Delivery",
            "displayName": "RTB Win Rate (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the proportion of impressions (won bids) in total number of bids (attempts to win an impression). Calculated as Impressions / Bids in %.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "rtbMediaCost",
            "category": "Cost",
            "displayName": "RTB Media Cost",
            "displayFormat": "n2",
            "description": "This metric shows the cost for which inventory was purchased from ad exchanges.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbAdformIncludedFee",
            "category": "Cost",
            "displayName": "RTB Adform Included Fee",
            "displayFormat": "n2",
            "description": "This metric shows the amount of Adform included fee.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbRichMediaFee",
            "category": "Cost",
            "displayName": "RTB Rich Media Fee",
            "displayFormat": "n2",
            "description": "This metric shows the amount of Rich Media fees which are applied to heavy banners, rich media banners and banners with video.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbTradingDeskFee",
            "category": "Cost",
            "displayName": "RTB Trading Desk Fee",
            "displayFormat": "n2",
            "description": "This metric shows the amount of Trading desk fee.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbContextualTargetingCost",
            "category": "Cost",
            "displayName": "RTB Contextual Targeting Cost",
            "displayFormat": "n2",
            "description": "This metric shows the amount of Contextual targeting costs.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbBrandSafetyCost",
            "category": "Cost",
            "displayName": "RTB Brand Safety Cost",
            "displayFormat": "n2",
            "description": "This metric shows the amount of Brand safety costs.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "sales",
            "category": "Site Tracking",
            "displayName": "Sales",
            "displayFormat": "n2",
            "description": "This metric shows the sales value collected from all visits on tracked pages and is an Order level variable. Collected only if variable is implemented in Tracking points.  It has predefined Uniqueness of 'No Repeat', which means that sales value form pageviews, generated by the same user within 15 minutes, are excluded.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "salesAll",
            "category": "Site Tracking",
            "displayName": "Sales (All)",
            "displayFormat": "n2",
            "description": "This metric shows the sales value collected from all visits on tracked pages. Collected only if variable is implemented in Tracking points.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "salesSpecs",
            "category": "Site Tracking",
            "displayName": "Sales (Specs)",
            "displayFormat": "n2",
            "description": "This metric shows the sales value collected from all visits on tracked pages. Colected only if variable is implemented in Tracking points. There is a possibility to change uniqueness setting for this metric.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "salesByCost",
            "category": "Cost",
            "displayName": "Sales/Cost",
            "displayFormat": "n2",
            "description": "This metric shows Sales value divided by Cost value. Cost is either booked or accumulated cost for the selected dimension, or RTB Budget Spent in case of Real Time Bidding campaign. Sales is a system variable and represents the returned value of a campaign.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "costType",
                    "displayName": "Cost type",
                    "description": "Apply selected cost calculation method",
                    "specValuesMetadata": [
                        {
                            "key": "maxCost",
                            "displayName": "Max cost",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fixedCost",
                            "displayName": "Fixed cost",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "fixedPrice",
                            "displayName": "Fixed price",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "rtb",
                            "displayName": "RTB",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "seAvgCPC",
            "category": "Cost",
            "displayName": "SE Avg. CPC",
            "displayFormat": "n2",
            "description": "This metric shows average cost per click value for the selected dimension in Search Engine campaigns.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "seAvgPosition",
            "category": "Delivery",
            "displayName": "SE Avg. Position",
            "displayFormat": "n2",
            "description": "This metric shows average position value for the selected dimension in Search Engine campaigns.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "sysvarBasketSize",
            "category": "Site Tracking",
            "displayName": "Sys Var Basket Size",
            "displayFormat": "n0",
            "description": "This metric shows the size of the basket (shopping cart) and is an Order level variable. It is a system variable collected from visitors on a tracked page of advertiser's website.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "sysvarNumeric1",
            "category": "Site Tracking",
            "displayName": "Sys Var Numeric 1",
            "displayFormat": "n2",
            "description": "This metric shows numeric information collected from visitors on a tracked page of a client's website. It is a system variable and its name can be edited on the Variables tab in Tracking section.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "sysvarNumeric2",
            "category": "Site Tracking",
            "displayName": "Sys Var Numeric 2",
            "displayFormat": "n2",
            "description": "This metric shows numeric information collected from visitors on a tracked page of a client's website. It is a system variable and its name can be edited on the Variables tab in Tracking section.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "sysvarProductCount",
            "category": "Site Tracking",
            "displayName": "Sys Var Product Count",
            "displayFormat": "n0",
            "description": "This metric shows the number of ordered products and is a Product level variable. It is a system variable collected from visitors on a tracked page of advertiser's website.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "sysvarProductSales",
            "category": "Site Tracking",
            "displayName": "Sys Var Product Sales",
            "displayFormat": "n2",
            "description": "This metric shows the sales amount of ordered products and is a Product level variable. It is a system variable collected from visitors on a tracked page of advertiser's website.",
            "specsMetadata": [
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "videoCompletionRate",
            "category": "Engagement",
            "displayName": "Video Completion Rate (%)",
            "displayFormat": "0.00%",
            "description": "Video completion rate is calculated as Video Completed / Video Play Started * 100%",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "videoEvents",
            "category": "Engagement",
            "displayName": "Video Events",
            "displayFormat": "n2",
            "description": "This metric shows the interactions with video banners, where banner events are implemented. Interactions such as Play, Pause, Stop, Sound On, and others can be reported.",
            "specsMetadata": [
                {
                    "key": "videoInteractionType",
                    "displayName": "Video Interaction Type",
                    "description": "Displays statistics for selected video interaction type",
                    "specValuesMetadata": [
                        {
                            "key": "play",
                            "displayName": "Play",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "pause",
                            "displayName": "Pause",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "stop",
                            "displayName": "Stop",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "soundOn",
                            "displayName": "Sound On",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "soundOff",
                            "displayName": "Sound Off",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fullScreenOn",
                            "displayName": "Full Screen On",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "fullScreenOff",
                            "displayName": "Full Screen Off",
                            "isDefault": true,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "videoEventsPlayTimePercent",
            "category": "Engagement",
            "displayName": "Video Events (Play Time, %)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of video viewed for the selected dimension.",
            "specsMetadata": [
                {
                    "key": "videoEventType",
                    "displayName": "Video Event Type",
                    "description": "Displays statistics for selected video event type",
                    "specValuesMetadata": [
                        {
                            "key": "25Percent",
                            "displayName": "25%",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "50Percent",
                            "displayName": "50%",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "75Percent",
                            "displayName": "75%",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "100Percent",
                            "displayName": "100%",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "videoStartRate",
            "category": "Engagement",
            "displayName": "Video Start Rate (%)",
            "displayFormat": "0.00%",
            "description": "Video start rate is calculated as Video Play Started / Impressions * 100%",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "viewImpressionsIAB",
            "category": "Viewability",
            "displayName": "Viewable Impressions for IAB Viewability",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that were actually in the users' screens. According to IAB standards, an impression is counted as viewable when at least 50 % of the banner area is visible in the user's screen for at least 1 second; at least 30% of the large (greater than 242,000 pixels) banner area is visible in the user's screen for at least 1 second; at least 50% of the in-stream video is visible in the user's screen for at least 2 seconds. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "viewImpressionsCustom1",
            "category": "Viewability",
            "displayName": "Viewable Impressions for Custom Viewability #1",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that were actually in the users' screens. Note: viewable impression custom thresholds #1 and #2 can be defined in the Ad Viewability Settings in Campaign Details. The custom thresholds can't be lower than stated in IAB standard. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "viewImpressionsCustom2",
            "category": "Viewability",
            "displayName": "Viewable Impressions for Custom Viewability #2",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that were actually in the users' screens. Note: viewable impression custom thresholds #1 and #2 can be defined in the Ad Viewability Settings in Campaign Details. The custom thresholds can't be lower than stated in IAB standard. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "visitors",
            "category": "Site Tracking",
            "displayName": "Visitors",
            "displayFormat": "n0",
            "description": "Shows the number of unique visitors in advertiser's website for the selected tracking setup.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "visits",
            "category": "Site Tracking",
            "displayName": "Visits",
            "displayFormat": "n0",
            "description": "Shows the number of visits in advertiser's website for the selected tracking setup.",
            "specsMetadata": [
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "vtr",
            "category": "Site Tracking",
            "displayName": "VTR (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the impression conversion rate for the selected dimension. Calculated as Conversions divided by Impressions and multiplied by 1000, in percents.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "noRepeat",
                            "displayName": "No repeats",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointSession",
                            "displayName": "Point - session",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "sessions",
                            "displayName": "Sessions",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "dcoProductViews",
            "category": "Delivery",
            "displayName": "Product Retargeting Item Views",
            "displayFormat": "n0",
            "description": "The number of times that a Product Retargeting item was shown in a banner. One of the most commonly used KPIs to evaluate the performance of an item.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "ctrDco",
            "category": "Delivery",
            "displayName": "CTR (Product Retargeting item, %)",
            "displayFormat": "0.00%",
            "description": "The percentage of Product Retargeting item views that resulted in a click. One of the most commonly used KPIs to evaluate the performance of an item.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "nonViewableImpressionsIAB",
            "category": "Viewability",
            "displayName": "Non-Viewable Impressions for IAB Viewability",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that were not in the users' screens. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "nonViewableImpressionsCustom1",
            "category": "Viewability",
            "displayName": "Non-Viewable Impressions for Custom Viewability #1",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that were not in the users' screens. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "nonViewableImpressionsCustom2",
            "category": "Viewability",
            "displayName": "Non-Viewable Impressions for Custom Viewability #2",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that were not in the users' screens. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionspct",
            "category": "Delivery",
            "displayName": "Impressions (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the proportion of impressions for the selected dimension, in comparison with the total number of impressions.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "undeterminedImpressions",
            "category": "Viewability",
            "displayName": "Undetermined Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions that could not be measured for viewability. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionDistributionNonViewablePctIAB",
            "category": "Viewability",
            "displayName": "Impression Distribution (Non-Viewable, %) for IAB viewability",
            "displayFormat": "0.00%",
            "description": "This metric shows part of rendered impressions that were not in the users' screens, calculated as the percentage of non-viewable impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionDistributionNonViewablePctCustom1",
            "category": "Viewability",
            "displayName": "Impression Distribution (Non-Viewable, %) for Custom Viewability #1",
            "displayFormat": "0.00%",
            "description": "This metric shows part of rendered impressions that were not in the users' screens, calculated as the percentage of non-viewable impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionDistributionNonViewablePctCustom2",
            "category": "Viewability",
            "displayName": "Impression Distribution (Non-Viewable, %) for Custom Viewability #2",
            "displayFormat": "0.00%",
            "description": "This metric shows part of rendered impressions that were not in the users' screens, calculated as the percentage of non-viewable impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionDistributionUndeterminedPct",
            "category": "Viewability",
            "displayName": "Impression Distribution (Undetermined, %)",
            "displayFormat": "0.00%",
            "description": "This metric shows part of rendered impressions that were not measured for viewability, calculated as the percentage of non-measured impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionDistributionViewablePctIAB",
            "category": "Viewability",
            "displayName": "Impression Distribution (Viewable, %) for IAB viewability",
            "displayFormat": "0.00%",
            "description": "This metric shows part of rendered impressions that were in the users' screens, calculated as the percentage of viewable impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionDistributionViewablePctCustom1",
            "category": "Viewability",
            "displayName": "Impression Distribution (Viewable, %) for Custom Viewability #1",
            "displayFormat": "0.00%",
            "description": "This metric shows part of rendered impressions that were in the users' screens, calculated as the percentage of viewable impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "impressionDistributionViewablePctCustom2",
            "category": "Viewability",
            "displayName": "Impression Distribution (Viewable, %) for Custom Viewability #2",
            "displayFormat": "0.00%",
            "description": "This metric shows part of rendered impressions that were in the users' screens, calculated as the percentage of viewable impressions in relation to eligible impressions. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "dmpDspDataCost",
            "category": "Cost",
            "displayName": "DMP Data Cost (DSP)",
            "displayFormat": "n2",
            "description": "This metric shows total data cost that was spent on DMP data to win an impression in RTB.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "dmpRotatorsDataCost",
            "category": "Cost",
            "displayName": "DMP Data Cost (Creative)",
            "displayFormat": "n2",
            "description": "This metric shows total data cost that was spent on DMP data to show an impression in creatives.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "impressionscrossdevice",
            "category": "Delivery",
            "displayName": "Impressions (cross-device)",
            "displayFormat": "n0",
            "description": "This metric shows the number of times that an advertisement was shown on a publisher's site. When selecting uniqueness levels, a user is considered unique across all their devices.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "clickscrossdevice",
            "category": "Delivery",
            "displayName": "Clicks (cross-device)",
            "displayFormat": "n0",
            "description": "This metric shows the number of times that users clicked on a banner and were directed to an advertiser's destination. When selecting uniqueness levels, a user is considered unique across all their devices. TIP: User engagements with rich media banners, e.g., click on video play start button, are not taken into account.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "conversionscrossdevice",
            "category": "Site Tracking",
            "displayName": "Conversions (cross-device)",
            "displayFormat": "n0",
            "description": "This metric shows the number of times that users took the desired action on an advertiser's website, e.g., purchased an item, subscribed to a newsletter. Here, the user may have interacted with the campaign and website on different devices.",
            "specsMetadata": [
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "pageviewscrossdevice",
            "category": "Site Tracking",
            "displayName": "Pageviews (cross-device)",
            "displayFormat": "n0",
            "description": "This metric shows the number of times pages on an advertiser's website were viewed. Here, the user may have interacted with the campaign and website on different devices. TIP: Use with dimension Page in order to see data for each page separately.",
            "specsMetadata": [
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "ctrcrossdevice",
            "category": "Delivery",
            "displayName": "CTR (cross-device, %)",
            "displayFormat": "0.00%",
            "description": "This metric shows the percentage of impressions that resulted in a click. When selecting uniqueness levels, a user is considered unique across all their devices.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "covcrossdevice",
            "category": "Site Tracking",
            "displayName": "COV (cross-device, %)",
            "displayFormat": "0.00%",
            "description": "This metric shows the conversion rate, calculated as the ratio of conversions to clicks. Here, the user may have interacted with the campaign and website on different devices.",
            "specsMetadata": [
                {
                    "key": "dataSource",
                    "displayName": "Data Source",
                    "description": "Statistics from Adform or another available data source",
                    "specValuesMetadata": [
                        {
                            "key": "adform",
                            "displayName": "Adform",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "se",
                            "displayName": "Search engine",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "conversionType",
                    "displayName": "Conversion type",
                    "description": "Display statistics for selected conversion type only",
                    "specValuesMetadata": [
                        {
                            "key": "allConversionTypes",
                            "displayName": "All conversion types",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "conversionType1",
                            "displayName": "Conversion type 1",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType2",
                            "displayName": "Conversion type 2",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "conversionType3",
                            "displayName": "Conversion type 3",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "avgFrequencycrossdevice",
            "category": "Delivery",
            "displayName": "Avg. Frequency (cross-device)",
            "displayFormat": "n2",
            "description": "This metric shows the average number of impressions to which a user has been exposed. When selecting uniqueness levels, a user is considered unique across all their devices. Could be used to evaluate reach of a campaign. TIP: To evaluate frequency capping, select the appropriate uniqueness level, and use the corresponding dimensions. Check documentation for more details.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "salescrossdevice",
            "category": "Site Tracking",
            "displayName": "Sales (cross-device)",
            "displayFormat": "n2",
            "description": "This metric shows the sales value transmitted on conversion pages on an advertiser's website, e.g., thank you page. Here, the user may have interacted with the campaign and website on different devices. TIP: Sales variable needs to be transmitted on a conversion tracking point.",
            "specsMetadata": [
                {
                    "key": "visitUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "pointCampaign",
                            "displayName": "Point - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allSitesCampaign",
                            "displayName": "All sites - campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "orders",
                            "displayName": "Orders",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "pageCategory",
                    "displayName": "Page category",
                    "description": "Display statistics for selected page category only",
                    "specValuesMetadata": [
                        {
                            "key": "allPages",
                            "displayName": "All pages",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "landingPages",
                            "displayName": "Landing pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "infoPages",
                            "displayName": "Info pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "signUpPages",
                            "displayName": "Sign-up pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "none",
                            "displayName": "None",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "homepage",
                            "displayName": "Homepages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "productPage",
                            "displayName": "Product pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "thankYouPage",
                            "displayName": "Thank-you pages",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "download",
                            "displayName": "Download",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                },
                {
                    "key": "adInteraction",
                    "displayName": "Ad interaction",
                    "description": "Display site tracking statistics for selected ad interaction only",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "postClick",
                            "displayName": "Post click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "postImpression",
                            "displayName": "Post impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentClick",
                            "displayName": "Recent click",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "recentImpression",
                            "displayName": "Recent impression",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allCampaign",
                            "displayName": "All campaign",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "allNonCampaign",
                            "displayName": "All non-campaign",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "renderedImpressions",
            "category": "Delivery",
            "displayName": "Rendered Impressions",
            "displayFormat": "n0",
            "description": "The number of times that an advertisement was rendered anywhere in a user's browser. This metric has been accredited by the Media Rating Council (MRC).",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "videoPlayStartCount",
            "category": "Engagement",
            "displayName": "Video Starts (all)",
            "displayFormat": "n0",
            "description": "This metric shows the total number of video starts (including both auto-play and user-initiated video plays). TIP: Only unique starts are reported.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "userInitiatedVideoPlayCount",
            "category": "Engagement",
            "displayName": "Video Plays (user initiated)",
            "displayFormat": "n0",
            "description": "This metric shows the number of user-initiated video plays (\"play\" button presses).",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbLostBids",
            "category": "Delivery",
            "displayName": "RTB Lost Bids",
            "displayFormat": "n0",
            "description": "This metric shows the number of RTB bids that were lost (for instance, when a creative was outbid or if the creative requires additional review). Statistics are based on sampled data.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbLossRate",
            "category": "Delivery",
            "displayName": "RTB Loss Rate (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the part of all RTB bids that were lost (for instance, when a creative was outbid or if the creative requires additional review), calculated as Lost Bids / RTB Bids. Statistics are based on sampled lost bid data.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "rtbCrossDeviceCost",
            "category": "Cost",
            "displayName": "RTB Cross-Device Cost",
            "displayFormat": "n2",
            "description": "This metric shows the amount of Cross device costs.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "eligibleImpressions",
            "category": "Delivery",
            "displayName": "Eligible Impressions",
            "displayFormat": "n0",
            "description": "This metric shows the number of eligible impressions. Eligible impressions are impressions that have been fully rendered in the user's browser, and were eligible for viewability measurement based on the creative format and tag type.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "measurableRate",
            "category": "Viewability",
            "displayName": "Measurable Rate (%)",
            "displayFormat": "0.00%",
            "description": "This metric shows the part of rendered impressions that were measured for viewability, calculated as the percentage of measurable impressions in relation to rendered impressions.",
            "specsMetadata": [
                {
                    "key": "adUniqueness",
                    "displayName": "Uniqueness",
                    "description": "Display statistics for selected uniqueness level",
                    "specValuesMetadata": [
                        {
                            "key": "all",
                            "displayName": "All",
                            "isDefault": true,
                            "description": ""
                        },
                        {
                            "key": "campaignUnique",
                            "displayName": "Campaign unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "campaignDayUnique",
                            "displayName": "Campaign day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "mediaUnique",
                            "displayName": "Media unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemUnique",
                            "displayName": "Line item unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "lineItemDayUnique",
                            "displayName": "Line item day unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "bannerUnique",
                            "displayName": "Banner unique",
                            "isDefault": false,
                            "description": ""
                        },
                        {
                            "key": "notCampaignUnique",
                            "displayName": "Not campaign unique",
                            "isDefault": false,
                            "description": ""
                        }
                    ]
                }
            ],
            "attributes": []
        },
        {
            "key": "bannerClickInteractions",
            "category": "Delivery",
            "displayName": "Banner Click Interactions",
            "displayFormat": "n0",
            "description": "This metric shows the number of clicks interactions for Banner Click Coordinate X and Banner Click Coordinate Y. It is used to draw Banner Heat Map report overlay.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "dmpRtbCrossDeviceCost",
            "category": "Cost",
            "displayName": "DMP Cross Device Extension Cost",
            "displayFormat": "n2",
            "description": "This metric shows total cross device extension cost that was spent on DMP Cross Device extension data to win an impression in RTB.",
            "specsMetadata": [],
            "attributes": []
        },
        {
            "key": "dmpRtbLookalikeCost",
            "category": "Cost",
            "displayName": "DMP Lookalike Extension Cost",
            "displayFormat": "n2",
            "description": "This metric shows total lookalike extension cost that was spent on DMP Lookalike extension data to win an impression in RTB.",
            "specsMetadata": [],
            "attributes": []
        }
    ],
    "correlationCode": "ext_133c3a7e-0efd-4e7e-835d-2f854328d4a3"
}
```