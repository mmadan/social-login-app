exports.createFacebookWindow = function()
{
	var ui = require('/ui/ui');
	var win = ui.createWindow({title : "Facebook"});
	var currUserLabel=ui.createLabel({text : '', top : 0, left : '1%'});
	win.add(currUserLabel);
	currUserLabel.hide();

//creating facebook button
    Ti.Facebook.appid = '450784751611753';
    Ti.Facebook.permissions = ['publish_stream'];
    Ti.Facebook.addEventListener('login', function(e) {
        if (e.success) {
            alert('Logged in');
            exports.GetUserInfo(currUserLabel);
        }
    });
    Ti.Facebook.addEventListener('logout', function(e) {
        alert('Logged out');
        exports.GetUserInfo(currUserLabel);
    });
        // Add the button.  Note that it doesn't need a click event listener.
     win.add(Ti.Facebook.createLoginButton({
        top : 50
    }));
    
    
    var postButton=ui.createButton({title : 'Post', width : '30%', left : '2%'});
    win.add(postButton);
    postButton.addEventListener('click',function(){
    	if(Titanium.Facebook.loggedIn==false)
    	{
    		alert('Login 1st to post this message');
    	}
    	else if(postMessage.value==''){alert('status cant be left blank');}
    	else
    	{
    		 Ti.Facebook.authorize();
			    // Now create the status message after you've confirmed that authorize() succeeded
			    Ti.Facebook.requestWithGraphPath('me/feed', {message: postMessage.value}, 
			             "POST", function(e) {
			        if (e.success) {
			            alert("Success!  From FB: " + e.result);
			        } else {
			            if (e.error) {
			                alert('already posted the same status on ur profile'+e.error);
			            } else {
			                alert("Unkown result");
			            }
			        }
			    });	
    	}
    	
    });
    var postMessage=ui.createTextField({value : 'I just found this new app and its truly amazing....try it everyone :)',left : '34%', top : '45%',width : '58%'})
    win.add(postMessage);
    
    exports.GetUserInfo(currUserLabel);
	return win;
}

exports.GetUserInfo=function(userLabel)
{
	if(Ti.Facebook.loggedIn)
	{
		 Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
	        if (e.success) {
	            var user=JSON.parse(e.result);
	            userLabel.text='Logged in as: '+user.name;
	            userLabel.show();
	        } else if (e.error) {
	            alert(e.error);
	        } else {
	            alert('Unknown response');
	        }
	    });
    }
    else{ userLabel.hide();}
}

