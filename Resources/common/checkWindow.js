exports.createCheckWindow=function(){
	
	var checkWindow = Titanium.UI.createWindow({  
    title:'LinkedIn',
    backgroundColor:'#fff'
});


var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'LinkedIn',
    window:checkWindow
});

var linkedInButton=Ti.UI.createButton({
	
	title : 'Login to LinkedIN',
	width : '50%',
	
	
});
linkedInButton.addEventListener('click',function(){

});
checkWindow.add(linkedInButton);



	return tab3;
}
