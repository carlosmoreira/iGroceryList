angular.module('starter.controllers', [])


    .controller('GroceriesCtrl', function ($scope, Chats, $http, $ionicPopup, $location, API_URL) {

        $scope.groceries = null;

        $scope.init = function () {
            $http.get(API_URL + '/groceryitem').then(function (groceries) {
                try {
                    $scope.groceries = groceries.data;
                } catch (error) {
                    alert(error);
                }
            });
        };

        $scope.placeInCart = function (grocery) {
            $http.put(API_URL + '/groceryitem/' + grocery.id, grocery)
                .then(function (response) {
                    $scope.init();
                })
        };

        $scope.hasInCart = function () {
            var total = 0;
            angular.forEach($scope.groceries, function (grocery) {
                //console.log(grocery);
                if (grocery.inCart)
                    total++;
            });
            return total > 0;
        };

        $scope.addNew = function (groceryName) {

            if (groceryName == undefined || groceryName == '') {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Error',
                    template: 'Grocery Item cannot be empty!'
                });
                return;
            }

            $http.post(API_URL + '/groceryitem', {'name': groceryName})
                .then(function (response) {
                    console.log(response);
                    if (response.data.Success){

                        $location.path('/');
                        $scope.init();
                    }

                });
        };

        $scope.finishShopping = function () {

            var inCart = $scope.groceries.filter(function (grocery) {
                grocery.bought = 1;
                return grocery.inCart;
            });

            $http.post( API_URL + '/groceryitem/buyCart', { 'cartItems' : inCart })
                .then(function (response) {
                    console.log(response);
                    if(response.data && response.data.Success){
                        $scope.init();
                    }
                })
        }

    });
