const express = require('express')
const router = express.Router()

const productCtrl = require('../controllers/product.controller.js')

router.get('/products', productCtrl.getProducts)
router.get('/product/:id', productCtrl.getProductById)
router.get('/product-view/:slug', productCtrl.getProductBySlug)
router.get('/products-es', productCtrl.getProductsFromES)

module.exports = router
