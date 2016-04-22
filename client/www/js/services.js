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
                // console.log('POI successfully deleted!');
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

.factory('Routes', function($http, $rootScope, ENV, uiGmapGoogleMapApi, uiGmapIsReady) {
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
  
  Routes.getOneRoute = function() {
    return $http.get(ENV.apiEndpoint + '/api/route/:_id')
      .then(function(route) {
        return route.data;
      })
      .catch(function(err) {
        console.log('error in getting routes in services.js: ', err);
      });
  };

  Routes.getDirections = function(routeID) {
    uiGmapIsReady.promise()
    .then(function (instances) {        
      //for testing directions
      mapInstance = instances[0].map;

      uiGmapGoogleMapApi.then(function (maps) {
                      $rootScope.directionsDisplay = new maps.DirectionsRenderer();
                  });
      //end for directions

    })
    .then(function() {
      //testing directionsService

      var directionsService = new google.maps.DirectionsService();

      var directionsRequest = {
        origin: '747 Howard Street, San Francisco, CA',
        destination: '982 Market Street, San Francisco, CA',
        travelMode: google.maps.DirectionsTravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
      };

      directionsService.route(
        directionsRequest,
        function(response, status)
        {
          if (status == google.maps.DirectionsStatus.OK)
          {
           $rootScope.directionsDisplay.setMap(mapInstance);
           $rootScope.directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true});
           $rootScope.directionsDisplay.setDirections(response);
            
          }
          else
            console.log('there was an error', response);
        }
      );
    })
    .catch(function(err) {
      console.log('error in doing things when map is ready', err);
    });
  };

  return Routes;
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

