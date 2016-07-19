---
title: Tokens
permalink: /storage/tokens/
---

* TOC
{:toc}

Every operation done in KBC must be authorized with a *Token* (sometimes called *Storage API Token*,
*SAPI Token* or simply *Storage Token*). Storage token is required for almost all operations because they
(may) manipulate data in Storage.

Each KBC user is automatically assigned when they join a project. Additionally, other tokens are created
automatically in some cases when you create a new configuration of a component (e.g. Orchestrations).
Apart from that, you may create unlimited number of other tokens with access to all or some Storage
buckets to easily [share a single table](/overview/tutorial/management/#user-management)
from your Storage with someone without them having to become a project administrator.

Tokens can be managed from *Storage* - *File Uploads* page. Tokens which belong to project
administrators are called *Master Tokens* and they have the user email as their description.
Master tokens cannot be modified or deleted. If you want to delete a Master token, you must
remove the user from the project at the *Users & Settings* page.
Every token can be *refreshed*, which means that the actual token becomes immediately invalid.
If you invalidate your own master token, you must refresh your Storage view in console.
Because tokens allow access to data, you should refresh a token in case there is a suspicion
that the token has leaked.

{: .image-popup}
![Screenshot - Storage Tokens](/storage/tokens/overview.png)

## Using Limited Tokens
To add users with access limited to only some of your data, create a new, temporary, access token:

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/access-tokens.png)

Limit access of that token to a single Storage bucket, for instance, 'out.c-tutorial'.
You can also limit the token validity.

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/access-token-detail.png)

Once the token is created, display its details and send it to an arbitrary email address by clicking the **Send token** button.

{: .image-popup}
![Screenshot - Access Tokens](/storage/tokens/access-token-detail-2.png)

An additional message can be sent along with the token.

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
A Storage token itself does not allow the bearer to access KBC via Administrative UI. However the
allows the bearer to call various [APIs](http://developers.keboola.com/overview/api/) and run tasks.
A Master token has always access to all components, so having the master token is equivalent of
having access to the KBC Administration UI.

When you create a new token, the token by default has
**no access** to any of the KBC components, which means that all the token bearer can do is access the
the permitted Storage buckets via [Storage API](http://developers.keboola.com/integrate/storage/) or
via the [Storage Console](https://storage-api-console.keboola.com/). The token cannot be used to
run any actions in your project.

For production use, it is recommended not to give away your master token, but to create dedicated tokens for
different uses. This also simplifies their invalidation as it is clear for what each token is used. For example,
suppose that you need to trigger extracting data from a MySQL database from within your own environment. You would
then create a token which is authorized for running the *MySQL Database Extractor* (`keboola.ex-db-mysql` component) and
*write* access to bucket `in.c-tutorial` (which is used as destination in the particular configuration, you want to run).

{: .image-popup}
![Screenshot - Component limited token](/storage/tokens/component-limited.png)

You can then give away the token to the maintainer of the database process and be sure that he can use
only that particular component in that particular bucket (while he can still reconfigure it, e.g. update the extraction queries).
Also being able to write to a limited sets of bucket is a nice prevention of an accidental overwrite of some data.
