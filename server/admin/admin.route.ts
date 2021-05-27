const express = require('express');
const adminCtrl = require('./admin.controller');

const router = express.Router();

router.route('/').post(adminCtrl.create);

module.exports = router;
