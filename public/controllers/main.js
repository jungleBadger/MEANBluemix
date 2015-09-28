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
    
app.controller("Page1Ctrl", ['$scope', '$window', '$http',
                            function($scope, $window, $http) {
                
                /*************************/
                // API Calls variables  //
                //***********************/                                                    
                    var email = $window.sessionStorage.user+'@br.ibm.com';
                    var client_id = 'cf31d182-1732-4984-845f-285a867d93a4';    
                    
                /******************************/
                // Render All messages        //
                // GET method when called     // 
                //*****************************/                                    
                    $scope.messages = [];
                    $http.get('/api/v1/render').then(
                        function(response) {
                            $scope.messages = response.data;
                        }, function(response) {
                            console.log('failed render');
                        });
                                
                /******************************/
                // Render /about from IBMAPI  //
                // GET method when called     // 
                //*****************************/                                                
                    $http.get('https://w3.api.ibm.com/common/run/bluepages/about').then(
                        function(response) {
                            $scope.testApi = response.data;
                        }, function(response) {
                            console.log("failed about");
                        });

                /*********************************/
                // Render photo by intranet id   //
                // This method doesnt get called //
                // the image is already resolved // 
                //********************************/                                    
                'https://eapim.w3ibm.mybluemix.net/common/run/bluepages/photo?client_id=cf31d182-1732-4984-845f-285a867d93a4&email=dcerag@br.ibm.com'
                                
                    var photoHandler = document.getElementById("userPhoto");
                    photoHandler.src = 'https://eapim.w3ibm.mybluemix.net/common/run/bluepages/'+
                        'photo?client_id='+client_id+'&email='+email;
                
                /*******************************************/
                // Render employee info (sent id via header)//
                // GET method when called                  // 
                //******************************************/                                    
                    var req = {
                        method: 'GET',                                                                                                                           url:'https://eapim.w3ibm.mybluemix.net/common/run/bluepages/email/'+email+'/'+
                                    'callupname&preferredidentity&dept',
                        headers: {
                            'Content-Type': "text/plain",
                            'X-IBM-Client-Id': client_id
                            }
                        }            
                    $http(req).then(function(response){
                        $scope.userInfo = {};
                        $scope.userInfo = response.data.search.entry[0].attribute;
                    }, function(response) {
                        console.log(response);
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