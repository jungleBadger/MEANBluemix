(function() { 
var app = angular.module('mongobm', ['ngRoute', 'angular-ladda', 'auth.factory', 'auth.controller']);

app.config(function($routeProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('TokenInterceptor');

    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'  
        }).when('/page1', {
            templateUrl: 'partials/page1.html',
            controller: 'Page1Ctrl'
        }).when('/', {
            templateUrl: '/partials/login.html',
            controller: 'LoginCtrl'
        });
});
    
    

    
    
app.controller('MongoBmCtrl', function ($scope, $http) {
	$scope.formModel = {};
	$scope.submitting = false;
	$scope.submitted = false;
	$scope.has_error = false;

});
    
    
app.controller("HeaderCtrl", ['$scope', '$location',
  function($scope, $location) {
 
    $scope.isActive = function(route) {
        return route === $location.path();
    }
  }
]);    
      
app.controller("HomeCtrl", ['$scope', '$http',
  function($scope, $http) {
 
      $scope.insert = function () {
        console.log($http.get('http://localhost:3000/api/insertmessage', {'teste' : '12355'}));    
        console.log($http.get('http://testeapp.w3ibm.mybluemix.net/api/insertmessage'));    
      }
      
      $scope.delete = function () {
        console.log($http.post('http://localhost:3000/api/delete'));  
        console.log($http.post('http://testeapp.w3ibm.mybluemix.net/api/delete'));    
      }
 
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

