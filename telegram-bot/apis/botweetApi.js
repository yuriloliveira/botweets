const axios = require('axios');
const config = require('../config');

function BotweetApi() {
    const axiosClient = axios.create({
        timeout: 10000,
    });

    async function getTweetCountByHashtagAndLang({ hashtag, lang }) {
        const { data } = await axiosClient.get(`${config.BOTWEET_API_BASE_URL}/hashtags/${hashtag}/tweets/lang/${lang}/count`);
        return data.count;
    }

    async function getTweetsFromHashtagGroupedByHourOfDay(hashtag) {
        const { data } = await axiosClient.get(`${config.BOTWEET_API_BASE_URL}/hashtags/${hashtag}/tweets/count/by-hour`);
        return data.tweets_by_hour;
    }

    async function getMostFollowedUsersByHashtag(hashtag) {
        const { data } = await axiosClient.get(`${config.BOTWEET_API_BASE_URL}/hashtags/${hashtag}/users/most-followed?limit=5`);
        return data.users;
    }

    async function getAllHashtags() {
        const { data } = await axiosClient.get(`${config.BOTWEET_API_BASE_URL}/hashtags`);
        return data;
    }

    return {
        getTweetCountByHashtagAndLang,
        getTweetsFromHashtagGroupedByHourOfDay,
        getMostFollowedUsersByHashtag,
        getAllHashtags
    }
}

module.exports = BotweetApi;