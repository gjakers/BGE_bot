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

var options = {
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCGgy9QqFwElrVg4vf6QNX_A",
  headers: {
    'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) " +
                  "AppleWebKit/537.36 (KHTML, like Gecko) " +
                  "Chrome/62.0.3202.94 " +
                  "Safari/537.36"
  }
};

request(options, function(err, response, yt_body) {
	parser.parseString(yt_body, function(err, yt_data) {
		options['url'] = "https://www.reddit.com/r/bestguyever.rss";
		request(options, function(err, response, rd_body) {
			parser.parseString(rd_body, function(err, rd_data) {
				yt_data['feed']['entry'].forEach( function(yt_entry) {
					var title = yt_entry['title'][0];
					var time  = yt_entry['published'][0];
					var url   = yt_entry['link'][0]['$']['href'];
				
					if( (Date.now() - Date.parse(time)) <= 1200000 ) {
						console.log("Found new upload: " + title);
						var exists = false;
						rd_data['feed']['entry'].forEach( function(rd_entry) {
							if(rd_entry['content'][0]['_'].includes(url))
								exists = true
						});
						if (exists == false) {
							if (title.includes("Ripple")) { return; }
							console.log("posting to reddit");
							r.getSubreddit('bestguyever')
								.submitLink({ title: title, url: url })
								.assignFlair({ text: "Official", css_class: 'official' });
						}
					}
				});
			});
		});
	});
});
