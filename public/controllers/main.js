(function() { 
var app = angular.module('mongobm', ['ngRoute']);

    
    app.config(function($routeProvider, $httpProvider) {
        
    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
            
        }).when('/', {
            templateUrl: '/partials/home.html',
            controller: 'HomeCtrl'
        });
});
    
    
//app.run(function (defaultErrorMessageResolver) {
//		defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
//			errorMessages['tooYoung'] = 'You must be at least {0} years old to use this site';
//			errorMessages['tooOld'] = 'You must be max {0} years old to use this site';
//			errorMessages['badUsername'] = 'Username can only contain numbers and letters and _';
//		});
//	}
//);


app.controller('MongoBmCtrl', function ($scope, $http) {
	$scope.formModel = {};
	$scope.submitting = false;
	$scope.submitted = false;
	$scope.has_error = false;


$scope.test = function() {
    alert();
    console.log($http.get('http://testeapp.w3ibm.mybluemix.net/api/render'));
};
    
//	$scope.onSubmit = function () {
//		$scope.submitting = true;
//		console.log("Hey i'm submitted!");
//		console.log($scope.formModel);
//
//		$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel).
//			success(function (data) {
//				console.log(":)");
//				$scope.submitting = false;
//				$scope.submitted = true;
//				$scope.has_error = false;
//			}).error(function(data) {
//				console.log(":(");
//				$scope.submitting = false;
//				$scope.submitted = false;
//				$scope.has_error = true;
//			});
//
//	};
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
        console.log($http.get('http://localhost:3000/api/insertmessage'));    
      console.log($http.get('http://testeapp.w3ibm.mybluemix.net/api/insertmessage'));    
      }
      
      $scope.delete = function () {
        console.log($http.post('http://localhost:3000/api/delete'));  
        console.log($http.post('http://testeapp.w3ibm.mybluemix.net/api/delete'));    

      }
      
      $scope.render = function () {
        console.log($http.get('http://localhost:3000/api/render'));
        console.log($http.get('http://testeapp.w3ibm.mybluemix.net/api/render'));    

      
      }
      
    $scope.isActive = function(route) {
      return route === $location.path();
    }
 
    
  }
]);
})();