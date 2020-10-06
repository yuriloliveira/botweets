import json
from pyspark.sql.functions import array_contains, hour, explode
from utils import load_and_get_table_df

def parse_json_response(json_str_list):
    results = []
    for json_str in json_str_list:
        results.append(json.loads(json_str))
    
    return results

class TweetAnalytics:
    __tweets_df = None
    __users_df = None
    __sqlContext = None

    def __init__(self, sqlContext):
        self.sqlContext = sqlContext

    def load(self):
        self.__tweets_df = load_and_get_table_df(self.sqlContext, "tweet", "tweets")
        self.__users_df = load_and_get_table_df(self.sqlContext, "tweet", "users")

    def get_tweets_by_hashtag_and_lang(self, hashtag, lang):
        return parse_json_response(self.__get_tweets_by_hashtag_and_lang(hashtag, lang).toJSON().collect())

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
        return parse_json_response(result.toJSON().collect())

    def get_most_followed_users(self, hashtag, limit=5):
        tweetsByHashtag = self.__tweets_df.where(array_contains(self.__tweets_df.hashtags, hashtag)).alias('tweet')
        users = self.__users_df.alias('user')
        usersByHashtag = users.join(tweetsByHashtag, users.user_id == tweetsByHashtag.user_id)
        result = usersByHashtag\
            .select(users.user_id, users.screen_name, users.followers_count)\
            .orderBy(users.updated_at.desc())\
            .dropDuplicates(['user_id'])
        result = result.orderBy(result.followers_count.desc())
        return parse_json_response(result.toJSON().collect())

    def get_all_hashtags(self):
        hashtags = self.__tweets_df.select(explode('hashtags').alias('hashtag'), 'updated_at')
        hashtags = hashtags.orderBy(hashtags.updated_at.desc()).dropDuplicates(['hashtag'])
        # dropDuplicates does not keep the order, so must order again
        hashtags = hashtags.orderBy(hashtags.updated_at.desc())
        first_hashtag = hashtags.collect()[0]
        hashtags = hashtags.select('hashtag')
        return (parse_json_response(hashtags.toJSON().collect()), first_hashtag['updated_at'])

    # private methods
    def __get_tweets_by_hashtag_and_lang(self, hashtag, lang):
        tweetsByHashtag = self.__tweets_df.where(array_contains(self.__tweets_df.hashtags, hashtag))
        return tweetsByHashtag.where(tweetsByHashtag['lang'] == lang)