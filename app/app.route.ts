import {Request, Response} from "express";

const express = require('express');
const userRoutes = require('../server/user/user.route');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/test', (req: Request, res: Response) => res.send({message: 'success'}));

module.exports = router;
