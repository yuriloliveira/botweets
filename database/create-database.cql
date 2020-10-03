-- Keyspace tweet --
CREATE KEYSPACE IF NOT EXISTS tweet WITH replication =
    { 'class': 'SimpleStrategy', 'replication_factor': 3 };

-- Tables --
CREATE TABLE IF NOT EXISTS tweet.tweets (
    tweet_id bigint PRIMARY KEY,
    hashtags list<text>,
    lang text,
    created_at timestamp,
    updated_at timestamp
);
-- tweet.tweets indexes --
CREATE INDEX IF NOT EXISTS tweets_hashtags_idx ON tweet.tweets (hashtags);
CREATE INDEX IF NOT EXISTS tweets_lang_idx ON tweet.tweets (lang);
CREATE INDEX IF NOT EXISTS tweets_craeted_at_idx ON tweet.tweets (created_at);


CREATE TABLE IF NOT EXISTS tweet.users (
    user_id bigint,
    followers_count bigint,
    PRIMARY KEY ((user_id), followers_count) 
) WITH CLUSTERING ORDER BY (followers_count ASC);