package com.tweetloader.hashtag;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;

import com.tweetloader.hashtag.domain.TweetsByHashtag;
import com.tweetloader.hashtag.domain.TweetsByHashtagRepository;

public class TweetController {
	@Autowired
	private TweetsByHashtagRepository tweetsByHashtagRepository;
	
	@PostMapping("/")
	public TweetsByHashtag index() {
		TweetsByHashtag t = new TweetsByHashtag("hashtag", "tweet_id", new Date());
		return this.tweetsByHashtagRepository.save(t);
	}
}
