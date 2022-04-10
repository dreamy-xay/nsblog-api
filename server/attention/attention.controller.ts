import { Request, Response } from 'express'

const db = require('../../app/db')

async function getAttention(req: Request, res: Response) {
  const {username, limit, offset} = req.query

  let result = await db.query(`SELECT username FROM user WHERE username = '${username}'`)
  if (!result.length) {
    return res.status(404).send({
      error: 'Username error'
    })
  }

  result = await db.query('SELECT username, nickname, avatar, signature FROM user WHERE username IN ' +
    `(SELECT attention_username FROM attention WHERE username = '${username}') LIMIT ${offset}, ${limit}`)

  return res.status(200).send({
    attentions: result
  })
}

async function createAttention(req: any, res: Response) {
  const {username} = req.body

  if (username === req.username) {
    return res.status(404).send({
      error: 'Username error'
    })
  }

  const result = await db.query('INSERT INTO attention (attention_username, username, blacklist) ' +
    `VALUES ((SELECT username FROM user WHERE username = '${username}'), '${req.username}', 0)`)

  if (result.code === 'ER_BAD_NULL_ERROR') {
    return res.status(404).send({
      error: 'Username error'
    })
  } else if (result.code === 'ER_DUP_ENTRY') {
    return res.status(403).send({
      error: 'Duplicate username'
    })
  }

  return res.status(201).send()
}

async function deleteAttention(req: any, res: Response) {
  const {username} = req.body

  const result = await db.query('DELETE FROM attention WHERE username = ' +
    `'${req.username}' AND attention_username IN (SELECT username FROM user WHERE username = '${username}')`)

  if (!result.affectedRows) {
    return res.status(404).send({
      error: 'Username error'
    })
  }

  return res.status(200).send()
}

async function getFans(req: Request, res: Response) {
  const {username, limit, offset} = req.query

  let result = await db.query(`SELECT username FROM user WHERE username = '${username}'`)
  if (!result.length) {
    return res.status(404).send({
      error: 'Username error'
    })
  }

  result = await db.query('SELECT username, nickname, avatar, signature FROM user WHERE username IN ' +
    `(SELECT username FROM attention WHERE attention_username = '${username}') LIMIT ${offset}, ${limit}`)

  return res.status(200).send({
    fans: result
  })
}

module.exports = {
  getAttention,
  createAttention,
  deleteAttention,
  getFans
}
