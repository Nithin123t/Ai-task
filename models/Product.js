const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  stock: Number,
  sold: Number
});

module.exports = mongoose.model('Product', productSchema);
