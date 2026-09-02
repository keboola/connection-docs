---
title: AWS Signature
slug: 'components/extractors/generic-extractor/configuration/aws-signature'
redirect_from:
    - /extend/generic-extractor/configuration/aws-signature/
---

<!-- Reference-type page. Content not yet re-verified against keboola/generic-extractor; see PRDCT-676. -->


Generic Extractor allows signing requests with [**AWS Signature Version 4**](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).
Signing is the process of adding authentication information to your requests. When you use AWS tools, the extractor signs your API request.

A sample AWS signature configuration looks like this:

```json
{
  ...,
  "aws": {
    "signature": {
      "credentials": {
        "accessKeyId": "testAccessKey",
        "#secretKey": "testSecretKey",
        "serviceName": "testService",
        "regionName": "testRegion"
      }
    }
  }
}
```

See [example [EX143]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/143-aws-signature-request).

## AWS Signature Credentials
- **accessKeyId** — AWS access key ID
- **#secretKey** — AWS secret access key
- **serviceName** — Signing to a particular service name
- **regionName** — Signing to a particular region name
