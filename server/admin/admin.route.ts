export {}
const express = require('express');
const tokenValidate = require('../helper/tokenValidate')
const adminCtrl = require('./admin.controller');

const router = express.Router();

router.route('/')
    /**
     * @typedef AdminGetInfo
     * @property {string} id - 管理员ID
     * @property {string} account - 账号
     * @property {string} nickname - 昵称
     * @property {string} email - 邮箱
     * @property {string} avatar - 头像
     * @property {string} signature - 个性签名
     * @property {string} profile - 简介
     */
    /**
     * 获取管理员信息
     * @route GET /admin
     * @group admin - 关于管理员的相关操作
     * @returns {AdminGetInfo.model} 200 - 注册成功
     * @returns {Error} 403 - error
     */
    .get(tokenValidate, adminCtrl.getInfo)
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
     * 管理员注册
     * @route POST /admin
     * @group admin - 关于管理员的相关操作
     * @param {AdminCreate.model} body.body.required
     * @returns {AdminCreateRes.model} 200 - 注册成功
     * @returns {Error} 403 - password error or username duplicate
     */
    .post(adminCtrl.create);

module.exports = router;
