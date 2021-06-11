export {}
const express = require('express');
const adminCtrl = require('./admin.controller');

const router = express.Router();

router.route('/')
    /**
     * @typedef AdminCreate
     * @property {string} account - 用户名 - eg:test
     * @property {string} password - 密码 - eg:test
     * @property {string} confirmPassword - 确认密码 - eg:test
     */
    /**
     * @typedef AdminCreateRes
     * @property {string} admin_id - 管理员ID
     * @property {string} account - 管理员账号
     */
    /**
     * 管理员登录
     * @route POST /admin
     * @group admin - 关于管理员的相关操作
     * @param {AdminCreate.model} body.body.required
     * @returns {AdminCreateRes.model} 200 - 注册成功
     * @returns {Error} 403 - password error or username duplicate
     */
    .post(adminCtrl.create);

module.exports = router;
