---
title: Gmail Messages
permalink: /components/extractors/communication/gmail/
redirect_from:
    - /extractors/communication/gmail/
---

* TOC
{:toc}

The Gmail Messages extractor allows you to fetch data from your Gmail account.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Gmail Messages** extractor.
Then click **Authorize Account** to [authorize the configuration](/components/#authorization). 
**Your inbox is accessed as read only.**

{: .image-popup}
![Gmail - authorize account](/components/extractors/communication/gmail/gmail-1.png)

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
