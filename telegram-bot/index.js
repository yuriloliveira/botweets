require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const BotweetApi = require('./apis/botweetApi');

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });
const botweetApi = BotweetApi();


// Accepts messages "#hashtag_name" only
bot.onText(/^#([^ ]+)$/, async (msg, match) => {
    try {
        const hashtag = match[1];
        const [ptTweetCount, tweetsByHour, mostFollowedUsers] = await Promise.all([
            botweetApi.getTweetCountByHashtagAndLang({ hashtag, lang: 'pt' }),
            botweetApi.getTweetsFromHashtagGroupedByHourOfDay(hashtag),
            botweetApi.getMostFollowedUsers()
        ]);
        const tweetsByHourText =
            tweetsByHour
                .map(({ created_at_hour, count }) =>`${count} postados às ${created_at_hour} horas`)
                .join('\n');
        const mostFollowedUsersText =
            mostFollowedUsers
                .map((user) => `${user.username} com ${user.followers_count} seguidores`)
                .join('\n');

        bot.sendMessage(
            msg.chat.id,
            `Há ${ptTweetCount} tweets em português da hashtag ${hashtag}\n` +
            `${tweetsByHourText}\n\nOs 5 usuários com mais seguidores são:\n` +
            mostFollowedUsersText
        );
    } catch (err) {
        console.log(err);
        bot.sendMessage(msg.chat.id, 'Não foi possível processar a #tag. Por favor, tente novamente.');
    }
});