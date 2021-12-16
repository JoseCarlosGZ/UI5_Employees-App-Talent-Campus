//En este se usa para tratar datos, modificacion datos...
sap.ui.define([
     "com/accenture/employee2/util/Constants"
], function(Constants) {
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
		setLocationName: function(aEmployees, aLocations) {
			aEmployees.forEach(oEmployee => {
                let oFindLocation = aLocations.find(oLocation => {
                                        return oLocation.ID === oEmployee.location_ID
                                    } );
                //Si existe la localizacion pone el .name, sino el ""
                //variable = condición  THEN  valor1  ELSE  valor 2
                //variable = condición   ?    valor1   :    valor 2
                //El operador !! es una doble negación, es decir, anexo a una variable, si esta existe, deuelve true y si no false
                oEmployee.Locations_name_Added_in_DataManager =  !!oFindLocation ? oFindLocation.name : "∄ Locations.ID for this \n Employee.location_ID";
            });

            return aEmployees;
        },
        

		setCategoryName: function(aEmployees, aCategories) {
			aEmployees.forEach(oEmployee => {
                let oFindLocation = aCategories.find(oCategory => {
                    return oCategory.ID === oEmployee.category_ID

                } );
                

                oEmployee.Categories_name_Added_in_DataManager =  !!oFindLocation ? oFindLocation.name : "∄ Categories.ID for this \n Employee.location_ID";
            });

            return aEmployees;
        }

	};
});
