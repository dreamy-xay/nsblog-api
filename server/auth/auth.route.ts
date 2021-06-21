export{}
const express = require('express');
const authCtrl = require('./auth.controller');

const router = express.Router();

router.route('/admin')
    /**
     * @typedef AdminLogin
     * @property {string} account - 用户名 - eg:test
     * @property {string} password - 密码 - eg:test
     * @property {string} captcha - 验证码（可选项） - eg:test
     */
    /**
     * @typedef AdminLoginRes
     * @property {string} token - 授权token
     * @property {string} id - 管理员ID
     * @property {string} account - 账号
     * @property {string} nickname - 昵称
     * @property {string} email - 邮箱
     * @property {string} avatar - 头像
     * @property {string} signature - 个性签名
     * @property {string} profile - 简介
     */
    /**
     * 管理员登录
     * @route POST /auth/admin
     * @group auth - 关于管理员和用户的授权操作
     * @param {AdminLogin.model} body.body.required
     * @returns {AdminLoginRes.model} 200 - 登陆成功
     * @returns {Error} 403 - password error or username error
     */
    .post(authCtrl.adminLogin);

router.route('/captcha')
    /**
     * 获取验证码图片
     * @route GET /auth/captcha
     * @group auth - 关于管理员和用户的授权操作
     * @returns {object} 200 - 获取验证码图片成功
     */
    .get(authCtrl.captcha);

module.exports = router;
