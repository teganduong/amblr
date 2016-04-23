angular.module('amblr.routeFilter', [])
  .controller('routeFilter', function ($scope, $rootScope, $ionicModal, $ionicSideMenuDelegate, Routes, POIs) {
    $scope.availRoutes = [];
    $scope.filteredRoute = null;

    $ionicModal.fromTemplateUrl('../../templates/routeFilterModal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      // backdropClickToClose: true,
      // hardwareBackButtonClose: true
    })
      .then(function (modal) {
        $scope.modal = modal;
      });

    $scope.showFilterModal = function () {
      Routes.getRoutes().then(function (routes) {
        $scope.availRoutes = routes;
        $scope.modal.show();
      });
    }

    $scope.showRoutesNearMe = function() {
      Routes.filterRoutesByDistance($rootScope.coordinates).then(function(routes) {
        $scope.availRoutes = routes;
        console.log(routes);
      })
    }

    $scope.hideFilterModal = function () {
      $scope.modal.hide();
    }

    $scope.setRoute = function (routeID) {
      $scope.filteredRoute = routeID;
      POIs.setRouteFilter(routeID);
      $rootScope.$broadcast('reloadPOIs');
      $scope.modal.hide();
    }
  });