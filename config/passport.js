var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField:'username',
  password: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  req.checkBody('username', 'E-mail inválido').notEmpty()
  req.checkBody('password', 'Senha inválida').notEmpty().isLength({min:4});
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'username': username}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, {message: 'Email já esta sendo usado.'});
    }
    var newUser = new User();
    newUser.username = username;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(password);
    newUser.name = req.body.name;
    newUser.address = req.body.address;
    newUser.phone = req.body.phone;
    newUser.imagePath = req.body.profileImage;

    newUser.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));

passport.use('local.signin', new LocalStrategy({
  usernameField:'username',
  password: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  req.checkBody('username', 'Usuário inválido').notEmpty();
  req.checkBody('password', 'Senha inválida').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'username': username}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Nenhum usuário encontrado.'});
    }
    if (!user.validPassword(password)) {
      return done(null, false, {message: 'Senha incorreta.'});
    }
    return done(null, user);
  });
}));
