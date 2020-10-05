from utils import load_and_get_table_df

class UserAnalytics:
    __users_df = None
    __sqlContext = None

    def __init__(self, sqlContext):
        self.sqlContext = sqlContext

    def load_users(self):
        self.__users_df = load_and_get_table_df(self.sqlContext, "tweet", "users")
    
    def get_most_followed_users(self, limit):
        result = self.__users_df.orderBy(self.__users_df.followers_count.desc()).limit(limit)
        return result.toJSON().collect()