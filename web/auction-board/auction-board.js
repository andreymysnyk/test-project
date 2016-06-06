(function () {
    angular.module('auction')
    .directive('auctionBoard', function () {
        return {
            restrict: 'E',
            templateUrl: 'auction-board/auction-board.html'
        }
    });
})();