require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const BotweetApi = require('./apis/botweetApi');
const HashtagLoaderApi = require('./apis/hashtagLoaderApi');

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });
const botweetApi = BotweetApi();
const hashtagLoaderApi = HashtagLoaderApi();

// Accepts messages "#hashtag_name" only
bot.onText(/^#([^ ]+)$/, async (msg, match) => {
    try {
        const hashtag = match[1];
        await hashtagLoaderApi.loadHashtag(hashtag);
        const [ptTweetCount, tweetsByHour, mostFollowedUsers, allHashtagsResponse] = await Promise.all([
            botweetApi.getTweetCountByHashtagAndLang({ hashtag, lang: 'pt' }),
            botweetApi.getTweetsFromHashtagGroupedByHourOfDay(hashtag),
            botweetApi.getMostFollowedUsersByHashtag(hashtag),
            botweetApi.getAllHashtags()
        ]);
        bot.sendMessage(
            msg.chat.id,
            buildResponseMessage(hashtag, ptTweetCount, tweetsByHour, mostFollowedUsers, allHashtagsResponse)    
        );
    } catch (err) {
        console.log(err);
        bot.sendMessage(msg.chat.id, 'Não foi possível processar a #tag. Por favor, tente novamente.');
    }
});

function buildResponseMessage(hashtag, ptTweetCount, tweetsByHour, mostFollowedUsers, allHashtagsResponse) {
    const tweetsByHourText =
        tweetsByHour
            .map(({ created_at_hour, count }) =>`${count} foram postados às ${created_at_hour} horas`)
            .join('\n') || '';
    const mostFollowedUsersText =
        mostFollowedUsers
            .map((user) => `${user.screen_name} com ${user.followers_count} seguidores`)
            .join('\n') || '';
    const { hashtags, last_updated_at } = allHashtagsResponse;
    const hashtagsText = hashtags.map((h) => '#' + h).join(' ');

    return (
        `Há ${ptTweetCount} tweets em português com #${hashtag}\n` +
        (tweetsByHour.length === 0
            ? ''
            : `De todos os tweets com #${hashtag}:\n${tweetsByHourText}\n\n`
        ) +
        (mostFollowedUsers.length === 0
            ? ''
            : `Os 5 usuários com mais seguidores da #${hashtag} são:\n` +
                mostFollowedUsersText + '\n'
        ) +
        `\nAs hashtags das quais tenho informação são:\n${hashtagsText}\n` +
        `Última data de atualização das hashtags: ${last_updated_at}`
    );
}