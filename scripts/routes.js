var route = angular.module('route', ['ngRoute']);

route.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html"
        })
        .when("/edit", {
            templateUrl: "templates/edit.html"
        })
        .when("/dashboard", {
            templateUrl: "templates/dashboard.html"
        })
        .otherwise({redirectTo :'/'});
});