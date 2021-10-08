---
title: Available Dimensions
permalink: /components/extractors/marketing-sales/adform-dsp-reports/available-dimensions
redirect_from:
    - /extractors/marketing-sales/adform-dsp-reports/available-dimensions
---

Note that this list can be retrieved also via this [API call](https://api.adform.com/help/references/buyer-solutions/reporting/metadata/dimensions): 

```json
[
        {
            "key": "deviceVendor",
            "category": "Technical",
            "displayName": "Device Vendor",
            "description": "This dimension indicates the name of the company that manufactures the device or primarily sells it, e.g. Samsung."
        },
        {
            "key": "deviceModel",
            "category": "Technical",
            "displayName": "Device Model",
            "description": "This dimension indicates the device model name or number used primarily by the hardware vendor to identify the device, e.g. SM-T805S."
        },
        {
            "key": "adCreativeType",
            "category": "Banner",
            "displayName": "Ad Creative Type",
            "description": "This dimension groups information by the following ad creative types: Video, Display, Pixel Tag. It helps to evaluate how different types contribute to campaign performance in order to optimize line item strategies accordingly."
        },
        {
            "key": "adInteractionType",
            "category": "Site Tracking",
            "displayName": "Ad Interaction Type",
            "description": "This dimension can be used to group view-through and click-through activity e.g. conversions, orders etc."
        },
        {
            "key": "agencyIDOVK",
            "category": "Campaign",
            "displayName": "Agency ID (OVK)",
            "description": "This dimension groups data by Agency ID (OVK). Agency ID (OVK) is a unique identifier of an Agency or Agency office. Collected from Campaign Details page."
        },
        {
            "key": "appName",
            "category": "RTB",
            "displayName": "App Name",
            "description": "Groups information by app name provided by app store e.g. Angry Birds."
        },
        {
            "key": "appID",
            "category": "RTB",
            "displayName": "App ID",
            "description": "Groups information by app ID provided by app store."
        },
        {
            "key": "appStore",
            "category": "RTB",
            "displayName": "App Store",
            "description": "Groups information by app store name e.g. Apple App Store."
        },
        {
            "key": "banner",
            "category": "Banner",
            "displayName": "Banner/Adgroups",
            "description": "This dimension groups information by banner for Display campaigns, or by Adgroup for Search campaigns. Banner is an advertisement vehicle. The banner is displayed through different medias/publishers on different placements. Adgroup contains one or more keywords used in Search Engine campaigns."
        },
        {
            "key": "bannerAdMessage",
            "category": "Banner",
            "displayName": "Banner Ad Message",
            "description": "This dimension indicates what ad message was used in XML enabled banner through Adform Content Manager."
        },
        {
            "key": "bannerAttribute1",
            "category": "Banner",
            "displayName": "Banner Attribute 1",
            "description": "This dimension groups information by Banner Attribute 1. Banner attribute is a user-defined property of a banner. Banner Attribute 1 is usually assigned to the banner batch column in Banner Overview page."
        },
        {
            "key": "bannerAttribute1ID",
            "category": "Banner",
            "displayName": "Banner Attribute 1 ID",
            "description": "Groups metrics by the Adform Banner Attribute ID"
        },
        {
            "key": "bannerAttribute2",
            "category": "Banner",
            "displayName": "Banner Attribute 2",
            "description": "This dimension groups information by Banner Attribute 2. Banner attribute is a user-defined property of a banner. Collected from Banner Overview page."
        },
        {
            "key": "bannerAttribute3",
            "category": "Banner",
            "displayName": "Banner Attribute 3",
            "description": "This dimension groups information by Banner Attribute 3. Banner attribute is a user-defined property of a banner. Collected from Banner Overview page."
        },
        {
            "key": "bannerAttribute4",
            "category": "Banner",
            "displayName": "Banner Attribute 4",
            "description": "This dimension groups information by Banner Attribute 4. Banner attribute is a user-defined property of a banner. Collected from Banner Overview page."
        },
        {
            "key": "bannerAttribute5",
            "category": "Banner",
            "displayName": "Banner Attribute 5",
            "description": "This dimension groups information by Banner Attribute 5. Banner attribute is a user-defined property of a banner. Collected from Banner Overview page."
        },
        {
            "key": "bannerBackup",
            "category": "Banner",
            "displayName": "Backup Banner",
            "description": "This dimension indicates with a \"X\" symbol whether a back-up banner exists or not. Usually used with Banner/Adgroups dimension. Collected from Banner Overview page."
        },
        {
            "key": "bannerClickInteractionCoordinateX",
            "category": "Banner",
            "displayName": "Banner Click Coordinate X",
            "description": "Shows banner click interaction coordinate X. It is used to draw Banner Heat Map report overlay."
        },
        {
            "key": "bannerClickInteractionCoordinateY",
            "category": "Banner",
            "displayName": "Banner Click Coordinate Y",
            "description": "Shows banner click interaction coordinate Y. It is used to draw Banner Heat Map report overlay."
        },
        {
            "key": "bannerDomain2Level",
            "category": "Delivery",
            "displayName": "Banner Domain (2nd level)",
            "description": "This dimension shows 2nd level URLs of publisher sites (e.g. *.cnn.com), where banner was displayed when a clicks or an impression was registered."
        },
        {
            "key": "bannerDomain3Level",
            "category": "Delivery",
            "displayName": "Banner Domain (3rd level)",
            "description": "This dimension shows 3rd level URLs of publisher sites (e.g. *.editorial.cnn.com), where banner was displayed when a click was registered. When using this dimension with Impressions metric, 2nd level banner domain information is reported (less detailed information is provided)."
        },
        {
            "key": "bannerFormat",
            "category": "Banner",
            "displayName": "Banner Format",
            "description": "This dimension indicates the format of the banner, such as \"Skyscraper\", \"Advertorials\", etc. Collected from Banner Overview page."
        },
        {
            "key": "bannerFormatID",
            "category": "Banner",
            "displayName": "Banner format ID",
            "description": "This dimension indicates the format of the banner, such as \"Skyscraper\", \"Advertorials\", etc. Collected from Banner Overview page."
        },
        {
            "key": "bannerGlobalID",
            "category": "Banner",
            "displayName": "Banner Global ID",
            "description": "Groups information by Banner Global ID. When banner is copied, all its copies will have the same Global ID as the original banner. This way, statistics could be used to check how the same banner is performing across different campaigns. Note: When banner is copied, a unique Banner ID is assigned each time, therefore to check banner performance across different client campaigns, Global ID has to be used."
        },
        {
            "key": "bannerID",
            "category": "Banner",
            "displayName": "Banner ID",
            "description": "This dimension groups data by Adform banner ID."
        },
        {
            "key": "bannerMember",
            "category": "Banner",
            "displayName": "Banner Member",
            "description": "Groups data by the name of synchronized ads members. It shows data only for Synchronized Ads and is compatible with clicks and event only."
        },
        {
            "key": "bannerSize",
            "category": "Banner",
            "displayName": "Banner Size",
            "description": "This dimension groups information by banner size. Banner size is shown as \"width x height\" in pixels, e.g. 300 x 250."
        },
        {
            "key": "bannerType",
            "category": "Banner",
            "displayName": "Banner Type",
            "description": "This dimension groups information by creative material type. Most common banner types include Flash, Image, Rich Media, Link, Keyword and other."
        },
        {
            "key": "bannerTypeID",
            "category": "Banner",
            "displayName": "Banner type ID",
            "description": "This dimension groups information by creative material type. Most common banner types include Flash, Image, Rich Media, Link, Keyword and other."
        },
        {
            "key": "bannerWeight",
            "category": "Banner",
            "displayName": "Banner Weight (KB)",
            "description": "This dimension groups information by banner weight."
        },
        {
            "key": "brandSafetyBlockedCategory",
            "category": "Delivery",
            "displayName": "Brand Safety Blocked Category",
            "description": "This dimension groups data by Brand Safety Blocked Category."
        },
        {
            "key": "brandSafetyProvider",
            "category": "Delivery",
            "displayName": "Post-buy Brand Safety Provider",
            "description": "This dimension groups data by the post-buy brand safety provider whose data was used to prevent banners from being displayed on domains with undesirable, brand-incompatible content."
        },
        {
            "key": "browser",
            "category": "Technical",
            "displayName": "Browser",
            "description": "Technical dimension, shows information grouped by visitors' web browser, such as \"Explorer 8\" or \"Firefox 2\"."
        },
        {
            "key": "buyType",
            "category": "Buying",
            "displayName": "Buy Type",
            "description": "This dimension indicates the booking/buy types of the selected placement. Possible values: Impressions (CPM), Clicks (CPC), Viewable Impressions (vCPM), Days, Weeks, Months and Conversions."
        },
        {
            "key": "buyTypeID",
            "category": "Buying",
            "displayName": "Buy Type ID",
            "description": "This dimension indicates the booking/buy type ID of the selected placement."
        },
        {
            "key": "campaign",
            "category": "Campaign",
            "displayName": "Campaign",
            "description": "This dimension shows and groups information by campaign. The campaign is the base item in Adform system, it contains media, placements, banners."
        },
        {
            "key": "campaignBillingID",
            "category": "Campaign",
            "displayName": "Campaign Billing ID",
            "description": "This dimension groups data by Adform campaign billing ID, which is of the form AA-BB-0123, where AA is agency's abbreviation, BB is country's abbreviation and 0123 is an identifying number."
        },
        {
            "key": "campaignCurrency",
            "category": "Campaign",
            "displayName": "Campaign Currency",
            "description": "This dimension groups information by campaign currency. Campaign currency identifies a currency unit in which campaign bookings are done and reported. Data is collected from Campaign Details page."
        },
        {
            "key": "campaignEndDate",
            "category": "Campaign",
            "displayName": "Campaign End Date",
            "description": "This dimension indicates the date on which a campaign ends.",
            "displayFormat": "d"
        },
        {
            "key": "campaignID",
            "category": "Campaign",
            "displayName": "Campaign ID",
            "description": "This dimension groups data by Adform campaign ID."
        },
        {
            "key": "campaignLabel1",
            "category": "Campaign",
            "displayName": "Campaign Label 01",
            "description": "This dimension groups data by Campaign Label 1. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel10",
            "category": "Campaign",
            "displayName": "Campaign Label 10",
            "description": "This dimension groups data by Campaign Label 10. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel11",
            "category": "Campaign",
            "displayName": "Campaign Label 11",
            "description": "This dimension groups data by Campaign Label 11. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel12",
            "category": "Campaign",
            "displayName": "Campaign Label 12",
            "description": "This dimension groups data by Campaign Label 12. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel13",
            "category": "Campaign",
            "displayName": "Campaign Label 13",
            "description": "This dimension groups data by Campaign Label 13. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel14",
            "category": "Campaign",
            "displayName": "Campaign Label 14",
            "description": "This dimension groups data by Campaign Label 14. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel15",
            "category": "Campaign",
            "displayName": "Campaign Label 15",
            "description": "This dimension groups data by Campaign Label 15. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel16",
            "category": "Campaign",
            "displayName": "Campaign Label 16",
            "description": "This dimension groups data by Campaign Label 16. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel17",
            "category": "Campaign",
            "displayName": "Campaign Label 17",
            "description": "This dimension groups data by Campaign Label 17. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel18",
            "category": "Campaign",
            "displayName": "Campaign Label 18",
            "description": "This dimension groups data by Campaign Label 18. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel19",
            "category": "Campaign",
            "displayName": "Campaign Label 19",
            "description": "This dimension groups data by Campaign Label 19. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel2",
            "category": "Campaign",
            "displayName": "Campaign Label 02",
            "description": "This dimension groups data by Campaign Label 2. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel20",
            "category": "Campaign",
            "displayName": "Campaign Label 20",
            "description": "This dimension groups data by Campaign Label 20. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel3",
            "category": "Campaign",
            "displayName": "Campaign Label 03",
            "description": "This dimension groups data by Campaign Label 3. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel4",
            "category": "Campaign",
            "displayName": "Campaign Label 04",
            "description": "This dimension groups data by Campaign Label 4. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel5",
            "category": "Campaign",
            "displayName": "Campaign Label 05",
            "description": "This dimension groups data by Campaign Label 5. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel6",
            "category": "Campaign",
            "displayName": "Campaign Label 06",
            "description": "This dimension groups data by Campaign Label 6. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel7",
            "category": "Campaign",
            "displayName": "Campaign Label 07",
            "description": "This dimension groups data by Campaign Label 7. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel8",
            "category": "Campaign",
            "displayName": "Campaign Label 08",
            "description": "This dimension groups data by Campaign Label 8. Data collected from Campaign Details page."
        },
        {
            "key": "campaignLabel9",
            "category": "Campaign",
            "displayName": "Campaign Label 09",
            "description": "This dimension groups data by Campaign Label 9. Data collected from Campaign Details page."
        },
        {
            "key": "campaignStartDate",
            "category": "Campaign",
            "displayName": "Campaign Start Date",
            "description": "This dimension indicates the date on which a campaign starts.",
            "displayFormat": "d"
        },
        {
            "key": "campaignType",
            "category": "Campaign",
            "displayName": "Campaign Type",
            "description": "This dimension groups information by campaign type. Campaign type can be assigned in Campaign Details page, possible values: Display, Affiliate, Email, Social Media and other."
        },
        {
            "key": "city",
            "category": "Geographical",
            "displayName": "City",
            "description": "Geographical dimension, groups information by visitor's city, e.g. Copenhagen, Oslo, Stockholm, London etc."
        },
        {
            "key": "clickDetail",
            "category": "Banner",
            "displayName": "Click Details",
            "description": "This dimension groups information by banner click details. Click details allow seperating clicks on back-up and flash banners, and clicks on different clickable areas defined by different click-tags implemented in the banners."
        },
        {
            "key": "client",
            "category": "Campaign",
            "displayName": "Client",
            "description": "Displays client/advertiser information. Used to group campaigns, in benchmarking reports etc."
        },
        {
            "key": "clientID",
            "category": "Campaign",
            "displayName": "Client ID",
            "description": "This dimension groups data by Adform client ID."
        },
        {
            "key": "continent",
            "category": "Geographical",
            "displayName": "Continent",
            "description": "Geographical dimension, groups information by visitor's continent, e.g. Australia, Europe, etc."
        },
        {
            "key": "continentID",
            "category": "Geographical",
            "displayName": "Continent ID",
            "description": "Used for drilling."
        },
        {
            "key": "cookiesEnabled",
            "category": "Technical",
            "displayName": "Cookies Enabled",
            "description": "Technical dimension, groups information by visitor's cookie acceptance setting. \"Enabled\", \"Disabled\" and \"Opt out\" are among possible values here. \"Enabled\" means that a visitor accepts all cookies, \"Disabled\" means that a visitor doesn't accept cookies at all, \"Opt out\" means that a visitor doesn't accept Adform cookies."
        },
        {
            "key": "country",
            "category": "Geographical",
            "displayName": "Country",
            "description": "Geographical dimension, groups information by visitor's country e.g. Denmark, UK, USA, etc."
        },
        {
            "key": "countryID",
            "category": "Geographical",
            "displayName": "Country ID",
            "description": "Used for drilling."
        },
        {
            "key": "date",
            "category": "Time",
            "displayName": "Date",
            "description": "This dimension groups information by date when a transaction happened.",
            "displayFormat": "d"
        },
        {
            "key": "dateID",
            "category": "Time",
            "displayName": "Date ID",
            "description": "Time dimension, groups information by date."
        },
        {
            "key": "dayMonth",
            "category": "Time",
            "displayName": "Day of Month",
            "description": "Time dimension, groups information by day of a month (from 1 to 31)."
        },
        {
            "key": "dcoProduct",
            "category": "Banner",
            "displayName": "Product Retargeting",
            "description": "This dimension groups data by the items used in Product Retargeting ads."
        },
        {
            "key": "deal",
            "category": "RTB",
            "displayName": "Deal Name",
            "description": "Groups information by Deal Name, used in Private Marketplaces."
        },
        {
            "key": "dealID",
            "category": "RTB",
            "displayName": "Deal ID",
            "description": "Groups information by Deal ID, used in Private Marketplaces."
        },
        {
            "key": "deviceType",
            "category": "Technical",
            "displayName": "Device Type",
            "description": "Technical dimension, groups data by device type, which can be: Desktop and Laptop, Small Screen Phone, Smart Phone, Tablet, Other Mobile, Media Hub, Console, TV, eReader, Smart Watch. It shows what share of traffic comes from different device types."
        },
        {
            "key": "event",
            "category": "Engagement",
            "displayName": "Event Name",
            "description": "This dimension groups information by banner event name. Banner events can be implemented in flash banners in order to track user interactions with banners, such as expands, clicks on play button, etc."
        },
        {
            "key": "flashVersion",
            "category": "Technical",
            "displayName": "Flash Version",
            "description": "Technical dimension, groups information by visitor's used Flash version."
        },
        {
            "key": "frequencyCampaign",
            "category": "Delivery",
            "displayName": "Frequency (Campaign)",
            "description": "This dimension groups information depending on the individual impression frequency on a campaign. A user, who has been exposed to a campaign advertisement twice, has a frequency of 2. A value of zero means that a user does not accept cookies. If this dimension is used with metric Clicks, then user may appear in several rows if s/he clicks several times. For example, a user clicks the first time after seeing a campaign banner twice (this click falls into frequency 2 row), and clicks the second time after seeing a banner the 5th time (this click falls into frequency 5 row)."
        },
        {
            "key": "frequencyLineItem",
            "category": "Delivery",
            "displayName": "Frequency (Line Item)",
            "description": "This dimension groups information depending on the individual impression frequency on each and every Line Item. A user, who has been exposed to an advertisement from a Line Item twice, has a frequency of 2. A value of zero means that a user does not accept cookies. If this dimension is used with metric Clicks, then user may appear in several rows if s/he clicks several times. For example, a user clicks the first time after seeing a banner from a Line item twice (this click falls into frequency 2 row), and clicks the second time after seeing a banner from the same Line Item for the 5th time (this click falls into frequency 5 row). Tip: this dimension should always be used with Line Item dimension."
        },
        {
            "key": "hour",
            "category": "Time",
            "displayName": "Hour",
            "description": "Time dimension, groups information by hour of the day (values from 0 to 23)."
        },
        {
            "key": "industryVertical",
            "category": "Campaign",
            "displayName": "Industry Vertical",
            "description": "This dimension groups data by industry vertical, collected from Client Management section. Useful for benchmarking reports when analyzing multiple advertisers' data."
        },
        {
            "key": "languageBrowser",
            "category": "Technical",
            "displayName": "Language (Browser)",
            "description": "This dimension groups data by user's browser language (e.g., English, Danish)."
        },
        {
            "key": "lineItem",
            "category": "Buying",
            "displayName": "Line Item",
            "description": "This dimension groups information by Line Item. Line Item is an advertisement spot on a media/publisher."
        },
        {
            "key": "lineItemEndDate",
            "category": "Buying",
            "displayName": "Line Item End Date",
            "description": "This dimension displays Line Item end date collected from Mediaplan scheduler.",
            "displayFormat": "d"
        },
        {
            "key": "lineItemID",
            "category": "Buying",
            "displayName": "Line Item ID",
            "description": "This dimension groups data by Adform Line Item ID."
        },
        {
            "key": "lineItemLabel1",
            "category": "Buying",
            "displayName": "Line Item Label 01",
            "description": "This dimension groups data by Line Item Label 01. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel10",
            "category": "Buying",
            "displayName": "Line Item Label 10",
            "description": "This dimension groups data by Line Item Label 10. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel11",
            "category": "Buying",
            "displayName": "Line Item Label 11",
            "description": "This dimension groups data by Line Item Label 11. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel12",
            "category": "Buying",
            "displayName": "Line Item Label 12",
            "description": "This dimension groups data by Line Item Label 12. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel13",
            "category": "Buying",
            "displayName": "Line Item Label 13",
            "description": "This dimension groups data by Line Item Label 13. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel14",
            "category": "Buying",
            "displayName": "Line Item Label 14",
            "description": "This dimension groups data by Line Item Label 14. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel15",
            "category": "Buying",
            "displayName": "Line Item Label 15",
            "description": "This dimension groups data by Line Item Label 15. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel16",
            "category": "Buying",
            "displayName": "Line Item Label 16",
            "description": "This dimension groups data by Line Item Label 16. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel17",
            "category": "Buying",
            "displayName": "Line Item Label 17",
            "description": "This dimension groups data by Line Item Label 17. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel18",
            "category": "Buying",
            "displayName": "Line Item Label 18",
            "description": "This dimension groups data by Line Item Label 18. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel19",
            "category": "Buying",
            "displayName": "Line Item Label 19",
            "description": "This dimension groups data by Line Item Label 19. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel2",
            "category": "Buying",
            "displayName": "Line Item Label 02",
            "description": "This dimension groups data by Line Item Label 02. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel20",
            "category": "Buying",
            "displayName": "Line Item Label 20",
            "description": "This dimension groups data by Line Item Label 20. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel3",
            "category": "Buying",
            "displayName": "Line Item Label 03",
            "description": "This dimension groups data by Line Item Label 03. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel4",
            "category": "Buying",
            "displayName": "Line Item Label 04",
            "description": "This dimension groups data by Line Item Label 04. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel5",
            "category": "Buying",
            "displayName": "Line Item Label 05",
            "description": "This dimension groups data by Line Item Label 05. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel6",
            "category": "Buying",
            "displayName": "Line Item Label 06",
            "description": "This dimension groups data by Line Item Label 06. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel7",
            "category": "Buying",
            "displayName": "Line Item Label 07",
            "description": "This dimension groups data by Line Item Label 07. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel8",
            "category": "Buying",
            "displayName": "Line Item Label 08",
            "description": "This dimension groups data by Line Item Label 08. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemLabel9",
            "category": "Buying",
            "displayName": "Line Item Label 09",
            "description": "This dimension groups data by Line Item Label 09. Line Item Labels can be set in Mediaplan page."
        },
        {
            "key": "lineItemNote",
            "category": "Buying",
            "displayName": "Line Item Note",
            "description": "This dimension displays Line Item Notes for the selected Line Item. Collected from Mediaplan section."
        },
        {
            "key": "lineItemStartDate",
            "category": "Buying",
            "displayName": "Line Item Start Date",
            "description": "This dimension displays Line Item start date collected from Mediaplan scheduler.",
            "displayFormat": "d"
        },
        {
            "key": "lineItemAdGapID",
            "category": "Buying",
            "displayName": "Line Item AdGap ID",
            "description": "AdGap ID is used to minimize effort of comparing Advertiser and Publisher reports by sharing unique ID per line item with the publisher to gain a common, shareable report."
        },
        {
            "key": "media",
            "category": "Buying",
            "displayName": "Media",
            "description": "Media/publisher is the provider of online advertising space, such as an online newspaper, social network site or other."
        },
        {
            "key": "mediaCountry",
            "category": "Buying",
            "displayName": "Media Country",
            "description": "This dimension indicates media/publisher country, where the selected media is located. Collected from Media database."
        },
        {
            "key": "mediaGlobal",
            "category": "Buying",
            "displayName": "Global Media",
            "description": "Groups information by media, automatically synchronized with the global media database."
        },
        {
            "key": "mediaGroup2",
            "category": "Buying",
            "displayName": "Media Group 2",
            "description": "This dimension groups information by media group 2 values. There can be several media groups containing different types of information, all of which describes medias and helps to group them, e.g. content, media type, target group, etc. Collected from Media database."
        },
        {
            "key": "mediaGroup3",
            "category": "Buying",
            "displayName": "Media Group 3",
            "description": "This dimension groups information by media group 3 values. There can be several media groups containing different types of information, all of which describes medias and helps to group them, e.g. content, media type, target group, etc. Collected from Media database."
        },
        {
            "key": "mediaGroup4",
            "category": "Buying",
            "displayName": "Media Group 4",
            "description": "This dimension groups information by media group 4 values. There can be several media groups containing different types of information, all of which describes medias and helps to group them, e.g. content, media type, target group, etc. Collected from Media database."
        },
        {
            "key": "mediaGroup5",
            "category": "Buying",
            "displayName": "Media Group 5",
            "description": "This dimension groups information by media group 5 values. There can be several media groups containing different types of information, all of which describes medias and helps to group them, e.g. content, media type, target group, etc. Collected from Media database."
        },
        {
            "key": "mediaID",
            "category": "Buying",
            "displayName": "Media ID",
            "description": "This dimension groups data by Adform media ID."
        },
        {
            "key": "mediaLineItem",
            "category": "Buying",
            "displayName": "Media: Line Item",
            "description": "A joint dimension to list Media:Line Item combination as one dimension values."
        },
        {
            "key": "mediaSection",
            "category": "Buying",
            "displayName": "Media Section",
            "description": "This dimension groups information by media section. Media section can have several placements and it is usually devoted for publishing information of similar content, e.g. sports, finance, transportation etc."
        },
        {
            "key": "month",
            "category": "Time",
            "displayName": "Month",
            "description": "Time dimension, groups information by month, e.g. January, February, etc."
        },
        {
            "key": "monthID",
            "category": "Time",
            "displayName": "Month ID",
            "description": "Time dimension, groups information by month, e.g. 1, 2, etc."
        },
        {
            "key": "network",
            "category": "Buying",
            "displayName": "Network",
            "description": "This dimension groups information by network. Networks are organisations containing several medias (publishers) usually of certain industry vertical."
        },
        {
            "key": "networkID",
            "category": "Buying",
            "displayName": "Network ID",
            "description": "This dimension groups data by Adform Network ID."
        },
        {
            "key": "operatingSystem",
            "category": "Technical",
            "displayName": "Operating System",
            "description": "Technical dimension, groups information by operating system of a visitor, e.g. Windows, iOS."
        },
        {
            "key": "order",
            "category": "Buying",
            "displayName": "Order",
            "description": "This dimension shows and groups information by order. Usually, it is used to group line items for the long running campaigns."
        },
        {
            "key": "orderID",
            "category": "Buying",
            "displayName": "Order ID",
            "description": "This dimension groups data by Adform Order ID."
        },
        {
            "key": "page",
            "category": "Site Tracking",
            "displayName": "Page",
            "description": "Website tracking dimension. Page is a definable content unit in advertiser's site. Usually one tracking point is implemented per page."
        },
        {
            "key": "pageID",
            "category": "Site Tracking",
            "displayName": "Page ID",
            "description": "This dimension groups data by Adform Page ID, also known as Tracking Point ID."
        },
        {
            "key": "paidKeyword",
            "category": "Banner",
            "displayName": "Paid Keywords",
            "description": "This dimension lists paid search keywords that visitors used to reach advertiser's website."
        },
        {
            "key": "reactionTime",
            "category": "Site Tracking",
            "displayName": "Reaction Time",
            "description": "This dimension groups information by reaction time in intervals (in days) between click and conversion (pageview). If there is no click in visitor's path, then between the impression and the conversion (pageview)."
        },
        {
            "key": "referrerType",
            "category": "Site Tracking",
            "displayName": "Referrer Type",
            "description": "Website tracking dimension, groups information by referrer type, such as \"Direct Traffic\", \"Referring Site\" or \"Natural Search\"."
        },
        {
            "key": "region",
            "category": "Geographical",
            "displayName": "Region",
            "description": "Geographical dimension, shows visitor related information grouped by region."
        },
        {
            "key": "regionID",
            "category": "Geographical",
            "displayName": "Region ID",
            "description": "Used for drilling."
        },
        {
            "key": "rtbCategory",
            "category": "RTB",
            "displayName": "RTB Categories",
            "description": "This dimension groups data by RTB categories. RTB categories shows Tier 1 and Tier 2 Categories, so that user can check on best/worst performing categories to be included/excluded in RTB Targeting, and evaluate current RTB Category targeting"
        },
        {
            "key": "rtbDomain",
            "category": "RTB",
            "displayName": "RTB Domain",
            "description": "This dimension groups data by RTB domain. RTB domains show 2nd level URLs of publisher sites (e.g. cnn.com), where a banner was displayed when impression was registered. RTB domain values are tracked and sent to Adform by AdExchanges."
        },
        {
            "key": "rtbInventorySource",
            "category": "RTB",
            "displayName": "RTB Inventory Source",
            "description": "Groups information by RTB Inventory Source. Inventory source is an ad exchange, which can be selected for running a Real Time Bidding campaign, e.g. Admeld, Microsoft Ad Exchange, etc."
        },
        {
            "key": "rtbInventorySourceID",
            "category": "RTB",
            "displayName": "RTB Inventory Source ID",
            "description": "Groups information by RTB Inventory Source ID. Inventory Source ID is an ID, used in Adform, for ad exchange, which can be selected for running a Real Time Bidding (RTB) campaign, e.g. Admeld, Microsoft Ad Exchange, etc."
        },
        {
            "key": "rtbParentCategory",
            "category": "RTB",
            "displayName": "RTB Parent Categories",
            "description": "This dimension groups data by RTB parent categories. RTB parent categories shows the best/worst performing Tier 2 categories."
        },
        {
            "key": "rtbAudience",
            "category": "RTB",
            "displayName": "RTB Audience",
            "description": "This dimension groups information by RTB audience selected in the Targeting step. An audience is a customized segment of users to be targeted, e.g. women from Denmark using Android devices."
        },
        {
            "key": "screenResolution",
            "category": "Technical",
            "displayName": "Screen Resolution",
            "description": "Technical dimensions, groups information by visitors' screen resolution e.g. 1280x1024."
        },
        {
            "key": "seAccount",
            "category": "Campaign",
            "displayName": "SE Account",
            "description": "This dimension groups information by Search Engine acount."
        },
        {
            "key": "seDailyBudget",
            "category": "Campaign",
            "displayName": "SE Daily Budget",
            "description": "This dimension groups information by daily budget of Search Engine campaign."
        },
        {
            "key": "sendingVariables",
            "category": "Site Tracking",
            "displayName": "Sending Variables",
            "description": "Website tracking dimension. This dimension indicates whether tracked page (tracking point) sends variable data or not. A variable contains information collected from visitors on a tracked page of a client's website."
        },
        {
            "key": "sysvar1",
            "category": "Site Tracking",
            "displayName": "Sys Var 1",
            "description": "This dimension groups information by system variable 1. A system variable contains information collected from visitors on a tracked page of a client's website. System variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by system variable 1, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases. System variable 1 name can be edited on the Variables tab in Tracking section."
        },
        {
            "key": "sysvar2",
            "category": "Site Tracking",
            "displayName": "Sys Var 2",
            "description": "This dimension groups information by system variable 2. A system variable contains information collected from visitors on a tracked page of a client's website. System variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by system variable 2, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases. System variable 2 name can be edited on the Variables tab in Tracking section."
        },
        {
            "key": "sysvar3",
            "category": "Site Tracking",
            "displayName": "Sys Var 3",
            "description": "This dimension groups information by system variable 3. A system variable contains information collected from visitors on a tracked page of a client's website. System variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by system variable 3, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases. System variable 3 name can be edited on the Variables tab in Tracking section."
        },
        {
            "key": "sysvar4",
            "category": "Site Tracking",
            "displayName": "Sys Var 4",
            "description": "This dimension groups information by system variable 4. A system variable contains information collected from visitors on a tracked page of a client's website. System variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by system variable 4, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases. System variable 4 name can be edited on the Variables tab in Tracking section."
        },
        {
            "key": "sysvar5",
            "category": "Site Tracking",
            "displayName": "Sys Var 5",
            "description": "This dimension groups information by system variable 5. A system variable contains information collected from visitors on a tracked page of a client's website. System variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by system variable 5, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases. System variable 5 name can be edited on the Variables tab in Tracking section."
        },
        {
            "key": "sysvar6",
            "category": "Site Tracking",
            "displayName": "Sys Var 6",
            "description": "This dimension groups information by system variable 6. A system variable contains information collected from visitors on a tracked page of a client's website. System variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by system variable 6, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases. System variable 6 name can be edited on the Variables tab in Tracking section."
        },
        {
            "key": "sysvar7",
            "category": "Site Tracking",
            "displayName": "Sys Var 7",
            "description": "This dimension groups information by system variable 7. A system variable contains information collected from visitors on a tracked page of a client's website. System variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by system variable 7, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases. System variable 7 name can be edited on the Variables tab in Tracking section."
        },
        {
            "key": "sysvarAge",
            "category": "Site Tracking",
            "displayName": "Sys Var Age Group",
            "description": "This dimension groups information by system variable Age Group and is an Order level variable. A system variable contains information collected from visitors on a tracked page of a client's website. Age Group variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by Age Group variable, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases."
        },
        {
            "key": "sysvarCountry",
            "category": "Site Tracking",
            "displayName": "Sys Var Country ",
            "description": "This dimension groups information by a system variable Country and is an Order level variable. A system variable contains information collected from visitors on a tracked page of a client's website. Country variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by Country variable, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases."
        },
        {
            "key": "sysvarCurrency",
            "category": "Site Tracking",
            "displayName": "Sys Var Currency",
            "description": "This dimension groups information by system variable Currency and is an Order level variable. A system variable contains information collected from visitors on a tracked page of a client's website. Currency variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by Currency variable, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases."
        },
        {
            "key": "sysvarGender",
            "category": "Site Tracking",
            "displayName": "Sys Var Gender",
            "description": "This dimension groups information by system variable Gender and is an Order level variable. A system variable contains information collected from visitors on a tracked page of a client's website. Gender variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by Gender variable, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases."
        },
        {
            "key": "sysvarProduct",
            "category": "Site Tracking",
            "displayName": "Sys Var Product Name",
            "description": "This dimension groups information by a system variable Product Name and is a Product level variable. A system variable contains information collected from visitors on a tracked page of a client's website. Product Name variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by Product Name variable, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases."
        },
        {
            "key": "sysvarProductGroup",
            "category": "Site Tracking",
            "displayName": "Sys Var Product Category",
            "description": "This dimension groups information by a system variable Product Category and is a Product level variable. A system variable contains information collected from visitors on a tracked page of a client's website. Product Category variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by Product Category variable, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases."
        },
        {
            "key": "sysvarProductID",
            "category": "Site Tracking",
            "displayName": "Sys Var Product ID",
            "description": "This dimension groups information by a system variable Product ID and is a Product level variable. A system variable contains information collected from visitors on a tracked page of a client's website. Product ID variable should be used to track information, which can be well aggregated and does not exceed 200 different values. If more than 200 different values are sent by Product ID variable, all the exceeding values will be represented by N/A row in this report. Please use Variable Data Export in order to see all different values in exceeding cases."
        },
        {
            "key": "tag",
            "category": "Buying",
            "displayName": "Tags",
            "description": "Tag is a small piece of code used to track online advertisements. This dimension groups information in relations to tags, it could be used to show rotators information."
        },
        {
            "key": "tagID",
            "category": "Buying",
            "displayName": "Tag ID (BN)",
            "description": "This dimension groups data by Adform Tag ID, also known as BN number."
        },
        {
            "key": "tagUID",
            "category": "Buying",
            "displayName": "Tag UID",
            "description": "This dimension groups data by Tag UID. Tag UID is a unique identifier of a tag, and can be used for matching Adform's statistics to Media's data. Collected from Tags page."
        },
        {
            "key": "viewabilityTime",
            "category": "Engagement",
            "displayName": "Viewability Time (sec.)",
            "description": "Amount of time that a banner was viewable. This dimension groups information by time intervals, e.g., 0-5 sec., 5-10 sec."
        },
        {
            "key": "website",
            "category": "Site Tracking",
            "displayName": "Website",
            "description": "Website tracking dimension, groups information by tracking website. It is the highest member of tracking hierarchy, and can contain one or more tracking sections. Collected from Tracking page."
        },
        {
            "key": "websiteSection",
            "category": "Site Tracking",
            "displayName": "Website Section",
            "description": "Website tracking dimension, groups information by tracking section. Tracking section can hold a group of tracking points assigned to a certain campaign, or a group of tracking points implemented on one section of client's website and used for many different campaigns. Collected from Tracking page."
        },
        {
            "key": "websiteSubsection",
            "category": "Site Tracking",
            "displayName": "Website Subsection",
            "description": "Website tracking dimension, groups information by tracking subsection. Tracking subsection is a part of tracking section and can hold a group of tracking points assigned to a certain campaign, or a group of tracking points implemented on one subsection of client's website and used for many different campaigns. Collected from Tracking page."
        },
        {
            "key": "week",
            "category": "Time",
            "displayName": "Week",
            "description": "Time dimension, groups information by the week number, e.g. 1, 2, etc."
        },
        {
            "key": "weekday",
            "category": "Time",
            "displayName": "Weekday",
            "description": "Time dimension, groups information by weekday, e.g. Monday, Tuesday, etc."
        },
        {
            "key": "weekdayID",
            "category": "Time",
            "displayName": "Weekday ID",
            "description": "Time dimension, groups information by weekday, e.g. 1, 2, etc."
        },
        {
            "key": "year",
            "category": "Time",
            "displayName": "Year",
            "description": "Time dimension, groups information by year, e.g. 2009, 2010, etc."
        },
        {
            "key": "yearID",
            "category": "Time",
            "displayName": "Year ID",
            "description": "Time dimension, groups information by year, e.g. 2009, 2010, etc."
        },
        {
            "key": "yearMonth",
            "category": "Time",
            "displayName": "Year-Month",
            "description": "Time dimension, groups information by year and month, e.g. 2009-12."
        },
        {
            "key": "yearWeek",
            "category": "Time",
            "displayName": "Year-Week",
            "description": "Time dimension, groups information by year and week, e.g. 2009-24"
        },
        {
            "key": "zip",
            "category": "Geographical",
            "displayName": "ZIP Code",
            "description": "Geographical dimension, groups data by visitor's ZIP code."
        },
        {
            "key": "dmpDspDataProviderIds",
            "category": "DMP",
            "displayName": "DMP Data Provider ID (DSP)",
            "description": "This dimension groups data by IDs of DMP Data Providers whose data was used in RTB to win an impression."
        },
        {
            "key": "dmpDspDataProvider",
            "category": "DMP",
            "displayName": "DMP Data Provider (DSP)",
            "description": "This dimension groups data by DMP Data Providers whose data was used in RTB to win an impression."
        },
        {
            "key": "dmpDspSegmentIds",
            "category": "DMP",
            "displayName": "DMP Segment ID (DSP)",
            "description": "This dimension groups data by IDs of DMP Data Provider Segments that were used in RTB to win an impression."
        },
        {
            "key": "dmpDspSegment",
            "category": "DMP",
            "displayName": "DMP Segment (DSP)",
            "description": "This dimension groups data by DMP Data Provider Segments that were used in RTB to win an impression."
        },
        {
            "key": "dmpDspSegmentSource",
            "category": "DMP",
            "displayName": "DMP Segment Source (DSP)",
            "description": "This dimension groups data by sources (e.g., original, cross-device, audience extension) of the DMP segments that were used in RTB to win an impression."
        },
        {
            "key": "dmpRotatorsDataProviderIds",
            "category": "DMP",
            "displayName": "DMP Data Provider ID (Creative)",
            "description": "This dimension groups data by IDs of DMP Data Providers whose data was used in creatives to show an impression."
        },
        {
            "key": "dmpRotatorsDataProvider",
            "category": "DMP",
            "displayName": "DMP Data Provider (Creative)",
            "description": "This dimension groups data by DMP Data Providers whose data was used in creatives to show an impression."
        },
        {
            "key": "dmpRotatorsSegmentIds",
            "category": "DMP",
            "displayName": "DMP Segment ID (Creative)",
            "description": "This dimension groups data by IDs of DMP Data Provider Segments that were used in creatives to show an impression."
        },
        {
            "key": "dmpRotatorsSegment",
            "category": "DMP",
            "displayName": "DMP Segment (Creative)",
            "description": "This dimension groups data by DMP Data Provider Segments that were used in creatives to show an impression."
        },
        {
            "key": "dmpRotatorsSegmentSource",
            "category": "DMP",
            "displayName": "DMP Segment Source (Creative)",
            "description": "This dimension groups data by sources (e.g., original, cross-device, audience extension) of the DMP segments that were used in creatives to show an impression."
        },
        {
            "key": "crossDeviceDataProvider",
            "category": "Buying",
            "displayName": "Cross-Device Data Provider",
            "description": "This dimension groups data by Cross-Device Data Providers whose algorithms are used to connect identifiers that belong to the same user."
        },
        {
            "key": "connectionType",
            "category": "Technical",
            "displayName": "Connection Type",
            "description": "Technical dimension, groups data by users' connection type, such as \"WiFi\" or \"3G\"."
        },
        {
            "key": "rtbAdPosition",
            "category": "RTB",
            "displayName": "RTB Ad Position",
            "description": "Groups data by an ad's position on a page, such as \"Above the fold\" or \"Below the fold\"."
        },
        {
            "key": "videoPlayerSize",
            "category": "Technical",
            "displayName": "Video Player Size",
            "description": "Technical dimension, groups data by video player size, such as \"Small (240p or less)\" or \"HD (720p-1079p)\"."
        },
        {
            "key": "rtbLossReason",
            "category": "RTB",
            "displayName": "RTB Not-winning Reason",
            "description": "This dimension groups Lost bids by the reason why they were not won. The reasons are imported from integrated partners and have various names (e.g., Lost; Creative was outbid; Creative requires additional review)."
        },
        {
            "key": "dynamicAd",
            "category": "Dynamic Ad",
            "displayName": "Dynamic Ad",
            "description": "This dimension groups data by Dynamic Ad. A Dynamic Ad is an entity that links specific Creative Shell, Version List and Dynamic Ad Setup. Serving tag is created for each specific Dynamic Ad."
        },
        {
            "key": "dynamicAdVersion",
            "category": "Dynamic Ad",
            "displayName": "Dynamic Ad Version",
            "description": "This dimension groups data by Dynamic Ad Version. A Dynamic Ad Version is a single set of data variables and values used for messaging."
        },
        {
            "key": "dynamicAdSetup",
            "category": "Dynamic Ad",
            "displayName": "Dynamic Ad Setup",
            "description": "This dimension groups data by Dynamic Ad Setup. A Dynamic Ad Setup is an entity consisting of information about Creative Shells, Versions data and Dynamic Strategy set."
        },
        {
            "key": "dynamicAdCreativeShell",
            "category": "Dynamic Ad",
            "displayName": "Dynamic Ad Creative Shell",
            "description": "This dimension groups data by Dynamic Ad Creative Shell. A Dynamic Ad Creative Shell is a creative (banner) that is used as a shell containing dynamic variable rendering logic."
        },
        {
            "key": "contractType",
            "category": "External Vars",
            "displayName": "Contract type",
            "description": "Contract type external variable"
        },
        {
            "key": "partnerID",
            "category": "External Vars",
            "displayName": "Partner ID",
            "description": "Partner ID external variable"
        },
        {
            "key": "channelID",
            "category": "External Vars",
            "displayName": "Channel ID",
            "description": "Channel ID external variable"
        },
        {
            "key": "environmentType",
            "category": "Technical",
            "displayName": "Environment Type",
            "description": "This dimension groups data by device environment type, which can be: Desktop, Mobile (undefined), Mobile Web, Mobile In-application."
        },
        {
            "key": "videoPlacementType",
            "category": "Technical",
            "displayName": "RTB Video Placement Type",
            "description": "This dimension groups data by video placement type. The values indicate whether the ad was played in the video player itself (In-stream) or outside the video player and autoplays in a large format player whenever it is in view (Out-stream). If video placement type was not provided by exchange, it falls under \"Unresolved\"."
        },
        {
            "key": "videoPosition",
            "category": "Technical",
            "displayName": "RTB Video Position",
            "description": "This dimension groups data by video ad position. The values (Pre-roll, Mid-roll, Post-roll) indicate whether the ad was played before, during or after the streaming of the video content. If video ad position was not provided by exchange, it falls under \"Unresolved\"."
        },
        {
            "key": "dma",
            "category": "Geographical",
            "displayName": "DMA region",
            "description": "DMA region is a geographical dimension that groups information by user‘s designated market area (DMA), also referred to as a media market."
        }
    ]
```