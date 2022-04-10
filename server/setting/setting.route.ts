export{}
const express = require('express')
const settingCtrl = require('./setting.controller')
const {tokenValidate} = require('../helper/tokenValidate')

const router = express.Router()

router.route('/')
  .put(tokenValidate, settingCtrl.updateSetting)

router.route('/history')
  .get(tokenValidate, settingCtrl.getHistory)

router.route('/message')
  .get(tokenValidate, settingCtrl.getMessage)

router.route('/privacy')
  .get(tokenValidate, settingCtrl.getPrivacy)

module.exports = router
