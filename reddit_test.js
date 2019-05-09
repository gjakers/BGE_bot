const request   = require('request');
const xml2js    = require('xml2js');

var parser = new xml2js.Parser();

const options = {
  url: "https://www.reddit.com/r/bestguyever.rss",
  headers: {
    'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) " +
                  "AppleWebKit/537.36 (KHTML, like Gecko) " +
                  "Chrome/62.0.3202.94 " +
                  "Safari/537.36"
  }
};

request(options, function(err, response, body) {
	parser.parseString(body, function(err, data) {
		data['feed']['entry'].forEach( function(entry) {
			console.log( text: entry['content'][0]['$']['href'] );
		});
	});
});
