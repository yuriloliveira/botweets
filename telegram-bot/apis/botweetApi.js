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
        return data.tweets_by_hour.map(JSON.parse);
    }

    async function getMostFollowedUsers() {
        const { data } = await axiosClient.get(`${config.BOTWEET_API_BASE_URL}/users/most_followed?limit=5`);
        return data.users.map(JSON.parse);
    }

    return {
        getTweetCountByHashtagAndLang,
        getTweetsFromHashtagGroupedByHourOfDay,
        getMostFollowedUsers
    }
}

module.exports = BotweetApi;