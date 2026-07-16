---
title: S3 Staging
slug: 'extend/common-interface/manifest-files/in-files-s3-staging'
---

When using [AWS S3 for direct data exchange](/extend/common-interface/folders/#exchanging-data-via-s3),
the manifest files in the component’s working directory will contain an additional `s3` section with
credentials for downloading the actual file data.

```json
{
    "id": "in.c-docker-demo.data",
    ...
    "s3": {
        "isSliced": true,
        "region": "us-east-1",
        "bucket": "kbc-sapi-files",
        "key": "exp-2/1581/table-exports/in/c-docker-test/test/243100072.csv.gzmanifest",
        "credentials": {
            "access_key_id": "ASI...CDQ",
            "secret_access_key": "tCE..I+T",
            "session_token": "Ago...POP"
        }
    }
}
```

If the file is sliced and you need to merge it into a single file, read through the guide to
[working with sliced files](/integrate/storage/api/import-export/#working-with-sliced-files).
In that case, the `key` points to another manifest, which contains a list of sliced files.

Note: Exchanging data via AWS S3 is currently available only for input mapping.
