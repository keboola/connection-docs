# Keboola Connection Documentation

[![Build and deploy](https://github.com/keboola/connection-docs/actions/workflows/main.yml/badge.svg)](https://github.com/keboola/connection-docs/actions/workflows/main.yml)

[How to write documentation](https://keboola.atlassian.net/wiki/spaces/KB/pages/82935879/Public+documentation)

## Documentation Development

### Running in Docker

```bash
docker-compose run --rm --service-ports jekyll
```
Documentation will be available at http://localhost:4000

### Publish

* `git push origin HEAD` - on `master` branch

New version is published immediately after push by [Travis](https://travis-ci.org/keboola/connection-docs)

## License

MIT licensed, see [LICENSE](./LICENSE) file. 
