const express = require('express')
const router = express.Router()

const adminCtrl = require('../controllers/admin.controller.js')

router.post('/admin-login', adminCtrl.adminLogin)
router.post('/access', adminCtrl.verifyUser, (req, res) => {
  res.send('I am a restricted API')
})

module.exports = router
