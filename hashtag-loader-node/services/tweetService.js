const TweetApi = require('../apis/tweetApi');
const CassandraDb = require('../db/cassandraDb');

function TweetService() {
    const tweetApi = TweetApi();
    const db = CassandraDb();

    async function loadAndCreateTweets(hashtag) {
        const tweetsToBeCreated = await tweetApi.searchTweetsByHashtag(hashtag);
        

        await db.createManyTweets(tweetsToBeCreated.map((tweet) => ({
            id: tweet.id,
            hashtags: tweet.entities.hashtags.map(({ text }) => text),
            lang: tweet.lang || tweet.metadata.iso_language_code || null,
            created_at: new Date(tweet.created_at),
            updated_at: new Date(),
        })));

        await db.createManyUsers(tweetsToBeCreated.map((tweet) => ({
            user_id: tweet.user.id,
            followers_count: tweet.user.followers_count
        })));

        return tweetsToBeCreated;
    }

    return {
        loadAndCreateTweets
    }
}

module.exports = TweetService;