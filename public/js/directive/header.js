stockApp.directive('header', ['$compile', '$http', '$location', '$route', function($compile, $http, $location, $route) {
    return {
        restrict: 'E',
        templateUrl: 'js/html/header.html',
        transclude: true,
        link: function(scope, element, attrs) {
                scope.$emit('LOAD');
                $http.get("/authentication/admin").success(function(response, status, headers, config) {
                    scope.$emit('UNLOAD');
                    if (response.status == 'success') {

                    } else {
                        $location.path("/admin-login");
                    }
                });
            
          scope.logout = function() {
                scope.$emit('LOAD');
                $http.get("/logout", { logout: 'admin' }).success(function(response, status, headers, config) {
                    scope.$emit('UNLOAD');
             
                    $location.path("/");
                });
            };
        }
    }
}]);
