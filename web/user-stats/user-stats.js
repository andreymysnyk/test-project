(function () {
    angular.module('auction')
    .directive('userStats', function () {
        return {
            restrict: 'E',
            templateUrl: 'user-stats/user-stats.html'
        }
    });
})();