(function () {
    angular.module('auction')
    .controller('LoginController', ['$scope', 'User', function ($scope, User) {
        $scope.username = '';

        $scope.login = function () {
            User.login($scope.username);
        };
    }]);
})();
