import {Request, Response} from "express";

const Bcrypt = require('bcryptjs');
const {Admin} = require('./admin.model');

async function create(req: Request, res: Response) {
    const {account, password, confirmPassword} = req.body;
    if (password !== confirmPassword)
        return res.status(403).send({message: "password error"})

    const findUsername = await Admin.findOne({where: {account}});
    if (findUsername)
        return res.status(403).send({message: "username duplicate"})

    const encryptPassword = await Bcrypt.hash(password, await Bcrypt.genSalt(10))
    const result = await Admin.create({
        account,
        password: encryptPassword,
        nickname: account
    })

    return res.send({
        admin_id: result.admin_id,
        account: result.account
    })
}

module.exports = {
    create
};
