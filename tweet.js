//Tweets short poems using Wordnik API for nouns, verbs, and adjectives

var debug = false;

//API key
var WordnikAPIKey = 'nwd137wytn500jknnooa6krcmlofs70afdkr1na1l30vwep58';
var request = require('request');
var inflection = require('inflection');
var pluralize = inflection.pluralize;
var capitalize = inflection.capitalize;
var singularize = inflection.singularize;
//Arrays of pre-fromatted sentence strings containing nouns, verbs, and adjectives to be randomly chosen from when writing a poem
var nounPre;
var verbPre;
var adjsPre;

var wordfilter = require('wordfilter');

var Twit = require('twit');

var T = new Twit(require('./config.js'));

//Function to randomly pick from array of words (nouns,verbs,adjectives) produced by Wordnik
Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
    // nounsPre[random * nounsPre.length]
}
//Function to remove inappropriate words from the arrays
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

//Request Urls to request specified parts of speech from Wordnik
function nounUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

function verbUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=verb&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

function adjUrl(minCorpusCount, limit) {
	return "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adjective&minCorpusCount=" + minCorpusCount + "&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=" + limit + "&api_key=" + WordnikAPIKey;
}

//Tweet function that creates a small poem tweet and posts it to the bot's Twitter page
function tweet() {
    console.log(" ");
	var d=new Date();
	var ds = d.toLocaleDateString() + " " + d.toLocaleTimeString();
	console.log(ds);  // date/time of the request
    
    //Poem Creation
	var tweetText = nounPre.pick() + "\n" + verbPre.pick() + "\n" + adjsPre.pick();
    
    //Attempting to tweet the poem
	if(debug) 
		console.log('Debug mode: ', tweetText);
	else
		T.post('statuses/update', {status: tweetText }, function (err, reply) {
            //failure
			if (err != null){
				console.log('Error: ', err);
			}
            //success
			else {
				console.log('Tweeted: ', tweetText);
			}
		});
}
//Array of nouns produced by Wordnik
var nouns;
function getNouns() {	
    console.log("inside getNouns");
	// Get 200 nouns with minimum corpus count of 50,000 
	request(nounUrl(50000,200), function(err, response, data) {
        //console.log("not defined adjsPre");
        
        //Loading noun array with nouns
		if (err != null) return;
		nouns = eval(data);
		//Filter out inappropriate nouns
		for (var i = 0; i < nouns.length; i++) {
			if (wordfilter.blacklisted(nouns[i].word))
			{
				console.log("Blacklisted: " + nouns[i].word);
				nouns.remove(nouns[i]);
				i--;
			}				
		}
        //Filling nounPre with poem sentences to choose from
        nounPre = [
        "I am " + singularize(nouns.pick().word) + ".",
        "I see a " + singularize(nouns.pick().word) + " outside my " + singularize(nouns.pick().word) + ".",
        capitalize(nouns.pick().word) + ", " + nouns.pick().word + ", " + nouns.pick().word + ".",
        "There is a " + singularize(nouns.pick().word) + " in the " + singularize(nouns.pick().word),
        "I sense a " + nouns.pick().word + ".",
        "I see " + pluralize(nouns.pick().word) + ".",
        "So many " + pluralize(nouns.pick().word) + ".",
        "If I could go back to " + singularize(nouns.pick().word) + ", ",
        "We search for " + nouns.pick().word + ".",
        "You love our " + nouns.pick().word + ".",
        "Sacred " + nouns.pick().word + ", "
        // etc.			
        ];
        
//        console.log("-------Tweet something");
//        tweet();
	});
}
//Array of verbs produced by Wordnik
var verbs;
function getVerbs() {
    console.log("inside getVerbs");
	// Get 200 nouns with minimum corpus count of 50,000 
	request(verbUrl(50000,200), function(err, response, data) {
        //Loading verb array with verbs
		if (err != null) return;
		verbs = eval(data);
		//Filter out inappropriate verbs
		for (var i = 0; i < verbs.length; i++) {
			if (wordfilter.blacklisted(verbs[i].word))
			{
				console.log("Blacklisted: " + verbs[i].word);
				verbs.remove(verbs[i]);
				i--;
			}				
		}
        //Filling verbPre with poem sentences to choose from
        verbPre = [
        "I need to " + verbs.pick().word + ".",
        "I want to " + verbs.pick().word + " while I " + verbs.pick().word +  ".",
        capitalize(verbs.pick().word) + " with me.",
        "Why must I " + verbs.pick().word + "?",
        "How could you " + verbs.pick().word + "?",
        "Please " + verbs.pick().word + ".",
        capitalize(verbs.pick().word) + " with me.",
        "I decide to " + verbs.pick().word + ".",
        "You decide to " + verbs.pick().word + ".",
        "If you always " + verbs.pick().word + ", ",
        "It's starting to " + verbs.pick().word + "."
        // etc.			
        ];
        
//        console.log("-------Tweet something");
//        tweet();
	});
}
//Array of adjectives produced by Wordnik
var adjs;
function getAdjs() {
    console.log("inside getAdjs");
	// Get 200 nouns with minimum corpus count of 50,000 
	request(adjUrl(50000,200), function(err, response, data) {
        //Loading adjective array with adjectives
        console.log("inside adj request");
		if (err != null) return;
		adjs = eval(data);
        
		//Filter out inappropriate adjectives
		for (var i = 0; i < adjs.length; i++) {
			if (wordfilter.blacklisted(adjs[i].word))
			{
				console.log("Blacklisted: " + adjs[i].word);
				nouns.remove(adjs[i]);
				i--;
			}
		}
        //Filling adjsPre with poem sentences to choose from
        adjsPre = [
        "I feel " + adjs.pick().word + ".",
        capitalize(adjs.pick().word) + ", " + adjs.pick().word + ", " + adjs.pick().word + ".", 
        "A " + adjs.pick().word + " place.",
        "Never feel " + adjs.pick().word + ".",
        capitalize(adjs.pick().word) + " world.",
        capitalize(adjs.pick().word) + " life.",
        "The feeling of " + adjs.pick().word + ".",
        "I am " + adjs.pick().word + ".",
        "Why? " + capitalize(adjs.pick().word) + ".",
        "You feel " + adjs.pick().word + ".",
        "It is " + adjs.pick().word + " outside."
        // etc.			
        ];
        console.log("defined adjsPre");
        
        //Call to post poem tweet to bot's page
        console.log("Calling Tweet");
        tweet();
        
	});
}

//Calling functions to fill the pre's and filter words
console.log("calling getNouns");
getNouns();
console.log("calling getVerbs");
getVerbs();
console.log("calling getAdjs");
getAdjs();


// And recycle every half hour
setInterval(tweet, 1000 * 60 * 30);
