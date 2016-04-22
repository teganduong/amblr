angular.module('amblr.routeManage', [])
  .controller('routeManage', function ($scope, $rootScope, $ionicModal, $ionicSideMenuDelegate, $filter, Routes, POIs) {
    $scope.userID = null;
    $scope.availRoutes = [];
    $scope.currentRoute = null;
    $scope.routePOIs = [];
    
    $ionicModal.fromTemplateUrl('../../templates/routeManageModal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      // backdropClickToClose: true,
      // hardwareBackButtonClose: true
    })
      .then(function (modal) {
        $scope.modal = modal;
      });

    $scope.showRouteManageModal = function () {
      Routes.getRoutes().then(function (routes) {
        $scope.availRoutes = routes;
        $scope.userID = $rootScope.userID;
        $scope.modal.show();
      });
    }

    $scope.hideRouteManageModal = function () {
      $scope.modal.hide();
      $scope.resetSelected();
    }

    $scope.selectRoute = function (routeID) {
      var selectedRoute = $filter('filter')($scope.availRoutes, { '_id': routeID })[0];
      var objectIDs = selectedRoute.POIs.reduce(function (accumulator, element) {
        accumulator[element] = true;
        return accumulator;
      }, {});
      
      $scope.routePOIs = POIs.inMemoryPOIs.filter(function (element) {
        return (objectIDs[element['_id']]);
      });
      
      $scope.currentRoute = selectedRoute;
    }
    
    $scope.resetSelected = function () {
      $scope.currentRoute = null;
      $scope.currentRouteName = null;
      $scope.routePOIs = [];
    }

    $scope.removePOI = function (poiID) {
      console.log($scope.currentRoute);
      for (var i = 0; i < $scope.currentRoute.POIs.length; i++) {
        if ($scope.currentRoute.POIs[i] === poiID) {
          var removedPOI = $scope.currentRoute.POIs.splice(i, 1);
          $scope.routePOIs.splice($scope.routePOIs.indexOf(removedPOI), 1);
          break;
        }  
      }
      
      Routes.updateRoute($scope.currentRoute).then(function (route) {
        $scope.currentRoute = route;
      });
    }

  });