var route = angular.module('route', ['ngRoute']);

route.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            controller: 'loginCtrl'
        })
        .when("/edit", {
            templateUrl: "templates/edit.html",
            controller: 'editCtrl'
        })
        .when("/dashboard", {
            templateUrl: "templates/dashboard.html",
            controller: 'dashboardCtrl'
        })
        .otherwise({redirectTo :'/'});
});