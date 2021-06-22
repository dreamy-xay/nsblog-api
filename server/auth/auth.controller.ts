import {Request, Response} from "express";

const Captcha = require('svg-captcha')
const JWT = require('jsonwebtoken')
const Bcrypt = require('bcryptjs')
const config = require('../../app/config')
const {Admin} = require('../admin/admin.model')

// async function admin(req: Request, res: Response) {
//     const {captcha} = req.body
//
//     if (BasicAuth(req).name) {
//         JWT.verify(BasicAuth(req).name, config.jwtSecret, (error: Error, data: any) => {
//             if (error)
//                 return res.status(403).send({message: error.message})
//             if (data.text === captcha.toLowerCase())
//                 adminLogin(req, res)
//             else
//                 return res.status(403).send({message: "captcha error"})
//         });
//     } else await adminLogin(req, res)
// }

async function adminLogin(req: Request, res: Response) {
    const {account, password} = req.body

    const admin = await Admin.findOne({where: {account}});

    if (admin) {
        const isValid = await Bcrypt.compare(password, admin.password);

        if (isValid) {
            const token = JWT.sign({
                admin_id: admin.admin_id
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

function captcha(req: any, res: Response) {
    const {text, data} = Captcha.create({fontSize: 50, width: 100, height: 40});

    res.cookie("captcha", JWT.sign({text: text.toLowerCase()}, config.jwtSecret, {expiresIn: 60 * 5}))

    res.set('Content-Type', 'image/svg+xml')
    res.send(String(data))
}

module.exports = {
    adminLogin,
    captcha
};
