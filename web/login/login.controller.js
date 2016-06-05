(function () {
    angular.module('auction')
    .controller('LoginController', ['$window', '$location', '$scope', '$http', function ($window, $location, $scope, $http) {
        $scope.username = '';

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
})();
