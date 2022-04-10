export{}
const express = require('express')
const authCtrl = require('./auth.controller')
const {tokenValidate} = require('../helper/tokenValidate')

const router = express.Router()

router.route('/login')
  .post(authCtrl.login)

router.route('/logout')
  .post(authCtrl.logout)

router.route('/logoff')
  .post(tokenValidate, authCtrl.logoff)

module.exports = router
