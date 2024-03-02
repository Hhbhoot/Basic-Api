const express = require('express');
const productRoutes = express.Router();
const {getProducts, getByCompanyName, addProduct, getProducyById} = require('../controller/productController');

productRoutes.route('/').get(getProducts).post(addProduct);
productRoutes.route('/company').get(getByCompanyName);
productRoutes.route('/id').get(getProducyById);

module.exports = productRoutes ;
