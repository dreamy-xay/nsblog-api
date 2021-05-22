import {Request, Response} from "express";

const db = require('mssql')
const {User} = require('./user.model');
const dbConfig = require('../../app/dbConfig');

async function test(req: Request, res: Response) {
    const pool = await db.connect(dbConfig)
    const result = await pool.request()
        .query('SELECT * FROM SC')
    res.send({
        message: "success",
        data: result.recordsets
    })
}

module.exports = {test};
