import {Request, Response} from "express";

const express = require('express');
const authRoutes = require('../server/auth/auth.route');
const adminRoutes = require('../server/admin/admin.route');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

router.use('/test', (req: Request, res: Response) =>
    res.send({message: 'success'})
);

module.exports = router;
