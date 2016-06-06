(function() {
    angular.module('auction')
    .factory('Auction', ['$window', '$http', function ($window, $http) {
        return {
            start: start,
            get: get,
            bid: bid
        };

        function start(itemId, count, bid) {
            return $http.post('/auction/start', {
                session_token: $window.sessionStorage.session_token,
                item_id: itemId,
                count: count,
                bid: bid
            });
        }

        function get() {
            return $http.get('/auction/get');
        }

        function bid(bid) {
            return $http.post('/auction/bid', {
                session_token: $window.sessionStorage.session_token,
                bid: bid
            });
        }
    }]);
})();