//Creamos el BUS para pasar datos entre controladores. La funcion init de la API de SAPUI5 se ejecuta antes de todo al iniciar nuestra aplicación
sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/accenture/employee2/util/Constants"
], function (UIComponent, Constants) {
	"use strict";

	return UIComponent.extend("com.accenture.employee2.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            
            /*
            En la instrucción de abajo se usa el método getRouter() definido en Router.js para irnos a la primera vista de
             la aplicación, es decir, aquella vista definida en el apartado "routes" del manifest.json cuya propiedad pattern
             esté vacía "".
            */      
            // this.getRouter().initialize();


            //Enable routing
            /*Los buses se usan para pasar información entre controladores. Este BUS hay que inicializarlo en la función onInit()
            del App.controller.js*/
            sap.ui.getCore().getEventBus().publish(Constants.BUS, "init", {});//init es el nombre que le damos al BUS

		}
	});
});
