(function () {
    angular.module('auction')
    .controller('AuctionController', ['$window', '$location', '$scope', '$http', function ($window, $location, $scope, $http) {
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
})();
