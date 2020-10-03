-- Keyspace tweet --
CREATE KEYSPACE IF NOT EXISTS tweet WITH replication =
    { 'class': 'SimpleStrategy', 'replication_factor': 3 };

-- tweet tables --
CREATE TABLE IF NOT EXISTS tweet.tweets_by_hashtag (
    hashtag text,
    tweet_id text,
    updated_at timestamp,
    PRIMARY KEY ((hashtag), tweet_id)
)
WITH comment = 'Q1. Encontrar tweets por hashtag'
AND CLUSTERING ORDER BY (tweet_id ASC);
CREATE TABLE IF NOT EXISTS tweet.tweets_by_lang (
    hashtag text,
    lang text,
    tweet_id text,
    PRIMARY KEY ((hashtag, lang), tweet_id)
)
WITH comment = 'Q3. Encontrar tweets de uma hashtag por lingua'
AND CLUSTERING ORDER BY (tweet_id ASC);
CREATE TABLE IF NOT EXISTS tweet.tweets_by_hour (
    hashtag text,
    hour_of_day smallint,
    tweet_id text,
    PRIMARY KEY ((hashtag, hour_of_day), tweet_id)
)
WITH comment = 'Q4. Encontrar tweets de uma hashtad por hora do dia'
AND CLUSTERING ORDER BY (tweet_id ASC);
-- Keyspace user --
CREATE KEYSPACE IF NOT EXISTS user WITH replication =
    { 'class': 'SimpleStrategy', 'replication_factor': 3 };
CREATE TABLE IF NOT EXISTS user.users_by_follower_count (
    follower_count bigint,
    user_id text,
    PRIMARY KEY ((follower_count), user_id)
)
WITH comment = 'Q2. Encontrar usuarios com maior numero de seguidores'
AND CLUSTERING ORDER BY (user_id ASC);