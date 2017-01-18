
require('dotenv').config();
//var ProgressBar = require('progress');

var Twitter = require('twitter');
var jsonfile = require('jsonfile')
var file = 'tweets.json'

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
			console.log('you have an error', error)
			
		}
})

function output(tweetList) {
	console.log(tweetList)
	tweetList = tweetList.split(/[\s\n\t\r\^#\^@\W]+/g).sort(); //sorting and spliting sentence passed into an array
	console.log(tweetList)
    var current = null; //declaring variables
    var count = 0;
    var json = {};
    
    for (var index = 0; index < tweetList.length; index++) { //iterating over converted array
       
        if (tweetList[index] != current) { //checking the current value in loop
            current = tweetList[index];  //if it is not null, current is set to the value
            count = 1; //count is set as 1
        } else {
            count++; //else count will increase by one
            json[tweetList[index]] = count; //json property is assigned its count value
        }
      
      json[tweetList[index]] = count; //json property is assinged its count value

    }
    console.log(json)
    return json;
}

