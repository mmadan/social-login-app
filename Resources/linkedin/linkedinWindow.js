exports.createLinkedinWindow = function() {
	var ui = require('/ui/ui');
	var win = ui.createWindow({
		title : "Linkedin"
	});

	var linkedInButton = ui.createButton({
		title : 'LinkedIn Login',
		width : '50%',
		top : '50dp'
	});
	win.add(linkedInButton);
	
	var login = false;
	
	linkedInButton.addEventListener('click', function(){
		if(!login)
		{
			require('/ui/animateWindow').createAnimateWindow(linkedin_share);
		}else
		{
			Ti.App.Properties.setString("linkedin_token", "");
			Ti.App.Properties.setString("linkedin_token_secret", "");
			Ti.App.Properties.setString("linkedin_pin","");
			linkedInButton.title = "login";
			login = false;
		}
	});
	var linkedin_share = function()
	{
		linkedInButton.title = "LinkedIn Logout";
		login = true;
	}


	return win;
}
