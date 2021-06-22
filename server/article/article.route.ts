export{}
const express = require('express');
const tokenValidate = require('../helper/tokenValidate')
const articleCtrl = require('./article.controller');

const router = express.Router();

router.route('/')
    /**
     * 创建或修改文章
     * @route POST /article
     * @group article - 关于文章的各种操作
     * @returns {object} 200 - 获取成功
     */
    .post(articleCtrl.articleCreate)

router.route('/tag')
    /**
     * 获取文章标签
     * @route GET /article/tag
     * @group article - 关于文章的各种操作
     * @returns {object} 200 - 获取成功
     */
    .get(articleCtrl.tagGet)

router.route('/category')
    /**
     * 获取文章分类
     * @route GET /article/category
     * @group article - 关于文章的各种操作
     * @returns {object} 200 - 获取成功
     */
    .get(articleCtrl.categoryGet)
    /**
     * @typedef CategoryCreate
     * @property {string} name - 文章类别名称 - eg:Java
     */
    /**
     * 添加文章分类
     * @route POST /article/category
     * @group article - 关于文章的各种操作
     * @param {CategoryCreate.model} body.body.required
     * @returns {object} 200 - 添加成功
     * @returns {Error} 403 - username duplicate
     */
    .post(tokenValidate, articleCtrl.categoryCreate)

module.exports = router;
