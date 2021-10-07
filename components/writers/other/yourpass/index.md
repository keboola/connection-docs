---
title: YourPass
permalink: /components/writers/other/yourpass/ 
---c

* TOC
{:toc}
  
YourPass enables users to create passes for mobile wallets; e.g., for boarding passes, loyalty points, or tickets.

The YourPass writer uses the [YourPass API](https://doc.yourpass.eu/) to
create/delete/update [YourPass](https://www.yourpass.eu/) passes.

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **YourPass** writer.

### Authorization Configuration

Fill in the required authorization parameters:

- `Username`: your YourPass username/email
- `Password`: your YourPass password
- `Client Id`: your YourPass client Id
- `Client secret`: your YourPass client secret; if not specified, can be left empty.

Then you can toggle between sandbox mode and production mode using the checkbox. When the checkbox is checked, the
sandbox mode is set.

{: .image-popup}
![Screenshot - YourPass authorization configuration](/components/writers/other/yourpass/yourpass_auth.png)

**Save** the configuration and then click **Add Row** to create a new row configuration.

### Row Configuration

#### Input table mapping

Click **New Table Input** to add one table to the [Input Mapping](/transformations/mappings/).

{: .image-popup}
![Screenshot - Input mapping](/components/writers/other/yourpass/inputmapping.png)

#### Input file properties

Each action on the pass requires different input data in a specific format. All dynamic data and images should be
flattened with an underscore.

```json
 {
  "id": "1101",
  "dynamicData": {
    "lastName": "Jedno",
    "fistName": "Tomáš"
  },
  "dynamicImages": {
    "logo": "id-of-logo-image",
    "strip": {
      "cs": "id-of-czech-image"
    }
  }
}

```

Will be

```json
 {
  "id": "1101",
  "dynamicData_lastName": "Jedno",
  "dynamicData_fistName": "Tomáš"
  "dynamicImages_logo": "id-of-logo-image",
  "dynamicImages_strip_cs": "id-of-czech-image"
}
```

The header names of the data in the input table should be in line with the header names
of [YourPass properties](https://doc.yourpass.eu/#pass) (case-sensitive).

- To create a pass the input file should contain the templateId and optionally the expirationDate, dynamicData, and
  dynamicImages
- To Delete a pass the input file should ony contain the pass Id
- To update passes the input file should contain the pass Id and templateId, optionally the dynamicData, dynamicImages,
  expirationDate, and voided.

#### Endpoint and action setting

In the row configuration select the pass endpoint to create/delete/update pass data (only the pass endpoint is currently
supported by the writer). Then select the exact action you want to perform :

- Create  : create a new pass
- Delete  : delete an existing pass based on an ID
- Update  : update an existing pass

Once all configurations are set click **save** to save the configuration.

{: .image-popup}
![Screenshot - Input mapping](/components/writers/other/yourpass/row.png)
