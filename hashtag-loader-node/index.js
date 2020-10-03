const express = require('express');
const app = express();

require('dotenv').config();

const config = require('./config');
const TweetService = require('./services/tweetService');

const tweetService = TweetService();
app.post('/hashtags/:hashtag', async (req, res, next) => {
    try {
        const { hashtag } = req.params;
        const tweets = await tweetService.loadAndCreateTweets(hashtag);
        res.status(200).json(tweets);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

app.use(require('./middlewares/defaultErrorMiddleware'));

app.listen(config.PORT, () => {
    console.log(`App listening on port ${config.PORT}`);
});