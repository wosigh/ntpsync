// Author: webosnerd.com
// License: GNU GPL version 3 (see LICENSE file)
// Contact: karl@webosnerd.com
// Copyright 2010

var ServiceID = 'palm://org.webosinternals.upstartmgr';
var StageName = 'mainstage';

function AppAssistant (appController)
{
}

AppAssistant.StageController = null;

AppAssistant.Cookie = new Mojo.Model.Cookie("SyncPrefs");

AppAssistant.prototype.handleLaunch = function (launchParams)
{
	this.controller = Mojo.Controller.getAppController();	
	if (launchParams.source != "notification")
		var sync = AppAssistant.syncClock();
	else
	{
		// Determine if the stage is already present
		var stageProxy = this.controller.getStageProxy(StageName);
		var stageController = this.controller.getStageController(StageName);
	
		// If it is present, open and focus the stage
	
		if (stageProxy)
		{
			if (stageController)
			{
				stageController.window.focus();
			}
		}
		// Otherwise, create the stage and show it
		else
		{
			var pushMainScene = function(stageController)
			{
				stageController.pushScene("main");
				AppAssistant.StageController = stageController;
			};
		
			var stageArguments = {name: "StageName", lightweight: true};
			
			Mojo.Controller.getAppController().createStageWithCallback(stageArguments, pushMainScene, "card");
		}
	}
}

AppAssistant.syncClock = function ()
{
	var CookieData = this.Cookie.get();
	
	if (CookieData)
	{
		if (CookieData.AutoSync == true)
		{
			this.scheduleSync(1);
		}
	}
	
	this.syncReq = new Mojo.Service.Request
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

AppAssistant.scheduleSync = function (interval)
{
	this.schedReq = new Mojo.Service.Request
	(
		'palm://com.palm.power/timeout',
		{
			method: "set",
			parameters:
			{
				"key": "com.webosnerd.ntpsync.sync",
				"in": "08:00:00",
				"wakeup": true,
				"uri": "palm://com.palm.applicationManager/open",
				"params": '{"id":"com.webosnerd.ntpsync","params":{"source":"none"}}'
			}
		}
	);
}

AppAssistant.clearSync = function ()
{
	this.clearReq = new Mojo.Service.Request
	(
		'palm://com.palm.power/timeout',
		{
			method: "clear",
			parameters: {"key": "com.webosnerd.ntpsync.sync"}
		}
	);
}
