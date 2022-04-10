import { Response } from 'express'

const db = require('../../app/db')

async function updateSetting(req: any, res: Response) {
  const result = {}

  for (const i in req.body) {
    const setting = await db.query(`UPDATE setting SET ${i} = ${req.body[i]} WHERE username = '${req.username}'`)

    if (setting.code === 'ER_PARSE_ERROR') {
      // @ts-ignore
      result[i] = false
    } else if (setting.affectedRows) {
      // @ts-ignore
      result[i] = true
    }
  }
  return res.status(201).send(result)
}

async function getHistory(req: any, res: Response) {
  const result = await db.query(`SELECT history_record FROM setting WHERE username = '${req.username}'`)

  return res.status(200).send({
    history_record: Number(result[0].history_record.toString('hex'))
  })
}

async function getMessage(req: any, res: Response) {
  const result = await db.query('SELECT message_prompt, comment_message_prompt, attention_message_prompt, like_message_prompt, chat_message_prompt ' +
    `FROM setting WHERE username = '${req.username}'`)

  return res.status(200).send({
    message_prompt: Number(result[0].message_prompt.toString('hex')),
    comment_message_prompt: Number(result[0].comment_message_prompt.toString('hex')),
    attention_message_prompt: Number(result[0].attention_message_prompt.toString('hex')),
    like_message_prompt: Number(result[0].like_message_prompt.toString('hex')),
    chat_message_prompt: result[0].chat_message_prompt
  })
}

async function getPrivacy(req: any, res: Response) {
  const result = await db.query(`SELECT view_dynamic, view_ask, view_profile FROM setting WHERE username = '${req.username}'`)

  return res.status(200).send({
    view_dynamic: Number(result[0].view_dynamic.toString('hex')),
    view_ask: Number(result[0].view_ask.toString('hex')),
    view_profile: Number(result[0].view_profile.toString('hex'))
  })
}

module.exports = {
  updateSetting,
  getHistory,
  getMessage,
  getPrivacy
}
