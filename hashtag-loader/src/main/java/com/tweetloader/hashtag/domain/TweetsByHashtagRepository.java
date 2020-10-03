package com.tweetloader.hashtag.domain;

import org.springframework.stereotype.Repository;

import com.datastax.driver.core.Session;
import com.datastax.driver.mapping.Mapper;
import com.datastax.driver.mapping.MappingManager;

@Repository
public class TweetsByHashtagRepository {
	private Mapper<TweetsByHashtag> mapper;
	private Session session;
	
	private static final String TABLE = "tweets_by_hashtag";
	
	public TweetsByHashtagRepository(MappingManager mappingManager) {
		this.mapper = mappingManager.mapper(TweetsByHashtag.class);
		this.session = mappingManager.getSession();
	}
	
	public TweetsByHashtag save(TweetsByHashtag tweet) {
		mapper.save(tweet);
		return tweet;
	}
}
