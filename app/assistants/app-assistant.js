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
	if (launchParams.source == "alarm")
		var sync = AppAssistant.syncClock(false, true);
	else if (launchParams.source == "notification")
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
	else
		var sync = AppAssistant.syncClock(true, false);		
}

AppAssistant.syncClock = function (showBanner, setTimer)
{
	if (setTimer)
	{
		var CookieData = this.Cookie.get();
	
		if (CookieData)
		{
			if (CookieData.AutoSync == true)
			{
				this.scheduleSync(8);
			}
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
			onSuccess: this.syncOK.bind(this, showBanner),
			onFailure: this.syncFail.bind(this)
		}
	);
}

AppAssistant.syncOK = function (showBanner)
{
	if (showBanner == true)
	{
		this.controller = Mojo.Controller.getAppController();
		this.controller.showBanner("Device clock synchronized", { source: 'notification' });
		this.controller.playSoundNotification("vibrate", "",1);
		Mojo.Log.info("Manual sync");
	}
	else
		Mojo.Log.info("Background sync");
}

AppAssistant.syncFail = function (response)
{
	Mojo.Controller.getAppController().showBanner("Synchronization failed", { source: 'notification' });
	if (response)
		Mojo.Log.error(response.returnValue, response.errorText);
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
				"in": "00:10:00",
				"wakeup": false,
				"uri": "palm://com.palm.applicationManager/open",
				"params": '{"id":"com.webosnerd.ntpsync","params":{"source":"alarm"}}'
			}
		}
	);
	Mojo.Log.info("Scheduled sync");
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
	Mojo.Log.info("Cleared sync timer");
}
