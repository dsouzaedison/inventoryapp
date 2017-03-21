angular.module('inventory', ['route'])
    .controller('inventoryCtrl', function ($scope, $location, $http, appConfig) {
        //Controller Code
        $scope.redirectTo = function (link) {
            $location.path(link);
        };

        $scope.showSpinner = function () {
            return appConfig.spinner;
        };
    })
    .controller('loginCtrl', function ($scope, $http, $location, appConfig) {
        $scope.user = '';
        $scope.pass = '';

        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
        } else {
            alert('No Storage Support!');
        }

        if (localStorage.getItem("loggedIn"))
            if (localStorage.loggedIn == 'true')
                $location.path('/dashboard');

        $scope.signIn = function () {
            appConfig.spinner = true;
            $http.post('login.php', {
                headers: {
                    "Content-Type": "application/json"
                },
                "user": $scope.user,
                "pass": $scope.pass
            })
                .then(function (data) {
                    // console.log(data);
                    if (data.data == "1") {
                        localStorage.setItem("loggedIn", 'true');
                        $location.path('/dashboard');
                    }

                    appConfig.spinner = false;
                });
        }
    })
    .controller('editCtrl', function ($scope, $http, $location, appConfig) {
        $scope.expense = {
            date: null,
            tag: '',
            amount: null
        };
        $scope.income = {
            date: null,
            tag: '',
            amount: null
        };
        $scope.addExpense = function () {
            appConfig.spinner = true;
            var date = new Date($scope.expense.date);
            // console.log('Date : ' + date);
            // console.log('Date : ' + date.getDate());
            // console.log('Date : ' + (date.getMonth() + 1));
            // console.log('Date : ' + date.getFullYear());
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            $http.post('add_data.php', {
                "type": 0,
                "name": $scope.expense.tag,
                "amount": $scope.expense.amount,
                "day": day,
                "month": month,
                "year": year
            })
                .then(function (expenseRes) {
                    if (expenseRes.data != 0) {
                        $scope.expense.data = null;
                        $scope.expense.tag = '';
                        $scope.expense.amount = null;
                    }
                    appConfig.spinner = false;
                });
        };

        $scope.addIncome = function () {
            appConfig.spinner = true;
            var date = new Date($scope.income.date);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            $http.post('add_data.php', {
                "type": 1,
                "name": $scope.income.tag,
                "amount": $scope.income.amount,
                "day": day,
                "month": month,
                "year": year
            })
                .then(function (incomeRes) {
                    if (incomeRes.data != 0) {
                        $scope.income.data = null;
                        $scope.income.tag = '';
                        $scope.income.amount = null;
                    }
                    appConfig.spinner = false;
                });
        };

        $scope.redirectTo = function (link) {
            $location.path(link);
        };

        $scope.logout = function () {
            localStorage.setItem("loggedIn", false);
            $scope.redirectTo('/');
        };
    })
    .controller('dashboardCtrl', function ($scope, $http, appConfig) {
        $scope.currentExpense = 0;
        $scope.currentIncome = 0;
        $scope.total = 0;
        $scope.showPromptVal = false;
        $scope.deleteId = null;
        $scope.currentDay = 'Today';

        var date = new Date();
        $scope.today = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };

        $http.get('get_data.php?day=' + $scope.today.day + '&month=' + $scope.today.month + '&year=' + $scope.today.year)
            .then(function (dataResponse) {
                // console.log(JSON.stringify(dataResponse.data));
                $scope.data = dataResponse.data;
                $scope.data.forEach(function (item) {
                    if (item.type == 0)
                        $scope.currentExpense += parseInt(item.amount);
                    else $scope.currentIncome += parseInt(item.amount);
                });
            });

        $http.get('get_total_amount.php')
            .then(function (totalResponse) {
                // console.log(JSON.stringify(dataResponse.data));
                $scope.total = totalResponse.data;
            });

        $scope.showPrompt = function (flag, id) {
            if (flag) {
                $scope.showPromptVal = true;
                $scope.deleteId = id;
            }
            else if (flag == false)
                $scope.showPromptVal = false;
            else return $scope.showPromptVal;
        };

        $scope.deleteRow = function () {
            appConfig.spinner = true;
            $scope.showPromptVal = false;

            $http.get('delete-info.php?id=' + $scope.deleteId)
                .then(function (deleteResult) {
                    if (deleteResult.data > -1) {
                        var index = $scope.data.map(function (x) {
                            return x.id;
                        }).indexOf(deleteResult.id);
                        $scope.data.splice(index, 1);

                        $scope.currentExpense = 0;
                        $scope.currentIncome = 0;

                        $scope.data.forEach(function (item) {
                            if (item.type == 0)
                                $scope.currentExpense += parseInt(item.amount);
                            else $scope.currentIncome += parseInt(item.amount);
                        });

                        $http.get('get_total_amount.php')
                            .then(function (totalResponse) {
                                // console.log(JSON.stringify(dataResponse.data));
                                $scope.total = totalResponse.data;
                                appConfig.spinner = false;
                            });
                    }
                });
        };

        $scope.getNewInfo = function () {
            appConfig.spinner = true;
            document.getElementById("newDate").valueAsDate = null;

            var newDate = new Date($scope.newDate);
            $scope.newDate = {
                day: newDate.getDate(),
                month: newDate.getMonth() + 1,
                year: newDate.getFullYear()
            };

            if (isNaN($scope.newDate.day) || isNaN($scope.newDate.month) || isNaN($scope.newDate.year)) {
                var date = new Date();
                $scope.newDate = {
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                };
                $scope.currentDay = 'Today';
            } else
                $scope.currentDay = (($scope.newDate.day < 10) ? '0' : '') + $scope.newDate.day + '/' + (($scope.newDate.month < 10) ? '0' : '') + $scope.newDate.month + '/' + $scope.newDate.year;


            $http.get('get_data.php?day=' + $scope.newDate.day + '&month=' + $scope.newDate.month + '&year=' + $scope.newDate.year)
                .then(function (dataResponse) {
                    $scope.currentExpense = 0;
                    $scope.currentIncome = 0;
                    $scope.data = dataResponse.data;
                    $scope.data.forEach(function (item) {
                        if (item.type == 0)
                            $scope.currentExpense += parseInt(item.amount);
                        else $scope.currentIncome += parseInt(item.amount);
                    });
                    appConfig.spinner = false;
                });
        };
    });