var mongoose = require('mongoose');
var POI = require('../models/poiModel.js');
var Route = require('../models/routeModel.js');
var sampleData = require('../data/samplePOIData.js');
var logger = require('../config/logger.js');
var Promise = require('bluebird');

Promise.promisifyAll( mongoose );

/*
   This function will load sample data 
   for us to use, we would comment out 
   execution of it if in production.

*/
var createPOIsFromData = function() {
 
  // delete all data first so we don't have dupes
  // everytime server is bounced and db isn't
  POI.remove({}, function(err, removed) {
    if (err) {
      return logger.error('Error removing POIs: ' + err);
    }

    logger.info('Removed POIs: ' + removed);

  });

  sampleData.forEach(function(poi) {
    POI.create(poi, function(err, newPoi) {
      if (err) {
        return logger.error('Error creating POI: ' + newPoi + ', error: ' + err);
      } 
        
      logger.info('Created sample POI: ' + newPoi);
    
    });
  });

}; 

exports.savePOI = function(req, res) {
  logger.info('POI to create: ' + req.body);

  //Need to split out the route information from the req.body
  //pass the route information to create a new route
  // get the route ID and add it to the POI's routeID field 
  // need to go through each property of the request body
  // var newPOI = req.body;
  var newPOI = {};
  for (var key in req.body) {
    // if the key does not equal route, then add it to the newPOI
    if (key !== 'route') {
      newPOI[key] = req.body[key];
    }
  }
  
  //check if the new POI has a route
  if (req.body['route']) {
    var newRoute = {name: req.body['route'],
                    userID: req.body.userID};

    // if there is a route, once we extract and save it from body, check db
    Route.findOneAsync({ name: req.body['route'], userID: req.body.userID })
      .then(function(route){
        //check if route exists
        if(!route) {
        // if it doesn't exist, then add it to database so we can get its ID
          newRoute.loc = {type: "Point", coordinates: [req.body.long, req.body.lat]}
          return Route.createAsync(newRoute);
        }
        // if it did exist then just return it 
        return route;
      })
      .then(function(route) {
        //receive the route that was returned after creation or finding
        //pass on the route id to the newPOI object to create new POI
        newPOI.routeId  = route._id;

        return POI.createAsync(newPOI);
      }) 
      .then(function(result) {
        // logger.info('POI successfully created: ' + result)
        var POIID = String(result._id);
        Route.findOneAndUpdateAsync({name: newRoute.name}, { $push: { POIs: POIID} }, function(err, data) {
          if ( err ) {
            console.log('ERROR ' + err );
          }
        })
        return result;
      })
      .then(function(result){
        res.status(201);
        res.json(result);
      })
      .catch(function(err) {
        logger.error('in newPOI save ', err);
        res.status(400);
        return res.json(err);
      });
  } else {
    //if no route provided then just add newPOI with no route
    logger.info('there was no route submitted');
    POI.create(newPOI, function(err, result) {
      if (err) {
        logger.error('in newPOI save ', err);
        res.status(400);
        return res.json(err);
      }
      // logger.info('POI successfully created: ' + result);

      res.status(201);
      res.json(result);
    })
  }
};


exports.getAllPOI = function(req, res) {

  POI.find({}, function(err, pois) {
    if (err) {
      logger.error('ERROR in getAllPOI: ', err);
      return res.json(err);
    } 
      
    // logger.info('Successfully retrieved pois: ' + pois);
    res.json(pois); 
  });
};

exports.deletePOI = function (req, res) {
  var poiID = req.params.id;
  
  POI.removeAsync({ _id: poiID }).then(function (poi) {
    return Route.update({}, { $pull: { 'POIs': poiID } }, { multi: true });
  }).then(function (routes) {
    res.status(200);
    res.end();
    return;
  }).catch(function (err) {
    logger.error('ERROR in delete: ', err);
    res.status(404);
    res.end();
  });
};

