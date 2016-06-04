(function () {
    var app = angular.module('auction', [ ]);

    app.directive('initCanvas', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var canvasEl = element[0].getElementsByTagName('canvas')[0];

                $timeout(function() {
                    drawTemp(canvasEl, isDay(scope.item), scope.item.temp_left, scope.item.temp_right);
                    element[0].className += " load";
                }, 80 * scope.$index)
            }
        }
    });
})();
