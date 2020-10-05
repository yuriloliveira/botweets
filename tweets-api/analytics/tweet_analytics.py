from pyspark.sql.functions import array_contains, hour
from utils import load_and_get_table_df

class TweetAnalytics:
    __tweets_df = None
    __sqlContext = None

    def __init__(self, sqlContext):
        self.sqlContext = sqlContext

    def load_tweets(self):
        self.__tweets_df = load_and_get_table_df(self.sqlContext, "tweet", "tweets")

    def get_tweets_by_hashtag_and_lang(self, hashtag, lang):
        return self.__get_tweets_by_hashtag_and_lang(hashtag, lang).toJSON().collect()

    def count_tweets_by_hashtag_and_lang(self, hashtag, lang):
        return self.__get_tweets_by_hashtag_and_lang(hashtag, lang).count()

    def group_tweets_from_hashtag_by_hour(self, hashtag):
        tweetsByHashtag = self.__tweets_df.where(array_contains(self.__tweets_df.hashtags, hashtag))
        result = tweetsByHashtag\
            .groupBy(\
                hour('created_at')\
                    .alias('created_at_hour')\
            )\
            .count()\
            .orderBy('created_at_hour')
        return result.toJSON().collect()

    # private methods
    def __get_tweets_by_hashtag_and_lang(self, hashtag, lang):
        tweetsByHashtag = self.__tweets_df.where(array_contains(self.__tweets_df.hashtags, hashtag))
        return tweetsByHashtag.where(tweetsByHashtag['lang'] == lang)