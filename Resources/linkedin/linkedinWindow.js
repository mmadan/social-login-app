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
	linkedInButton.addEventListener('click', function() {

	});
	win.add(linkedInButton);

	return win;
}
