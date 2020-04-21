const express = require('express')
const router = express.Router()

const adminCtrl = require('../controllers/admin.controller.js')
const productCtrl = require('../controllers/product.controller.js')

router.post('/admin-login', adminCtrl.adminLogin)
router.post('/admin-add-product', adminCtrl.verifyUser, adminCtrl.addProduct)
router.post('/access', adminCtrl.verifyUser, (req, res) => {
  res.send('I am a restricted API')
})
router.get('/product-stats', productCtrl.getProductStats)

module.exports = router
