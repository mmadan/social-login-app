/*
 * ATTENTION: Some efforts has been put in order to produce this code.
 *            If you like and use it consider making a dontation in order
 *            to allow me to do more and provide you with more solutions.
 *
 *            Thanks,
 *            David Riccitelli
 *
 *            To donate, copy and paste this link in your browser:
 * https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=T5HUU4J5EQTJU&lc=IT&item_name=OAuth%20Adapter&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted
 *
 * last update 29.06.2010 16.00
 * 
 * Copyright 2010 David Riccitelli, Interact SpA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * This library currently works only with Twitter, although I'd like to
 * spend some more time to make it generally compatible with other services
 * too.
 *
 * Sample use with Twitter:

 // create a new OAuthAdapter instance by passing by your consumer data and signature method
 var oAuthAdapter = new OAuthAdapter(
 'your-consumer-secret',
 'your-consumer-key',
 'HMAC-SHA1');

 // load the access token for the service (if previously saved)
 oAuthAdapter.loadAccessToken('twitter');

 // consume a service API - in this case the status update by Twitter
 oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', ['status','Hey @ziodave, I managed to use the #oauth adapter for @titanium consuming @twitterapi'],'Twitter','Tweet published.','Tweet not published.');

 // if the client is not authorized, ask for authorization. the previous tweet will be sent automatically after authorization
 if (oAuthAdapter.isAuthorized() == false)
 {
	 // this function will be called as soon as the application is authorized
     var receivePin = function() {
		 // get the access token with the provided pin/oauth_verifier
         oAuthAdapter.getAccessToken('https://api.twitter.com/oauth/access_token');
		 // save the access token
         oAuthAdapter.saveAccessToken('twitter');
     };

	 // show the authorization UI and call back the receive PIN function
     oAuthAdapter.showAuthorizeUI('https://api.twitter.com/oauth/authorize?' + oAuthAdapter.getRequestToken('https://api.twitter.com/oauth/request_token'), receivePin);
 }

 */
/*
 * The Adapter needs 2 external libraries (oauth.js, sha1.js) hosted at
 *  http://oauth.googlecode.com/svn/code/javascript/
 *
 * Save them locally in a lib subfolder
 */
Ti.include('sha1.js');
Ti.include('oauth.js');

