(function() {
    angular.module('auction')
    .factory('User', ['$window', '$location', '$http', function ($window, $location, $http) {
        return {
            login: login,
            logout: logout,
            getUser: getUser
        };

        function login(username) {
            $http.post('/user/login', {username: username}).then(
                function(response) {
                    $window.sessionStorage.session_token = response.data;
                    $location.path('/');
                }, function (response) {
                    console.log(response);
                });
        }

        function logout() {
            $http.post('/user/logout', {session_token: $window.sessionStorage.session_token}).then(
                function(response) {
                    delete $window.sessionStorage.session_token;

                    $location.path('/login');
                }, function (response) {
                    console.log(response);
                });
        }

        function getUser() {
            return $http.post('/user/get', {session_token: $window.sessionStorage.session_token});
        }
    }]);
})();