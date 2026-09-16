---
title: /data/out/files manifests
slug: 'extend/common-interface/manifest-files/out-files-manifests'
---

#### `/data/out/files` manifests

An output file manifest sets options for transferring a file to Storage. The following example lists available
manifest fields; all of them are optional.

```json
{
  "is_permanent": true,
  "is_encrypted": true,
  "notify": false,
  "tags": [
    "image",
    "pie-chart"
  ]
}
```

These parameters can be used (taken from [Storage API File Import](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/files/prepare)):

- If `is_permanent` is false, the file will be automatically deleted after 15 days.
- When `notify` is true, the members of the project will be notified that a file has been uploaded to the project.
