---
title: Running Generic Extractor
lastUpdated: 2026-11-27
slug: 'components/extractors/generic-extractor/running'
description: 'Turn on debug mode to see every request Generic Extractor sends, run it locally in Docker with a config.json, and run the documented examples.'
redirect_from:
    - /extend/generic-extractor/running/
---

<!-- How-to-type page. Content not yet re-verified against keboola/generic-extractor; see PRDCT-676. -->


Generic Extractor is normally run from within the Keboola user interface. It can be found in the **Extractors** section
and all you need to do is provide its configuration JSON. No other settings are necessary.

Because creating the configuration JSON can be a non-trivial task, there are some things which can help
you in developing the configuration.

## Before you start

- A Generic Extractor configuration you are working on.
- To run it locally, [Docker](https://docs.docker.com/get-docker/) with Docker Compose, and Git to clone the
  public [Generic Extractor repository](https://github.com/keboola/generic-extractor).
  <!-- VERIFY(Nikita): keboola/generic-extractor is archived; the current source is components/ex-generic in keboola/components, which is private, so readers can't clone it. Both have the same layout (docker-compose.yml service app builds image keboola/generic-extractor, Dockerfile runs composer install, Executor.php defaults the data dir to /data, doc/ has run-single-example.sh and run-samples.sh). The steps below were checked against both repos' files, not run end to end. The old ECR image is in a private registry. Decide which source readers should use. -->
- A local run can't decrypt values encrypted in Keboola, so have the plain values of any
  `#` secrets at hand.

## Debug mode
Debug mode can be turned on by setting `"debug": true` in the `config` section of the configuration, e.g.:

```json
{
    "api": {
        ...
    },
    "config": {
        "debug": true,
        ...
    }
}
```

In debug mode, the extractor displays all API requests it sends, helping you understand what is really happening,
why something is skipped, etc.

![Screenshot - Debug Logs](/components/extractors/generic-extractor/events.png)

**Warning:** If the API sends sensitive data (e.g. authorization token) in the URL, these may become
visible in the events. Also, debug mode considerably slows the extraction. Therefore it should never
be turned on in production configurations.

## Running locally
If you are working on a complicated configuration, or developing a new component based on
Generic Extractor, running every configuration from the Keboola UI may be slow and tedious.
You may run Generic Extractor locally, provided that you have access to Docker.
The following is **not necessary** to run or configure Generic Extractor in Keboola.

### Build the image
Clone the repository and build the image:

```bash
git clone https://github.com/keboola/generic-extractor.git
cd generic-extractor
docker compose build app
```

This builds the image `keboola/generic-extractor`, with its dependencies installed.

### Run a configuration
Create an empty directory somewhere and in it create a `config.json` file with a
configuration you want to execute. For example:

```json
{
  "parameters": {
    "api": {
      "baseUrl": "https://api.github.com",
      "http": {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      }
    },
    "config": {
      "debug": true,
      "jobs": [
        {
          "endpoint": "/orgs/keboola/members",
          "dataType": "members"
        }
      ]
    }
  }
}
```

Then run Generic Extractor in the current directory by executing the following command on *nix systems:

    docker run --rm -v $(pwd):/data keboola/generic-extractor

or on Windows:

    docker run --rm -v %cd%:/data keboola/generic-extractor

You should see:

    DEBUG: Using NO Auth [] []
    DEBUG: Using automatic conversion of single values to arrays where required. [] []
    DEBUG: GET /orgs/keboola/members HTTP/1.1 Host: api.github.com User-Agent: Guzzle/5.3.1 curl/7.38.0 PHP/7.0.17   [] []
    DEBUG: Analyzing members {"rowsAnalyzed":[],"rowsToAnalyze":7} []
    DEBUG: Processing results for __kbc_default. [] []
    INFO: Extractor finished successfully. [] []

along with the output tables created in `/out/tables` sub-directory of the current directory.
It is recommended to remove the contents of the `out/tables` directory before running the extractor again.

**Important:** Generic Extractor itself is not able to decrypt encrypted values. That means that when you
supply the configuration directly in the `config.json` file, you must always provide decrypted values — e.g.:

```json
{
    ...,
    "config": {
        "#username": "JohnDoe",
        "#password": "TopSecret",
        ...
    }
}
```

When you store such configuration in the Keboola UI, it will automatically be encrypted:

```json
{
    ...,
    "config": {
        "#username": "JohnDoe",
        "#password": "KBC::ComponentProjectEncrypted==r13Khq0lR4ycDNTujirz5/GMqNEVZ4tZ2OTmRcsNYqlP/a/STMelWtz9R8yEtr3ck6KiYA7XrL8pqIQv9S7Ro28KNZgmqtSNzKhFcEsItPnTDCQqvnU99q2a0ES+oN/v",
        ...
    }
}
```

The above configuration then **cannot** be run locally.
Read more about [encryption](/extend/encryption/).

## Running examples
[All examples](https://github.com/keboola/generic-extractor/tree/master/doc) referenced in this documentation are actually runnable against the proper API. Because
it is difficult to find the specific API for the case (and gain access to it), you can test
these configurations against a [mock server](https://github.com/keboola/ex-generic-mock-server).
Each example contains a set of requests (`*.request` file) and responses (`*.response`) and
optionally their headers (`*.requestHeaders` and `*.responseHeaders`).

To run the examples:

- Clone the repository, if you haven't yet: `git clone https://github.com/keboola/generic-extractor.git`.
- Navigate to the documentation directory: `cd generic-extractor/doc`.
- Run a single example of your choice, e.g.: `./run-single-example.sh 001-simple-job`. The script builds the
  images, runs the example against the mock server and compares the output with the example's `_sample_out`.
- The output will be available in `examples/001-simple-job/out/tables`.
- Or run all examples by executing `./run-samples.sh`.

**Check:** the run logs `Extractor finished successfully.`, the example's `out/tables` directory holds its CSV files,
and `run-single-example.sh` prints `Example 001-simple-job successful.`

If you want to create your own example, follow the instructions in the [mock server repository](https://github.com/keboola/ex-generic-mock-server/blob/master/README.md#creating-examples).

---

**Next:** [Publishing Component →](/components/extractors/generic-extractor/publish/)
