angular.module('amblr.profile', [])
  .controller('ProfileCtrl', function($scope, $rootScope, $ionicModal, User, Routes, POIs) {
    var currentUserID = User.getUserID();
    console.log('currentUserID: ', currentUserID);
    // dummy data 
    $scope.currentUser = {
      username: 'tegan',
      email: 'something@gmail.com'
    };

    $scope.allRoutes = [];
    $scope.allPOIs = [];

    // routes created by user
    $scope.myRoutes = ['route1'];
    $scope.myRoute;

    // POIs created by user
    $scope.myPOIs = [];

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

        POIs.getPOIs().then(function(pois) {
          $scope.allPOIs = pois.data;
          console.log('allPOIs retrieved: ', $scope.allPOIs);
          for (var i = 0; i < pois.length; i++) {
            var poi = pois[i];
            if (poi.userID === currentUserID) {
              $scope.myPOIs.push(poi);
            }
          }
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