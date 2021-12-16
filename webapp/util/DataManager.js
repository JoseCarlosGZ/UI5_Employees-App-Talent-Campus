//En este se usa para tratar datos, modificacion datos...
sap.ui.define([
    "com/accenture/employee2/util/Constants"
], function (Constants) {
    "use strict";
    return {
        /*
        Nota. Una entidad como Locations viene a ser una tabla pero aquí la tratamos con un array de objetos. 
        Cada uno de los objetos de esa entidad (de ese array) serán los distintos registros de la tabla.
        
        Para añadir una nueva propiedad/columna a un objeto/registro de una Entidad/Tabla, no tenemos más que:
                             objeto_de_entidad.Nombre_Propiedad_a_Insertar = valor
        */



        /* Le pasamos por parámetro la entidad Employees y la entidad Locations y para cada objeto de Employees
        busca en la entidad Locations su primer objeto cuya primary key ID sea igual a la propiedad/columna 
        location_ID del objeto de Employees que este selecionado actualmente en el foreach.
        
        En cada ciclo del foreach si la comparación ha sido exitosa el objeto oFindLocation tendrá dentro 
        el objeto de la entidad Locations cuyo ID es igual al location_ID del objeto actual de Employees,
        pero si no se ha encontrado ninguna ocurrencia entonces el objeto oFindLocation estará a null
        
        Si el oFindLocation no es null, le INSERTAMOS al objeto actual de Employees (en que se encuentre
        seleccionado por el foreach) una propiedad nueva con el mismo valor que la propiedad que queramos
        del objeto actualmente seleccionado de Locations (en este caso hemos escogido .name pero podísmos
        haber escogido cualquier otra).
        Sino, si el oFindLocation es null, entonces le pasamos una String vacia "", ya que no se pueden pintar
        en una tabla propiedades con valor null pero si String vacias*/
        add_LocationsName_CategoriesName: function (aEmployees, aLocations, aCategories) {

            aEmployees.forEach(oEmployee => {
                /*Me encuentra el registro de la entidad Locations cuyo Primary Key es igual al campo location_ID del 
                registro de Employees seleccionado en el paso de bucle actual*/
                let oFindLocation = aLocations.find(oLocation => {
                    return oLocation.ID === oEmployee.location_ID
                });

                let oFindCategory = aCategories.find(oCategory => {
                    return oCategory.ID === oEmployee.category_ID
                });

                //Si existe la localizacion pone el .name, sino el ""
                //variable = condición  THEN  valor1  ELSE  valor 2
                //variable = condición   ?    valor1   :    valor 2
                //El operador !! es una doble negación, es decir, anexo a una variable, si esta existe, deuelve true y si no false
                oEmployee.Locations_name_Added_in_DataManager = !!oFindLocation ? oFindLocation.name : "";
                oEmployee.Categories_name_Added_in_DataManager = !!oFindCategory ? oFindCategory.name : "";
            });

            return aEmployees;
        },

        createEmployee: function (aEmployee, oNewEmployee) {

            //Guardamo el ID de empleados mayor + 1
            let higherID_in_EntityEmployees = this.getLastId(aEmployee);

            return {
                // createdAt: "2021-10-28T09:46:12.835Z",
                // createdBy: "admin",
                // modifiedAt: "2021-11-08T08:23:02.731Z",
                // modifiedBy: "admin",
                // ID: higherID_in_EntityEmployees,
                employee_name: oNewEmployee.employee_name,
                employee_salary: oNewEmployee.employee_location,
                employee_age: oNewEmployee.age,
                profile_image: oNewEmployee.employee_photo,
                location_ID: oNewEmployee.employee_location,
                category_ID: oNewEmployee.employee_category
            }
        },

        //Le mandamos por parámetro el array de empleados, busca el ID más alto y lo devuelve sumandole 1.
        getLastId: function (aEmployee) {
            //Ordena el array de mayor a menor
            aEmployee = aEmployee.sort((a, b) => { return b.ID - a.ID });
            //Devolvemos el ID mayor + 1
            return aEmployee[0].ID + 1;

        },

        //El Id en un update se envian en la llamda al servicio
        updateEmployee: function (oModifiedEmployee) {
            return {
                createdAt: "2021-10-28T09:46:12.835Z",
                createdBy: "admin",
                modifiedAt: "2021-11-08T08:23:02.731Z",
                modifiedBy: "admin",
                employee_name: oModifiedEmployee.employee_name,
                employee_salary: parseFloat(oModifiedEmployee.location_ID),
                employee_age: parseInt(oModifiedEmployee.employee_age),
                profile_image: oModifiedEmployee.profile_image,
                location_ID: oModifiedEmployee.location_ID,
                category_ID: oModifiedEmployee.category_ID
            }
        }


    };
});
