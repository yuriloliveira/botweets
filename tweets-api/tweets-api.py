import os
os.environ['PYSPARK_SUBMIT_ARGS'] = '--packages com.datastax.spark:spark-cassandra-connector_2.11:2.3.0 --conf spark.cassandra.connection.host=127.0.0.1 pyspark-shell'

import flask
from flask import jsonify, request, Response
import json
from pyspark import SparkContext
from pyspark.sql import SQLContext
from pyspark.sql.functions import array_contains, hour
from analytics.tweet_analytics import TweetAnalytics

sc = SparkContext("local", "movie lens app")
sqlContext = SQLContext(sc)

tweet_analytics = TweetAnalytics(sqlContext)
tweet_analytics.load()

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/hashtags', methods=['GET'])
def get_all_hashtags():
    (hashtags, last_updated_at) = tweet_analytics.get_all_hashtags()
    return jsonify({ 'hashtags': hashtags, 'last_updated_at': last_updated_at })

@app.route('/hashtags/<hashtag>/tweets/lang/<lang>', methods=['GET'])
def get_tweets_by_lang(hashtag, lang):
    hashtag_lower = hashtag.lower()
    tweets = tweet_analytics.get_tweets_by_hashtag_and_lang(hashtag_lower, lang)
    return jsonify({ 'hashtag': hashtag_lower, 'tweets': tweets })

@app.route('/hashtags/<hashtag>/tweets/lang/<lang>/count', methods=['GET'])
def get_tweets_by_lang_count(hashtag, lang):
    hashtag_lower = hashtag.lower()
    tweet_count = tweet_analytics.count_tweets_by_hashtag_and_lang(hashtag_lower, lang)
    return jsonify({ 'hashtag': hashtag_lower, 'count': tweet_count })

@app.route('/hashtags/<hashtag>/tweets/count/by-hour', methods=['GET'])
def group_tweets_hour(hashtag):
    hashtag_lower = hashtag.lower()
    tweets_by_hour = tweet_analytics.group_tweets_from_hashtag_by_hour(hashtag)
    return jsonify({ 'hashtag': hashtag_lower, 'tweets_by_hour': tweets_by_hour })


@app.route('/hashtags/<hashtag>/users/most-followed', methods=['GET'])
def get_most_followed_users(hashtag):
    limit = request.args.get('limit', 5)
    most_followed_users = tweet_analytics.get_most_followed_users(hashtag, limit=int(limit))
    return jsonify({ 'users': most_followed_users })

app.run()