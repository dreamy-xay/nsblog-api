export {}
const express = require('express');
const tokenValidate = require('../helper/tokenValidate')
const fileCtrl = require('./file.controller');

const router = express.Router();

router.route('/')
    /**
     * 上传图片
     * @route POST /file
     * @group file - 关于文件处理的操作
     * @consumes multipart/form-data
     * @param {file} img.formData.require - 选择上传的图片
     * @returns {object} 200 - 上传成功，返回图片地址
     * @returns {Error} 403 - error
     */
    .post(tokenValidate, fileCtrl.upload);

module.exports = router;
