(function () {
    angular.module('auction')
    .controller('AuctionController', ['$scope', 'User', 'Auction', 'ngDialog', '$interval', '$timeout', '$websocket', '$location', function ($scope, User, Auction, ngDialog, $interval, $timeout, $websocket, $location) {
        $scope.user = {};
        $scope.items = [];
        $scope.auction = {};

        reloadInfo();

        $scope.logout = function () {
            User.logout();
        };

        $scope.showAuctionDialog = function (item) {
            ngDialog.openConfirm({
                template: 'items/startAuction.html',
                className: 'ngdialog-theme-plain',
                data: {
                    count: item.count
                }
            }).then(function(data) {
                Auction.start(item.id, data.quantity, data.bid).then(function(response) {
                    $timeout(function () {
                        reloadInfo();
                    }, 1000);
                    $scope.showInfoDialog('Auction queued');
                }, function (response) {
                    $scope.showInfoDialog('Error creating auction');
                });
            });
        };

        $scope.showInfoDialog = function(message) {
            ngDialog.open({
                template: 'items/auction-info.html',
                className: 'ngdialog-theme-plain',
                data: {
                    message: message
                }
            });
        };

        $scope.postBid = function (myBid) {
            Auction.bid(myBid).then(function(response) {
                reloadInfo();
                $scope.showBidInfoDialog('Bid placed');
            }, function (response) {
                $scope.showBidInfoDialog('Error placing bid');
            });
        };

        $scope.showBidInfoDialog = function(message) {
            ngDialog.open({
                template: 'auction-board/place-bid-info.html',
                className: 'ngdialog-theme-plain',
                data: {
                    message: message
                }
            });
        };

        $interval(function() {
            if ($scope.auction) {
                var passed = Math.round((new Date() - $scope.auction.loaded) / 1000);
                $scope.auction.timerLocal = $scope.auction.timer - passed;

                if ($scope.auction.timerLocal < -10) {
                    reloadInfo();
                }
            }
        }, 1000);

        function reloadInfo() {
            User.getUser().then(function(response) {
                if (response.data.id) {
                    $scope.user = response.data;
                } else {
                    $scope.logout();
                }
            });

            User.getItems().then(function(response) {
                $scope.items = response.data;
            });

            Auction.get().then(function(response) {
                $scope.auction = response.data;

                if ($scope.auction) {
                    $scope.auction.loaded = new Date();
                    $scope.auction.timerLocal = $scope.auction.timer;
                }
            });
        }

        // websocket
        var dataStream = $websocket('ws://' + $location.host() + ':8001/');
        dataStream.onMessage(function(message) {
            reloadInfo();
        });
    }]);
})();
