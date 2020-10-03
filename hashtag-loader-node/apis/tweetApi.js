const config = require('../config');

function TweetApi() {
    const axios = require('axios');
    const tweetClient = axios.create({
        timeout: 30000, // time in milliseconds
        headers: {
            Authorization: `Bearer ${config.TWITTER_BEARER_TOKEN}`
        }
    });

    async function searchTweetsByHashtag(hashtag) {
        const response = await tweetClient.get(`https://api.twitter.com/1.1/search/tweets.json?q=%23${hashtag}`);
        const { statuses } = response.data;
        return statuses;
    }

    return {
        searchTweetsByHashtag
    }
}

module.exports = TweetApi;