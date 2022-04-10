import { Request, Response } from 'express'

const JWT = require('jsonwebtoken')
const BasicAuth = require('basic-auth')
const config = require('../../app/config')
const db = require('../../app/db')
const {nowTime} = require('../helper/date')

async function getTopic(req: Request, res: Response) {
  const {limit, offset} = req.query

  const result: Array<string> = []

  const topic = await db.query(`SELECT topic_name FROM topic LIMIT ${offset}, ${limit}`)

  if (topic.length) {
    topic.forEach((item: any) => {
      result.push(item.topic_name)
    })
  }

  return res.status(200).send({
    topics: result
  })
}

async function createTopic(req: Request, res: Response) {
  const {topic_name, remark} = req.body

  const result = await db.query(`INSERT INTO topic (topic_name, remark, time) VALUES ('${topic_name}', '${remark}', '${nowTime()}')`)

  if (result.code === 'ER_DUP_ENTRY') {
    return res.status(403).send({
      error: 'Duplicate topic_name'
    })
  }

  return res.status(201).send()
}

async function getTag(req: Request, res: Response) {
  const {topic_name} = req.query

  const result: Array<string> = []

  const tag = await db.query(`SELECT topic_tag_name FROM t_tt WHERE topic_name = '${topic_name}'`)

  if (tag.length) {
    tag.forEach((item: any) => {
      result.push(item.topic_tag_name)
    })
  }

  return res.status(200).send({
    tags: result
  })
}

async function createTag(req: Request, res: Response) {
  const {topic_name, tag_name, remark} = req.body

  let result = await db.query(`SELECT topic_name FROM topic WHERE topic_name = '${topic_name}'`)
  if (!result.length) {
    return res.status(404).send({
      error: 'Topic_name error'
    })
  }

  result = await db.query(`INSERT INTO topic_tag (topic_tag_name, time, remark) VALUES ('${tag_name}', '${nowTime()}', '${remark}')`)
  if (result.code === 'ER_DUP_ENTRY') {
    return res.status(403).send({
      error: 'Duplicate tag_name'
    })
  }

  await db.query(`INSERT INTO t_tt (topic_name, topic_tag_name) VALUES ('${topic_name}', '${tag_name}')`)

  return res.status(201).send()
}

async function getOneTag(req: any, res: Response) {
  const tag = await db.query(`SELECT topic_tag_name, remark, article_count, attention_count FROM topic_tag WHERE topic_tag_name = '${req.params.id}'`)

  if (tag.length) {
    let attention
    JWT.verify(BasicAuth(req).name, config.jwtSecret, (error: Error, data: any) => {
      if (!error && data.username)
        attention = 1
      else
        attention = 0
    })

    return res.status(200).send({
      name: tag[0].topic_tag_name,
      remark: tag[0].remark,
      article_count: tag[0].article_count,
      attention_count: tag[0].attention_count,
      attention
    })
  }

  return res.status(404).send({
    error: 'Tag_name error'
  })
}

module.exports = {
  getTopic,
  createTopic,
  getTag,
  createTag,
  getOneTag
}
