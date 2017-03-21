angular.module('inventory')
    .service('app', function ($location, $http, appConfig) {
        var controller = this;
        controller.alertTitle = "Alert";
        controller.alertMessage = "Load Failed";
        controller.alertButton = "OK";
        controller.showAlert = false;

        controller.setAlertMessage = function (title, message, button) {
            controller.alertTitle = title;
            controller.alertMessage = message;
            controller.alertButton = button;
        };

    });