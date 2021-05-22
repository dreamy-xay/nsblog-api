const express = require('express');
const userCtrl = require('./user.controller');

const router = express.Router();

router.route('/test').get(userCtrl.test);

module.exports = router;
