exports.tabGroup = Ti.UI.createTabGroup();

exports.platform = function()
{
	var name = Ti.Platform.osname;
	if(name == "android")
		return name+"UI";
	else
		return "iOSUI"	
}

exports.platformLang = Ti.Platform.locale;
exports.platformLayout = Ti.Platform.osname+"Images";
exports.osname = Ti.Platform.osname;

exports.isChat = true;
exports.open_login_window = false;

var applyDefaults = function(params, defaults) 
{
	params = params || {};
	var _ = require('lib/underscore');
	_.each(defaults, function(val, key){
		
		params[key] = params[key] ? params[key] : val;
	
	});
}

exports.createWindow = function(params) 
{
	params = params || {};

	var defaults = {
		color : '#fff',
		barColor : '#808080',
		backButtonTitleImage:'/images/whitearrow.png',
		backgroundColor : '#fff',
		tabBarHidden : false,
		exitOnClose:true,
		title : "New Window",
		orientationModes : [ Ti.UI.PORTRAIT ,Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
	};

	applyDefaults(params, defaults);
	var win = Ti.UI.createWindow(params);
	return win;
};

exports.createTableView = function(params){
	params = params || {};
	var defaults = {
		minRowHeight:'80dp',
	}
	applyDefaults(params , defaults);
	return Ti.UI.createTableView(params);
}

exports.createRow = function(params){
	params = params || {};
	var defaults = {
		className:"row",
		height : '80dp'
	}
	if(Ti.Platform.osname == "ipad")
	defaults.height = '160dp';
	applyDefaults(params , defaults);
	return Ti.UI.createTableViewRow(params);
}


exports.createDashboardView = function(params) {
	params = params || {};
	
	var defaults = {
		top	: '40dp',
		editable	:	false,
	}
	applyDefaults(params, defaults);
	return	Ti.UI.createDashboardView(params);
}
exports.createDashboardItem =function(params) {
	params = params || {};
	
	var defaults = {}
	applyDefaults(params, defaults);
	
	return Ti.UI.createDashboardItem(params);
}

exports.createImageView = function(params) {
	params = params || {};
	
	var defaults = {
		height : '60dp',
		width : '60dp',
		top:'10dp',
	}
	if(Ti.Platform.osname == "ipad")
	{
		defaults.height = '120dp';
		defaults.width = '120dp';
	}
	applyDefaults(params , defaults);
	return Ti.UI.createImageView(params);
}


exports.createView = function(params) {
	params = params || {};
	
	var defaults = {
		height:'auto',
		layout:'vertical',
	};
	applyDefaults(params , defaults);
	return Ti.UI.createView(params);
}

exports.createLabel = function(params) {
	params = params || {};
	
	var defaults = {
		width:'auto',
		left:'0dp',
		height:'auto',
		color : "#000",
		font : {fontSize : 16}
	};
	if(Ti.Platform.osname == "ipad")
	defaults.font = {fontSize : 28};
	applyDefaults(params , defaults);
	return Ti.UI.createLabel(params);
}
exports.createActivityIndicator = function(params) 
{
	params = params || {};

	var defaults = {
		height:50,
	    color: '#808080',
	    message: L('loading_message'),
	    width: 210
	};

	applyDefaults(params, defaults);
	var loading = Ti.UI.createActivityIndicator(params);
	return loading;
};
exports.createTextField = function(params)
{
	params = params || {};
	
	var defaults = {
		height:'40dp',
		width : '90%',
		top : '10dp',
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	}
	
	applyDefaults(params, defaults);
	var textField = Ti.UI.createTextField(params);
	return textField;
}

exports.createButton = function(params)
{
	params = params || {};
	
	var defaults = {
		width:"80%",
		height:"35dp",
	}
	if(Ti.Platform.osname == "ipad")
	defaults.height = '70dp';
	applyDefaults(params, defaults);
	var button = Ti.UI.createButton(params);
	return button;
}
exports.createScrollView = function(params) 
{
	params = params || {};

	var defaults = {
		contentWidth:'auto',
		contentHeight:'auto',
		top:'0dp',
		left:'0dp',
		showVerticalScrollIndicator:true,
		showHorizontalScrollIndicator:true
	};

	applyDefaults(params, defaults);
	var scrollView = Ti.UI.createScrollView(params);
	return scrollView;
};
exports.alertMessage = function(params)
{
	params = params || {};

	var defaults = {
		message: L('online_message'),
        buttonNames: ['OK']
	};

	applyDefaults(params, defaults);
	var msg = Ti.UI.createAlertDialog(params);
	return msg;
}
exports.androidDashboardButton = function(params)
{
	params = params || {};

	var defaults = {
		height: '70dp',
		width: '65dp',
		anchorPoint:{x:1.0,y:1.0},
	};

	applyDefaults(params, defaults);
	var button = Ti.UI.createButton(params);
	return button;
}
exports.androidButton = function(params)
{
	params = params || {};

	var defaults = {
		anchorPoint : {x:1.0,y:1.0},
		height : '34dp',
		width : '55dp',
		right : '5dp',
		color : '#fff',
		backgroundImage : '/images/nextbutton.png',
		font  : {fontSize:'10dp'},
	};

	applyDefaults(params, defaults);
	var button = Ti.UI.createButton(params);
	return button;
}
exports.createButtonBar = function(params)
{
	params = params || {};

	var defaults = {
		backgroundColor:'#808080',
		top : "10dp",
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : "30dp",
		width: '300dp',
	};
	if(Ti.Platform.osname == "ipad")
	{
		defaults.top  = '20dp';
		defaults.height  = '60dp';
		defaults.width  = '600dp';
	}
	applyDefaults(params, defaults);
	var button = Ti.UI.createButtonBar(params);
	return button;
}
exports.androidBadgeView = function(params) {
	params = params || {};
	
	var defaults = {
		height : '90dp',
		width : "90dp", 
		anchorPoint:{x:1.0,y:1.0}, 
		top : "135dp",
	};
	applyDefaults(params , defaults);
	return Ti.UI.createView(params);
}
exports.createCustomTabButton = function(params) {
	params = params || {};
	
	var defaults = {
		borderWidth : 1,
		height : '50dp',
		width : '106dp',
		borderColor : "#808080",
	};
	applyDefaults(params , defaults);
	return Ti.UI.createButton(params);
}
exports.createBackButton = function(params){
	params = params || {};
	
	var defaults = {
		height : "30dp",
		width : "60dp",
		backgroundImage : "/images/backButton.png"
	};
	applyDefaults(params , defaults);
	return Ti.UI.createButton(params);
}
exports.createDisplayMessage = function(params){
	params = params || {};
	
	var defaults = {
		height : "30dp",
		width : '90%',
		top : '50dp',
		borderRadius : 10,
		visible : false,
		backgroundColor : "#808080",
		textAlign : "center",
		color : "#fff",
		font:{fontSize:"14dp", fontWeight:'bold'},
	};
	if(Ti.Platform.osname == "ipad")
	{
		defaults.height = "60dp";
		defaults.font = {fontSize:"22dp", fontWeight:'bold'};
	}
	applyDefaults(params , defaults);
	return Ti.UI.createLabel(params);
}