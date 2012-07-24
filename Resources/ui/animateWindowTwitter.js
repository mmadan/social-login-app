exports.createAnimateWindow = function(complete)
{
	Ti.include("/twitter/twitter_client.js");
	var client = new twitter_client();
	
	var  ui = require('/ui/ui');
	
	
	var  win = ui.createWindow({
		 modal : true,
		 navBarHidden : true,
	});
	var loadingLabel = ui.createLabel({
		text : "Loading Please Wait..",
		width : '100%',
		textAlign : "center",
	});
	var view = ui.createView({
		borderWidth:8,
		borderColor:'#999',
		height:"90%",
		width:"300dp",
		borderRadius:10,
		layout : "absolute"
	});
	view.add(loadingLabel);
	win.add(view);
	

	// create a button to close window
	var close = ui.createImageView({
		image : '/images/close.png',
		height: 30,
		width: 30,
		right : 0,
		top : 0,
	});
	win.add(close);
	close.addEventListener('click', function()
	{
		win.close();
	});

	win.open();
	
	var show_webview = function(url) {
		var webView = Ti.UI.createWebView({
			width : "100%",
			height : "100%",
			top : 0,
			visible : false,
			url : url,
		});
		view.add(webView);
		
		webView.addEventListener('beforeload', function(e) {
			webView.visible = false;
		});
		webView.addEventListener('load', function(e) {
			var html = e.source.html;
			client.set_pin(html);
			if (client.get_pin() != null) 
			{
				client.access_token(save_token_and_exit);
			}
			webView.visible = true;
		});
		
	}
	var save_token_and_exit = function()
	{
		Ti.App.Properties.setString("twitter_token", client.get_oauth_token());
		Ti.App.Properties.setString("twitter_token_secret", client.get_oauth_token_secret());
		Ti.App.Properties.setString("twitter_pin",client.get_pin());
		complete();
		win.close();
	}
	var login_twitter = function() 
	{
		client.request_token(function() {
			var url  = client.get_authorize_url_with_token();
			show_webview(url);
		});
	}
	login_twitter();
}
