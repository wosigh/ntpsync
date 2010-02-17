function MainAssistant() {
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
	
}

MainAssistant.prototype.handleOption = function(event)
{
	if (event.value == true)
	{
		AppAssistant.Cookie.put({"AutoSync": true });
		AppAssistant.scheduleSync(1);
	}
	else
	{
		AppAssistant.Cookie.put({"AutoSync": false });
		AppAssistant.clearSync();
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