# Keboola Connection Documentation

[![Build Status](https://travis-ci.org/keboola/connection-docs.svg?branch=master)](https://travis-ci.org/keboola/connection-docs)

How to write documentation [http://sites.google.com/a/keboola.com/devel/kbc/dokumentace](http://sites.google.com/a/keboola.com/devel/kbc/dokumentace)

## Documentation Development

### Install

* Clone the repo
* `cd` into repo workspace
* `gem install bundle`
* `gem install jekyll`
* `bundle install`

### Run

* `bundle exec jekyll serve`

Documentation will be available at http://localhost:4000


### Publish

* `git push origin HEAD` - on gh-pages branch

New version is published immediately after push by [Github Pages](https://pages.github.com/)

### Running in Docker

```bash
docker-compose run --rm --service-ports jekyll
```
