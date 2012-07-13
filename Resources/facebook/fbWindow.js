exports.createFacebookWindow = function()
{
	var ui = require('/ui/ui');
	var win = ui.createWindow({title : "Facebook"});
//	var currUserLabel=ui.createLabel({text : 'Logged in as '});
//	win.add(currUserLabel);
    Ti.Facebook.appid = '450784751611753';
    Ti.Facebook.permissions = ['publish_stream'];
    Ti.Facebook.addEventListener('login', function(e) {
        if (e.success) {
            alert('Logged in');
        }
    });
    Ti.Facebook.addEventListener('logout', function(e) {
        alert('Logged out');
    });
        
    // Add the button.  Note that it doesn't need a click event listener.
    win.add(Ti.Facebook.createLoginButton({
        top : 50
    }));
	return win;
}

