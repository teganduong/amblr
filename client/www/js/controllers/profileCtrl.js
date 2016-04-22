angular.module('amblr.profile', [])
  .controller('ProfileCtrl', function($scope, $rootScope, $ionicModal, Users, Routes) {

    $scope.currentUser = {
      username: 'tegan',
      email: 'something@gmail.com'
    };

    // routes created by user
    $scope.routes = [];

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
          $scope.routes = routes;
          $scope.modal.show();
        });
       }
      $scope.hideUserProfileModal = function () {
        $scope.modal.hide();
      }
  });