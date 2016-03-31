FROM ruby:2.3

COPY Gemfile Gemfile.lock /code/
WORKDIR /code

RUN gem install bundle \
  && gem install jekyll \
  && bundle install

