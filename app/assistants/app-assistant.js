// Author: webosnerd.com
// License: GNU GPL version 3 (see LICENSE file)
// Contact: karl@webosnerd.com
// Copyright 2010

var ServiceID = 'palm://org.webosinternals.upstartmgr';

function AppAssistant (appController)
{
}

AppAssistant.prototype.handleLaunch = function (launchParams)
{	
	if (launchParams.source != "notification")
		var sync = AppAssistant.syncClock();
};

AppAssistant.syncClock = function ()
{
	var syncRequest = new Mojo.Service.Request
	(
		ServiceID,
		{
			method: 'start',
			parameters:
			{
				'id': 'com.webosnerd.ntpsync'
			},
			onSuccess: this.syncOK.bindAsEventListener(this),
			onFailure: this.syncFail.bindAsEventListener(this)
		}
	);
}

AppAssistant.syncOK = function ()
{
	this.controller = Mojo.Controller.getAppController();
	this.controller.showBanner("Device clock synchronized", { source: 'notification' });
	this.controller.playSoundNotification("vibrate", "",1)
}

AppAssistant.syncFail = function ()
{
	Mojo.Controller.getAppController().showBanner("Synchronization failed", { source: 'notification' });
}
