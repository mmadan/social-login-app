
var ui = require('/ui/ui');

var fbWindow = require('/facebook/fbWindow').createFacebookWindow();
var fbTab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Facebook',
    window:fbWindow
});

var twitterWindow = require('/twitter/twitterWindow').createTwitterWindow();
var twitterTab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Twitter',
    window:twitterWindow
});

var linkedinWindow = require('/linkedin/linkedinWindow').createLinkedinWindow();
var linkedinTab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Linkedin',
    window:linkedinWindow
});

ui.tabGroup.addTab(fbTab);
ui.tabGroup.addTab(twitterTab);
ui.tabGroup.addTab(linkedinTab);

ui.tabGroup.open();
