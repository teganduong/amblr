angular.module ('amblr.services', [])

.factory('POIs', function($http, $rootScope, ENV, $filter) {
  var POIs = {};
  POIs.inMemoryPOIs = [];

  POIs.routeFilter = null;

  POIs.getPOIs = function () {
    var self = this;
    
    return $http.get(ENV.apiEndpoint + '/api/pois/')
    .then(function (pois) {
      self.inMemoryPOIs = pois.data;
      
      /* filter POIs here for display */
      if (self.routeFilter) {
        /* build object containing all IDs of POIs in current route */      
        var objectIDs = self.routeFilter.POIs.reduce(function (accumulator, element) {
          accumulator[element] = true;
          return accumulator;
        }, {});
        
        pois.data = pois.data.filter(function (element) {
          return (objectIDs[element['_id']]);
        });
        
        /* filter and order by the route POIs order */
        pois.data = pois.data.reduce(function (accumulator, element, index) {
          var index = self.routeFilter.POIs.indexOf(element._id);
          if (index >= 0) {
            accumulator[index] = element;
          }
          return accumulator;
        }, []);
        
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

  Routes.getRoutes = function () {
    return $http.get(ENV.apiEndpoint + '/api/routes/')
      .then(function (routes) {
        return routes.data;
      })
      .catch(function (err) {
        console.log('error in getting routes in services.js: ', err);
      });
  };

  Routes.updateRoute = function (route) {
    return $http.put(ENV.apiEndpoint + '/api/routes/', route)
      .then(function (routes) {
        return routes.data;
      })
      .catch(function (err) {
        console.log('error in updating routes in services.js: ', err);
      });
  };  

  return Routes;
})

.factory('User', function($http, $rootScope, ENV) {
  var User = {};

  User.getUserID = function() {
    return $http.get(ENV.apiEndpoint + '/checkuserid')
    .success(function(data) {
      console.log('UserID successfully retrieved: ', data);
      $rootScope.userID = data;
      return $rootScope.userID;
    })
    .error(function(data) {
      console.log('error: ' + data);
    });
  };

  return User;
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

