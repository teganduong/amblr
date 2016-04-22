angular.module('amblr.profile', [])
  .controller('ProfileCtrl', function($scope, $rootScope, $ionicModal, Users, Routes, POIs) {
    // dummy data 
    $scope.currentUser = {
      username: 'tegan',
      email: 'something@gmail.com'
    };

    $scope.allRoutes = [];

    // routes created by user
    $scope.myRoutes = ['route1'];
    $scope.myRoute;

    // POIs created by user
    $scope.pois = ['something'];

    $ionicModal.fromTemplateUrl('../../templates/profile.html', {
      scope: $scope,
      animation: 'slide-in-up',
      })
      .then(function (modal) {
        $scope.modal = modal;
      });

      $scope.showUserProfileModal = function () {
        Routes.getRoutes().then(function (routes) {
          $scope.allRoutes = routes;
          console.log('allRoutes: ', $scope.allRoutes);
          $scope.modal.show();
        });
       }

      $scope.hideUserProfileModal = function () {
        $scope.modal.hide();
      }

      $scope.setUserRoute = function (routeID) {
        $scope.myRoute = routeID;
        POIs.setRouteFilter(routeID);
        $rootScope.$broadcast('reloadPOIs');
        $scope.modal.hide();
      }
  });