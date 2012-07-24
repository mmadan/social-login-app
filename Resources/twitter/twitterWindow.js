Ti.include('lib/oAuthAdapter.js');
exports.createTwitterWindow = function() {
	var ui = require('/ui/ui');
	var win = ui.createWindow({
		title : "Twitter"
	});

	var twitterButton = ui.createButton({
		title : 'Twitter'
	});
	win.add(twitterButton);
	
	var login = false;
	
	twitterButton.addEventListener('click', function() {

		if (!login) {
			require('/ui/animateWindowTwitter').createAnimateWindow(twitter_share);
		} else {
			Ti.App.Properties.setString("twitter_token", "");
			Ti.App.Properties.setString("twitter_token_secret", "");
			Ti.App.Properties.setString("twitter_pin", "");
			twitterButton.title = "login";
			login = false;
		}

		/*

		 var oAuthAdapter = new OAuthAdapter('Vamzv7FqPngjhZBGh0dl8Ni39DPoQWUki7oIDris4', 'BjgpGJUYMBHWV7X8Pfyw', 'HMAC-SHA1');

		 // load the access token for the service (if previously saved)
		 oAuthAdapter.loadAccessToken('twitter');

		 oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [['status', 'hey @ziodave, I successfully tested the #oauth adapter with #twitter and @appcelerator #titanium!']], 'Twitter', 'Published.', 'Not published.');

		 // if the client is not authorized, ask for authorization.
		 // the previous tweet will be sent automatically after authorization
		 if (oAuthAdapter.isAuthorized() == false) {
		 // this function will be called as soon as the application is authorized
		 var receivePin = function() {
		 // get the access token with the provided pin/oauth_verifier
		 oAuthAdapter.getAccessToken('http://twitter.com/oauth/access_token');
		 // save the access token
		 oAuthAdapter.saveAccessToken('twitter');
		 };

		 // show the authorization UI and call back the receive PIN function
		 oAuthAdapter.showAuthorizeUI('http://twitter.com/oauth/authorize?oauth_token=' + oAuthAdapter.getRequestToken('http://twitter.com/oauth/request_token', [['oauth_callback', 'oob']]), receivePin, PinFinder.twitter);
		 }
		 */

	});

	var twitter_share = function() {
		twitterButton.title = "Twitter Logout";
		login = true;
	}

	return win;
}
