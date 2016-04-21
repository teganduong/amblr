angular.module('amblr.profile', [])
  .controller('ProfileCtrl', function($scope, $q) {
    openFB.api({
      path: '/me',
      params: {fields: 'id,name'},
      success: function(user) {
        console.log(user);
        $scope.$apply(function() {
          $scope.user = user;
        });
      },
      error: function(error) {
        console.log(error);
        alert('Facebook error: ' + error.error_description);
      }
    });
  });