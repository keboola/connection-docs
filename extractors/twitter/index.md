---
title: Twitter
permalink: /extractors/twitter/
---

* TOC
{:toc}

The Twitter extractor, as the name implies, fetches data from [Twitter](https://twitter.com/).
Complete the following steps to configure it:

### Create New Configuration

Find Twitter in the **Extractors** section. Create a new configuration, and name it. 
It can be renamed at any time.

{: .image-popup}
![Twitter New Configuration](/extractors/twitter/01-new-configuration.png)

### Authorize Twitter Account
Select one of the two authorization methods:

 - **Instant** -- Use if having access to a Twitter account. It will be done immediately.
 - **External** -- Use to authorize access to an account of a non-KBC user. Generate a link to the external authorization app and send it to the user. The generated link is valid for 48 hours and will not be stored anywhere.
 
 {: .image-popup}
![Twitter Authorization](/extractors/twitter/02-authorize.png)


{: .image-popup}
![Twitter Authorization Selection](/extractors/twitter/03-authorize-modal.png)

When finished setting up authorization, click **Continue** to move to the next tab, and start selecting data. 

{: .image-popup}
![Twitter Data Selection](/extractors/twitter/04-authorized.png)

### Select Data
To configure what you want to fetch from Twitter, use the other four tabs displayed in the above pop-up window.
It is okay to leave any of the steps blank.

 - **User Timeline** -- Returns a collection of the most recent Tweets posted by the user indicated by the *Screen Name*.
   
   {: .image-popup}
![Twitter Screen Name](/extractors/twitter/05-screen-name.png)

   - [Limited to last 3,200 tweets](https://dev.twitter.com/rest/reference/get/statuses/user_timeline) 
 - **Mentions** -- Returns mentions for the authenticating user.
   - [Limited to last 800 mentions of the account](https://dev.twitter.com/rest/reference/get/statuses/mentions_timeline)
 - **Followers List** -- Returns a list or users following the specified user by *Screen Name*.
 - **Search** -- Searches tweets. Read [more about search queries](https://dev.twitter.com/rest/public/search).
    - The Twitter Search API searches against a sampling of recent Tweets published within the past 7 days.

When done, **Save** the configuration.

### Run Extractor
**Run** the extraction job. It will start immediatelly.

{: .image-popup}
![Twitter Job](/extractors/twitter/06-twitter-job.png)

## Extraction Output Tables

The extractor output is always **incremental**, and **primary keys** are set for all tables 
to append new rows and update the already existing ones with each execution.

The following are the Twitter extractor output tables:

### 1 -- Tweets

The Tweets table contains:

- Tweets from the `User Timeline`, `Mentions` or `Search` tabs
- Tweets attached to one of the above mentioned tweets. These are usually the original tweets that were retweeted and were referenced in the `retweeted_status_id` of the retweet.

The origin of a tweet is distinguished by a special `keboola_source` column with the following values for each source:

  - `userTimeline` -- `User Timeline` 
  - `mentions` -- `Mentions`
  - `search` -- `Search`

The table columns mirror [the structure of the Twitter Tweet entity](https://dev.twitter.com/overview/api/tweets):

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for the Tweet. |
| `created_at` | UTC time when this Tweet was created.|
| `favorite_count` |  Indicates approximately how many times this Tweet has been “liked” by Twitter users. |
| `in_reply_to_screen_name` | If the represented Tweet is a reply, this field will contain the screen name of the original Tweet’s author. |
| `in_reply_to_status_id` | If the represented Tweet is a reply, this field will contain the integer representation of the original Tweet’s ID. |
| `in_reply_to_user_id` | If the represented Tweet is a reply, this field will contain the integer representation of the original Tweet’s author ID. This will not necessarily always be the user directly mentioned in the Tweet. |
| `lang` | When present, it indicates a BCP 47 language identifier corresponding to the machine-detected language of the Tweet text, or “und” if no language could be detected. |
| `quoted_status_id` | This field only surfaces when the Tweet is a quote Tweet. This field contains the integer value Tweet ID of the quoted Tweet. |
| `retweet_count` | Number of times this Tweet has been retweeted. This field is no longer capped at 99 and will not turn into a String for “100+” |
| `retweeted_status_id` | Id of the original tweet. Referenced tweet should be also in this table. |
| `source` | Utility used to post the Tweet as an HTML-formatted string. |
| `text` | The actual UTF-8 text of the status update. |
| `truncated` | Indicates whether the value of the text parameter was truncated, for example, as a result of a retweet exceeding the 140 character Tweet length. Truncated text will end in ellipsis, like this ... Since Twitter now rejects long Tweets vs truncating them, the large majority of Tweets will have this set to false. |
| `user_id` | Reference to the user who posted this Tweet. The referenced user can be found in `users` with `id` equals to `user_id`. |
| `withheld_copyright` | When present and set to “true”, it indicates that this piece of content has been withheld due to a DMCA complaint. |
| `keboola_source` | Source of the tweet - `userTimeline`, `mentions` or `search`. When the same tweet is the source of more targets (for instance, search and mentions), only one (later imported) source is set.

### 2 -- Users

The Users table contains:

- Users from the `Followers List` tab
- Users attached to tweets

The origin of a user is distinguished by a special `keboola_source` column with the following values for each source:

  - `Followers List` - `followersList`
  - `userTimeline`, `mentions`, `search` - Derived from associated tweet

The table columns mirror [the structure of Twitter User entity](https://dev.twitter.com/overview/api/users):

| Column | Description |
| `id` [PK] | The integer representation of the unique identifier for this User. |
| `created_at` | The UTC datetime that the user account was created on Twitter. |
| `description` | The user-defined UTF-8 string describing their account. |
| `favourites_count` | The number of tweets this user has favored in the account’s lifetime. British spelling is used in the field name for historical reasons. |
| `followers_count` | The number of followers this account currently has. Under certain conditions of duress, this field will temporarily indicate “0.” |
| `friends_count` | The number of users this account is following (AKA their “followings”). Under certain conditions of duress, this field will temporarily indicate “0.” |
| `lang` | The BCP 47 code for the user’s self-declared user interface language. May or may not have anything to do with the content of their Tweets. |
| `name` | The name of the user, as they’ve defined it. Not necessarily a person’s name. Typically capped at 20 characters, but subject to change. |
| `screen_name` | The screen name, handle, or alias that this user identifies themselves with. screen_names are unique but subject to change. Use id_str as a user identifier whenever possible. Typically a maximum of 15 characters long, but some historical accounts may exist with longer names. |
| `statuses_count` | The number of tweets (including retweets) issued by the user. |
| `keboola_source` | Source of the user - `followersList`, `userTimeline`, `mentions` or `search`. When the same tweet is the source of more targets (e.g. search and mentions), only one (later imported) source is set.

### 3 -- tweets-user-mentions

This table contains users mentioned in tweets.

| Column | Description |
| `user_id` [PK] | Id of [user](#table---users) |
| `tweets_pk` [PK] |  Id of [tweet](#table---tweets) |
| `name` | The name of the user, as they’ve defined it. Not necessarily a person’s name. Typically capped at 20 characters, but subject to change. |
| `screen_name` | The screen name, handle, or alias that this user identifies themselves with. screen_names are unique but subject to change. Use id_str as a user identifier whenever possible. Typically a maximum of 15 characters long, but some historical accounts may exist with longer names.  |

### 4 -- tweets-urls

This table contains URLs included in the text of a Tweet.

| Column | Description |
| `tweets_pk` [PK] |  Id of [tweet](#table---tweets) |
| `url` [PK] | Wrapped URL, corresponding to the value embedded directly into the raw Tweet text. |
| `display_url` | Version of the URL to display to clients. |
| `expanded_url` | Expanded version of display_url. |

### 5 -- tweets-hashtags

This table contains hashtags present in tweets.

| Column | Description |
| `tweets_pk` [PK] |  Id of [tweet](#table---tweets) |
| `text` [PK] | Name of the hashtag, minus the leading ‘#’ character. |
