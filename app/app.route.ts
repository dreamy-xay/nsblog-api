import {Request, Response} from 'express'
const attentionRoutes = require('../server/attention/attention.route')
const authRoutes = require('../server/auth/auth.route')
const favoriteRoutes = require('../server/favorite/favorite.route')
const imageRoutes = require('../server/image/image.route')
const settingRoutes = require('../server/setting/setting.route')
const topicRoutes = require('../server/topic/topic.route')
const userRoutes = require('../server/user/user.route')

const express = require('express')

const router = express.Router()

router.use('/attentions', attentionRoutes)
router.use('/auth', authRoutes)
router.use('/favorites', favoriteRoutes)
router.use('/images', imageRoutes)
router.use('/setting', settingRoutes)
router.use('/topics', topicRoutes)
router.use('/users', userRoutes)

router.use('/test', (req: Request, res: Response) => {
    res.send({message: 'success'})
})

module.exports = router
