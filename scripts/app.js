angular.module('inventory',['route'])
.controller('inventoryCtrl', function ($scope, $location, $http, appConfig) {
    //Controller Code
    $scope.redirectTo = function (link) {
        $location.path(link);
    };

})
    .controller('loginCtrl', function ($scope, $http, $location, appConfig) {
        $scope.user = '';
        $scope.pass = '';

        $scope.signIn = function () {
            $http.post('login.php', {
                headers: {
                    "Content-Type": "application/json"
                },
                "user": $scope.user,
                "pass": $scope.pass
            })
                .then(function (data) {
                    // console.log(data);
                    if(data.data == "1")
                        $location.path('/dashboard');
                });
        }
    })
    .controller('editCtrl', function ($scope, $http, $location) {
        $scope.expense = {
            date : null,
            tag: '',
            amount: 0
        };
        $scope.income = {
            date : null,
            tag: '',
            amount: 0
        };
        $scope.addExpense = function () {
            var date = new Date($scope.expense.date);
            // console.log('Date : ' + date);
            // console.log('Date : ' + date.getDate());
            // console.log('Date : ' + (date.getMonth() + 1));
            // console.log('Date : ' + date.getFullYear());
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
        };
        $scope.addIncome = function () {
            var date = new Date($scope.income.date);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
        };
    });