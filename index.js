
require('dotenv').config();
var Twitter = require('twitter');
var jsonfile = require('jsonfile');
var readLine = require('readline');
var file = 'tweets.json'
var alchemy 
var tweetList;

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
		
		for (var i=0; i<tweet_length; i++) {
			var tweet = tweets[i];
			tweetList += tweet.text + " ";
			
		}
		output(tweetList) 
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


function output(tweetList) {
	console.log(tweetList)
	tweetList = tweetList.replace(/[^a-zA-Z 0-9]+/g, '').split(/[\s\/\W]+/g).sort(); 
	console.log(tweetList)
    var current = null; 
    var count = 0;
    var json = {};
    
    for (var index = 0; index < tweetList.length; index++) { 
       
        if (tweetList[index] != current) { 
            current = tweetList[index];  
            count = 1; 
        } else {
            count++; 
            json[tweetList[index]] = count; 
        }
      
      json[tweetList[index]] = count; 
    }
    console.log(json)
    return json;
}

