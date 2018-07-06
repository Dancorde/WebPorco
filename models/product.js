var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: {type: String, required: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  sold: {type: Number, default: 0},
  stored: {type: Number},
});

module.exports = mongoose.model('Product', schema);
