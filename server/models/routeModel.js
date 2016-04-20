var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var routeSchema = mongoose.Schema({
  name: {type: String, required: true},
});

routeSchema.plugin(timestamps);

module.exports = mongoose.model('Route', routeSchema);

