angular.module('amblr.leftnav', [])
.controller('LeftMenuNav', function($scope, $ionicSideMenuDelegate, $http, $rootScope) {

  $scope.loggedIn = false;
  
  $scope.isLoggedIn = function() {

    $http.get('/checklogin')
      .success(function(data) {
        console.log(data);
        $rootScope.loggedIn = data;
      })
      .error(function(data) {
        console.log('error: ' + data);
      });
  };

  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
    $scope.isLoggedIn();
  };
});