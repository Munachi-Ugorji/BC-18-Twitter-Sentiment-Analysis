
require('dotenv').config();
var Twitter = require('twitter');
var jsonfile = require('jsonfile');
var readLine = require('readline');
var file = 'tweets.json';
var promise = require('promise');
var alchemy = require('node_alchemy')(process.env.api_key);
var stopwword = require('stopword');
var tweetList = [];


var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
})


var rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout
})

rl.question('Enter a twitter username...', (twHandle) => {

	if(twHandle) {
		console.log('Verifying your twitter handle');
		console.log('-----------------------------');

		client.get('statuses/user_timeline', {screen_name: twHandle, count: 15}, function(error, tweets, response){
			if(!error) {
	
				tweet_length = tweets.length;
				
				//var ProgressBar = require('progress');
 
				//var bar = new ProgressBar(':bar', { total: tweet_length });
			
				for (var i=0; i<tweet_length; i++) {
					var tweet = tweets[i];
					tweetList += tweet.text + " ";
					// bar.tick(i)
					console.log("Process="+ Math.round((i+1)/tweet_length * 100).toString() + "%")
				}

				// if (bar.complete) {
				// 	console.log('\n')
				// }

				// console.log(tweetList)
				
				alchemy.lookup('sentiment','text', tweet.text)
				  .then (function (result) {
				  	res.json(result);
				  })
				  .catch(function (err) {
				  	res.json({status: 'error', message:err});
				  });


				//output(tweetList) 
				var obj = {tweet: tweetList}

				jsonfile.writeFile(file, obj, function (err) {
				console.error(err)
				})}
			else {
				console.log('OOPs, Houston we have a problem', error)
				
			}
		});	

	} 
	rl.close();
});


