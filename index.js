require('dotenv').config();
var Twitter = require('twitter');
var jsonfile = require('jsonfile');
var readLine = require('readline');
var alchemy = require('node_alchemy')(process.env.api_key);
var wordsFrequency = require('./wordfreq');
var colors = require('colors');
var Table = require('cli-table');


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

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var table = new Table({
    head: [colors.yellow('Word'), colors.yellow('Frequency')], 
    colWidths: [30, 20]
});

console.log('');
console.log('');
console.log(colors.help.bold('\t WELCOME TO TWITTER SENTILYSIS'));
console.log(colors.silly('------------------------------------------------'));
console.log('');
console.log(colors.verbose('We analyze your tweets and inform you of the general disposition of your tweets, \nwhether positive, negative or neutral. We also give you a list of your \nmost used words on twitter. All this based on your last 25 tweets.'))
console.log('');
console.log(colors.verbose('\t \t You can perform these: \n \n 1. Word Analysis \n \n 2. Sentiment Analysis'));
console.log(colors.silly('-------------------------------------------------'));
console.log('');
console.log(colors.bgBlue('You need a Twitter Handle e.g. "munaugo" to perform the above tasks'));
console.log('');


rl.question(colors.input('Enter a twitter handle...: '), (twHandle) => {

	if(twHandle) {
		console.log('');
		console.log(colors.bgBlue('Verifying your twitter handle'));
		console.log(colors.silly('-----------------------------'));

		client.get('statuses/user_timeline', {screen_name: twHandle, count: 25}, function(error, tweets, response){
			if(!error) {
				
				tweet_length = tweets.length;
				var tweetList = [];

				for (var i=0; i<tweet_length; i++) {
					var tweet = tweets[i];
					tweetList += tweet.text + " ";
					console.log(colors.verbose("fetching tweets: "+ Math.round((i+1)/tweet_length * 100).toString() + "%"))
				}
					var obj = {tweet: tweetList}
					var file = 'tweets.json';

					jsonfile.writeFile(file, obj, function (err) {
					})
				

				console.log(colors.verbose('Tweets have been fetched sucessfully and stored in "tweets.json"'));
				console.log('');
				console.log(colors.bgGreen.bold(` \t Hello ${twHandle} \t`));
				console.log('');
				console.log(colors.silly('----------------------------'));
				console.log('');
				console.log(colors.verbose('Choose the task you want to do. \n \n 1 => Word Frequency Analysis \n \n 2 => Sentiment Analysis'));
				console.log('');

				rl.question(colors.input('Enter 1 or 2: '), (todo)	=> {

					if(todo == 1) {
						client.get('statuses/user_timeline', {screen_name: twHandle, count: 25 }, function(error, tweets, response){
							if(!error) {
								var tweetObj = {tweets: tweets};
								var tweetLength = tweetObj.tweets.length;
								var allTweet = '';
								for (let i =0; i < tweetLength -1; i++){
									allTweet +=  tweetObj.tweets[i].text;
								}
								
								words = wordsFrequency(allTweet);

								for(var key in words){
									if(key == 5) break;
								    if (words.hasOwnProperty(key)) {
								    	table.push(
										    [words[key].word, words[key].freq]
										);
								    }
					    		}
					    		console.log('');
								console.log(colors.verbose('WORD FREQUENCY ANALYSIS'));
								console.log('');
					    		console.log(colors.verbose(table.toString()));
					    		console.log('');
					    		console.log(colors.verbose('Thank you for using this tool'));


							}
						});
					} else if(todo = 2){

						console.log('');
						console.log(colors.verbose('SENTIMENT ANALYSIS'));
						console.log('');

						client.get('statuses/user_timeline', {screen_name: twHandle, count: 25}, function(error, tweets, response){
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
												sentimentSum += parseFloat(result.data.docSentiment.score);
											}
										}).catch(function(error) {

										})
									promises.push(eachPromise);
								}
								Promise.all(promises).then((result) => {
											console.log('');
											console.log(colors.green(twHandle + ' your sentiment cumulative is ' + sentimentSum));
											var sentimentType = ((sentimentSum > 0) ? 'Positive' : ((sentimentSum < 0) ? 'Negative' : 'Neutal'));
											console.log('');
											console.log(colors.green("You're tweets show a " + sentimentType + ' disposition.'));
											if (sentimentType = 'Positive'){
												console.log(colors.green("Wow! that's good... Keep it up."));
											} else if (sentimentType = 'Negative') {
												console.log(colors.green("Well... Seems you're going to change your type of tweets."));
											} else {
												console.log(colors.green("Hey! You've got to stand somewhere."));
											}
											console.log('');
											console.log(colors.verbose('Thank you for using this tool.'));
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

