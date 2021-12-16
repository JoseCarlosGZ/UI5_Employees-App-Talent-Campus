sap.ui.define([
    "com/accenture/employee2/Router",
    "com/accenture/employee2/util/Constants",
    "com/accenture/employee2/util/Services",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Router, Constants, Services, Filter, FilterOperator) {
        "use strict";

        return Router.extend("com.accenture.employee2.controller.App", {

            onInit: function () {
                /*Inicializamos el bus creado en Component.js
                
                 PARÁMETROS de .subscribe(1,2,3):
                1) Constants.BUS          ⟶ Nombre del Bus al que se hace la llamada. El que hemos creado en Component.js
                2) "init"                 ⟶ nombre que le damos al bus una vez iniciado.
                3) this.handleInitRequest ⟶ función que se ejecuta una vez recibido el bus. La función handleInitRequest() definida
                más abajo crea los modelos de datos de la aplicación.
                */
                sap.ui.getCore().getEventBus().subscribe(Constants.BUS, "init", this.handleInitRequest, this);
            },


            //1) AL INICIALIZAR EL BUS SE SETEA EL MODELO DE DATOS DEL SERVICIO PADRE Y TAMBIÉN SUS ENTIDADES QUE NECESITEMOS
            handleInitRequest: function (oChannel, oEvent, oData) {
                this.createModels();
                this.callLoadData();
            },


            //1.1) SETEA EL MODELO DE DATOS DEL SERVICIO PADRE (el que se llama con el dataSources)
            createModels: function () {
                Services.setModel(this.getOwnerComponent().getModel(Constants.EMPLOYEE_MODEL));
                this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/newEmployee", {});
                /*Me creo al iniciar la App un nuevo empleado vacio donde guardaremos las propiedades que queremos modificar antes de guardarlo de nuevo
                ¿Si no le ponemos metemos el objeto vacio a la entidad?
                */
                this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/modifiedEmployee", {});
            },


            //1.2) INICILIZA LA APLICACIÓN MOSTRANDO LA VISTA PRINCIPAL
            initApp: function () {
                this.getRouter().initialize();
            },


            //1.3.1) METE EN EL OBJETO oData LA ENTIDAD Locations
            callServiceLocations: function (resolve, reject) {
                let fnSuccess = (oData) => {
                    /*La siguiente instrucción es para meter un objeto con las propiedades ID y city vacias. Los necesitamos en el
                     filtro de locations para que si se selecciona la opción "vacia" en el Select que controla el motor del filtro, 
                      no se filtre por ningún campo. Le ponemos sólo dos propiedades ID  y city al objeto inyectado en la 
                      primera posición del EntityLocations, porque son las propiedades necesarias en la etiqueta core del Select*/
                    oData.results.unshift({ID: "",city: ""});

                    resolve(oData);
                };
                let fnError = (oError) => {
                    reject(oError);
                };
                //Llama al getLocations() definido en Services.js
                Services.getLocations(fnSuccess, fnError);
            },


            //1.3.2) METE EN EL OBJETO oData LA ENTIDAD Categories
            callServiceCategories: function (resolve, reject) {
                let fnSuccess = (oData) => {
                    //Le inyectamos a la entidad 
                    oData.results.unshift({descr: "", ID: "", name: ""});
                    resolve(oData);
                };
                let fnError = (oError) => {
                    reject(oError);
                };
                //Llama al getCategories() definido en Services.js
                Services.getCategories(fnSuccess, fnError);
            },


            //1.4) OBTIENE EL ARRAY DE PROMESAS aPromises, GUARDANDO EN ESTA LAS ENTIDADES QUE ESTÁN EN SENDOS OBJETOS oDATA
            getPromises: function () {

                let aPromises = [];
                aPromises.push(new Promise((resolve, reject) => {
                    //Llama a callServiceLocations() 
                    this.callServiceLocations(resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    //Llama a callServiceCategories() 
                    this.callServiceCategories(resolve, reject);
                }));

                return aPromises;
            },


            //1.5) METE EN EL MODELO DE DATOS dataModel LAS ENTIDADES DEL SERVICIO PADRE NECESITADAS
            //Nota.Cada elemento del array aData contiene sendos objetos oData obtenidos en los métodos callServivesNombreEntidad
            setData: function (aData) {
                this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/EntityLocations", aData[0].results);
                this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/EntityCategories", aData[1].results);
            },


            //1.6) LLAMA a setData(1.5) QUE AÑADE AL dataModel LAS ENTIDADES DESEADAS. INICIALIZA LA APP
            callLoadData: function () {
                //llama a getPromises(1.4) 
                let aPromises = this.getPromises();
                //Si la llamada al servicio va bien nos devuelve el aData y se ejecuta el .then, si va mal se ejecuta el .catch
                Promise.all(aPromises).then((aData) => {
                    //Llama setData(1.5) y le mete como argumento el array
                    this.setData(aData);
                    //Iniciamos la aplicación
                    this.initApp();
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                });
            }









        });
    });
