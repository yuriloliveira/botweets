package com.tweetloader.hashtag.domain;

import java.util.Date;

import com.datastax.driver.mapping.annotations.ClusteringColumn;
import com.datastax.driver.mapping.annotations.PartitionKey;
import com.datastax.driver.mapping.annotations.Table;

@Table(name = "tweets_by_hashtag")
public class TweetsByHashtag {
	@PartitionKey
	private String hashtag;
	
	@ClusteringColumn
	private String tweetId;
	
	private Date updatedAt;

	public TweetsByHashtag(String hashtag, String tweetId, Date updated_at) {
		super();
		this.hashtag = hashtag;
		this.tweetId = tweetId;
		this.updatedAt = updated_at;
	}
}
