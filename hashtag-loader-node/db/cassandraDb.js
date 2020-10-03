const cassandra = require('cassandra-driver');
function CassandraDb() {
    const client = new cassandra.Client({
        contactPoints: ['localhost:5432'],
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

        const results = await Promise.all(insertPromises);

        return results;
    }

    async function createManyTweets(tweets) {
        if (tweets.length === 0) {
            return [];
        }

        const insertPromises = tweets.map((tweet) =>
            client.execute(
                'INSERT INTO tweets (tweet_id, hashtags, lang, created_at, updated_at) VALUES (?, ?, ?, ?, ?);',
                buildCreateTweetReplacements(tweet),
                { hints: ['bigint', null, null, 'timestamp', 'timestamp'] }
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
                'INSERT INTO users (user_id, followers_count) VALUES (?, ?);',
                [user.user_id, user.followers_count],
                { hints: ['bigint', 'bigint'] }
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
        tweet.hashtags,
        tweet.lang,
        tweet.created_at,
        tweet.updated_at
    ];
}