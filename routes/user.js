var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Service = require('../models/service');
var Cart = require('../models/cart');
var Product = require('../models/product');
var ServiceType = require('../models/serviceType');


var csrfProtection = csrf();
router.use(csrfProtection);

var url = 'mongodb://localhost:27017/shopping'

router.get('/product/new', isLoggedIn, function(req, res, next) {
  res.render('shop/new_product', {csrfToken: req.csrfToken()});
});

router.post('/product/new', isLoggedIn, function(req, res, next) {
  var product = {
    name: req.body.productName,
    description: req.body.productDesc,
    price: req.body.productPrice,
    stored: req.body.productStored,
    imagePath: req.body.productImage
  };

  Product.create(product);

  res.redirect('/user/profile');
});

router.get('/service', isLoggedIn, function(req, res, next) {
  res.render('user/service', {csrfToken: req.csrfToken()});
});

router.post('/service', isLoggedIn, function(req, res, next) {
  var service = {
    user: req.user,
    name: req.body.clientName,
    pet: req.body.petName,
    phone: req.body.phone,
    service: req.body.service,
    time: req.body.time,
    date: req.body.date
  };

  Service.create(service);

  res.redirect('/user/profile');
});


router.get('/profile', isLoggedIn, function (req, res, next) {
  if (!req.user.admin) {
    Order.find({user: req.user}, function(err, orders) {
      Service.find({user: req.user}, function(err, services){
        ServiceType.find(function(err, serviceTypes){
          if (err) {
            return res.write('Error!');
          }
          var cart;
          orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
          });

          res.render('user/profile', { orders: orders,
                                      services: services,
                                      user: req.user,
                                      serviceTypes: serviceTypes,
                                      csrfToken: req.csrfToken()
                                    });
        }).sort({name: 1});
      }).sort({_id: -1});
    }).sort({_id: -1});
  } else {
    Service.find(function(err, services){
      Product.find(function(err, products){
        ServiceType.find(function(err, serviceTypes){
          res.render('user/admin', {services: services, products: products, serviceTypes: serviceTypes});
        });
      });
    });
  }


});



router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
