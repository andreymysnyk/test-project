(function () {
    angular.module('auction')
    .controller('AuctionController', ['$scope', 'User', function ($scope, User) {
        $scope.user = {};

        User.getUser().then(function(response) {
            $scope.user = response.data;
        });

        $scope.logout = function () {
            User.logout();
        };
    }]);
})();
