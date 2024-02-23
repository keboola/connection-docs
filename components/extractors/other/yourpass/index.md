---
title: YourPass
permalink: /components/extractors/other/yourpass/
redirect_from:
    - /extractors/other/yourpass/
---

* TOC
{:toc}

YourPass enables users to create passes for mobile wallets; e.g., for boarding passes, loyalty points, or tickets.

The YourPass extractor uses the [YourPass API](https://doc.yourpass.eu/) to import data from [YourPass](https://www.yourpass.eu/)
to Keboola.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **YourPasss** extractor.

### Authorization Configuration

Fill in the required authorization parameters:
- `Username`: string (required); your YourPass username/email
- `Password`: string (required); your YourPass password
- `Client Id`: string (required); your YourPass client Id
- `Client secret`: string (optional); your YourPass client secret; if not specified, can be left empty.

Then you can toggle between sandbox mode and production mode using the checkbox. When the checkbox is checked, the sandbox mode is set.

{: .image-popup}
![Screenshot - YourPass authorization configuration](/components/extractors/other/yourpass/yourpass_auth.png)

**Save** the configuration and then click **Add Row** to create a new row configuration.

### Row Configuration

In the row configuration select the pass endpoint to extract data about passes (only the pass endpoint is currently supported by the extractor).
Then specify the output table name in the parameter **Output name**; this will be the name of the output table in Keboola.
Specify the project ID to only fetch passes from a specific project. You can also specify the template ID, to only fetch
passes created with a specific template. You can specify both template ID and project ID, as well as keep both blank. If you keep both 
parameters blank, the extractor will fetch all passes from all projects.

{: .image-popup}
![Screenshot - YourPass row configuration](/components/extractors/other/yourpass/yourpass_row.png)

### Load Settings

Select one of the following two load types: 

- `Incremental Update` -- updates the result tables based on the primary key.
- `Full Load` -- overwrites the destination table each time.

You can set the primary keys by clicking the button **Add Primary Key Column** and adding multiple keys if required.
You can delete primary keys by clicking the button **Delete Primary Key Column**. Just make sure to delete the output tale 
in the storage before deleting primary keys, as the output table always expects the list of primary keys to stay constant.

