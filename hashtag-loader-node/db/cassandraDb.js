const cassandra = require('cassandra-driver');
const config = require('../config');

function CassandraDb() {
    const client = new cassandra.Client({
        contactPoints: [`${config.CASSADRA_DB_HOST}:9042`],
        localDataCenter: 'datacenter1',
        keyspace: 'tweet'
    });

    async function createManyTweets(tweets) {
        if (tweets.length === 0) {
            return [];
        }
        
        const insertPromises = tweets.map((tweet) =>
            client.execute(
                'INSERT INTO tweets (tweet_id, hashtags, lang, created_at, updated_at) VALUES (?, ?, ?, ?, ?);',
                buildCreateTweetReplacements(tweet)
            )
        );
        return Promise.all(insertPromises);
    }

    async function createManyTweets(tweets) {
        if (tweets.length === 0) {
            return [];
        }

        const insertPromises = tweets.map((tweet) =>
            client.execute(
                'INSERT INTO tweets (tweet_id, user_id, hashtags, lang, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);',
                buildCreateTweetReplacements(tweet),
                { hints: ['bigint', 'bigint', 'list<text>', 'text', 'timestamp', 'timestamp'] }
            )
        );
        return Promise.all(insertPromises);
    }

    async function createManyUsers(users) {
        if (users.length === 0) {
            return [];
        }

        const insertPromises = users.map((user) =>
            client.execute(
                'INSERT INTO users (user_id, updated_at, followers_count, screen_name) VALUES (?, ?, ?, ?);',
                [user.user_id, user.updated_at, user.followers_count, user.screen_name],
                { hints: ['bigint', 'timestamp', 'bigint', 'text'] }
            )
        );
        return Promise.all(insertPromises);
    }

    return {
        createManyTweets,
        createManyUsers
    }
}

module.exports = CassandraDb;

function buildCreateTweetReplacements(tweet) {
    return [
        tweet.id,
        tweet.user_id,
        tweet.hashtags,
        tweet.lang,
        tweet.created_at,
        tweet.updated_at
    ];
}