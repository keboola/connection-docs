---
title: Stripe
permalink: /components/extractors/other/stripe/
redirect_from:
    - /extractors/other/stripe/
---

* TOC
{:toc}

This data source connector uses the [Stripe API](https://stripe.com/docs/api) to import almost all data from [Stripe](https://stripe.com/).

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Stripe** connector.
You need to provide an [API token](https://stripe.com/docs/api#authentication).
You can get it in the [Stripe dashboard](https://dashboard.stripe.com/login?redirect=%2Faccount%2Fapikeys). 

To configure what data you want to extract, you can select one of the configuration templates:

- Only Charges -- FULL LOAD
- Almost ALL Data -- FULL LOAD

{: .image-popup}
![Screenshot - Stripe Confguration](/components/extractors/other/stripe/stripe-1.png)

When done, **Save** the configuration. 

You can also [switch to the JSON editor](/components/extractors/other/generic/#template-mode).
