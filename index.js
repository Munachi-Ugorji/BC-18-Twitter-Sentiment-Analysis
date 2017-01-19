require('dotenv').config();
var Twitter = require('twitter');
var jsonfile = require('jsonfile');
var readLine = require('readline');
var alchemy = require('node_alchemy')(process.env.api_key);
var wordsFrequency = require('./wordfreq');
var file = 'tweets.json';



var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
})


var rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout
});



rl.question('Enter a twitter username...', (twHandle) => {

	if(twHandle) {
		console.log('Verifying your twitter handle');
		console.log('-----------------------------');

		client.get('statuses/user_timeline', {screen_name: twHandle, count: 15}, function(error, tweets, response){
			if(!error) {
				
				tweet_length = tweets.length;
				var tweetList = [];

				for (var i=0; i<tweet_length; i++) {
					var tweet = tweets[i];
					tweetList += tweet.text + " ";
					console.log("Process="+ Math.round((i+1)/tweet_length * 100).toString() + "%")
				}
					var obj = {tweet: tweetList}

					jsonfile.writeFile(file, obj, function (err) {
					console.error(err)
					})
				
				rl.question('Enter 1 or 2: ', (todo)	=> {

					if(todo == 1) {
						client.get('statuses/user_timeline', {screen_name: twHandle, count:15}, function(error, tweets, response){
							if(!error) {
								var tweetObj = {tweets: tweets};
								var tweetLength = tweetObj.tweets.length;
								var allTweet = '';
								for (let i =0; i < tweetLength -1; i++){
									allTweet +=  tweetObj.tweets[i].text;
								}
								
								words = wordsFrequency(allTweet);

								for (var key in words){
									if(key == 5) break;
									if (words.hasOwnProperty(key)) {
										console.log('Word: '+ words[key].word +' <===> Frequency: '+ words[key].freq);
									}
								}


							}
						});
					} else if(todo = 2){
						client.get('statuses/user_timeline', {screen_name: twHandle, count:15}, function(error, tweets, response){
							if (!error){
								var tweetObj = {tweets:tweets};
								var tweetLength = tweetObj.tweets.length;
								var promises = [];
								var sentimentSum = 0;

								for (let i = 0; i < tweetLength - 1; i++){
									eachTweet = tweetObj.tweets[i];

									var params = {
										text: eachTweet.text
									};

									var eachPromise = alchemy.lookup('sentiment', 'text', eachTweet.text)
										.then(function(result){
											if (result.data.docSentiment.score){
												console.log(result.data.docSentiment.type);
												console.log('--------------------------');
												sentimentSum += parseFloat(result.data.docSentiment.score);
											}
										}).catch(function(error) {

										})
										promises.push(eachPromise);
								}
								Promise.all(promises).then((result) => {
									console.log('Your sentiment cumulative is ' + sentimentSum);
								}).catch(()=> {
									console.log('error')
								});
							}
						});
					} else {
						console.log('Input either 1 or 2');
					}

					rl.close();
				});

				
			} else {
				console.log('Is that a valid twitter handle?');
				rl.close();
			}
			
		});	

	} else {
		rl.close();
	}
	
});

