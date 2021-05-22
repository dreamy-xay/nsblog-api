import {Request, Response} from "express";

const db = require('../../app/db');

async function test(req: Request, res: Response) {
    const result = await db.query('SELECT * FROM admin')
    res.send({
        message: "success",
        data: result
    })
}

module.exports = {test};
