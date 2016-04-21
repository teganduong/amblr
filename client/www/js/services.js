angular.module ('amblr.services', [])

.factory('POIs', function($http, $rootScope, ENV, $filter) {
  var POIs = {};

  POIs.routeFilter = null;

  POIs.getPOIs = function () {
    var self = this;
    
    return $http.get(ENV.apiEndpoint + '/api/pois/')
    .then(function (pois) {
      /* filter POIs here */
      if (self.routeFilter) {
        pois.data = $filter('filter')(pois.data, { 'routeId': self.routeFilter });
      }
      return pois;
    })
    .catch(function(err) {
      console.log('error in getting pois in services.js: ', err);
    });
  };

  POIs.savePOI = function(POI) {
    return $http({
      method: 'POST',
      url: ENV.apiEndpoint + '/api/pois/',
      data: JSON.stringify(POI)
    }).then(function(res) {
      //both addPOIs run this
      $rootScope.$broadcast('reloadPOIs');
      return res;
    })
    .catch(function(err) {
      console.log('error in saving poi to databse', err);
    });
  };

  POIs.deletePOI = function(poiID) {
    var url = ENV.apiEndpoint + '/api/pois/' + poiID;
    return $http.delete(url, {})
              .success(function(data, status, headers, config) {
                console.log('POI successfully deleted!');
              })
              .error(function(data, status, headers, config) {
                console.error('Error in deleting POI');
              });
  };

  POIs.setRouteFilter = function (routeID) {
    this.routeFilter = routeID;
  };

  return POIs;
})

.factory('Routes', function($http, $rootScope, ENV) {
  var Routes = {};

  Routes.getRoutes = function() {
      return $http.get(ENV.apiEndpoint + '/api/routes/')
      .then(function(routes) {
        return Routes = routes.data;
      })
      .catch(function(err) {
        console.log('error in getting routes in services.js: ', err);
      });
    };
  return Routes;
})

.factory('Users', function($http, $rootScope, ENV) {
  var Users = {};

  Users.getUserById = function(userID) {
    var url = ENV.apiEndpoint + '/api/users/' + userID;
    return $http.get(url, {})
      .success(function(data, status, headers, config) {
        console.log('User successfully retrieved: ', data);
      })
      .error(function(data, status, headers, config) {
        console.error('Error in getting user: ', data);
      });
  };

  return Users;
})

.factory('Location', function($cordovaGeolocation, $ionicLoading) {

  var location = {};

  location.getCurrentPos = function() {
    var position = {};
    $ionicLoading.show({
      template: 'Getting current location...',
      noBackdrop: true
    });

    var options = {timeout: 10000, enableHighAccuracy: true};
    return $cordovaGeolocation.getCurrentPosition(options).then(function (pos) {
      position.lat = pos.coords.latitude;
      position.long = pos.coords.longitude;

      $ionicLoading.hide();
      return position;
    }, function (error) {
      alert('Unable to get location: ' + error.message);
      $ionicLoading.hide(); 
    });
  };

  return location;

})

.factory('CenterMap', function($rootScope) {

  var CenterMap = {};

  CenterMap.recenter = function() {
    $rootScope.$broadcast('centerMap');
    return true;
  };

  return CenterMap;
});

