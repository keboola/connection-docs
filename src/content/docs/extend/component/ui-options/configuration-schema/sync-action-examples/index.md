---
title: Sync Action UI Elements Examples
slug: 'extend/component/ui-options/configuration-schema/sync-action-examples'

---


Some UI elements use [sync actions](/extend/common-interface/actions/) to get some values dynamically 
from the component code. This section provides a list of the elements currently supported. 

Each element specifies the `action` attribute, which relates to the name of the sync action registered in the Developer Portal.

***Note:** Support for these elements is also abstracted in the official [Python Component library](https://github.com/keboola/python-component#framework-support).*

### Dynamically Loaded Dropdowns

Drop-down lists (values and labels) can be loaded by the component sync action. 

The sync action code has to return the following stdout:

```
[
 { label: 'Joe', value: 'joe' },
 { label: 'Doe', value: 'doe },
 { label: 'Jane', value: 'jane' }
]
```

The `label` value is optional. 

When used in Python, you can use the [SelectElement](https://github.com/keboola/python-component#selectelement) class as a return value.

#### Dynamically loaded multi select

```json
{
    "test_columns": {
      "type": "array",
      "propertyOrder": 10,
      "description": "Element loaded by an arbitrary sync action.",
      "items": {
        "enum": [],
        "type": "string"
      },
      "format": "select",
      "options": {
        "async": {
          "label": "Re-load test columns",
          "action": "testColumns"
        }
      },
      "uniqueItems": true
    }
}
```

The above code will create the following element, which triggers an action named `testColumns`:

![Screenshot](/extend/component/ui-options/ui-examples/dynamic_dropdown_multi.gif)

#### Dynamically loaded single select

```json
{
  "test_columns_single": {
    "propertyOrder": 40,
    "type": "string",
    "description": "Element loaded by an arbitrary sync action (single).",
    "enum": [],
    "format": "select",
    "options": {
      "async": {
        "label": "Re-load test columns",
        "action": "testColumns"
      }
    }
  }
}
```

The above code will create the following element, which triggers the `testColumns` action:

![ Screenshot](/extend/component/ui-options/ui-examples/single-drop.gif)

### Generic Validation Button

This button can be used to return feedback from the component. The output supports Markdown.

Example use cases are query testing, testing connection, report validation, etc.

The sync action code has to return the following stdout (JSON string):

```json
{
  "message": "###This is display text. \n\n It can contain **Markdown** notation. ",
  "type": "info",
  "status": "success"
}
```

**Available options:**
- `type`: possible values: success, info, warning, error, table
- `status`: possible values: success, error

#### Custom Icons

Markdown supports special status icons that are rendered in Keboola UI style. The following icons are supported:

```
![success]()
![warning]()
![error]()
```

![status_icons.png](/extend/component/ui-options/ui-examples/status_icons.png)

When used in Python, you can use the [ValidationResult](https://github.com/keboola/python-component#validationresult) class as a return value.

**NOTE** If status: error is used the message will always be displayed as an error message.

#### Example

```json
{
  "validation_button": {
    "type": "button",
    "format": "sync-action",
    "propertyOrder": 10,
    "options": {
      "async": {
        "label": "Validate",
        "action": "validate_report"
      }
    }
  }
}
```

The above code will create the following element, which triggers the `validate_report` action:

![screenshot](/extend/component/ui-options/ui-examples/generic-button.gif)

### Test Connection

This button can be used for simple connection tests. 

The sync action code has to return the following stdout (JSON string) or error (exit code >0):

```json
{
  "status": "success" // this is required and will never be other value than "success"
}
```

The name of this sync action **always has to be `testConnection`.**

When used in Python, the method does not need to return anything, or it can just throw an exception.

#### Example

```json
{
    "test_connection": {
      "type": "button",
      "format": "test-connection",
      "propertyOrder": 30
    }
}
```

The above code will create the following element, which triggers the `testConnection` action:

![multiselect](/extend/component/ui-options/ui-examples/test_connection.png)

### Autoload

All sync action types (buttons, select, and multi-selects) can automatically trigger the sync action if not defined on the UI page load. 

#### Example

```json
{
  "endpoint": {
    "type": "string",
    "title": "Endpoint",
    "description": "Use the sync action to get a list of available endpoints.",
    "propertyOrder": 1,
    "options": {
      "async": {
        "label": "List Endpoints",
        "action": "listEndpoints",
        "autoload": []
      }
    },
    "items": {
      "enum": [],
      "type": "string"
    },
    "enum": []
  }
}
```

Additionally, a watch element can be set in an autoload array, which, when defined or changed, will trigger the sync action.

#### Example

```json
{
  "field_names": {
    "type": "array",
    "format": "select",
    "title": "Fields (optional)",
    "description": "List of field names to be downloaded",
    "propertyOrder": 2,
    "options": {
      "async": {
        "label": "List Fields",
        "action": "listFields",
        "autoload": [
          "parameters.endpoint"
        ]
      }
    },
    "items": {
      "enum": [],
      "type": "string"
    },
    "uniqueItems": true
  }
}
```

The autoload option also enables caching loaded values by default, which can be disabled by setting the `autoload.cache` to false.

#### Example

```json
{
  "endpoint": {
    "type": "string",
    "title": "Endpoint",
    "description": "Use a sync action to get a list of available endpoints.",
    "propertyOrder": 1,
    "options": {
      "async": {
        "label": "List Endpoints",
        "action": "listEndpoints",
        "autoload": [],
        "cache": false
      }
    },
    "items": {
      "enum": [],
      "type": "string"
    },
    "enum": []
  }
}
```
