const TweetApi = require('../apis/tweetApi');
const CassandraDb = require('../db/cassandraDb');

function TweetService() {
    const tweetApi = TweetApi();
    const db = CassandraDb();

    async function loadAndCreateTweets(hashtag) {
        const tweetsToBeCreated = await tweetApi.searchTweetsByHashtag(hashtag);
        

        await db.createManyTweets(tweetsToBeCreated.map((tweet) => ({
            id: tweet.id,
            user_id: tweet.user.id,
            hashtags: tweet.entities.hashtags.map(({ text }) => unaccent(text.toLowerCase())),
            lang: tweet.lang || tweet.metadata.iso_language_code || null,
            created_at: new Date(tweet.created_at),
            updated_at: new Date(),
        })));

        await db.createManyUsers(tweetsToBeCreated.map((tweet) => ({
            user_id: tweet.user.id,
            updated_at: new Date(tweet.created_at),
            followers_count: tweet.user.followers_count,
            screen_name: tweet.user.screen_name
        })));

        return tweetsToBeCreated;
    }

    return {
        loadAndCreateTweets
    }
}

module.exports = TweetService;

function unaccent(str) {
    // code extracted from https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}