
require('dotenv').config();
//var ProgressBar = require('progress');

var Twitter = require('twitter');
var tweetList;
var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
})


var params = {screen_name: 'munaugo'};
//client.get('http://api.twitter.com/1.1/statuses/user_timeline.json?count=2',{include_entities:false});

client.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params, function(error, tweets, response) {
	if(!error) {
		// var len = parseInt(response.headers['content-length'], 10);
 
  	
  // 		var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
		//     complete: '=',
		//     incomplete: ' ',
		//     width: 20,
		//     total: len
		//   });

  // 			response.on('data', function (chunk) {
		//   	console.log(chunk, "adsd")
		//     bar.tick(1);
		//   });
 
		//   response.on('end', function () {
		//     console.log('\n');
		//   });
		tweet_length = tweets.length;
		
		for (var i=0;i<tweet_length;i++) {
			var tweet = tweets[i];
			tweetList += tweet.text + " ";
			
		}
		output(tweetList) }
		else {
			console.log('you have an error', error)
			
		}
})

function output(tweetList) {
	console.log(tweetList)
}
