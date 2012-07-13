exports.createSpinner = function(){
	
	var view = Ti.UI.createView({
		visible : false,
		opacity:0.9,
		height: '100%',
		width: '100%',
		backgroundColor : '#000'
	});
	
	var box = Ti.UI.createView({
		backgroundColor:'black',
		borderRadius : 10,
		opacity:0.6,
		borderWidth : 1,
		borderColor : '#fff',
		width : '260dp',
		height: "80dp"
	});
	
	var spinner = Ti.UI.createActivityIndicator({
		style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
		message : 'Authorizing..',
		color : '#fff',
	});
	
	view.add(box);
	view.add( spinner );
	
	view.start = function( message ){
		message = 'Loading....';
		view.visible = true;
		spinner.message = message;
		spinner.show();
	}
	
	view.stop = function(){
		spinner.hide();
		view.visible = false;
	}
	
	return view;
};
