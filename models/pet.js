var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String},
  age: {type: Number},
  race: {type: String},
  imagePath: {type: String},
});

module.exports = mongoose.model('Pet', schema);
