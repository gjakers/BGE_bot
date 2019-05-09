const request   = require('request');
const snoowrap  = require('snoowrap');
const xml2js    = require('xml2js');


const r = new snoowrap( {
  userAgent:     'BGE_bot',
  clientId:      process.env.client_id,
  clientSecret:  process.env.client_secret,
  refresh_token: process.env.refresh_token
} );

var parser = new xml2js.Parser();

const options = {
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCGgy9QqFwElrVg4vf6QNX_A",
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
      var title = entry['title'][0];
      var time = entry['published'][0];
      var url = entry['link'][0]['$']['href'];
      console.log(title);
      if( (Date.now() - Date.parse(time)) <= 600000 ) {
        console.log("Creating post \"", title, "\"\n");
        r.getSubreddit('bestguyever').submitLink( {
          title: title,
          url: url
        })
      }
    });
  });
});
