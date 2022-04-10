export{}
const express = require('express')
const favoriteCtrl = require('./favorite.controller')
const {tokenValidate, tokenGetInfo} = require('../helper/tokenValidate')

const router = express.Router()

router.route('/collections')
  .post(tokenValidate, favoriteCtrl.createCollection)

router.route('/collections/:id')
  .delete(tokenValidate, favoriteCtrl.deleteCollection)

router.route('/name')
  .put(tokenValidate, favoriteCtrl.updateName)

router.route('/remark')
  .put(tokenValidate, favoriteCtrl.updateRemark)

router.route('/private')
  .put(tokenValidate, favoriteCtrl.updatePrivate)

router.route('/')
  .get(tokenGetInfo, favoriteCtrl.getFavorites)

  .post(tokenValidate, favoriteCtrl.createFavorite)

router.route('/:id')
  .delete(tokenValidate, favoriteCtrl.deleteFavorite)

module.exports = router
