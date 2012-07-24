Ti.include('/lib/sha1.js');
Ti.include('/lib/oauth.js');

var twitter_client = function() {
	var CONSUMER_KEY = 'BjgpGJUYMBHWV7X8Pfyw';
	var CONSUMER_SECRET = 'Vamzv7FqPngjhZBGh0dl8Ni39DPoQWUki7oIDris4';

	var REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
	var AUTHORIZE_URL = 'https://api.twitter.com/oauth/authorize';
	var ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
	//var USER_DETAILS_URL = 'https://api.linkedin.com/v1/people/~';

	// the accessor is used when communicating with the OAuth libraries to sign the messages
	var accessor = {
		consumerSecret : CONSUMER_SECRET,
		tokenSecret : ''
	}

	var pin = null;
	var oauth_token = null;
	var oauth_token_secret = null;

	/**
	 * Returns token. There are two different tokens such as request token and access token.
	 * If you call this method after first authentication process, you will get the "request token". Otherwise, "access token"
	 * @method get_oauth_token
	 */
	this.get_oauth_token = function() {
		return oauth_token;
	}
	/**
	 * Returns secret
	 * @method get_oauth_token_secret
	 */
	this.get_oauth_token_secret = function() {
		return oauth_token_secret;
	}
	/**
	 * Returns the URL that we are going to use in 2nd step of authentication.
	 * @method get_authorize_url_with_token
	 */
	this.get_authorize_url_with_token = function() {
		return AUTHORIZE_URL + '?oauth_token=' + oauth_token;
	}
	/**
	 * Returns pin or oauth verifire
	 * @method get_pin
	 */
	this.get_pin = function() {
		return pin;
	}
	/**
	 * Pass the html text and find the pin from that html text and then set it to the variable.
	 * @method get_pin
	 * @param string html the innerText of html page that returns from twiter after 1st step authentication. We are going to find the pin.
	 */
	this.set_pin = function(html) {

		var regExp = '<code>(.*?)</code>' ;
		Ti.API.debug('Looking for a PIN [regExp:' + regExp + '].');
		var result = RegExp(regExp).exec(html);
		if (result == null || result.length < 2) {
			pin = null;
			Ti.API.debug('Result : ' + result);
			return null;
		}
		Ti.API.debug('Looking for a PIN [pin:' + result[1] + ']: done.');
		pin = result[1];
		return pin;
	}
	/**
	 * Initializes the token and secrets. Please uses this method only once you have authenticated the twitter login and saved the "access token" (not "request token")
	 * @method init
	 * @param string token access token
	 * @param string secret oauth token secret
	 * @pin string pin from twitter
	 * Save accessToken, accessTokenSec and pin(oauth verifire)
	 */
	this.init = function(saved_token, saved_secret, saved_pin) {
		oauth_token = saved_token;
		oauth_token_secret = saved_secret;
		pin = saved_pin;
	}
	var createMessage = function(pUrl) {
		var message = {
			action : pUrl,
			method : 'POST',
			parameters : []
		}
		message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
		message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
		return message;
	}
	/**
	 * 1st step of oAuth. Please refer to this doc https://dev.twitter.com/docs/auth/oauth
	 * @method request_token
	 * @param function complete The function callback that will be triggered after the process is completed. Note that the http post is invoked asynchronously (not sync.)
	 */
	this.request_token = function(complete) {
		Ti.API.debug('Requesting token');
		var message = createMessage(REQUEST_TOKEN_URL);

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var client = Ti.Network.createHTTPClient();
		client.open('POST', REQUEST_TOKEN_URL, true);
		client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));

		client.onload = function() {
			Ti.API.debug('[load]' + this.status);
			var responseParams = OAuth.getParameterMap(client.responseText);
			oauth_token = responseParams['oauth_token'];
			oauth_token_secret = responseParams['oauth_token_secret'];

			Ti.API.debug('request token got the following response: ' + client.responseText);
			Ti.API.debug('oauth_token ' + oauth_token);
			Ti.API.debug('oauth_token_secret ' + oauth_token_secret);

			if (complete != 'undefined') {
				Ti.API.debug('Calling the callback from request_token ()');
				complete();
			}
		}

		client.onerror = function(e) {
			Ti.API.debug('[error]' + this.status + " [text]" + client.responseText);
		}
		client.send(null);
	}
	/**
	 * 3rd step of oAuth. Please refer to this doc https://dev.twitter.com/docs/auth/oauth
	 * @method access_token
	 * @param function complete The function callback that will be triggered after the process is completed. Note that the http post is invoked asynchronously (not sync.)
	 */
	this.access_token = function(complete) {
		Ti.API.debug('Accessing token');
		accessor.tokenSecret = oauth_token_secret;
		var message = createMessage(ACCESS_TOKEN_URL);

		message.parameters.push(['oauth_token', oauth_token]);
		message.parameters.push(['oauth_verifier', pin]);

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var client = Ti.Network.createHTTPClient();
		client.open('POST', ACCESS_TOKEN_URL, true);
		client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));

		client.onload = function() {
			var responseParams = OAuth.getParameterMap(client.responseText);
			oauth_token = responseParams['oauth_token'];
			oauth_token_secret = responseParams['oauth_token_secret'];
			Ti.API.debug('request token got the following response: ' + client.responseText);
			Ti.API.debug('oauth_token ' + oauth_token);
			Ti.API.debug('oauth_token_secret ' + oauth_token_secret);
			complete.call();
		}
		client.onerror = function(e) {
			Ti.API.debug('[error]' + this.status + " [text]" + client.responseText);
		}
		client.send(null);
	}

	this.load_user_details = function(complete) {

		accessor.tokenSecret = oauth_token_secret;
		var message = {
			action : USER_DETAILS_URL,
			method : 'GET',
			parameters : []
		}
		message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
		message.parameters.push(['oauth_token', oauth_token]);
		message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var client = Ti.Network.createHTTPClient();
		client.open("GET", USER_DETAILS_URL, true);
		client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));

		client.onload = function() {
			Ti.API.debug('load_user_details - [onload]' + client.responseText);
			complete(client.responseText);
		}

		client.onerror = function(e) {
			Ti.API.debug('[error]' + this.status + " [text]" + client.responseText);
		}
		client.send();
		Ti.API.debug('load_user_details');
	}
}
