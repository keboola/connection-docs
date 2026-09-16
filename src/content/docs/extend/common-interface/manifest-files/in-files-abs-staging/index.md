---
title: ABS Staging
slug: 'extend/common-interface/manifest-files/in-files-abs-staging'
---

When using [Azure Blob Storage for direct data exchange](/extend/common-interface/folders/#exchanging-data-via-abs),
the manifest files in the component’s working directory will contain an additional `abs` section with
credentials for downloading the actual file data.

```json
{
    "id": "in.c-docker-demo.data",
    ...
    "abs": {
        "is_sliced": true,
        "region": "us-east-1",
        "container": "exp-2-export-7647-627703071-in-c-docker-test-test",
        "name": "627703071.csv.gzmanifest",
        "credentials": {
            "sas_connection_string": "BlobEndpoint=https://kbcfsdxcgtsezztoqc.blob.core.windows.net;SharedAccessSignature=sv=2017-11-09&sr=c&st=2020-08-27T08:42:08Z&se=2020-08-27T20:42:08Z&sp=rl&sig=UJW4DPh%2Baaaaaaaaaa",
            "expiration": "2020-08-27T22:42:08+0200"
        }
    }
}
```

If the file is sliced and you need to merge it into a single file, read through the guide to
[working with sliced files](/storage/api/import-export/#working-with-sliced-files).
In that case, the `name` points to another manifest, which contains a list of sliced files.

Note: Exchanging data via Azure ABS is currently available only for input mapping.
