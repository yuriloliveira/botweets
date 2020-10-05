-- Keyspace tweet --
CREATE KEYSPACE IF NOT EXISTS tweet WITH replication =
    { 'class': 'SimpleStrategy', 'replication_factor': 1 };
-- Tables --
CREATE TABLE IF NOT EXISTS tweet.tweets (
    tweet_id bigint PRIMARY KEY,
    user_id bigint,
    hashtags list<text>,
    lang text,
    created_at timestamp,
    updated_at timestamp
);
-- tweet.tweets indexes --
CREATE INDEX IF NOT EXISTS tweets_hashtags_idx ON tweet.tweets (hashtags);
CREATE INDEX IF NOT EXISTS tweets_user_id_idx ON tweet.tweets (user_id);
CREATE INDEX IF NOT EXISTS tweets_lang_idx ON tweet.tweets (lang);
CREATE INDEX IF NOT EXISTS tweets_craeted_at_idx ON tweet.tweets (created_at);

CREATE TABLE IF NOT EXISTS tweet.users (
    user_id bigint,
    updated_at timestamp,
    screen_name text,
    followers_count bigint,
    PRIMARY KEY ((user_id), updated_at)
) WITH CLUSTERING ORDER BY (updated_at DESC);

CREATE INDEX IF NOT EXISTS users_followers_count_idx ON tweet.users (followers_count);