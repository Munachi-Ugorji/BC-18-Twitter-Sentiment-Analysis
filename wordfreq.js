var sw = require('stopword');

function wordFrequency(sentences) {
    sentences = sentences.replace(/href\s*=\s*(['"])(https?:\/\/.+?)\1/ig,''); 
    sentences = sentences.replace(/[^\w\s]/gi, ''); 
    sentences = sentences.replace(/[\s\n\t\r]+/g, ' '); 
    sentences = sentences.split(' ').sort(); 

    sentences = sw.removeStopwords(sentences);

    
    var wordsObj = {};
    
    sentences.forEach(function (key) {
      if (wordsObj.hasOwnProperty(key)) {
        wordsObj[key]++;
      } else {
        wordsObj[key] = 1;
      }
    });
    
    
    var wordAndFreq = [];
    
    wordAndFreq = Object.keys(wordsObj).map(function(key) {
      return {
        word: key,
        freq: wordsObj[key]
      };
    });
  
    wordAndFreq.sort(function(a, b) {
      return b.freq - a.freq;
    });
  
    return wordAndFreq;

}


module.exports = wordFrequency;