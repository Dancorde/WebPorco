var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var Service = require('../models/service');


/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', { title: 'Web Porco - Petshop', products: productChunks });
  });
});



router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
    // res.send({product: product, productsCart: cart.generateArray(), totalPrice: cart.totalPrice});
  });
});


router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
    // res.send({product: product, productsCart: cart.generateArray(), totalPrice: cart.totalPrice});
  });

});


router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {total: cart.totalPrice});
});

router.post('/checkout', function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  req.session.cart = null;

  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name
  });
  order.save(function(err, result){
    req.flash('success', 'Compra realizada com sucesso.');
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldURL = req.url;
  res.redirect('/user/signin');
}
