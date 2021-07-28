---
title: YourPass
permalink: /components/extractors/other/yourpass/
redirect_from:
    - /extractors/other/yourpass/
---

* TOC
{:toc}

YourPass enables users to create passes for mobile wallets; eg. for boarding passes, loyalty points, or tickets.

The YourPass extractor uses the [YourPass API](https://doc.yourpass.eu/) to import data from [YourPass](https://www.yourpass.eu/)
to Keboola Connection.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **YourPasss** extractor.

### Authorization configuration

Fill in the required authorization parameters:
- Username (username) - [REQ] your YourPass username/email
- Password (#password) - [REQ] your YourPass password
- Client Id (client_id) - [REQ] your YourPass client Id
- Client secret (#client_secret) - [OPT] your YourPass client secret, If not specified, can be left empty

Then you can toggle between sandbox mode and production mode using the checkbox. When the checkbox is checked, the sandbox mode is set.

{: .image-popup}
![Screenshot - YourPass authorization configuration](/components/extractors/other/yourpass/yourpass_auth.png)

Then click **Save** to save the configuration and click **Add row** to create a new row configuration.

### Row configuration

In the row configuration select the pass endpoint to extract data about passes (only the pass endpoint is currently supported by the extractor).
Then specify the output table name in the parameter **Output name**, this will be the name of the output table in Keboola.
Then you can specify the project id, to only fetch passes from a specific project. You can also specify the template id, to only fetch
passes created with a specific template. You can specify both template id and project id, as well as keep both blank. If you keep both parameters blank, the
extractor will fetch all passes from all projects.

{: .image-popup}
![Screenshot - YourPass row configuration](/components/extractors/other/yourpass/yourpass_row.png)

### Load settings

Select one of the following two load types: 

- `Incremental Update` -- updates the result tables based on the primary key.
- `Full Load` -- overwrites the destination table each time.

You can set the primary keys by clicking the **Add primary key column** button and adding multiple keys if required.
You can delete primary keys by clicking the **Delete primary key column** button, just make sure to delete the output tale in the storage before deleting
 primary keys, as the output table always expects the list of primary keys to stay constant.

