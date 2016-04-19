angular.module('amblr.leftnav', ['ngDraggable'])
.controller('LeftMenuNav', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  $scope.$on('draggable:end', function(target, event) {
    // hardcoded offset to 27 px
    $scope.$broadcast('newMarkerDrop', event.x, event.y - 27);
  });
});