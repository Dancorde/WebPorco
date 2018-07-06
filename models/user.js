var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  address: {type: String, required: true},
  phone: {type: String, required: true},
  imagePath: {type: String, required: true},
  admin: {type: Boolean, default: false},
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};




module.exports = mongoose.model('User', userSchema);
