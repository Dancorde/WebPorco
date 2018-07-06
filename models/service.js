var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  name: {type: String},
  pet: {type: String},
  phone: {type: String},
  service: {type: String},
  time: {type: String},
  imagePath: {type: String, required: true},
  date: {type: Date},
  price: {type: Number}
});

module.exports = mongoose.model('Service', schema);
