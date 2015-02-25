function onDeviceReady() { 
	StatusBar.overlaysWebView(true);

	cordova.getAppVersion(function(version) {
		alert(version);
	});
}