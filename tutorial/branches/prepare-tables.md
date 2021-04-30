---
title: Prepare table manipulating configurations
permalink: /tutorial/branches/prepare-tables/
---

* TOC
{:toc}

In this section you will prepare [component configurations](/components/) that manipulate tables and buckets in [storage](/storage/). We'll use those configurations in the following sections to show how branches work. 

You can create a configuration of any component in a branch and the following steps are not strictly necessary -- you
can use branches in a completely empty project. However, the tutorial follows the typical situation when you're using 
branches in a non-empty project.

## Prepare the production configurations
You'll start with a data pipeline that pulls data about bitcoin prices and creates a list of top 5 days when the price was the highest. Let's prepare the production configurations, so that you can try working with branches later.

First you need to pull the bitcoin data. To simplify this, you can download a [prepared csv file](/tutorial/branches/bitcoin_price.csv) using [HTTP extractor](/components/extractors/storage/http/).

## Set up HTTP extractor in production

Create new [HTTP extractor](/components/extractors/storage/http/) configuration, fill in **Base URL** to `https://help.keboola.com`. Then add a new table to the extractor, named `bitcoin_price` and fill the **Path** to `/tutorial/branches/bitcoin_price.csv`. **Table Name** should be `bitcoin_price`.

{: .image-popup}
![Prepared HTTP extractor row](/tutorial/branches/figures/http-ex-prod-row.png)

{: .image-popup}
![Prepared HTTP extractor](/tutorial/branches/figures/http-ex-prod-set-up.png)

Run the extractor and verify that a new table `in.c-keboola-ex-http-682373219.bitcoin_price` was created.

*Note: The number in your bucket name represents configuration ID and will be different from what you see on the screenshot.*

### Set up transformation 
First create a new [Snowflake transformation](/transformations/snowflake-plain/), named `Bitcoin`.

{: .image-popup}
![New snowflake transformation](/tutorial/branches/figures/new-snflk.png)

In the **Table Input Mapping** section fill in the `bitcoin_price` table that you created using HTTP extractor. 

{: .image-popup}
![Snowflake input mapping](/tutorial/branches/figures/snflk-prod-im.png)

In **Table Output Mapping** add `top_prices` table that will be created in the transformation.

{: .image-popup}
![Snowflake output mapping](/tutorial/branches/figures/snflk-prod-om.png)

Finally, add a new code to `Block 1` named `Top prices` with following query.

{% highlight sql %}
{% raw %}
CREATE TABLE "top_prices" AS SELECT * FROM "bitcoin_price" ORDER BY PRICE DESC LIMIT 5;

ALTER TABLE "top_prices" DROP COLUMN "_timestamp";
{% endraw %}
{% endhighlight %}

{: .image-popup}
![Snowflake output mapping](/tutorial/branches/figures/snflk-prod-code.png)


{: .image-popup}
![Finished transformation](/tutorial/branches/figures/transformation-prod-set-up.png)

Save the transformation and run it. Then verify that there is a new table `out.c-bitcoin.top_prices` containing 5 values from the
source data -- dates and amounts when bitcoin had the most value.

{: .image-popup}
![New table](/tutorial/branches/figures/snflk-new-table.png)

Now you have the production set and in [the next section](/tutorial/branches/prepare-files/) you'll set up a Python transformation using file storage. After that you can give branches a test run. 
