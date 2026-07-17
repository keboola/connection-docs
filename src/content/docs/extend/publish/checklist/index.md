---
title: Checklist
slug: 'extend/publish/checklist'
---


This checklist is used for the last check of the component before sending the publish request.
See [Publish Component tutorial](/extend/publish/) for details.

**Developer Portal**
- <input type="checkbox"> The component name doesn't contain words like `extractor`, `application`, and `writer`.
- <input type="checkbox"> The component icon is representative and has reasonable quality. It is in `PNG` format and without background.
- <input type="checkbox"> The short description describes the **service**, NOT `This extractor extracts ...`.
- <input type="checkbox"> Licensing information is valid, and the vendor description is current.
- <input type="checkbox"> License and documentation URLs are publicly accessible, no link to a private repository.
- <input type="checkbox"> The tag is set to the expected value and uses [semantic versioning](https://semver.org/).
- <input type="checkbox"> The correct [data flow is set in UI options](/extend/publish/#component-name-and-description).

**Component Configuration**
- <input type="checkbox"> Sensitive values [use encryption](/overview/encryption/).
- [Configuration and Row schema](/extend/publish/#component-configuration)
    - <input type="checkbox"> Titles are short and without a colon, period, etc.
    - <input type="checkbox"> Required properties are listed in the field `required`.
    - <input type="checkbox"> Each property has defined `propertyOrder`.
    - <input type="checkbox"> Properties have an explanatory `description` if they are not trivial.
- Configuration description (if used)
  - <input type="checkbox"> Contains only level 3 `###` and level 4 `####` headers.
  - <input type="checkbox"> Doesn't repeat what is obvious from Configuration and Row schema.

**Component Internals**
- Job exits with an understandable [UserError](/extend/common-interface/environment/#return-values) if:
  - <input type="checkbox"> Empty configuration.
  - <input type="checkbox"> Invalid credentials.
  - <input type="checkbox"> Wrong data type used (e.g., string instead of array).
  - <input type="checkbox"> Missing required property.
  - <input type="checkbox"> Random/invalid data typed to the configuration properties.
  - <input type="checkbox"> External server/service is down.
  - <input type="checkbox"> An expected error occurs (e.g., not found, too many requests, ...).
- <input type="checkbox"> Internal messages (e.g., stack trace) with no meaning for the user are not logged.

**Publication Request**
- <input type="checkbox"> A link to the pull request with changes in the [documentation](/) is included (if any). 
