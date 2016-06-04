(function () {
    var app = angular.module('auction', ['ngRoute']);

    app.config(['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'auction/auction.view.html',
                controller: 'AuctionController'
            }).
            when('/login', {
                templateUrl: 'login/login.view.html',
                controller: 'LoginController'
            }).
            otherwise('/login');
        }
    ]);

    app.controller('LoginController', ['$window', '$location', '$scope', '$http', function ($window, $location, $scope, $http) {
        $scope.username = '';

        //submit
        $scope.login = function () {
            $http.post('/user/login', {username: $scope.username}).then(
                function(response) {
                    $window.sessionStorage.session_token = response.data;
                    $location.path('/');
                }, function (response) {
                    console.log(response);
            });
        };
    }]);

    app.controller('AuctionController', ['$window', '$location', '$scope', '$http', function ($window, $location, $scope, $http) {
        $scope.logout = function () {
            $http.post('/user/logout', {session_token: $window.sessionStorage.session_token}).then(
                function(response) {
                    delete $window.sessionStorage.session_token;

                    $location.path('/login');
                }, function (response) {
                    console.log(response);
            });
        };
    }]);

    app.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
        $rootScope.$on('$routeChangeStart', function () {
            if (!$window.sessionStorage.session_token) {
                $location.path('/login');
            } else {
                $location.path('/');
            }
        });
    }]);

    app.directive('initCanvas', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var canvasEl = element[0].getElementsByTagName('canvas')[0];

                $timeout(function() {
                    drawTemp(canvasEl, isDay(scope.item), scope.item.temp_left, scope.item.temp_right);
                    element[0].className += " load";
                }, 80 * scope.$index)
            }
        }
    });
})();
