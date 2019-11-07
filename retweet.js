//Finds tweets with hashtag Poetry, Poem, Poems, and PoetryLover.

var Twit = require('twit');

var T = new Twit(require('./config.js'));

//Search for posts on Twitter with the hashtag Poetry, Poem, Poems, and PoetryLover. Also filter out any retweeted posts.
var poetrySearch = {q: "#poetry OR #poem OR #poems OR #poetrylover, -filter:retweets", count: 10, result_type: "recent"}; 

//Retweet the last (nonretweeted) posts found by poetrySearch
function retweetLatest() {
    console.log("calling get() with poetrySearch()");
	T.get('search/tweets', poetrySearch, function (error, data) {
        
	  console.log(error, data);
        //check for any occurring errors
	  if (!error) {
          //Obtain id of tweet being retweeted
		var retweetId = data.statuses[0].id_str;
          //Post the tweet obtained
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
            //Retweeting Successful
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
            //Retweeting Failure - Twitter Call
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
        //Retweeting Failure - Search Request
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}
//Calling retweet function - launch point of events
retweetLatest();
//retweet every half hour
setInterval(retweetLatest, 1000 * 60 * 30);

