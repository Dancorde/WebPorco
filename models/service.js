var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, required: true},
  pet: {type: String, required: true},
  phone: {type: String, required: true},
  service: {type: String, required: true},
  date: {type: Date, required: true},
});

module.exports = mongoose.model('Service', schema);
