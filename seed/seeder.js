var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var Product = require('../models/product');
var User = require('../models/user');

var databaseURL = 'mongodb://localhost:27017/shopping';

var con = mongoose.connect(databaseURL);

// Apaga todo o banco antes de seedar
mongoose.connection.dropDatabase(function(err, result){});

var seed = [
  new Product({
    imagePath: 'https://imgmanagercb-a.akamaihd.net/racao-para-cachorro/pedigree-adulto-carne-e-vegetais-pacote-20-kg_300x300-PU5f5f9_1.jpg',
    name: 'Ração para cães 20Kg',
    description: 'Saco de ração para cachorro adulto de 20Kg.',
    price: 50,
    stored: 40
  }),
  new Product({
    imagePath: 'https://images-americanas.b2w.io/produtos/01/00/item/6922/8/6922853g1.jpg',
    name: 'Ração para cães 5Kg',
    description: 'Saco de ração para cachorro filhote de 5Kg.',
    price: 15,
    stored: 34
  }),
  new Product({
    imagePath: 'https://images-americanas.b2w.io/produtos/01/00/item/6922/7/6922721GG.jpg',
    name: 'Ração para gatos 5Kg',
    description: 'Saco de ração para gato filhote de 5Kg.',
    price: 16,
    stored: 46
  }),
  new Product({
    imagePath: 'https://images1.petlove.com.br/products/177801/hd/Ra%C3%A7%C3%A3o-Royal-Canin-Premium-Cat-para-Gatos-Adultos-Castrados.jpg?1495055887',
    name: 'Ração premium para gatos 5Kg',
    description: 'Saco de ração premium para gato de 5Kg.',
    price: 17,
    stored: 67
  }),
  new User({
    username: "admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("admin", bcrypt.genSaltSync(5), null),
    name: "Administrador",
    address: "Administrador",
    phone: "Administrador",
    imagePath: "https://images.unsplash.com/photo-1530731141654-5993c3016c77?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a586d71be520581c3f4268545162b40a&auto=format&fit=crop&w=1350&q=80",
    admin: true,
  })
];

var done = 0;

for (var i = 0; i < seed.length; i++) {
  seed[i].save(function(err, result) {
    done++;
    if (done === seed.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
