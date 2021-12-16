sap.ui.define([
    "com/accenture/employee2/Router",
    "com/accenture/employee2/util/Constants",
    "com/accenture/employee2/util/Services",
    "com/accenture/employee2/util/DataManager",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    function (Router, Constants, Services, DataManager, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Router.extend("com.accenture.employee2.controller.Main", {

            //La función onInit() que sólo se lanza la primera vez que se muestra la vista
            onInit: function () {
                //Llamamos a la función onMatchedRoute 
                this.getRouter().getRoute(Constants.MAIN_VIEW).attachMatched(this.onMatchedRoute, this);
            },

            /*Esta función se lanza cada vez que se muestra esta vista en el navegador, no es por lo tanto
            como la función onInit() que sólo se lanza la primera vez que se muestra la vista*/
            onMatchedRoute: function () {
                /*Llamamos a la función callServiceEmployee() que está definida en esta misma clase, por eso
                la podemos llamar haciendo uso del this. OJO, si estuviera definida en otra clase, tendríamos
                 que importarla primero en esta clase arriba en la matriz del sap.ui.define([, después meter
                 el nombre de dicha clase como parámetros en function(aquí) y por último la podríamos llamar 
                 aquí de este modo: NombreClaseImportada.nombreFuncionDeClaseImportada().   */
                this.callServiceEmployee();

            },


            callServiceEmployee: function () {

                //recuperamos del dataModel las entidades Locations y Categories que guardamos en el App.Controller
                let aLocations = this.getView().getModel(Constants.DATAMODEL).getProperty("/EntityLocations");
                let aCategories = this.getView().getModel(Constants.DATAMODEL).getProperty("/EntityCategories");

                Services.getEmployees().then((oData) => {
                    let aEmployees = oData.results;

                    /*llamamos a la funciones de DataManager y le enviamos por parámetros las entidades recuperadas arriba en forma de array.
                    Dicha función las manejas y nos devuelve las entidades con una propiedad adicional insertada*/
                    aEmployees = DataManager.add_LocationsName_CategoriesName(aEmployees, aLocations, aCategories);

                    /*Pasa los datos de la entidad Employees recuperados en el objeto oData a una propiedad (primer parámetro
                    de .setProperty() ) del modelo de datos creado en el manifest de nombre "dataModel" y por último envía a la
                    vista manejada por este controlador dicho modelo de datos*/
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/EntityEmployees", aEmployees);


                }).catch((oError) => {
                    console.log(oError);
                });
            },


            delayToast: function () {
                var delayInMilliseconds = 500;
                setTimeout(function () {
                    //Desde que se llame a la función, este código se ejecuta 1seg después
                    sap.m.MessageToast.show("The table has been updated", {
                        duration: 3000,
                        at: "center center"
                    });
                }, delayInMilliseconds);
            },

            //Deshace los filtros para que se vuelvan a mostrar todos los datos
            onPressRefreshTable: function () {
                try {
                    //Nos traemos la tabla de la vista
                    let oTable = this.getView().byId("tabla01");
                    //A partir de la tabla nos traemos todos los datos de las columnas de la tabla que están en el elemento items de la misma
                    let oBinding = oTable.getBinding("items");
                    /*Bindea el motor del filtro con los datos de la tabla*/
                    oBinding.filter([]);
                    /*
                    Los filtros del componente Select funcionan insertando (cuando se llame al método change="onSelectFilter") una nueva entidad 
                    al modelo llamada como se indica en el atributo del Select selectedKey="{dataModel>/selected_location}".
                    Esa nueva entidad sólo se usa temporalmente mientras dura la comparación del filtro con la entidad que se indica en el atributo 
                    items="{path: 'dataModel>/EntityLocations'}".
                    
                    Los campos por los que se filtra son los indicados en el elemento del select llamado core:
                    <core:Item key="{dataModel>ID}" text="{dataModel>city}" />

                    1ª forma de limpiar un filtro. Seleccionamos el Select que activa el filtro por un atributo id que habremos puesto en el xml del
                    Select. Y al 
                   this.getView().byId("slCategory").setSelectedKey("")
                    this.getView().byId("slLocation").setSelectedKey("")
                    Hace los mismo que la instrucción de arriba pero de distinto modo. Arriba le dice al componente que controla el motor del filtro,
                    es decir, Select, que no filtre por ningún campo. 
                    En las intrucciones de abajo:

                    1) A la propiedad selectedKey del Select ( selectedKey="{dataModel>/selected_location}" ) le asociamos la propiedad del modelo
                        que le especificamos al Select en su atributo items="{path: 'dataModel>/EntityLocations'}".

                    2) Y en la propiedad del modelo que le hemos asociado al Select (EntintyLocations en este caso), se irá guardando el contenido
                        de la etiqueta core, que siempre son el atritubo key (primary key) de la entidad guardada en el modelo sobre la que queremos filtrar
                        y el atributo text con la propiedad de la entidad sobre la que queremos filtrar. 
                    
                    3) En concreto en .setProperty("/selected_location", ""), de la forma que tenemos programado el componente Select, le está diciendo
                        al filtro que filtre toda la tabla por la propiedad ID de la entidad EntityLocations que este vacio. Como no existe ningún
                        registro/objeto de EntityLocations cuyo ID esté vacío, entonces no filtra. 

                    RESUMIENDO. El atributo selectedKey del componente Select va de la mano del atributo items que le indica sobre que entidad filtrar.
                    Los atributos Key y text del elemento core indican sobre que campos de la entidad se va a filtrar.
                    */
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/selected_location", "");
                    this.getView().getModel(Constants.DATAMODEL).setProperty("/selected_category", "");

                    this.callServiceEmployee();


                    //Le hacemos feedback al usuario indicándole que la tabla se ha actualizado
                    //Falta actualizar la tabla
                    this.delayToast();
                } catch (error) {
                }
            },

            /*Con esta instrucción se obtiene la propiedad Key del registro/objeto que hemos clickeado/seleccionado
            oEvent.getSource().getSelectedItem().getProperty("key");
            */
            onSelectChangeLocation: function (oEvent) {
                let bSelected = oEvent.getSource().getSelectedItem().getProperty("key");
                let oTable = this.getView().byId("tabla01");
                let oBinding = oTable.getBinding("items");
                // console.log(bSelected);
                oBinding.filter(
                    new Filter({
                        path: "location_ID",
                        variable: "Location",
                        operator: FilterOperator.EQ,
                        value1: bSelected
                    })
                );
            },

            onSelectChangeCategory: function (oEvent) {
                let bSelected = oEvent.getSource().getSelectedItem().getProperty("key");
                let oTable = this.getView().byId("tabla01");
                let oBinding = oTable.getBinding("items");
                // console.log(bSelected);
                oBinding.filter(
                    new Filter({
                        path: "category_ID",
                        variable: "Category",
                        operator: FilterOperator.EQ,
                        value1: bSelected /*Valor por el que se filtra que se indic en el atributo text de la etiqueta core */
                    })
                );
            },


            onSelectFilter: function () {
                let oTable = this.getView().byId("tabla01");
                let oBinding = oTable.getBinding("items");
                let sSeletedKey_location = this.getView().getModel(Constants.DATAMODEL).getProperty("/selected_location");
                let sSeletedKey_category = this.getView().getModel(Constants.DATAMODEL).getProperty("/selected_category");
                let aFilters = [];

                /*La entidad /selected_location existirá sólo si se selecciona algunad de las opciones del combobox del Select*/
                if (!!sSeletedKey_location) {
                    aFilters.push(
                        new Filter({
                            path: "location_ID", /*Este nombre es interno del filtro y da igual cual le demo */
                            variable: "location", /*Este nombre es interno del filtro y da igual cual le demo */
                            operator: FilterOperator.EQ,
                            value1: sSeletedKey_location
                        })
                    )
                }
                if (!!sSeletedKey_category) {
                    aFilters.push(
                        new Filter({
                            path: "category_ID",
                            variable: "Category",
                            operator: FilterOperator.EQ,
                            value1: sSeletedKey_category /*Valor por el que se filtra que se indica en el atributo text de la etiqueta core */
                        })
                    )
                }

                //Crea un filtro único con todos los filtros que hemos creado anteriormente, porque oBinding solo acepta un filtro, por eso hay que unirlos
                let allFilter = new sap.ui.model.Filter(aFilters, true);
                //Aplicamos el allFilter a los items
                oBinding.filter(allFilter);
            },



            //Abre el fragmento de insertar nuevo empleado
            onPressShowFragmentAddEmployee: function () {
                this.showFragmentAddEmployee().open();
            },



            //Abre el fragmento de modificar un empleado existente
            //oEvent recupera el componente sobre la que se ha hecho el click
            onPressShowFragmentModifyEmployee: function (oEvent) {
                //let oModifiedEmployee = oEvent.getSource();
                let sPath = oEvent.getSource().getBindingContext("dataModel").getPath();
                let oModifiedEmployee = this.getView().getModel(Constants.DATAMODEL).getProperty(sPath);
                /*LE METEMOS AL MODELO UNA ENTIDAD VACIA CON EL MISMO NOMBRE QUEE HEMOS ESPECIFICADO EN EL FRAGMENTO, 
                 Y A ESA ENTIDAD LE METEMOS UN OBJETO CON LAS PROPIEDADES RECUPERADAS DEL FRAGMENTO*/
                this.getView().getModel(Constants.DATAMODEL).setProperty("/modifiedEmployee", oModifiedEmployee);
                this.showFragmentModifyEmployee().open();
            },



            //Crea y muestra el fragmento de insertar nuevo empleado
            showFragmentAddEmployee: function () {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.accenture.employee2.fragment.addEmployee", this);
                    this.getView().addDependent(this._oDialog);
                }
                return this._oDialog;
            },


            showFragmentConfirmRemoveEmployee: function () {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.accenture.employee2.fragment.confirmRemove", this);
                    this.getView().addDependent(this._oDialog);
                }
                return this._oDialog;
            },



            //Crea y muestra el fragmento de modificar empleado existente
            showFragmentModifyEmployee: function () {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.accenture.employee2.fragment.modifyEmployee", this);
                    this.getView().addDependent(this._oDialog);
                }
                return this._oDialog;
            },



            onCancelFragmentAddEmployee: function () {
                this.oncloseDialog();
            },

            onCancelFragmentConfirmRemove: function () {
                this.oncloseDialog();
            },


            onCancelFragmentModifyEmployee: function () {
              this.oncloseDialog();
            },

            oncloseDialog: function() {
                this._oDialog.close();
                this._oDialog.destroy();
                delete this._oDialog;

            },

            onSaveEmployee: function () {

                let aEmployee = this.getView().getModel(Constants.DATAMODEL).getProperty("/EntityEmployees");
                let oNewEmployee = this.getView().getModel(Constants.DATAMODEL).getProperty("/newEmployee");

                oNewEmployee = DataManager.createEmployee(aEmployee, oNewEmployee);
                this.callServiceNewEmployee(oNewEmployee);

                //Cuando se ha realizado la inserción, cerramos el cuadro de diálogo
               this.oncloseDialog();
            },



            onUpdateEmployee: function () {
                //En este punto, se recogen los valores de la entidad modifiedEmployee que sólo contiene un objeto ¿por eso lo recuperamos así?
                let oModifiedEmployee = this.getView().getModel(Constants.DATAMODEL).getProperty("/modifiedEmployee");
                let sID = oModifiedEmployee.ID;
                oModifiedEmployee = DataManager.updateEmployee(oModifiedEmployee);
                this.callServiceUpdateEmployee(oModifiedEmployee, sID);
            },

            onDeleteEmployee: function (oEvent) {
                //En este punto, se recogen los valores de la entidad modifiedEmployee
                let sPath = oEvent.getSource().getBindingContext("dataModel").getPath();
                let oModifiedEmployee = this.getView().getModel(Constants.DATAMODEL).getProperty(sPath);
                this.getView().getModel(Constants.DATAMODEL).setProperty("/removeID", oModifiedEmployee.ID);

                this.showFragmentConfirmRemoveEmployee().open();
            },


            onConfirmRemove: function () {
                let sID = this.getView().getModel(Constants.DATAMODEL).getProperty("/removeID");
                this.callServiceDeleteEmployee(sID);

            },


            callServiceNewEmployee: function (oNewEmployee) {
                Services.insertNewEmployee(oNewEmployee).then((oData) => {

                }).catch((oError) => {
                    console.log(oError);
                });
            },


            callServiceUpdateEmployee: function (oModifiedEmployee, sID) {
                /*bloqueda la app hasta que se complete la funcionalidad del servicio, ya que como
                 Como las llamadas a servicios se ejecutan de forma asíncrona, hata que no de respuesta
                  no se va a poder hacer otra cosa en el aplicación*/
                sap.ui.core.BusyIndicator.show();
                Services.updateEmployee(oModifiedEmployee, sID).then((oData) => {
                    //Aqui llega el flujo del programa si el servicio se ha lanzado correctamente.Cuando se ha realizado la inserción, cerramos el cuadro de diálogo
                     this.oncloseDialog();
                    sap.ui.core.BusyIndicator.hide();
                    //llamamos al servicio y refresca datos tabla
                    this.callServiceEmployee();
                }).catch((oError) => {
                    console.log(oError);
                    sap.ui.core.BusyIndicator.hide();
                });
            },

            callServiceDeleteEmployee: function (sID) {
                //bloqueda la app hasta que se complete la funcionalidad del servicio
                sap.ui.core.BusyIndicator.show();
                Services.deleteEmployee(sID).then((oData) => {
                   this.oncloseDialog();
                    sap.ui.core.BusyIndicator.hide();
                    //llamamos al servicio y refresca datos tabla
                    this.callServiceEmployee();
                }).catch((oError) => {
                    console.log(oError);
                    sap.ui.core.BusyIndicator.hide();
                });
            },


            onPressNavToEmployeeProfile: function (oEvent) {
                let sPath = oEvent.getSource().getBindingContext("dataModel").getPath();
                let oModifiedEmployee = this.getView().getModel(Constants.DATAMODEL).getProperty(sPath);
                this.getView().getModel(Constants.DATAMODEL).setProperty("/DetailEmployee", oModifiedEmployee);

                this.getRouter().navTo("EmployeeProfile");

            }




        });//function (clases importadas)
    });//sap.ui.define ()
