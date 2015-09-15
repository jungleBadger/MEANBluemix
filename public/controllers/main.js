(function() { 
var app = angular.module('mongobm', ['ngRoute', 'angular-ladda', 'auth.factory', 'auth.controller']);

app.config(function($routeProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('TokenInterceptor');

    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            access: {
                requiredLogin: false
            } 
        }).when('/page1', {
            templateUrl: 'partials/page1.html',
            controller: 'Page1Ctrl',
        access: {
            requiredLogin: true
            }
        }).otherwise({
            redirectTo: '/login'
        });
        
});
    
    
app.controller('MongoBmCtrl', function ($scope, $http) {
	$scope.formModel = {};
	$scope.submitting = false;
	$scope.submitted = false;
	$scope.has_error = false;

});
    
    
app.controller("HeaderCtrl", ['$scope', '$location', 'UserAuthFactory',
  function($scope, $location, UserAuthFactory) {
 
    $scope.isActive = function(route) {
        return route === $location.path();
    }
    
    $scope.logout = function () {
        UserAuthFactory.logout();
    }
  }
]);    
      
app.controller("HomeCtrl", ['$scope', '$http',
  function($scope, $http) {
  
    $scope.isActive = function(route) {
      return route === $location.path();
    }

  }
                            
]);

    
app.controller("Page1Ctrl", ['$scope', '$http',
                            function($scope, $http) {
                                
                                $scope.messages = [];
                                $http.get('http://localhost:3000/api/v1/render').then(
                                    function(response) {
                                        $scope.messages = response.data;
                                        console.log($scope.messages);
                                    }, function(response) {
                                        alert();
                                    });
                            }
]);
    
    
 app.run(function($rootScope, $window, $location, AuthenticationFactory) {
    AuthenticationFactory.check();
    
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
            $location.path("/login");
        } else {
            if (!AuthenticationFactory.user) {
                AuthenticationFactory.user = $window.sessionStorage.user;
            }
            if (!AuthenticationFactory.userRole) {
                AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            }
        }
    });
    
    
  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
    // if the user is already logged in, take him to the home page
    if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      $location.path('/');
    }
  });
});
  
    
})();

