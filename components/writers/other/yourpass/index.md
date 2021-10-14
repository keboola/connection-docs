---
title: YourPass
permalink: /components/writers/other/yourpass/ 
---

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

## Row Configuration

### Endpoints

In the row configuration select the Pass endpoint to modify Pass data (only the pass endpoints are currently
supported by the writer). Then select the exact action you want to perform :

- Create  : create a new pass
- Delete  : delete an existing pass based on an ID
- Update  : update an existing pass

For each action there are specific requirements for the input tables, these are explained in the [Input file properties](#input-file-properties) section.

Once all configurations are set, click **save** to save the configuration.

{: .image-popup}
![Screenshot - Input mapping](/components/writers/other/yourpass/row.png)


### Input table mapping

Click **New Table Input** to add one table to the [Input Mapping](/transformations/mappings/).

{: .image-popup}
![Screenshot - Input mapping](/components/writers/other/yourpass/inputmapping.png)

### Input file properties

Each action (create/delete/update) on the pass requires different input data in a specific format, with headers of a specific name.
The header names of the data in the input table should be in line with the header names
of [YourPass properties](https://doc.yourpass.eu/#pass) (case-sensitive).

#### Create

To create passes, add a table into the input mapping with the following columns:

- `templateId` (required) 
- `expirationDate` (optional) -  in ISO 8601 format, YYYY-MM-DDTHH:MM:SS[.mmmmmm]Z ex.: "2021-10-30T14:00:00.000000Z"
- `dynamicData` (optional)  - flattened with an underscore as described in [Adding dynamic data and dynamic images](#adding-dynamic-data-and-dynamic-images)
- `dynamicImages` (optional) - flattened with an underscore as described in [Adding dynamic data and dynamic images](#adding-dynamic-data-and-dynamic-images)

#### Delete

To delete passes, add a table into the input mapping with the following columns:

- `id` (required)

#### Update

To update passes, add a table into the input mapping with the following columns:

- `id` (required) 
- `templateId` (required) 
- `expirationDate` (optional) -  in ISO 8601 format, YYYY-MM-DDTHH:MM:SS[.mmmmmm]Z ex.: "2021-10-30T14:00:00.000000Z"
- `dynamicData` (optional)  - flattened with an underscore as described in [Adding dynamic data and dynamic images](#### Adding dynamic data and dynamic images)
- `dynamicImages` (optional) - flattened with an underscore as described in [Adding dynamic data and dynamic images](#### Adding dynamic data and dynamic images)
- `voided` (optional) - is a boolean value : "True" or "False"


#### Adding dynamic data and dynamic images

All dynamic data and images should be
flattened with an underscore.

```json
 {
  "templateId": "1101",
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
  "templateId": "1101",
  "dynamicData_lastName": "Jedno",
  "dynamicData_fistName": "Tomáš"
  "dynamicImages_logo": "id-of-logo-image",
  "dynamicImages_strip_cs": "id-of-czech-image"
}
```

