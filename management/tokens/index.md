---
title: Tokens
permalink: /management/tokens/
redirect_from:
    - /storage/tokens/
---

* TOC
{:toc}

Almost all operations in KBC must be authorized. This is done using *API Tokens*
(also called *Storage API Token*, *SAPI Token* or *Storage Token*). KBC is build
using the [API-first approach](https://apigee.com/about/tags/api-first-0), that means that
that almost every operation done in the KBC must is in fact an API call and uses an
API Token.

Normally, when you are using the user interface, your API token is exchaned automatically with
the server backend. Tokens are mostly used when working with KBC programatically. To do so, please follow our 
[Developers documentation](https://developers.keboola.com/overview/api/).

## Working with tokens
Tokens can be manage from the *Users & Settings* - *API Tokens* page. If they belong to project
administrators, they are called **Master Tokens**. Their description is their user email and they cannot be modified or deleted.
The only way to delete Master Tokens is removing the user from the project at the *Users & Settings* page.

{: .image-popup}
![Screenshot - Storage Tokens](/storage/tokens/overview.png)

As mentioned above, tokens are created:
1. automatically when joining a project (master token)
2. automatically When creating a new configuration of certain components (for example, Orchestrations)
3. manually when needed

The typical reasons to create a new API token include:
- you want to use the [APIs](https://developers.keboola.com/overview/api/), this includes all of the [Storage Clients](https://developers.keboola.com/integrate/storage/#storage-api-clients)
- you need to limit access to certain data (for example share a single table) or components

Every token can be *refreshed*: a new token is generated and the old token becomes immediately invalid.
If you invalidate your Master Token, reload your KBC view in the browser.

Because tokens allow access to data, you should refresh a token in case there is a suspicion
that the token has leaked.

[sharing a single table](/tutorial/management/#user-management)

## Using Limited Tokens
To add users with access limited to only some of your data, create a new, temporary access token:

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/access-tokens.png)

Limit access of that token to a single Storage bucket, for instance, 'in.c-csv-import'.
You can also limit the token validity.

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/access-token-detail.png)

You can see and copy the token only once right after it was created.

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/access-token-detail-2.png)

Token details can be accessed and updated anytime on the token detail page.

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/access-token-detail-3.png)

After the token is created, it to an arbitrary email address by clicking the **Send token** button.

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/send-token-button.png)

A message can be added to the email.

{: .image-popup}
![Screenshot - Send Token](/storage/tokens/send-token.png)

The recipient will obtain an email with an invitation link leading to the following screen:

{: .image-popup}
![Screenshot - Token Welcome Screen](/storage/tokens/token-welcome.png)


Via the [*Storage Console*](https://storage-api-console.keboola.com/), the added user can log into your project.

{: .image-popup}
![Screenshot - Storage Console](/storage/tokens/storage-console.png)

Only the buckets you made accessible will be seen. If you set the token to expire, it will
get deleted automatically after the specified period.

## Limited Access to Components
A Storage token itself does not allow the bearer to access KBC via the Administration UI. However, it
allows them to call various [APIs](http://developers.keboola.com/overview/api/) and run tasks.
A Master token has always access to all components, so having the master token allows you to do everything that can be otherwise done via the KBC Administration UI.

When creating a new token, the following rules apply:

- The token by default gives **no access** to any of the KBC components;
- The token bearer can only access **permitted** Storage buckets via [Storage API](http://developers.keboola.com/integrate/storage/) or
[Storage Console](https://storage-api-console.keboola.com/); and
- The token **cannot** be used to run any actions in your project.

For production use, it is recommended not to give away your Master Token, but to create **dedicated** tokens for
different uses. This also simplifies their invalidation as it is clear for what each token is used.

For example, suppose that you need to trigger extracting data from a MySQL database from within your own environment.
You would then create a token which is authorized for running the *MySQL Database Extractor* (`keboola.ex-db-mysql` component) and
*write* access to the `in.c-csv-import` bucket (which is used as a destination in the particular configuration you want to run).

{: .image-popup}
![Screenshot - Component limited token](/storage/tokens/component-limited.png)

You can then give away the token to the person responsible for the database process and be sure that they can use
only that particular component in that particular bucket (while they can still reconfigure it, e.g. update the extraction queries).
Also, being able to write to a limited set of buckets is a good way how to prevent accidentally overwriting data.
