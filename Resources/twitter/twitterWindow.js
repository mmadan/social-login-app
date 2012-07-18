exports.createTwitterWindow = function()
{
	var ui = require('/ui/ui');
	var win = ui.createWindow({title : "Twitter"});
	

	
	 var twitterButton=ui.createButton({title : 'Login to Tweet', width : '50%', top : '10%'});
	 twitterButton.addEventListener('click',function(){
					
	 });
    win.add(twitterButton);
	return win;
}
