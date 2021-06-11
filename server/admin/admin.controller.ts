import {Request, Response} from "express";

const Bcrypt = require('bcryptjs');
const {Admin} = require('./admin.model');

async function getInfo(req: Request, res: Response) {
    // @ts-ignore
    const admin = await Admin.findOne({where: {admin_id: req.admin_id}});

    if (admin) {
        return res.send({
            id: admin.admin_id,
            account: admin.account,
            nickname: admin.nickname,
            email: admin.email,
            avatar: admin.avatar,
            signature: admin.signature,
            profile: admin.profile,
        });
    } else {
        return res.status(403).send({message: "error"})
    }
}

async function create(req: Request, res: Response) {
    const {account, password, confirmPassword} = req.body;
    if (password !== confirmPassword)
        return res.status(403).send({message: "password error"})

    const findAdmin = await Admin.findOne({where: {account}});
    if (findAdmin)
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
    getInfo,
    create
};
