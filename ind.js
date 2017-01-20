require('dotenv').config();
var Twitter = require('twitter');
var readLine = require('readline');
var fs = require('fs');
var wordsFrequency = require('./wordfreq');
var colors = require('colors');
var Table = require('cli-table');

var alchemy = require('node_alchemy')(process.env.api_key /*'612be5e9d82c63b648661079c636abbfc7c6f0db'*/);

var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
  api_key: process.env.api_key //'612be5e9d82c63b648661079c636abbfc7c6f0db'
});

var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
})

const rl = readLine.createInterface({
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
console.log(colors.help.bold('\t WELCOME TO TWITITER DATA INSIGHT'));
console.log(colors.silly('------------------------------------------------'));
console.log('');
console.log(colors.verbose('\t \t You can perform Twitter \n \n 1. Word Analysis \n \n 2. Sentiment Analysis \n \n 3. Emotion Analysis'));
console.log(colors.silly('-------------------------------------------------'));
console.log('');

console.log(colors.bgBlue('You need a Twitter Handle e.g. AJUdensi to perform the above tasks'));
console.log('');
rl.question(colors.input('Enter a twitter handle: '), (twHandle) => {

	if(twHandle) {
		console.log('');
		console.log(colors.bgBlue('Verifying your twitter handle'));
		console.log(colors.silly('-----------------------------'));

		client.get('statuses/user_timeline', {screen_name: twHandle, count: 15}, function(err, tweets, res){


			if(!err){
				console.log('');
				console.log(colors.bgGreen.bold(` \t Hello ${twHandle} \t`));
				console.log('');
				console.log(colors.silly('----------------------------'));
				console.log('');
				console.log(colors.verbose('Choose a task you want to do. \n \n 1 => Word Frequency Analysis \n \n 2 => Sentiment Analysis \n \n 3 => Emotion Analysis'));
				console.log('');
				
				rl.question(colors.input('Enter 1 or 2 or 3: '), (toDo) => {
					
					if(toDo == 1){
						client.get('statuses/user_timeline', {screen_name: twHandle, count: 15}, function(err, tweets, res){
							if(!err){
								var twObj = {tweets: tweets};
								var twLength =twObj.tweets.length;
								var allTweet = '';
								//do word frequency
								for(let i = 0; i < twObj.tweets.length - 1; i++){
									 allTweet += twObj.tweets[i].text;
								}

								words = wordsFrequency(allTweet);

								for(var key in words){
									if(key == 5) break;
								    if (words.hasOwnProperty(key)) {
								    	table.push(
										    [words[key].word, words[key].freq]
										);
								       //console.log(colors.verbose(`Word: ${words[key].word} <===> Frequency: ${words[key].freq}`));
								    }
					    		}

					    		console.log(colors.verbose(table.toString()));
					    	}
					    });

					} else if(toDo == 2){
						client.get('statuses/user_timeline', {screen_name: twHandle, count: 15}, function(err, tweets, res){
							if(!err){
								var twObj = {tweets: tweets};
								var twLength =twObj.tweets.length;
								var promises = [];
								var sentimentSum = 0;
						//do sentiment
								for(let i = 0; i < twLength - 1; i++){
									eachTweet = twObj.tweets[i];		

									var eachPromise = alchemy.lookup('sentiment', 'text', eachTweet.text)
					                    .then(function(result) {
					                    	if(result.data.docSentiment.score){
					                    		//console.log(result.data.docSentiment.type);
					                    		//console.log('---------------------------')
					                        	sentimentSum += parseFloat(result.data.docSentiment.score);
					                        }
					                    }).catch(function(err) {
					                        //console.log({ status: 'error', message: err });
					                    })
									promises.push(eachPromise);
								}
								
								Promise.all(promises).then((result) => {
											console.log('');
											console.log(colors.green(`${twHandle} sentiment cumulative is ${sentimentSum}`));
											var sentimentType = ((sentimentSum > 0) ? 'Positive' : ((sentimentSum < 0) ? 'Negative' : 'Neutal'));
											console.log('');
											console.log(colors.green(`I think you are generally ${sentimentType}`));
											console.log('');
										}).catch(()=>{
											console.log(colors.bgRed("error"));
										});
							}
						});
					} else if(toDo == 3){
						client.get('statuses/user_timeline', {screen_name: twHandle, count: 15}, function(err, tweets, res){
							if(!err){
								var twObj = {tweets: tweets};

								for(let i = 0; i < twObj.tweets.length - 1; i++){
									eachTweet = twObj.tweets[i];

									alchemy_language.emotion({text: eachTweet.text}, function (err, response) {
									  if (err)
									    console.log(colors.bgRed('error:', err));
									  else
									    console.log(colors.green(response.docEmotions));
									});
								}
								

								
							}
						});

					} else {
						console.log(colors.bgRed('Please try again with a valid task command'));
					}
					
					rl.close();
				});
			
			} else {
				console.log(colors.bgRed('An error occurred. Enter a valid twitter handle or check network connection '));
				rl.close();
			}
		});
		
	} else {
		rl.close();
	}
});