---
title: Twitter
permalink: /extractors/twitter/
---

Twitter extractor allows you to fetch data from [Twitter](https://twitter.com/).

* TOC
{:toc}

## Configuring Extractor
To configure your Twitter extractor please follow these steps:

### Create new configuration

Find Twitter in Extractors section and create new configuration.
Choose some meaningful name (you can change it anytime later) of configuration and continue.


{: .image-popup}
![Twitter New Configuration](/extractors/twitter/01-new-configuration.png)

### Authorize Twitter Account
Select the method of authorization:

 - **Instant** - Use this if you have access to Twitter account. The authorization will be done immediately.
 - **External** - If you need to authorize access to a service from someone who does not have account in Keboola Connection you can generate external link which will guide him through this process.

{: .image-popup}
![Twitter Authorization](/extractors/twitter/02-authorize.png)


{: .image-popup}
![Twitter Authorization Selection](/extractors/twitter/03-authorize-modal.png)

### Data Selection
Now you can configure what you want to fetch from Twitter. The options are:

 - **User Timeline** - Returns a collection of the most recent Tweets posted by the user indicated by the [Screen Name](#how-to-get-user-screen-name).
   - [Limited to last 3200 tweets](https://dev.twitter.com/rest/reference/get/statuses/user_timeline)
 - **Mentions** - Returns mentions for the authenticating user.
   - [Limited to last 800 mentions of account](https://dev.twitter.com/rest/reference/get/statuses/mentions_timeline)
 - **Followers List** - Returns list or users following the specified user by [Screen Name](#how-to-get-user-screen-name).
 - **Search** - Search tweets. [Read more about search queries](https://dev.twitter.com/rest/public/search)
    - The Twitter Search API searches against a sampling of recent Tweets published in the past 7 days.

You can leave anyone of previous steps blank.
When you are done click `Save` to save the configuration.

{: .image-popup}
![Twitter Data Selection](/extractors/twitter/04-authorized.png)

### Run Extractor
When the extractor is configured you can run extraction by hitting the Run button.
Extraction job should be started immediately.

{: .image-popup}
![Twitter Job](/extractors/twitter/06-twitter-job.png)

#### How to get user screen name

{: .image-popup}
![Twitter Screen Name](/extractors/twitter/05-screen-name.png)


## Extraction Output

The output of extractor is always **incremental** and **primary keys** are set for all tables so new rows are appended and
existing rows are updated after each execution.

Following tables are output of the Twitter extractor.

### Table - tweets

- Tweets from `User timeline`, `Mentions` or `Search` tab
- Tweets attached to one of previous tweets (It is usually retweeted_status - original Tweet that was retweeted )
- Origin of tweet is distinguished by special column `keboola_source` with these values for each source:
  - `User Timeline` - `userTimeline`
  - `Mentions` - `mentions`
  - `Search` - `search`
- [Mirrors the structure of Twitter Tweet entity](https://dev.twitter.com/overview/api/tweets)

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the Tweet. |
| `created_at` | UTC time when this Tweet was created.|
| `favorite_count` |  Indicates approximately how many times this Tweet has been “liked” by Twitter users. |
| `in_reply_to_screen_name` | If the represented Tweet is a reply, this field will contain the screen name of the original Tweet’s author. |
| `in_reply_to_status_id` | If the represented Tweet is a reply, this field will contain the integer representation of the original Tweet’s ID. |
| `in_reply_to_user_id` | f the represented Tweet is a reply, this field will contain the integer representation of the original Tweet’s author ID. This will not necessarily always be the user directly mentioned in the Tweet. |
| `lang` | When present, indicates a BCP 47 language identifier corresponding to the machine-detected language of the Tweet text, or “und” if no language could be detected. |
| `quoted_status_id` | This field only surfaces when the Tweet is a quote Tweet. This field contains the integer value Tweet ID of the quoted Tweet. |
| `retweet_count` | Number of times this Tweet has been retweeted. This field is no longer capped at 99 and will not turn into a String for “100+” |
| `retweeted_status_id` | Reference to id of original tweets. Referenced table should be also in this table. |
| `source` | Utility used to post the Tweet, as an HTML-formatted string. Tweets from the Twitter website have a source value of web. |
| `text` | The actual UTF-8 text of the status update. |
| `truncated` | ndicates whether the value of the text parameter was truncated, for example, as a result of a retweet exceeding the 140 character Tweet length. Truncated text will end in ellipsis, like this ... Since Twitter now rejects long Tweets vs truncating them, the large majority of Tweets will have this set to false. |
| `user_id` | Reference to user who posted this Tweet. Referenced user can be found in `users` with `id` equals to `user_id`. |
| `withheld_copyright` | When present and set to “true”, it indicates that this piece of content has been withheld due to a DMCA complaint. |
| `keboola_source` | Source of the tweet - `userTimeline`, `mentions` or `search`. When the same tweet is source of more targets (eq. search and mentions) only one (later imported) source is set.

### Table - users

- Users from `Followers List` tab
- Users attached to tweets
- Origin of user is distinguished by special column `keboola_source` with these values for each source:
  - `Followers List` - `followersList`
  - `userTimeline`, `mentions`, `search` - Derived from associated tweet
- [Mirrors the structure of Twitter User entity](https://dev.twitter.com/overview/api/users)

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for this User. |
| `created_at` | The UTC datetime that the user account was created on Twitter. |
| `description` | The user-defined UTF-8 string describing their account. |
| `favourites_count` | The number of tweets this user has favorited in the account’s lifetime. British spelling used in the field name for historical reasons. |
| `followers_count` | The number of followers this account currently has. Under certain conditions of duress, this field will temporarily indicate “0.” |
| `friends_count` | The number of users this account is following (AKA their “followings”). Under certain conditions of duress, this field will temporarily indicate “0.” |
| `lang` | The BCP 47 code for the user’s self-declared user interface language. May or may not have anything to do with the content of their Tweets. |
| `name` | The name of the user, as they’ve defined it. Not necessarily a person’s name. Typically capped at 20 characters, but subject to change. |
| `screen_name` | The screen name, handle, or alias that this user identifies themselves with. screen_names are unique but subject to change. Use id_str as a user identifier whenever possible. Typically a maximum of 15 characters long, but some historical accounts may exist with longer names. |
| `statuses_count` | The number of tweets (including retweets) issued by the user. |
| `keboola_source` | Source of the user - `followersList`, `userTimeline`, `mentions` or `search`. When the same tweet is source of more targets (eq. search and mentions) only one (later imported) source is set.

### Table - tweets-user-mentions

Users mentioned in tweets.

| Column | Description |
| `user_id` [PK] | Id of [user](#table---users) |
| `tweets_pk` [PK] |  Id of [tweet](#table---tweets) |
| `name` | The name of the user, as they’ve defined it. Not necessarily a person’s name. Typically capped at 20 characters, but subject to change. |
| `screen_name` | The screen name, handle, or alias that this user identifies themselves with. screen_names are unique but subject to change. Use id_str as a user identifier whenever possible. Typically a maximum of 15 characters long, but some historical accounts may exist with longer names.  |

### Table - tweets-urls

URLs included in the text of a Tweet.

| Column | Description |
| `tweets_pk` [PK] |  Id of [tweet](#table---tweets) |
| `url` [PK] | Wrapped URL, corresponding to the value embedded directly into the raw Tweet text. |
| `display_url` | Version of the URL to display to clients. |
| `expanded_url` | Expanded version of display_url. |

### Table - tweets-hashtags

Hashtags present in tweets.

| Column | Description |
| `tweets_pk` [PK] |  Id of [tweet](#table---tweets) |
| `text` [PK] | Name of the hashtag, minus the leading ‘#’ character. |
