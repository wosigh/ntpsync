function MainAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

MainAssistant.prototype.setup = function() {

	var CookieData = AppAssistant.Cookie.get();
	var AutoSync = false;
	
	if (CookieData)
	{
		if (CookieData.AutoSync == true)
		{
			AutoSync = true;
		}
	}
	
	this.controller.setupWidget
	("auto-sync",
		this.attributes = {
			trueValue: true,
			falseValue: false 
		},
		this.model = {
			value: AutoSync,
			disabled: false
		}
	);
	
	this.menuAttr = {omitDefaultItems: true};
	
	this.menuModel = {
		visible: true,
		items: [
			{label: "Advanced...", command: 'do-advanced', disabled: true},
			Mojo.Menu.editItem,
			Mojo.Menu.prefsItem,
			Mojo.Menu.helpItem
    	]
	};
	
	this.controller.setupWidget(Mojo.Menu.appMenu, this.menuAttr, this.menuModel);
	
	Mojo.Event.listen(this.controller.get("auto-sync"), Mojo.Event.propertyChanged, this.handleOption.bind(this));
	
	
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

MainAssistant.prototype.handleOption = function(event)
{
	// this.controller.showBanner ("Triggered: " + event.value.toString(), { source: 'notification' });
	if (event.value == true)
	{
		AppAssistant.Cookie.put({"AutoSync": true });
		AppAssistant.scheduleSync(1);
	}
	else
	{
		AppAssistant.Cookie.put({"AutoSync": false });
	}
}

MainAssistant.prototype.handleCommand = function(event)
{
	if (event.type == Mojo.Event.command)
	{
		switch (event.command)
		{
			case 'do-advanced':
				AppAssistant.StageController.pushScene('advanced');
				break;
		}
	}
}