import {Request, Response} from "express";

const express = require('express');
const adminRoutes = require('../server/admin/admin.route');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/test',
    (req: Request, res: Response) => res.send({message: 'success'})
);

module.exports = router;
