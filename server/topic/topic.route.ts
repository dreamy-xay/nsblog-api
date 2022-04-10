export{}
const express = require('express')
const topicCtrl = require('./topic.controller')
// const {tokenValidate} = require('../helper/tokenValidate')

const router = express.Router()

// Todo: 权限问题
router.route('/')
  .get(topicCtrl.getTopic)

  .post(topicCtrl.createTopic)

router.route('/tags')
  .get(topicCtrl.getTag)

  .post(topicCtrl.createTag)

router.route('/tags/:id')
  .get(topicCtrl.getOneTag)

module.exports = router
