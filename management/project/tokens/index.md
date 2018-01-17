---
title: API Tokens
permalink: /management/project/tokens/
redirect_from:
  - /storage/tokens/
---

* TOC
{:toc}

All operations in a KBC project must be authorized. This is technically done using an *API Token*
(also called *Storage API Token*, *SAPI Token* or *Storage Token*). KBC is built
using the [API-first approach](https://apigee.com/about/tags/api-first-0), that means that
that almost every operation done in KBC is in fact an API call and uses an API Token. A token is 
valid only within a single project (hence the name Storage API Token). Apart from Storage tokens, 
there are also [manage tokens](/management/account/#tokens) which are used to perform operations outside individual projects.

Normally, when you are using the user interface, your API token is exchaned automatically with
the server backend. Therefore you need to work with tokens only when working with KBC programatically. 
To learn more about all the available programatic approaches, please follow our 
[Developers documentation](https://developers.keboola.com/overview/api/).
Tokens can be managed from the *Users & Settings* --- *API Tokens* page.

{: .image-popup}
![Screenshot - Storage Tokens](/management/project/tokens/overview.png)

## Master Tokens
Tokens that belong to the project
administrators are called **Master Tokens**. Their description is the email of the user they belong to. Master tokens cannot be modified, shared or deleted. The only way to delete a master Token is by 
[removing the user](/management/project/users/#removing-a-user) from the project at the 
[*Users & Settings* page](/management/project/users/). A single has only a single master token, also master
tokens are the only one which can be used to create other tokens.
A Master token has always access to all components, so having the master token allows you to do everything that can be otherwise done via the KBC Administration UI.

## Working with tokens
API tokens are created:

1. automatically when joining a project (master token)
2. automatically when creating a new configuration of certain components (for example, Orchestrations)
3. manually when needed

Typical reasons to manually create a new API token include:

- you want to use the [APIs](https://developers.keboola.com/overview/api/), this includes all of the [Storage Clients](https://developers.keboola.com/integrate/storage/#storage-api-clients)
- you need to limit access to certain data (for example share a single table) or components

Although tokens cannot be used to directly login to the KBC UI, they do allow executing almost all 
operations in a KBC project. As such, they must be treated as secret. Therefore the token 
string is shown only when the token is created and it is not accessible later. You should 
immediatelly [refresh a token](#refreshing-a-token) in case there is a suspicion that the 
token string was revealed to unauthorized persons.

When creating a new token, the following rules apply:

- The token by default gives **no access** to any of the KBC components;
- The token bearer can only access **permitted** Storage buckets via [Storage API](http://developers.keboola.com/integrate/storage/) or
[Storage Console](https://storage-api-console.keboola.com/); and
- The token **cannot** be used to run any actions in your project.
- The token **cannot** be used to create other tokens (only master token can be used to create new tokens).

You should never share the same token in multiple applications. The number of tokens is not 
limited anyhow, neither are any charges associated with them. Therefore, everytime you need to provide
someone with a KBC token, create a new one.

## Token Events
KBC also tracks all operations performed by each token. You can view the list of events from 
the token detail page. Click on the token you are interested in:

{: .image-popup}
![Screenshot - Token List](/management/project/tokens/token-list.png)

In the *Events* tab, you can see all operations performed by that token:

{: .image-popup}
![Screenshot - Token List](/management/project/tokens/token-list.png)

*Note: History of token operations is kept for **6 months**.* If you are interested in 
events assocaited with a particular storage object, view events in [Storage](/storage/).

## Limited Tokens
To add users with access limited to only some of your data, create a new token:

{: .image-popup}
![Screenshot - Access Tokens](/management/project/tokens/access-tokens.png)

Limit access of that token to a single Storage bucket, for instance, 'in.c-csv-import'.
You can also limit the token validity.

{: .image-popup}
![Screenshot - Access Tokens](/management/project/tokens/access-token-detail.png)

You can see and copy the token only once --- right after it was created. If you
need to access the token later, you can [share it](#sharing-token).

{: .image-popup}
![Screenshot - Access Tokens](/management/project/tokens/access-token-detail-2.png)

Token details can be accessed and updated anytime on the token detail page.

{: .image-popup}
![Screenshot - Access Tokens](/management/project/tokens/access-token-detail-3.png)

## Limited Access to Components
For production use, it is recommended not to give away your master token, but to create **dedicated** tokens for
different uses. This also simplifies refreshing tokens as it is clear for what each token is used.

For example, suppose that you need to trigger extracting data from a MySQL database from within your own environment.
You would then create a token which is authorized for running the *MySQL Database Extractor* (`keboola.ex-db-mysql` component) and
*write* access to the `in.c-csv-import` bucket (which is used as a destination in the particular configuration you want to run).

{: .image-popup}
![Screenshot - Component limited token](/management/project/tokens/component-limited.png)

You can then [share the token](#sharing-a-token) to the person responsible for the database process and be 
sure that they can use only that particular component in that particular bucket. They will be even able to 
reconfigure it --- e.g. update the extraction queries (but only via the API).
Also, being able to write to a limited set of buckets is a good way how to prevent accidentally overwriting data.

## Refreshing a Token
Every token can be *refreshed*: a new token value (token string) is generated and the old token becomes immediately invalid. That means that you have to update all places where the token was used. If you invalidate your own master token, you have to reload your KBC view in the browser.

{: .image-popup}
![Screenshot - Refresh Token Button](/management/project/tokens/refresh-token.png)

A confirmation dialog is displayed. When you click *Refresh*, the old token will become invalid.

{: .image-popup}
![Screenshot - Refresh Token Detail](/management/project/tokens/refresh-token-detail.png)

A new token is generated, you can copy it or send it to someone.

{: .image-popup}
![Screenshot - Refresh Token Done](/management/project/tokens/refresh-token-done.png)

## Sharing a Token
An existing token can be shared to an arbitrary email address (including yours). You can
share a token by clicking the **Send token** button. Note that master
tokens cannot be shared. 

**Important: Always use the send token feature instead of copying and sending the token yourself**. The send token feature is more secure because it does not actually send the token, only a link to retrieve it.

{: .image-popup}
![Screenshot - Access Tokens](/management/project/tokens/send-token-button.png)

A message can be added to the email.

{: .image-popup}
![Screenshot - Send Token](/management/project/tokens/send-token.png)

The recipient will obtain an email with an invitation link leading to the following screen:

{: .image-popup}
![Screenshot - Token Welcome Screen](/management/project/tokens/token-welcome.png)

Only the buckets you made accessible will be accessible by the token. If you set the token to expire, 
it will get deleted automatically after the specified period. In addition to sharing sections of 
your data with selected users, the buckets can be also used for writing;
people can send data directly to your KBC project instead of struggling with FTP or e-mail attachments.
To revoke the access, simply delete the token.

The token can than be used with the [Storage API](https://developers.keboola.com/integrate/) 
or some [other API](https://developers.keboola.com/overview/api/). It is also possible to 
use the [*Storage Console*](https://storage-api-console.keboola.com/) to upload or download
tables or files to the project.

{: .image-popup}
![Screenshot - Storage Console](/management/project/tokens/storage-console.png)
