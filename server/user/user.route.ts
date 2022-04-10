export{}
const express = require('express')
const userCtrl = require('./user.controller')
const {tokenValidate} = require('../helper/tokenValidate')

const router = express.Router()

router.route('/')
  .get(userCtrl.getUserInfo)

  .post(userCtrl.createUser)

  .put(tokenValidate, userCtrl.updateUserInfo)

router.route('/exist')
  .get(userCtrl.exist)

router.route('/password')
  .post(userCtrl.createPassword)

  .put(tokenValidate, userCtrl.updatePassword)

router.route('/avatar')
  .put(tokenValidate, userCtrl.updateAvatar)

router.route('/signature')
  .put(tokenValidate, userCtrl.updateSignature)

router.route('/email')
  .post(tokenValidate, userCtrl.updateEmail)

router.route('/email/validation')
  .get(userCtrl.validateEmailCode)

  .post(userCtrl.sendEmailCode)

router.route('/weibo')
  .delete(tokenValidate, userCtrl.deleteWB)

router.route('/qq')
  .delete(tokenValidate, userCtrl.deleteQQ)

router.route('/tag')
  .get(userCtrl.getTag)

  .post(tokenValidate, userCtrl.createTag)

router.route('/tag/:id')
  .delete(tokenValidate, userCtrl.deleteTag)

router.route('/profile')
  .get(tokenValidate, userCtrl.getProfile)

module.exports = router
