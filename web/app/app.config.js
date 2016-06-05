(function () {
    angular.module('auction')
    .config(['$routeProvider',
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
    ])
    .run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
        $rootScope.$on('$routeChangeStart', function () {
            if (!$window.sessionStorage.session_token) {
                $location.path('/login');
            } else {
                $location.path('/');
            }
        });
    }]);
})();
