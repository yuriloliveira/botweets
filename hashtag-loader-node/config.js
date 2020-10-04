const { env } = process;

const config = {
    ...env,
    TWITTER_API_KEY: env.TWITTER_API_KEY,
    TWITTER_API_SECRET: env.TWITTER_API_SECRET,
    TWITTER_BEARER_TOKEN: env.TWITTER_BEARER_TOKEN,
    TWEETS_SEARCH_API_BASEURL: "https://api.twitter.com/1.1/search/tweets.json",
    CASSADRA_DB_HOST: "localhost",
    PORT: 3000,
};

module.exports = config;