import {Request, Response} from "express";

const {Admin} = require('./admin.model')

async function create(req: Request, res: Response) {
    const {account, password} = req.query
    const result = await Admin.create({
        account,
        password
    })
    res.send({
        message: "success",
        data: result
    })
}

module.exports = {
    create
};
