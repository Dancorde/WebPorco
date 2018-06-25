var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
  new Product({
    imagePath: 'https://imgmanagercb-a.akamaihd.net/racao-para-cachorro/pedigree-adulto-carne-e-vegetais-pacote-20-kg_300x300-PU5f5f9_1.jpg',
    name: 'Ração para cães 20Kg',
    description: 'Saco de ração para cachorro adulto de 20Kg.',
    price: 50
  }),
  new Product({
    imagePath: 'https://images-americanas.b2w.io/produtos/01/00/item/6922/8/6922853g1.jpg',
    name: 'Ração para cães 5Kg',
    description: 'Saco de ração para cachorro filhote de 5Kg.',
    price: 15
  }),
  new Product({
    imagePath: 'https://images-americanas.b2w.io/produtos/01/00/item/6922/7/6922721GG.jpg',
    name: 'Ração para gatos 5Kg',
    description: 'Saco de ração para gato filhote de 5Kg.',
    price: 16
  }),
  new Product({
    imagePath: 'https://images1.petlove.com.br/products/177801/hd/Ra%C3%A7%C3%A3o-Royal-Canin-Premium-Cat-para-Gatos-Adultos-Castrados.jpg?1495055887',
    name: 'Ração premium para gatos 5Kg',
    description: 'Saco de ração premium para gato de 5Kg.',
    price: 17
  })
];

var done = 0;

for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
