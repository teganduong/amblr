const routeRouter = require('express').Router();
const routeController = require('../controllers/routeController.js');

// Declare all routes for routess and specify what controller method we're going to use for each

// the path '/api/routes' is already prepended to all routes based on app.use statement in server.js
routeRouter.route('/').get(routeController.getAllRoutes);
routeRouter.route('/').put(routeController.updateRoute);
routeRouter.route('/').post(routeController.getRoutesNearUser);
routeRouter.route('/:id').delete(routeController.deleteRoute);

module.exports = routeRouter;
