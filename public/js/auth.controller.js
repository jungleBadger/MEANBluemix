var app = angular.module('auth.controller', [])

app.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
  function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
    $scope.user = {
      username: '',
      password: ''
    };
 
    
      
    $scope.login = function() {
    $scope.submitting = true;
      var username = $scope.user.username,
        password = $scope.user.password;
 
      if (username !== undefined && password !== undefined) {
        UserAuthFactory.login(username, password).success(function(data) {
       
          AuthenticationFactory.isLogged = true;
          AuthenticationFactory.user = data.user.username;
          AuthenticationFactory.userRole = data.user.role;
 
          $window.sessionStorage.token = data.token;
          $window.sessionStorage.user = data.user.username; // to fetch the user details on refresh
          $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh
 
          $location.path("/page1");
 
        }).error(function(status) {
          alert('Oops something went wrong!');
        });
      } else {
        alert('Invalid credentials');
      }
 
    };
 
  }
]);