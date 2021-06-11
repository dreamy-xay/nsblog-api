import {Request, Response} from "express";

const Captcha = require('svg-captcha')
const JWT = require('jsonwebtoken')
const Bcrypt = require('bcryptjs')
const config = require('../../app/config')
const {Admin} = require('../admin/admin.model')

async function admin(req: Request, res: Response) {
    const {account, password, captcha} = req.body
    // @ts-ignore
    if (captcha && req.session.captcha != captcha.toLowerCase())
        return res.status(403).send({message: "captcha error"})

    const admin = await Admin.findOne({where: {account}});

    if (admin) {
        const isValid = await Bcrypt.compare(password, admin.password);

        if (isValid) {
            // @ts-ignore
            req.session._id = admin.admin_id;

            const token = JWT.sign({
                _id: admin.admin_id
            }, config.jwtSecret, {expiresIn: 60 * 60 * 24 * 2});

            return res.send({
                token,
                id: admin.admin_id,
                account: admin.account,
                nickname: admin.nickname,
                email: admin.email,
                avatar: admin.avatar,
                signature: admin.signature,
                profile: admin.profile,
            })
        }
        return res.status(403).send({message: "password error"})
    }
    return res.status(403).send({message: "account error"})
}

function captcha(req: Request, res: Response) {
    const {text, data} = Captcha.create({fontSize: 50, width: 100, height: 40});

    // @ts-ignore
    req.session.captcha = text.toLowerCase();
    // @ts-ignore
    res.set('Content-Type', 'image/svg+xml')
    res.send(String(data))
}

module.exports = {
    admin,
    captcha
};
