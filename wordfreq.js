
function output(tweetList) {
	console.log(tweetList)
	tweetList = tweetList.replace(/[^a-zA-Z 0-9]+/g, '').split(/[\s\/\W]+/g).sort(); 
	tweetList = stopwword.removeStopwords(tweetList);
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
