import { Request, Response } from 'express'

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const db = require('../../app/db')
const { nowTime, formatTime } = require('../helper/date')

async function getUserInfo(req: Request, res: Response) {
  const { username, type } = req.query

  let sqlOption
  if (Number(type) === 0) {
    sqlOption = "username, avatar, signature, nickname, gender, city, birthday, profession, address, profile"
  } else if (Number(type) === 1) {
    sqlOption = "username, nickname, avatar, registration_time, email"
  } else {
    sqlOption = "username, nickname, avatar, signature, gender, qq, weibo, email, birthday, profession, address"
  }

  const user = await db.query(`SELECT ${sqlOption} FROM user WHERE username = '${username}'`)

  if (!user.length) {
    return res.status(404).send({ error: 'Username error' })
  }

  if (Number(type) === 0) {
    user[0].gender = Number(user[0].gender.toString('hex'))
    user[0].birthday = formatTime(user[0].birthday)

    const tags: Array<any> = []
    const tag = await db.query(`SELECT topic_tag_name FROM u_tt WHERE username = '${username}'`)

    if (tag.length) {
      tag.forEach((item: any) => {
        tags.push(item.topic_tag_name)
      })
    }

    return res.status(200).send({
      username: user[0].username,
      avatar: user[0].avatar,
      signature: user[0].signature,
      nickname: user[0].nickname,
      gender: user[0].gender,
      city: user[0].city,
      birthday: user[0].birthday,
      profile: user[0].profile,
      profession: user[0].profession,
      address: user[0].address,
      tags,
    })
  } else if (Number(type) === 1) {
    user[0].registration_time = formatTime(user[0].registration_time)

    const like = await db.query(`SELECT count(*) FROM attention WHERE username = '${username}'`)

    const fans = await db.query(`SELECT count(*) FROM attention WHERE attention_username = '${username}'`)

    console.log(fans[0])
    // Todo: 待办
    return res.status(200).send({
      username: user[0].username,
      nickname: user[0].nickname,
      avatar: user[0].avatar,
      registration_time: user[0].registration_time,
      email: user[0].email,
      recommend_count: 12,   //
      like_count: like[0]['count(*)'],
      fans_count: fans[0]['count(*)'],
      dynamic_count: 50     //
    })
  }

  // Todo: 待办 type = 3
  return res.status(200).send()
}

async function createUser(req: Request, res: Response) {
  const { username, email, password, code } = req.body

  let result = await db.query(`SELECT username FROM user WHERE username = '${username}' OR email = '${email}'`)
  if (result.length) {
    return res.status(403).send({
      error: 'Duplicate username or Duplicate email'
    })
  }

  result = await db.query(`SELECT code FROM code WHERE email = '${email}' AND code = '${code}'`)
  if (!result.length) {
    return res.status(403).send({
      error: 'Code error'
    })
  }

  await db.query(`DELETE FROM code WHERE email = '${email}'`)

  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(password, salt)

  await db.query("INSERT INTO " +
    "user (username, nickname, registration_time, birthday, is_super, sponsor, password, is_active, email, avatar) " +
    `VALUES ('${username}', '${username}', '${nowTime()}', '${nowTime()}', 0, '', '${newPassword}', 1, '${email}', ` +
    `'https://img01.sogoucdn.com/app/a/100520146/94e81fe328283fa7252737e132bc22bf')`)

  // 创建 Setting 表
  await db.query("INSERT INTO " +
    "setting (username, article_num, show_author, blog_home_image, tag_category, read_ranking_list, comment_ranking_list, " +
    "message_prompt, comment_message_prompt, attention_message_prompt, like_message_prompt, chat_message_prompt, view_dynamic, " +
    "view_ask, view_profile, history_record) " +
    `VALUES ('${username}', 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)`)

  return res.status(201).send()
}

async function updateUserInfo(req: any, res: Response) {
  if (!Number(req.body.type)) {
    const { nickname, gender, city, birthday, profile } = req.body

    await db.query(`UPDATE user SET nickname = '${nickname}', gender = ${gender}, city = '${city}', birthday = '${birthday}', profile = '${profile}' WHERE username = '${req.username}'`)
  } else {
    const { profession, address } = req.body

    await db.query(`UPDATE user SET profession = '${profession}', address = '${address}' WHERE username = '${req.username}'`)
  }

  return res.status(201).send()
}

async function exist(req: Request, res: Response) {
  const { username, email } = req.query

  const result = {
    username: 'not exist',
    email: 'not exist'
  }

  const usernameResult = await db.query(`SELECT username FROM user WHERE username = '${username}'`)
  if (usernameResult.length) {
    result.username = 'exist'
  }

  const emailResult = await db.query(`SELECT username FROM user WHERE email = '${email}'`)
  if (emailResult.length) {
    result.email = 'exist'
  }

  return res.status(200).send(result)
}

async function createPassword(req: Request, res: Response) {
  const { username, password, data } = req.body

  const result = await db.query(`SELECT password FROM user WHERE username = '${username}'`)
  if (!result.length) {
    return res.status(403).send({
      error: 'Username error'
    })
  }

  if (data !== result[0].password) {
    return res.status(403).send({
      error: 'Data error'
    })
  }

  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(password, salt)

  await db.query(`UPDATE user SET password = '${newPassword}' WHERE username = '${username}'`)

  return res.status(201).send()
}

