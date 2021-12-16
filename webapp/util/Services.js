//Este fichero lo usamos para llamar a los servicios y obtener los datos o mandarselos
sap.ui.define("com.accenture.employee2.util.Services", [
],
    function () {
        'use strict';

        return {

            //Setear el modelo de datos, es traerse al contexto del core de la aplicación el metadata del sevicio raiz llamado con el dataSources en el manifest.
            setModel: function (oModel) {
                this.oModel = oModel;
            },

            //Para coger el modelo que hemos referenciado con el setModel
            getModel: function () {
                return this.oModel;
            },

            /*Con esta función vamos a recibir los datos de la entidad Employees que está dentro del servicio
            cuya raíz es employee.
            Si la petición GET alservidor es exitosa, entonces recibiremos los datos en el objeto oData, sino
            recibiremos un mensaje de error que se guardará en el objeto oError*/
            getEmployees: function () {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        },
                        urlParameters: {
                        "$expand": "location",
                        }

                    };
                    this.getModel().read("/Employees", oServiceInfo);//read("Ruta_entidad_a_atacar", objeto dond se guardará la respuesta)
                });
            },


            getLocations: function (fnSuccess, fnError) {
                let oServiceInfo = {
                    success: (oData) => {
                        if (fnSuccess) {
                            fnSuccess(oData);
                        }
                    },
                    error: (oError) => {
                        if (fnError) {
                            fnError(oError);
                        }
                    }
                };
                this.getModel().read("/Locations", oServiceInfo);
            },


            getCategories: function (fnSuccess, fnError) {
                let oServiceInfo = {
                    success: (oData) => {
                        if (fnSuccess) {
                            fnSuccess(oData);
                        }
                    },
                    error: (oError) => {
                        if (fnError) {
                            fnError(oError);
                        }
                    }
                };
                this.getModel().read("/Categories", oServiceInfo);
            },



            insertNewEmployee: function (oNewEmployee) {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
                    this.getModel().create("/Employees", oNewEmployee, oServiceInfo);
                });
            },
            
            
            updateEmployee: function (oModifiedEmployee, sID) {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
                    //1º parametro = objeto que queremos modificar, indicado du ID
                    //2º parametro = objeto que queremos guardar en esa posición
                    this.getModel().update("/Employees(ID="  + parseInt(sID) + ")", oModifiedEmployee, oServiceInfo);
                });
            },
            
            deleteEmployee: function (sID) {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
                    this.getModel().remove("/Employees(ID="  + sID + ")",oServiceInfo);
                });
            },

            getEmployeeDetails: function () {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
                    this.getModel().read("/Employees", oServiceInfo);//read("Ruta_entidad_a_atacar", objeto dond se guardará la respuesta)
                });
            }


        };//return 
    }, true);
