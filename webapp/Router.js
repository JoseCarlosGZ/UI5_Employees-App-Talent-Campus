//Para navegación entre vistas y para usar su método getRouter para lanzar la aplicación con .initialize()
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	
	return Controller.extend("com.accenture.employee2.Router", {
		
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		navBack: function(bIsFirstView, iJumpsNumber = -1) {
			window.history.go(iJumpsNumber);
		}
	});
});
