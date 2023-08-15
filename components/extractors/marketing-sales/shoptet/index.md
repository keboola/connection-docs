---
title: Shoptet Permalink
permalink: /components/extractors/marketing-sales/shoptet/
redirect_from:
    - /extractors/marketing-sales/shoptet/
---

* TOC
{:toc}
  
This extractor allows you to download data from Shoptet permalinks. 
In order to be able to use this extractor, you have to create a permanent link to your report in Shoptet administration.

For example, to create a permanent link for Orders, go to Orders > Export in you Shoptet adminitration page and at the bottom of the page, you can see the option to create the permanent link. This link is a direct download link to the csv file that you will use in component's configuration. To see how the report looks like, you can visit this link using your browser and it will automatically get downloaded to your computer.

The link will look something like this: 
`https://keboola.com/export/orders.csv?patternId=-9&partnerId=12&hash=3323211c346061e3d9abfadf1738a2a6661af830979b46111149664973d696a8`

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Shoptet** extractor.

- Set the shop name.
- Set the Base URL of the store.
- Set the Orders URL so that it contains the pattern ID and hash in the URL.
- Set the Products URL so that it contains the pattern ID and hash in the URL.
- Set the Customers URL so that it contains the hash in the URL.
- Set the Stock URL so that it contains the hash in the URL.

{: .image-popup}
![Screenshot - Config](/components/extractors/marketing-sales/shoptet/config1.png)

If you have any additional data to download, add the additional data with the **Add Additional Data** button.


{: .image-popup}
![Screenshot - Config](/components/extractors/marketing-sales/shoptet/add1.png)

Add the additional data name and URL, along with a primary key if needed.

{: .image-popup}
![Screenshot - Config](/components/extractors/marketing-sales/shoptet/add2.png)

Add the File charset of the file to be downloaded and the delimiter.


### Load Type
For loading options:
- Set the date period if needed by adding the date from and to. If left blank, all data will be fetched.
- Select one of the following two load types: 
    - `Incremental Update` -- updates the result tables based on the primary key set in the configuration.
    - `Full Load` -- overwrites the destination table each time.
- If needed, set the data to be downloaded in chunks and specify the chunk size in days.
    

{: .image-popup}
![Screenshot - Config](/components/extractors/marketing-sales/shoptet/loading.png)

