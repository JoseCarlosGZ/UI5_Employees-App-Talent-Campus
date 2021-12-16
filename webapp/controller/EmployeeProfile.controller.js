sap.ui.define([
    "com/accenture/employee2/Router",
    "com/accenture/employee2/util/Constants",
    "com/accenture/employee2/util/Services",
    "com/accenture/employee2/util/DataManager",

],
    function (Router, Constants, Services, DataManager) {
        "use strict";

        return Router.extend("com.accenture.employee2.controller.EmployeeProfile", {

        
            onInit: function () {
                 this.getRouter().getRoute("EmployeeProfile").attachMatched(this.onMatchedRoute, this);
              
            },
            
            onMatchedRoute: function() {
                
            },

            onPressGoMain: function() {
                this.navBack();
            }



    
          
            
            





        });//function (clases importadas)
    });//sap.ui.define ()
