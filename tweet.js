var debug = false;

var WordnikAPIKey = 'nwd137wytn500jknnooa6krcmlofs70afdkr1na1l30vwep58';
var request = require('request');
var inflection = require('inflection');
var pluralize = inflection.pluralize;
var capitalize = inflection.capitalize;
var singularize = inflection.singularize;
var nounPre;
var verbPre;
var adjsPre;

var wordfilter = require('wordfilter');

var Twit = require('twit');

var T = new Twit(require('./config.js'));

Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function nounUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

function verbUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=verb&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

function adjUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adjective&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

function tweet() {

	var tweetText = nounPre.pick() + "\n" + verbPre.pick() + "\n" + adjsPre.pick();

	if(debug) 
		console.log('Debug mode: ', tweetText);
	else
		T.post('statuses/update', {status: tweetText }, function (err, reply) {
			if (err != null){
				console.log('Error: ', err);
			}
			else {
				console.log('Tweeted: ', tweetText);
			}
		});
}
var nouns;
function getNouns() {
	console.log(" ");
	var d=new Date();
	var ds = d.toLocaleDateString() + " " + d.toLocaleTimeString();
	console.log(ds);  // date/time of the request	

	// Get 200 nouns with minimum corpus count of 5,000 (lower numbers = more common words) 
	request(nounUrl(5000,200), function(err, response, data) {
		if (err != null) return;
		nouns = eval(data);
		
		for (var i = 0; i < nouns.length; i++) {
			if (wordfilter.blacklisted(nouns[i].word))
			{
				console.log("Blacklisted: " + nouns[i].word);
				nouns.remove(nouns[i]);
				i--;
			}				
		}
        nounPre = [
        "I like " + nouns.pick().word + ".",
        "here's a noun: " + nouns.pick().word + " outside my house."
        // etc.			
        ];
        
//        console.log("-------Tweet something");
//        tweet();
	});
}
var verbs;
function getVerbs() {
	console.log(" ");
	var d=new Date();
	var ds = d.toLocaleDateString() + " " + d.toLocaleTimeString();
	console.log(ds);  // date/time of the request	

	// Get 200 nouns with minimum corpus count of 5,000 (lower numbers = more common words) 
	request(verbUrl(5000,200), function(err, response, data) {
		if (err != null) return;
		verbs = eval(data);
		
		for (var i = 0; i < verbs.length; i++) {
			if (wordfilter.blacklisted(verbs[i].word))
			{
				console.log("Blacklisted: " + verbs[i].word);
				verbs.remove(verbs[i]);
				i--;
			}				
		}
        verbPre = [
        "I " + verbs.pick().word + ".",
        "verb: " + verbs.pick().word + " outside my house."
        // etc.			
        ];
        
        console.log("-------Tweet something");
//        tweet();
	});
}
var adjs;
function getAdjs() {
	console.log(" ");
	var d=new Date();
	var ds = d.toLocaleDateString() + " " + d.toLocaleTimeString();
	console.log(ds);  // date/time of the request	

	// Get 200 nouns with minimum corpus count of 5,000 (lower numbers = more common words) 
	request(adjUrl(5000,200), function(err, response, data) {
		if (err != null) return;
		adjs = eval(data);
		
		for (var i = 0; i < adjs.length; i++) {
			if (wordfilter.blacklisted(adjs[i].word))
			{
				console.log("Blacklisted: " + adjs[i].word);
				nouns.remove(adjs[i]);
				i--;
			}				
		}
        adjsPre = [
        "I feel " + adjs.pick().word + ".",
        "adj: " + adjs.pick().word + " outside my house."
        // etc.			
        ];
        
        console.log("-------Tweet something");
        tweet();
        
	});
}
		
///----- NOW DO THE BOT STUFF
//var rand = Math.random();


getNouns();
getVerbs();
getAdjs();

//// Run the bot
//runBot();

// And recycle every hour
setInterval(tweet, 1000 * 60 * 60);