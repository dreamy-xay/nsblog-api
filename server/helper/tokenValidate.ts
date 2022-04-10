import { NextFunction, Response } from "express"

const JWT = require('jsonwebtoken')
const BasicAuth = require('basic-auth')
const config = require('../../app/config')

function tokenValidate(req: any, res: Response, next: NextFunction) {
  // console.log('token')
  if (!BasicAuth(req))
    return res.status(401).send({error: "Token error"})

  JWT.verify(BasicAuth(req).name, config.jwtSecret, (error: Error, data: any) => {
    if (!error && data.username) {
      req.username = data.username
      return next()
    }

    return res.status(401).send({error: "Token error"})
  })
}

function tokenGetInfo(req: any, res: Response, next: NextFunction) {
  if (!BasicAuth(req))
    return next()

  JWT.verify(BasicAuth(req).name, config.jwtSecret, (error: Error, data: any) => {
    if (!error && data.username) {
      req.username = data.username
    }

    return next()
  })
}

module.exports = {
  tokenValidate,
  tokenGetInfo
}
