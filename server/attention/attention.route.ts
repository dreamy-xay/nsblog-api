export{}
const express = require('express')
const attentionCtrl = require('./attention.controller')
const {tokenValidate} = require('../helper/tokenValidate')

const router = express.Router()

router.route('/')
  .get(attentionCtrl.getAttention)

  .post(tokenValidate, attentionCtrl.createAttention)

  .delete(tokenValidate, attentionCtrl.deleteAttention)

router.route('/fans')
  .get(attentionCtrl.getFans)

module.exports = router
