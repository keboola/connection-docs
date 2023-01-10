---
title: Columns and primary key of report configuration presets
permalink: /components/extractors/marketing-sales/bing-ads/report-presets-columns-and-pk/
redirect_from:
    - /extractors/marketing-sales/bing-ads/report-presets-columns-and-pk/
---

* TOC
{:toc}

## AccountPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther```
## AccountImpressionPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AbsoluteTopImpressionRatePercent, AbsoluteTopImpressionShareLostToBudgetPercent, AbsoluteTopImpressionShareLostToRankPercent, AbsoluteTopImpressionSharePercent, ClickSharePercent, ExactMatchImpressionSharePercent, ImpressionLostToBudgetPercent, ImpressionLostToRankAggPercent, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist, ImpressionSharePercent```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType```
## AdGroupPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, AdGroupId, AdGroupName, Language, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, CampaignStatus, CustomParameters, FinalUrlSuffix, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, Revenue, RevenuePerConversion, RevenuePerAssist, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, HistoricalAdRelevance, HistoricalExpectedCtr, HistoricalLandingPageExperience, HistoricalQualityScore```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, AdGroupId, Language, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, AdGroupId, AdGroupName, Language, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, CampaignStatus, CustomParameters, FinalUrlSuffix, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, Revenue, RevenuePerConversion, RevenuePerAssist, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, AdGroupId, Language, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther```
## AdGroupImpressionPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, AdGroupId, AdGroupName, Language, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, CampaignStatus, CustomParameters, FinalUrlSuffix, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, Revenue, RevenuePerConversion, RevenuePerAssist, AbsoluteTopImpressionRatePercent, AbsoluteTopImpressionShareLostToBudgetPercent, AbsoluteTopImpressionShareLostToRankPercent, AbsoluteTopImpressionSharePercent, ClickSharePercent, ExactMatchImpressionSharePercent, ImpressionLostToBudgetPercent, ImpressionLostToRankAggPercent, ImpressionSharePercent, HistoricalAdRelevance, HistoricalExpectedCtr, HistoricalLandingPageExperience, HistoricalQualityScore```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, AdGroupId, Language```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, AdGroupId, AdGroupName, Language, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, CampaignStatus, CustomParameters, FinalUrlSuffix, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, Revenue, RevenuePerConversion, RevenuePerAssist```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, AdGroupId, Language```
## CampaignPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, CampaignStatus, CustomParameters, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, BudgetName, BudgetStatus, BudgetAssociationStatus, HistoricalAdRelevance, HistoricalExpectedCtr, HistoricalLandingPageExperience, HistoricalQualityScore```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, CampaignStatus, CustomParameters, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, BudgetName, BudgetStatus, BudgetAssociationStatus```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther```
## CampaignImpressionPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, CampaignStatus, CustomParameters, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist, AbsoluteTopImpressionRatePercent, AbsoluteTopImpressionShareLostToBudgetPercent, AbsoluteTopImpressionShareLostToRankPercent, AbsoluteTopImpressionSharePercent, ClickSharePercent, ExactMatchImpressionSharePercent, ImpressionLostToBudgetPercent, ImpressionLostToRankAggPercent, ImpressionSharePercent, HistoricalAdRelevance, HistoricalExpectedCtr, HistoricalLandingPageExperience, HistoricalQualityScore```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, AccountName, DeliveredMatchType, CampaignId, CampaignName, CampaignStatus, CustomParameters, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, PhoneImpressions, PhoneCalls, CostPerConversion, Ptr, Assists, CostPerAssist, AllRevenue, AllRevenuePerConversion, AverageCpc, AverageCpm, AveragePosition, ConversionRate, ConversionsQualified, LowQualityClicks, LowQualityClicksPercent, LowQualityConversionRate, LowQualityConversions, LowQualityConversionsQualified, LowQualityGeneralClicks, LowQualityImpressions, LowQualityImpressionsPercent, LowQualitySophisticatedClicks, Revenue, RevenuePerConversion, RevenuePerAssist```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId```
## ProductDimensionPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, CampaignId, CampaignName, AdGroupId, AdGroupName, AdId, Language, TopVsOther, MerchantProductId, Condition, Price, ClickTypeId, BidStrategyType, StoreId, Brand, LocalStoreCode, ClickType, Title, SellerName, OfferLanguage, CountryOfSale, TotalClicksOnAdElements, CustomLabel0, CustomLabel1, CustomLabel2, CustomLabel3, CustomLabel4, ProductCategory1, ProductCategory2, ProductCategory3, ProductCategory4, ProductCategory5, ProductType1, ProductType2, ProductType3, ProductType4, ProductType5, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, ConversionRate, ConversionsQualified, Revenue, RevenuePerConversion, AssistedImpressions, AssistedClicks, AverageCpc, AverageCpm```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, CampaignId, AdGroupId, AdId, Language, TopVsOther, MerchantProductId, Condition, Price, ClickTypeId, BidStrategyType, StoreId```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, CampaignId, CampaignName, AdGroupId, AdGroupName, AdId, Language, TopVsOther, MerchantProductId, Condition, Price, ClickTypeId, BidStrategyType, StoreId, Brand, LocalStoreCode, ClickType, Title, SellerName, OfferLanguage, CountryOfSale, TotalClicksOnAdElements, CustomLabel0, CustomLabel1, CustomLabel2, CustomLabel3, CustomLabel4, ProductCategory1, ProductCategory2, ProductCategory3, ProductCategory4, ProductCategory5, ProductType1, ProductType2, ProductType3, ProductType4, ProductType5, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, ConversionRate, ConversionsQualified, Revenue, RevenuePerConversion, AssistedImpressions, AssistedClicks, AverageCpc, AverageCpm```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, CampaignId, AdGroupId, AdId, Language, TopVsOther, MerchantProductId, Condition, Price, ClickTypeId, BidStrategyType, StoreId```
## KeywordPerformance Report Presets
### Daily aggregation
#### Columns
```AccountId, AccountName, CampaignId, CampaignName, AdGroupId, AdGroupName, KeywordId, Keyword, AdId, TimePeriod, CurrencyCode, DeliveredMatchType, AdDistribution, DeviceType, Language, Network, DeviceOS, TopVsOther, BidMatchType, KeywordStatus, Impressions, Clicks, Ctr, CurrentMaxCpc, AverageCpc, Spend, AveragePosition, Conversions, ConversionsQualified, ConversionRate, CostPerConversion, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, QualityImpact, Assists, ReturnOnAdSpend, CostPerAssist, CustomParameters, FinalAppUrl, Mainline1Bid, MainlineBid, FirstPageBid, FinalUrlSuffix, ViewThroughConversions, ViewThroughConversionsQualified, AllCostPerConversion, AllReturnOnAdSpend, AllConversionsQualified, AllRevenue, AllRevenuePerConversion, HistoricalAdRelevance, HistoricalExpectedCtr, HistoricalLandingPageExperience, HistoricalQualityScore, Revenue, RevenuePerAssist, RevenuePerConversion```
#### Primary key
```AccountId, CampaignId, AdGroupId, KeywordId, AdId, TimePeriod, CurrencyCode, DeliveredMatchType, AdDistribution, DeviceType, Language, Network, DeviceOS, TopVsOther, BidMatchType```
### Hourly aggregation
#### Columns
```AccountId, AccountName, CampaignId, CampaignName, AdGroupId, AdGroupName, KeywordId, Keyword, AdId, TimePeriod, CurrencyCode, DeliveredMatchType, AdDistribution, DeviceType, Language, Network, DeviceOS, TopVsOther, BidMatchType, KeywordStatus, Impressions, Clicks, Ctr, CurrentMaxCpc, AverageCpc, Spend, AveragePosition, Conversions, ConversionRate, CostPerConversion, QualityScore, ExpectedCtr, AdRelevance, LandingPageExperience, QualityImpact, Assists, ReturnOnAdSpend, CostPerAssist, CustomParameters, FinalAppUrl, FinalUrlSuffix, Mainline1Bid, MainlineBid, FirstPageBid, ViewThroughConversions, AllCostPerConversion, AllReturnOnAdSpend, AllConversionsQualified, AllRevenue, AllRevenuePerConversion, Revenue, RevenuePerAssist, RevenuePerConversion```
#### Primary key
```AccountId, CampaignId, AdGroupId, KeywordId, AdId, TimePeriod, CurrencyCode, DeliveredMatchType, AdDistribution, DeviceType, Language, Network, DeviceOS, TopVsOther, BidMatchType```
## GeographicPerformance Report Presets
### Daily aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, CampaignName, AccountName, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, LocationType, Country, State, County, MetroArea, City, Neighborhood, MostSpecificLocation, LocationId, ProximityTargetLocation, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, Radius, CostPerConversion, CostPerAssist, Assists, ConversionRate, ConversionsQualified```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, LocationType, Country, State, County, MetroArea, City, Neighborhood, MostSpecificLocation, LocationId, ProximityTargetLocation```
### Hourly aggregation
#### Columns
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, CampaignName, AccountName, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, LocationType, Country, State, County, MetroArea, City, Neighborhood, MostSpecificLocation, LocationId, ProximityTargetLocation, Impressions, Clicks, Ctr, Spend, ReturnOnAdSpend, AllConversionsQualified, ViewThroughConversionsQualified, Radius, CostPerConversion, CostPerAssist, Assists, ConversionRate, ConversionsQualified```
#### Primary key
```TimePeriod, CurrencyCode, AdDistribution, DeviceType, Network, AccountId, DeliveredMatchType, CampaignId, BidMatchType, DeviceOS, Goal, GoalType, TopVsOther, LocationType, Country, State, County, MetroArea, City, Neighborhood, MostSpecificLocation, LocationId, ProximityTargetLocation```