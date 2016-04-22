angular.module('amblr.routeManage', [])
  .controller('routeManage', function ($scope, $rootScope, $ionicModal, $ionicSideMenuDelegate, Routes, POIs) {
    $scope.userID = null;
    $scope.availRoutes = [];
    $scope.currentRoute = null;
    $scope.currentRouteName = null;
    
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
    }

    $scope.selectRoute = function (routeID, routeName) {
      $scope.currentRoute = routeID;
      $scope.currentRouteName = routeName;
    }
    
    $scope.resetSelected = function () {
      $scope.currentRoute = null;
      $scope.currentRouteName = null;
    }

  });