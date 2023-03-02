---
title: Gmail Messages
permalink: /components/extractors/communication/gmail/
redirect_from:
    - /extractors/communication/gmail/
---

* TOC
{:toc}

The Gmail Messages extractor allows you to fetch data from your Gmail account.

## Authorization
[Create a new configuration](/components/#creating-component-configuration) of the **Gmail Messages** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 
**Your inbox is accessed as read only.**

{: .image-popup}
![Gmail - authorize account](/components/extractors/communication/gmail/gmail-1.png)

Reading email messages is considered as a very sensitive thing by Google. This means that authorization may often be reject and 
app may show as blocked or not-verified. In such case, we recommend that you use Custom OAuth Credentials. Generally using the 
Custom, OAuth credentials is the preferred authorization option, although it is more complicated.

### Custom OAuth Credentials

1. Visit the [Google API Console](https://console.developers.google.com/).
2. Select an existing project or create a new one, click **Enable APIs and Services**.
 
    {: .image-popup}
    ![Screenshot - Google API Console - Project](/components/extractors/communication/gmail/google_console_enable.png)

3. Select the [**GMail API**](https://console.cloud.google.com/apis/library/gmail.googleapis.com) and **Enable** it. You should 
then see it in the list of enabled APIs.
 
    {: .image-popup}
    ![Screenshot - Google API Console - API list](/components/extractors/communication/gmail/google_console_apis.png)
    
4. Select the **Credentials** section from the menu on the left, click the **Create credentials** button and select **OAuth client ID**.
  
    {: .image-popup}
    ![Screenshot - Google API Console - Create Credentials](/components/extractors/communication/gmail/google_console_credentials.png)
    
5. Choose **Web Application**. Into **Authorized redirect URIs** insert:
    - `https://oauth.keboola.com/authorize/keboola.ex-gmail/callback`
    - or `https://oauth.eu-central-1.keboola.com/authorize/keboola.ex-gmail/callback`
    - or `https://oauth.north-europe.azure.keboola.com/authorize/keboola.ex-gmail/callback`

    Depending on which stack are you using or planning to use.

    {: .image-popup}
    ![Screenshot - Google API Console - Fill Credentials](/components/extractors/communication/gmail/google_console_detail.png)

6. Click **Create** and a popup window will display your new Client ID and Client Secret credentials.
7. You can now use these credentials in the **Custom Authorization** tab when authorizing the Google Analytics Extractor.
 
    {: .image-popup}
    ![Screenshot - Custom Authorization](/components/extractors/communication/gmail/custom-credentials.png)

## Configuration
Fill in the form to fit your needs.

{: .image-popup}
![Gmail - configure queries](/components/extractors/communication/gmail/gmail-2.png)

- **Query** -- Query to filter your messages. To speed up the extraction, be as specific as possible. 
For more detailed information about querying, follow Google's [Advanced search](https://support.google.com/mail/answer/7190?hl=en) help site.
- **Headers** (optional) -- Headers you want to download. If no headers are specified, all headers will be downloaded.

Don't forget to **Save** the configuration.

## Produced Tables
Data are always imported incrementally. The extractor produces several tables that can be joined together.

### Queries
Queries and their messages; it is good to know which query a message came from.

{: .table-bordered }
| query | messageId |
| --- | --- |
| `from:some.address@example.com` | `9876cbd54bd215a6` |
| `from:another.address@example.com` | `1234abcd2ffdc1d6` |

### Messages
A base table of messages:

{: .table-bordered }
| id | threadId |
| --- | --- |
| `9876cbd54bd215a6` | `1234abcd2ffdc1d6` |
| `1234abcd2ffdc1d6` | `1234abcd2ffdc1d6` |

*Tip: You can group your messages to conversations with `GROUP BY threadId`*.

### Headers
All downloaded headers:

{: .table-bordered }
| messageId | name | value |
| --- | --- | --- |
| `1234abcd2ffdc1d6` | `From` | `News <some.address@example.com>` |
| `1234abcd2ffdc1d6` | `Subject` | `Trending News` |

### Parts
All downloaded message parts:

{: .table-bordered }
| messageId | partId | mimeType | bodySize | bodyData |
| --- | --- | --- | --- | --- |
| `1234abcd2ffdc1d6` | `0` | `text/plain` | `26` | `Lorem ipsum dolor sit amet` |
| `1234abcd2ffdc1d6` | `1` | `text/html` | `33` | `<p>Lorem ipsum dolor sit amet</p>` |

*Note: Only parts with `text/plain` and `text/html` mime types are downloaded.*
