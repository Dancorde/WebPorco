var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Service = require('../models/service');
var Cart = require('../models/cart');
var Product = require('../models/product');
var ServiceType = require('../models/serviceType');
var Pet = require('../models/pet');


var csrfProtection = csrf();
router.use(csrfProtection);

var url = 'mongodb://localhost:27017/shopping'

router.get('/product/new', isLoggedIn, function(req, res, next) {
  res.render('product/new', {csrfToken: req.csrfToken()});
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

router.get('/product/:id/edit', function(req, res, next) {
  var productId = req.params.id;
  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/user/profile');
    }

    res.render('product/edit', {product: product, csrfToken: req.csrfToken()});
  });
});

router.post('/product/edit/:id', function(req, res, next) {
  product = {
    name: req.body.productName,
    description: req.body.productDesc,
    price: req.body.productPrice,
    stored: req.body.productStored,
    imagePath: req.body.productImage
  }

  Product.update({_id: req.params.id}, {$set: product }, function(err, docs){
    res.redirect('/user/profile')
  });

});

router.get('/service/new', isLoggedIn, function(req, res, next) {
  res.render('service/new', {csrfToken: req.csrfToken()});
});

router.post('/service/new', isLoggedIn, function(req, res, next) {
  var service = {
    name: req.body.serviceName,
    description: req.body.serviceDesc,
    price: req.body.servicePrice,
    imagePath: req.body.serviceImage
  };

  ServiceType.create(service);

  res.redirect('/user/profile');
});

router.get('/service/:id/edit', function(req, res, next) {
  var productId = req.params.id;
  ServiceType.findById(productId, function (err, service) {
    if (err) {
      return res.redirect('/user/profile');
    }

    res.render('service/edit', {service: service, csrfToken: req.csrfToken()});
  });
});

router.post('/service/edit/:id', function(req, res, next) {
  service = {
    name: req.body.serviceName,
    description: req.body.serviceDesc,
    price: req.body.servicePrice,
    imagePath: req.body.serviceImage
  }

  ServiceType.update({_id: req.params.id}, {$set: service }, function(err, docs){
    res.redirect('/user/profile')
  });

});

router.get('/pet/new', isLoggedIn, function(req, res, next) {
  res.render('pet/new', {csrfToken: req.csrfToken()});
});

router.post('/pet/new', isLoggedIn, function(req, res, next) {
  var pet = {
    name: req.body.petName,
    race: req.body.petRace,
    age: req.body.petAge,
    imagePath: req.body.petImage
  };

  Pet.create(pet);

  res.redirect('/user/profile');
});

router.get('/service', isLoggedIn, function(req, res, next) {
  res.render('user/service', {csrfToken: req.csrfToken()});
});

router.post('/service', isLoggedIn, function(req, res, next) {

  ServiceType.find({name: req.body.service}, function(err, serviceTypes){

    price = serviceTypes[0].price;
    img = serviceTypes[0].imagePath;

    var service = {
       user: req.user,
       name: req.body.clientName,
       pet: req.body.petName,
       phone: req.body.phone,
       service: req.body.service,
       time: req.body.time,
       date: req.body.date,
       price: price,
       imagePath: img
     };

     Service.create(service);

     res.redirect('/user/profile');
  });

});


router.get('/profile', isLoggedIn, function (req, res, next) {
  if (!req.user.admin) {
    Order.find({user: req.user}, function(err, orders) {
      Service.find({user: req.user}, function(err, services){
        ServiceType.find(function(err, serviceTypes){
          Pet.find(function(err, pets){
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
                                        pets: pets,
                                        csrfToken: req.csrfToken()
                                      });
          });
        }).sort({name: 1});
      }).sort({_id: -1});
    }).sort({_id: -1});
  } else {
    Service.find(function(err, services){
      Product.find(function(err, products){
        ServiceType.find(function(err, serviceTypes){
          var count = 0;
          ServiceType.count({}, function(err, servicesCount){
            count = servicesCount
          });
          res.render('user/admin', {services: services,
            products: products,
            serviceTypes: serviceTypes,
            servicesCount: count,
          });
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
