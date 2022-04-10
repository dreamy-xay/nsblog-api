import { Request, Response } from 'express'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../app/db')
const config = require('../../app/config')

async function login(req: Request, res: Response) {
  const { username, password } = req.body

  const user = await db.query(`SELECT password, is_active FROM user WHERE username = '${username}'`)

  if (user.length !== 0) {

    if (Number(user[0].is_active.toString('hex')) === 0) {
      return res.status(401).send({
        error: 'Account has been disabled'
      })
    }

    const isValid = await bcrypt.compare(password, user[0].password);
    if (isValid) {
      const token = jwt.sign({
        username: username
      }, config.jwtSecret, { expiresIn: 60 * 60 * 24 * 2 });

      return res.status(200).send({
        token: token
      })
    }
  }

  return res.status(401).send({
    error: 'Password or username error'
  })
}

function logout(req: Request, res: Response) {

  return res.status(200).send()
}

async function logoff(req: any, res: Response) {
  const { password } = req.body

  const user = await db.query(`SELECT password, is_active FROM user WHERE username = '${req.username}'`)

  if (Number(user[0].is_active.toString('hex')) === 0) {
    return res.status(401).send({
      error: 'Account has been disabled'
    })
  }

  const isValid = await bcrypt.compare(password, user[0].password)

  if (isValid) {
    await db.query(`UPDATE user SET is_active = 0 WHERE username = '${req.username}'`)

    return res.status(200).send()
  }

  return res.status(403).send({
    error: 'Password error'
  })
}

module.exports = {
  login,
  logout,
  logoff
}
