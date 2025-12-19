---
title: Salesforce
permalink: /components/extractors/marketing-sales/salesforce/
redirect_from:
    - /extractors/marketing-sales/salesforce/
---

* TOC
{:toc}
  
This data source connector allows you to import data from Salesforce via the Bulk API. Data can be fetched in two ways: by running
a specified SOQL query, or by selecting a Salesforce object and getting all data from that object.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Salesforce V2** connector.

### Authorization
The connector supports three authentication methods. Select the appropriate **Login Method** based on your Salesforce setup and security requirements.

#### Security Token with Username and Password
This is the default and simplest authentication method. You need to provide your Salesforce **Login Name**, **Password**, and **Security Token**. 
If you do not have your Security Token, you will need to reset it by following the steps in the 
[Salesforce Documentation](https://help.salesforce.com/s/articleView?id=sf.user_security_token.htm&type=5).

Note that the security token is different for sandbox and production environments. When exporting data from a sandbox, 
don't forget to add `.sandboxname` at the end of your username.

#### Connected App with Username and Password
This method uses a Salesforce Connected App for authentication. In addition to your **Login Name** and **Password**, 
you need to provide the **Consumer Key** and **Consumer Secret** from your Connected App.

To set up a Connected App in Salesforce:

1. In Salesforce Setup, navigate to **Platform Tools > Apps > App Manager**.
2. Click **New Connected App**.
3. Fill in the basic information (Connected App Name, API Name, Contact Email).
4. In the **API (Enable OAuth Settings)** section, check **Enable OAuth Settings**.
5. Enable **Enable for Device Flow** (the Callback URL will be set automatically).
6. Select the following OAuth Scopes:
   - Manage user data via APIs (api)
   - Access unique user identifiers (openid)
   - Perform requests at any time (refresh_token, offline_access)
7. Save the Connected App.
8. In **App Manager**, find your app, click the dropdown arrow, and select **Manage**.
9. Click **Edit Policies** and set **IP Relaxation** to **Relax IP restrictions**.
10. To get the Consumer Key and Secret, go back to **App Manager**, find your app, click **View**, 
    then click **Manage Consumer Details** in the API section.

#### Connected App OAuth 2.0 Client Credentials
This method enables server-to-server authentication without user credentials. It requires a **Consumer Key**, 
**Consumer Secret**, and your Salesforce **Domain** (e.g., `https://your-org.my.salesforce.com`).

To enable Client Credentials Flow:

1. Follow the steps above to create a Connected App.
2. Additionally, check **Enable Client Credentials Flow** in the OAuth settings.
3. Provide your Salesforce domain in the configuration.

This method is ideal for automated integrations where no user interaction is required.

### Additional Settings
You can also configure:

- **Sandbox** -- Enable this option to download records from a sandbox instead of the production environment (available for Security Token and Connected App methods).
- **API Version** -- Select the Salesforce API version to use for data extraction.
- **Proxy Settings** -- Configure an HTTPS proxy server if required by your network setup.

After configuring the authorization, you can set up individual queries or objects in the [row based configuration](https://help.keboola.com/components/#configuration-rows).

{: .image-popup}
![Screenshot - Row configuration](/components/extractors/marketing-sales/salesforce/row_config.png)

In the row configuration select either `Query` or `Object` and use the corresponding text input to input a single query or 
object. Then select if you wish to fetch deleted records by checking the checkbox. Finally, set the loading type to either Full or
Incremental based on your use case. In the incremental update, you can also set the `incremental fetching` option. 
Incremental fetching allows you to select a field in Salesforce for example `LastModifiedDate` and fetch records that have been 
modified since the last run of the component. `LastModifiedDate` is the default field, but you can also specify any field in Salesforce
containing a timestamp.

### Load Type
Select one of the following two load types: 

- `Incremental Update` -- updates the result tables based on the primary key set in the configuration.
- `Full Load` -- overwrites the destination table each time.

#### Incremental Fetching

The option available in `Incremental Update` mode allows you to fetch records that have been modified since the
last run of the component. You need to specify a date field in Salesforce that will be used for this (by default `LastModifiedDate`).

The `LastModifiedDate` matches most of the Salesforce objects but there are some objects such as `*History` that do not contain this field 
and only the `CreatedDate` field may be used. This also varies per custom Salesforce setup.

{: .image-popup}
![Screenshot - Incremental fetching](/components/extractors/marketing-sales/salesforce/incremental_fetching.png)

#### Primary Key

A primary key can be defined to enable deduplication and "upserts" while importing to Storage. It defaults to `Id`, which 
will be valid in the vast majority of cases. However, if your custom implementation does not define this column or you would 
like to have your destination table without any, you can modify it.

## Limitations

Due to the data source connector utilizing the Salesforce Bulk API, it will not be possible to run all types of queries. 

The Bulk API does not support queries with any of the following:
* GROUP BY, OFFSET, or TYPEOF clauses
* Aggregate functions such as COUNT()
* Date functions in GROUP BY clauses (date functions in WHERE clauses are supported)
* Compound address fields or compound geolocations fields
