var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String},
  imagePath: {type: String},
  price: {type: Number},
  description: {type: String},
});

module.exports = mongoose.model('ServiceType', schema);