// create an OAuthAdapter instance
var OAuthAdapter = function(pConsumerSecret, pConsumerKey, pSignatureMethod)
 {
	
	Ti.API.info('*********************************************');
	Ti.API.info('If you like the OAuth Adapter, consider donating at');
	Ti.API.info('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=T5HUU4J5EQTJU&lc=IT&item_name=OAuth%20Adapter&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted');
	Ti.API.info('*********************************************');	

    // will hold the consumer secret and consumer key as provided by the caller
    var consumerSecret = pConsumerSecret;
    var consumerKey = pConsumerKey;

    // will set the signature method as set by the caller
    var signatureMethod = pSignatureMethod;

    // the pin or oauth_verifier returned by the authorization process window
    var pin = null;

    // will hold the request token and access token returned by the service
    var requestToken = null;
    var requestTokenSecret = null;
    var accessToken = null;
    var accessTokenSecret = null;

    // the accessor is used when communicating with the OAuth libraries to sign the messages
    var accessor = {
        consumerSecret: consumerSecret,
        tokenSecret: ''
    };

    // holds actions to perform
    var actionsQueue = [];

	// pin finder
	var pinFinder = null;

    // will hold UI components
    var window = null;
    var view = null;
    var webView = null;
    var receivePinCallback = null;

    this.loadAccessToken = function(pService)
    {
        Ti.API.debug('Loading access token for service [' + pService + '].');

        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, pService + '.config');
        if (file.exists == false) return;

        var contents = file.read();
        if (contents == null) return;

        try
        {
            var config = JSON.parse(contents.text);
        }
        catch(ex)
        {
            return;
        }
        if (config.accessToken) accessToken = config.accessToken;
        if (config.accessTokenSecret) accessTokenSecret = config.accessTokenSecret;

        Ti.API.debug('Loading access token: done [accessToken:' + accessToken + '][accessTokenSecret:' + accessTokenSecret + '].');
    };
    this.saveAccessToken = function(pService)
    {
        Ti.API.debug('Saving access token [' + pService + '].');
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, pService + '.config');
        if (file == null) file = Ti.Filesystem.createFile(Ti.Filesystem.applicationDataDirectory, pService + '.config');
        file.write(JSON.stringify(
        {
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
        }
        ));
        Ti.API.debug('Saving access token: done.');
    };

    // will tell if the consumer is authorized
    this.isAuthorized = function()
    {
        return ! (accessToken == null || accessTokenSecret == null);
    };

    // creates a message to send to the service
    var createMessage = function(pUrl, pMethod, pParameters)
    {
		Ti.API.debug('Creating a message [url:'+pUrl+'][method:'+pMethod+'][parameters:'+JSON.stringify(pParameters)+'].');
		
        var message = {
            action: pUrl
            ,
            method: pMethod
            ,
            parameters: []
        };
        message.parameters.push(['oauth_consumer_key', consumerKey]);
        message.parameters.push(['oauth_signature_method', signatureMethod]);

		if (pParameters && pParameters instanceof Array)
			for (p in pParameters)
				if (pParameters[p]) message.parameters.push(pParameters[p]);

		Ti.API.debug('Creating a message ['+JSON.stringify(message)+']: done.');

        return message;
    };

    // returns the pin
    this.getPin = function() {
        return pin;
    };

    // requests a requet token with the given Url
    this.getRequestToken = function(pUrl, pParameters)
    {
		Ti.API.debug('Requesting a token [url:'+pUrl+'][parameters:'+JSON.stringify(pParameters)+'].');
	
        accessor.tokenSecret = '';

        var message = createMessage(pUrl,'POST',pParameters);

		// if (pParameters)
		// 	for (p in pParameters)
		// 		message.push(pParameters[p]);

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var client = Ti.Network.createHTTPClient();
        client.open('POST', pUrl, false);
        client.send(OAuth.getParameterMap(message.parameters));

        var responseParams = OAuth.getParameterMap(client.responseText);
        requestToken = responseParams['oauth_token'];
        requestTokenSecret = responseParams['oauth_token_secret'];

        Ti.API.debug('request token got the following response: ' + client.responseText);

        return requestToken;
    }

    // unloads the UI used to have the user authorize the application
    var destroyAuthorizeUI = function()
    {
        // if the window doesn't exist, exit
        if (window == null) return;

        // remove the UI
        try
        {
            window.close();
            window.remove(view);
            view.remove(webView);
            webView.removeEventListener('load', authorizeUICallback);
            webView = null;
            view = null;
            window = null;
        }
        catch(ex)
        {
            Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
        }
    };

    // looks for the PIN everytime the user clicks on the WebView to authorize the APP
    // currently works with TWITTER
    var authorizeUICallback = function(e)
    {
        Ti.API.debug('authorizeUICallback.');

		// Ti.API.debug('*****************************');
		// Ti.API.debug(e.source.html);
		// Ti.API.debug('*****************************');

		pin = pinFinder.find(e.source.html);
		
		if (pin)
		{
	        if (receivePinCallback) setTimeout(receivePinCallback, 100);
	        destroyAuthorizeUI();
		}
    };

    // shows the authorization UI
    this.showAuthorizeUI = function(pUrl, pReceivePinCallback, pPinFinder)
    {
	
		Ti.API.debug('Showing authorization UI ['+pUrl+'].');
	
        receivePinCallback = pReceivePinCallback;
		pinFinder = pPinFinder;

        window = Ti.UI.createWindow({
            modal: true,
            fullscreen: true
        });
        var transform = Ti.UI.create2DMatrix().scale(0);
        view = Ti.UI.createView({
            top: 5,
            width: 310,
            height: 450,
            border: 10,
            backgroundColor: 'white',
            borderColor: '#aaa',
            borderRadius: 20,
            borderWidth: 5,
            zIndex: -1,
            transform: transform
        });
        closeLabel = Ti.UI.createLabel({
            textAlign: 'right',
            font: {
                fontWeight: 'bold',
                fontSize: '12pt'
            },
            text: '(X)',
            top: 10,
            right: 12,
            height: 14
        });
        window.open();

        webView = Ti.UI.createWebView({
            url: pUrl
        });
        webView.addEventListener('load', authorizeUICallback);
        view.add(webView);

        closeLabel.addEventListener('click', destroyAuthorizeUI);
        view.add(closeLabel);

        window.add(view);

        var animation = Ti.UI.createAnimation();
        animation.transform = Ti.UI.create2DMatrix();
        animation.duration = 500;
        view.animate(animation);
    };

    this.getAccessToken = function(pUrl)
    {
		Ti.API.debug('Getting access token [url:'+pUrl+'][tokenSecret:'+requestTokenSecret+'][oauth_token:'+requestToken+'][oauth_verifier:'+pin+']');
	
		if (accessToken) return accessToken;
	
		if (!pUrl) return null;
	
        accessor.tokenSecret = requestTokenSecret;

        var message = createMessage(pUrl,'POST');
        message.parameters.push(['oauth_token', requestToken]);
        message.parameters.push(['oauth_verifier', pin]);

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        for (var p in parameterMap)
        Ti.API.debug(p + ': ' + parameterMap[p]);

        var client = Ti.Network.createHTTPClient();
        client.open('POST', pUrl, false);
        client.send(parameterMap);

        var responseParams = OAuth.getParameterMap(client.responseText);
        accessToken = responseParams['oauth_token'];
        accessTokenSecret = responseParams['oauth_token_secret'];

        Ti.API.debug('*** get access token, Response: ' + client.responseText);

        processQueue();

        return accessToken;

    };

    var processQueue = function()
    {
        Ti.API.debug('Processing queue.');
        while ((q = actionsQueue.shift()) != null)
        send(q.url, q.parameters, q.title, q.successMessage, q.errorMessage);

        Ti.API.debug('Processing queue: done.');
    };

    var send = function(pUrl, pParameters, pTitle, pSuccessMessage, pErrorMessage)
	{
    	return send2(pUrl, 'POST', pParameters, pTitle, pSuccessMessage, pErrorMessage)
	};
    // var send2 = function(pUrl, pMethod, pParameters, pContentType, pBody, pTitle, pSuccessMessage, pErrorMessage)
    var send2 = function(pUrl, pMethod, pParameters, pTitle, pSuccessMessage, pErrorMessage)
    {
        Ti.API.debug('Sending a message to the service at [' + pUrl + '] with the following params: ' + JSON.stringify(pParameters));

        if (accessToken == null || accessTokenSecret == null)
        {

            Ti.API.debug('The send status cannot be processed as the client doesn\'t have an access token. The status update will be sent as soon as the client has an access token.');

            actionsQueue.push({
                url: pUrl,
                parameters: pParameters,
                title: pTitle,
                successMessage: pSuccessMessage,
                errorMessage: pErrorMessage
            });
            return;
        }

        accessor.tokenSecret = accessTokenSecret;

        var message = createMessage(pUrl,pMethod,pParameters);
        message.parameters.push(['oauth_token', accessToken]);
        // for (p in pParameters) message.parameters.push(pParameters[p]);
        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        for (var p in parameterMap)
        Ti.API.debug(p + ': ' + parameterMap[p]);

        var client = Ti.Network.createHTTPClient();
        client.open(pMethod, pUrl, false);
		client.send(parameterMap);
		// Ti.API.debug(OAuth.formEncode(parameterMap));
		// client.setRequestHeader('Authentication',OAuth.formEncode(parameterMap));
		// client.setRequestHeader('Content-Type',pContentType);
		//         client.send(pBody);

        if (client.status == 200) {
            Ti.UI.createAlertDialog({
                title: pTitle,
                message: pSuccessMessage
            }).show();
        } else {
            Ti.UI.createAlertDialog({
                title: pTitle,
                message: pErrorMessage
            }).show();
        }

        Ti.API.debug('*** sendStatus, Response: [' + client.status + '] ' + client.responseText);

        return client.responseText;

    };
    this.send = send;
    this.send2 = send2;

};

function PinFinder(pRegExp)
{
	
	var regExp = pRegExp;

	this.find = function(html)
	{
		Ti.API.debug('Looking for a PIN [regExp:'+regExp+'].');
		
		Ti.API.debug('******************************************************************');
		Ti.API.debug(html);
		Ti.API.debug('******************************************************************');
		
		var result = RegExp(regExp).exec(html);
		if (result == null || result.length < 2) return null;
		
		Ti.API.debug('Looking for a PIN [pin:'+result[1]+']: done.');
				
		return result[1];
	};

};

PinFinder.digg=new PinFinder('<p id="pin">(.*?)</p>');
PinFinder.twitter=new PinFinder('<div id="oauth_pin">(.*?)</div>');
PinFinder.buzz=new PinFinder('verification code: <b>(.*?)</b>');
PinFinder.yahoo=new PinFinder('<span id="shortCode">(.*?)</span>');