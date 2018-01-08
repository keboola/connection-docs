# Keboola Connection Documentation

[![Build Status](https://travis-ci.org/keboola/connection-docs.svg?branch=master)](https://travis-ci.org/keboola/connection-docs)

How to write documentation [http://sites.google.com/a/keboola.com/devel/kbc/dokumentace](http://sites.google.com/a/keboola.com/devel/kbc/dokumentace)

## Documentation Development

### Running in Docker

```bash
docker-compose run --rm --service-ports jekyll
```
Documentation will be available at http://localhost:4000

### Publish

* `git push origin HEAD` - on `master` branch

New version is published immediately after push by [Travis](https://travis-ci.org/keboola/connection-docs)
