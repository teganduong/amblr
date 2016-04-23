var mongoose = require('mongoose');
var Route = require('../models/routeModel.js');

exports.getAllRoutes = function(req, res) {
  Route.find({}, function(err, routes) {
    if (err) {
      logger.error('ERROR in getAllPOI: ', err);
      return res.json(err);
    } 
      
    // logger.info('Successfully retrieved pois: ' + pois);
    res.json(routes); 
  });
};

exports.getRoutesNearUser = function(req, res) {
  console.log('Get Routes Near Me', req.body);
  Route.find({
    loc: {
      $near: {
        $geometry: {
          type: "Point", 
          coordinates: [req.body[0], req.body[1]] 
        }, 
        $maxDistance: 3000
      } 
    } 
  }, function(err, routes){
    console.log(routes);
    console.log(req.body);
    res.send(routes);
  })
}

exports.getRoute = function(req, res) {

  // Route.find({}, function(err, routes) {
  //   if (err) {
  //     logger.error('ERROR in getAllPOI: ', err);
  //     return res.json(err);
  //   } 
      
  //   // logger.info('Successfully retrieved pois: ' + pois);
  //   res.json(pois); 
  // });
};