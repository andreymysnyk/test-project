(function () {
    angular.module('auction')
    .directive('items', function () {
        return {
            restrict: 'E',
            templateUrl: 'items/items.html'
        }
    });
})();