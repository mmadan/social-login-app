// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var spinner=require('/spinner').createSpinner();
var win1 = Titanium.UI.createWindow({  
    title:'Facebook',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Facebook',
    window:win1
});

 // Don't forget to set your appid and requested permissions, else the login button
    // won't be effective.
    Ti.Facebook.appid = '450784751611753';
    Ti.Facebook.permissions = ['publish_stream'];
    Ti.Facebook.addEventListener('login', function(e) {
    	spinner.start();
        if (e.success) {
        	spinner.stop();
            alert('Logged in');
            
        }
    });
    Ti.Facebook.addEventListener('logout', function(e) {
    	spinner.stop();
        alert('Logged out');
        
    });
        
    // Add the button.  Note that it doesn't need a click event listener.
    win1.add(Ti.Facebook.createLoginButton({
        top : 50
    }));


var postButton=Ti.UI.createButton({
	top : '46%',
	title : 'Post',
	width : '27%',
	left : '1%'
	
});
postButton.addEventListener('click',function(){
	
	if(textField.value!='')
	{
		spinner.start();
					 // First make sure this permission exists
				    Ti.Facebook.permissions = ['publish_stream'];
				    Ti.Facebook.authorize();
		
				    
				    // ...
				    // ...
				    
				    // Now create the status message after you've confirmed that authorize() succeeded
				    Ti.Facebook.requestWithGraphPath('me/feed', {message: textField.value }, 
				             "POST", function(e) {
				        if (e.success) {
				        	spinner.stop();
				            alert("Success!  From FB: " + e.result);
				        } else {
				            if (e.error) {
				            	spinner.stop();
				                alert(e.error);
				            } else {
				            	spinner.stop();
				                alert("Unkown result");
				            }
				        }
				    });
	 }
});
win1.add(postButton);

var textField = Titanium.UI.createTextField({
		color : '#5092bd',
		height : '50dp',
		font : {
			fontWeight : 'bold'
		},
		top : '45%',
		left : '30%',
		width : '60%',
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType : Ti.UI.KEYBOARD_EMAIL,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
	});
	win1.add(textField);


//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Twitter',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Twitter',
    window:win2
});
var TwitterButton=Ti.UI.createButton({
	top : '46%',
	title : 'Login to Twitter',
	width : '50%',
	left : '20%'
	
});
TwitterButton.addEventListener('click',function(){

});
win2.add(TwitterButton);



win1.add(spinner);
//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  

var tab3=require('/common/checkWindow').createCheckWindow();
tabGroup.addTab(tab3);
// open tab group
tabGroup.open();
