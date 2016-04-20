angular.module('amblr.leftnav', ['ngDraggable'])
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
  
  $scope.$on('draggable:end', function(target, event) {
    // hardcoded offset to 27 px
    $scope.$broadcast('newMarkerDrop', event.x, event.y - 27);
  });
});