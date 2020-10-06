const axios = require('axios');
const config = require('../config');

function HashtagLoaderApi() {
    const axiosClient = axios.create({
        timeout: 30000,
    });

    async function loadHashtag(hashtag) {
        const { data } = await axiosClient.post(`${config.HASHTAG_LOADER_API_BASE_URL}/hashtags/${hashtag}`);
        return data;
    }

    return {
        loadHashtag
    }
}

module.exports = HashtagLoaderApi;