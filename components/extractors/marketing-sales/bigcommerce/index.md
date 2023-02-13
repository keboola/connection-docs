---
title: BigCommerce
permalink: /components/extractors/marketing-sales/bigcommerce/
redirect_from:
    - /extractors/marketing-sales/bigcommerce/
---

* TOC
{:toc}

This extractor downloads data about brands, customers, orders and products in your BigCommerce store.

## Prerequisites
You must create a V2/V3 API access token with read-only OAuth scope and find your API path. Both can be accomplished by folowing [this guide](https://support.bigcommerce.com/s/article/Store-API-Accounts?language=en_US#creating).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **BigCommerce** extractor.

### Global configuration

First open the Global Configuration:

{: .image-popup}
![Global Configuration opening](/components/extractors/marketing-sales/bigcommerce/global_config_collapsed.png)

Here you must provide you **API Path** and **Access Token**.

{: .image-popup}
![API Path and Access Token entry](/components/extractors/marketing-sales/bigcommerce/global_config.png)

Validate the connection using the `TEST CONNECTION` button.

Don't forget to **Save**.

### Configuration rows
Now you can configure the reports to extract as configuration rows. First, **Add Row**:

{: .image-popup}
![Add Row](/components/extractors/marketing-sales/bigcommerce/add_row.png)

First you must select one of the **Endpoints** to select the data you wish to download:
- `Brands` to download [data about brands](https://developer.bigcommerce.com/api-reference/c2610608c20c8-get-all-brands#response-body).
- `Customers` to download [data about customers](https://developer.bigcommerce.com/api-reference/761ec193054b6-get-all-customers#response-body).
- `Orders` to download [data about orders](https://developer.bigcommerce.com/api-reference/82f91b58d0c98-get-all-orders#response-body) and [their products](https://developer.bigcommerce.com/api-reference/3b4dfef625708-list-order-products#response-body).
- `Products` to download [data about products](https://developer.bigcommerce.com/api-reference/4101d472a814d-get-all-products#response-body) (in your entire catalogue).

If you are extracting *time bound* data (i.e. anything **except** `Brands`), you must specify the **Sync Options** as well:
- **Date From** - Date from which data is downloaded (i.e. only data last modified after this are downloaded). Either date in `YYYY-MM-DD` format or a string i.e. `5 days ago`, `1 month ago`, `yesterday`, etc. You can also set this as `last run`, which will fetch data from the last run of the component; if no previous successful run exists, all data up to specified **Date To** will be downloaded.
- **Date To** - Date to which data is downloaded (i.e. only data last modified before this are downloaded). Either date in `YYYY-MM-DD` format or a string i.e. `5 days ago`, `1 week ago`, `today`, etc.

Finally, in the **Destination** part of the row configuration, you must choose the **Load Type**, i. e. whether you want to use [incremental loading](/storage/tables/#incremental-loading) (by selecting `Incremental Load`) or full loading (by selecting `Full Load`).

{: .image-popup}
![Row configuration entry](/components/extractors/marketing-sales/bigcommerce/row_config.png)

Once again: don't foget to **Save**.

### Example configuration

Let's say you want to download orders and their products modified after the last component run up to now, and upsert the resultant data into the Keboola Storage tables called `orders` and `order_products` respectively. In that case you would:
1. Set the **Endpoints** to `Orders`,
2. the **Date From** to `last run`,
3. the **Date To** to `now`, and
4. the **Load Type** to `Incremental Load`.

## Output
The output of each configuration row are tables with preset names as specified below for each case of the Endpoints row configuration option. Tables are **not** created if they would end up empty.

<!-- List of tables, foreign keys, schema. -->
### Brands
Brands are extracted as a table called `brands` that contains all [the fields the API provides](https://developer.bigcommerce.com/api-reference/c2610608c20c8-get-all-brands#response-body) flattened as columns (with the underscore `_` used as a separator).

<!-- The primary key is composed of only the column `id`. -->

### Customers
Customers are extracted as a table called `customers` that contains all [the fields the API provides](https://developer.bigcommerce.com/api-reference/761ec193054b6-get-all-customers#response-body) flattened as columns (with the underscore `_` used as a separator).

<!-- The primary key is composed of only the column `id`. -->

### Orders
Orders (from the entire catalogue) are extracted as a table called `orders` that contains all [the fields the API provides](https://developer.bigcommerce.com/api-reference/82f91b58d0c98-get-all-orders#response-body) flattened as columns (with the underscore `_` used as a separator) as well as their Order Products as a table called `order_products` (also with [all the fields the API provides](https://developer.bigcommerce.com/api-reference/3b4dfef625708-list-order-products#response-body) and flattened).

The primary key is composed of only the column `id` for the table `orders` and of the combination of columns `id` and `order_id` for the table `order_products`.

### Products
Products (from the entire catalogue) are extracted as a table called `products` that contains all [the fields the API provides](https://developer.bigcommerce.com/api-reference/4101d472a814d-get-all-products#response-body) flattened as columns (with the underscore `_` used as a separator).

<!-- The primary key is composed of only the column `id`. -->