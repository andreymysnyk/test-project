(function () {
    angular.module('auction')
    .controller('AuctionController', ['$scope', 'User', 'ngDialog', function ($scope, User, ngDialog) {
        $scope.user = {};
        $scope.items = [];

        User.getUser().then(function(response) {
            $scope.user = response.data;
        });

        User.getItems().then(function(response) {
            $scope.items = response.data;
        });

        $scope.logout = function () {
            User.logout();
        };

        $scope.showAuctionDialog = function () {
            ngDialog.open({ template: 'items/startAuction.html', className: 'ngdialog-theme-plain' });
        }
    }]);
})();