async function updatePassword(req: any, res: Response) {
  const { oldPassword, newPassword } = req.body

  const user = await db.query(`SELECT password FROM user WHERE username = '${req.username}'`)

  const isValid = await bcrypt.compare(oldPassword, user[0].password)
  console.log(isValid)
  if (isValid) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(newPassword, salt)

    await db.query(`UPDATE user SET password = '${password}' WHERE username = '${req.username}'`)

    return res.status(201).send()
  }

  return res.status(403).send({
    error: 'Old password error'
  })
}

async function updateAvatar(req: any, res: Response) {
  const { avatar } = req.body

  await db.query(`UPDATE user SET avatar = '${avatar}' WHERE username = '${req.username}'`)

  return res.status(201).send()
}

async function updateSignature(req: any, res: Response) {
  const { signature } = req.body

  await db.query(`UPDATE user SET signature = '${signature}' WHERE username = '${req.username}'`)

  return res.status(201).send()
}

async function updateEmail(req: any, res: Response) {
  const { email, code } = req.body

  const result = await db.query(`SELECT code FROM code WHERE email = '${email}' AND code = '${code}'`)
  if (!result.length) {
    return res.status(403).send({
      error: 'Code error'
    })
  }

  await db.query(`UPDATE user SET email = '${email}' WHERE username = '${req.username}'`)

  return res.status(201).send()
}

async function validateEmailCode(req: Request, res: Response) {
  const { email, code } = req.query

  let result = await db.query(`SELECT code FROM code WHERE email = '${email}' AND code = '${code}'`)
  if (!result.length) {
    return res.status(403).send({
      error: 'Code error'
    })
  }

  result = await db.query(`SELECT username, password FROM user WHERE email = '${email}'`)

  await db.query(`DELETE FROM code WHERE email = '${email}'`)

  return res.status(200).send({
    username: result[0].username,
    data: result[0].password
  })
}

async function sendEmailCode(req: Request, res: Response) {
  const { data } = req.body
  const email = data

  const result = await db.query(`SELECT time FROM code WHERE email = '${email}'`)
  if (result.length) {
    const time = new Date(result[0].time)

    console.log((new Date()).getTime() - time.getTime())
    if ((new Date()).getTime() - time.getTime() < 1000 * 60) {
      return res.status(403).send({
        error: 'Email error'
      })
    }
  }

  let emailCode = ''
  for (let i = 0; i < 6; i++) {
    let number = Math.ceil(Math.random() * 10)
    if (number >= 10)
      number = 9
    emailCode += number
  }

  const transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: 'dexteryuu@qq.com',
      pass: 'oilfctqedmnxggcj'
    }
  }))

  transport.sendMail({
    from: 'dexteryuu@qq.com',
    to: email,
    subject: '您在 NS Blog 申请的验证码（系统自动邮件,请勿回复）',
    html: `
          <p>你好！</p>
          <p>您的验证码是：<strong style="color: #ff4e2a;">${emailCode}</strong></p>
          <p>您正在对您的你搜账户进行设置，如非本人操作请忽略</p>
          <p>***该验证码5分钟内有效***</p>`
  }, async (error: any) => {
    if (!error) {
      await db.query(`DELETE FROM code WHERE email = '${email}'`)

      await db.query(`INSERT INTO code (time, email, code) VALUES ('${nowTime()}', '${email}', '${emailCode}')`)

      setTimeout(async () => {
        await db.query(`DELETE FROM code WHERE email = '${email}'`)
      }, 1000 * 60 * 5)
    }
  })

  return res.status(201).send()
}

async function deleteWB(req: any, res: Response) {
  await db.query(`UPDATE user SET weibo = null WHERE username = '${req.username}'`)

  return res.status(200).send()
}

async function deleteQQ(req: any, res: Response) {
  await db.query(`UPDATE user SET qq = null WHERE username = '${req.username}'`)

  return res.status(200).send()
}

async function getTag(req: any, res: Response) {
  const { username } = req.query

  const result: Array<string> = []

  const tag = await db.query(`SELECT topic_tag_name FROM u_tt WHERE username = '${username}'`)

  if (tag.length) {
    tag.forEach((item: any) => {
      result.push(item.topic_tag_name)
    })
  }

  return res.status(200).send({
    tags: result
  })
}

async function createTag(req: any, res: Response) {
  const { tag_name } = req.body

  let result = await db.query(`SELECT topic_tag_name FROM topic_tag WHERE topic_tag_name = '${tag_name}'`)
  if (!result.length) {
    return res.status(404).send({
      error: 'Tag_name error'
    })
  }

  result = await db.query(`INSERT INTO u_tt (topic_tag_name, username) VALUES ('${tag_name}', '${req.username}')`)
  if (result.code === 'ER_DUP_ENTRY') {
    return res.status(403).send({
      error: 'Duplicate tag_name'
    })
  }

  return res.status(201).send()
}

async function deleteTag(req: any, res: Response) {
  const result = await db.query(`DELETE FROM u_tt WHERE topic_tag_name = '${req.params.id}' AND username = '${req.username}'`)

  if (!result.affectedRows) {
    return res.status(404).send({
      error: 'Tag_name error'
    })
  }

  return res.status(200).send()
}

async function getProfile(req: any, res: Response) {
  const result = await db.query(`SELECT profile FROM user WHERE username = '${req.username}'`)

  return res.status(200).send({
    profile: result[0].profile
  })
}

module.exports = {
  getUserInfo,
  createUser,
  updateUserInfo,
  exist,
  createPassword,
  updatePassword,
  updateAvatar,
  updateSignature,
  updateEmail,
  validateEmailCode,
  sendEmailCode,
  deleteWB,
  deleteQQ,
  getTag,
  createTag,
  deleteTag,
  getProfile
}
