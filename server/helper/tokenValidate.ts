import {NextFunction, Request, Response} from "express";

const JWT = require('jsonwebtoken')
const BasicAuth = require('basic-auth')
const config = require('../../app/config')

/**
 * validate token
 * @param req
 * @param res
 * @param next
 */
function tokenValidate(req: Request, res: Response, next: NextFunction) {
    JWT.verify(BasicAuth(req).name, config.jwtSecret, (error: Error, data: any) => {
        if (data.admin_id && !error) {
            // @ts-ignore
            req.admin_id = data.admin_id
            return next();
        }
        return res.status(401).send({message: "token error"})
    });
}

module.exports = tokenValidate
