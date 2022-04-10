export{}
const express = require('express')
const imageCtrl = require('./image.controller')
const {tokenValidate} = require('../helper/tokenValidate')

const router = express.Router()

router.route('/')
  .post(tokenValidate, imageCtrl.upload)

module.exports = router
