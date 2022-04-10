import { Response } from 'express'

const db = require('../../app/db')
const { nowTime } = require('../helper/date')

async function createCollection(req: any, res: Response) {
  const { type, content_id, favorite_id } = req.body

  let result = await db.query(`SELECT favorite_id FROM favorite WHERE favorite_id = ${favorite_id} AND username = '${req.username}'`)
  if (!result.length) {
    return res.status(404).send({
      error: 'Favorite_id error'
    })
  }

  // Todo: content_id检测
  // if (Number(type) === 0)
  // result = await db.query(`SELECT favorite_id FROM favorite WHERE favorite_id = ${favorite_id} AND username = '${req.username}'`)
  // if (!result.length) {
  //   return res.status(404).send({
  //     error: 'Content_id error'
  //   })
  // }

  result = await db.query(`SELECT collection_id FROM collection WHERE type = ${type} AND content_id = ${content_id}`)
  if (result.length) {
    return res.status(403).send({
      error: 'Duplicate content_id'
    })
  }

  await db.query(`INSERT INTO collection (type, time, content_id) VALUES (${type}, '${nowTime()}', ${content_id})`)

  await db.query('INSERT INTO favorite_collection (favorite_id, collection_id) VALUES (' + favorite_id +
    `, (SELECT collection_id FROM collection WHERE type = ${type} AND content_id = ${content_id}))`)

  return res.status(201).send()
}

async function deleteCollection(req: any, res: Response) {

  let result = await db.query('SELECT favorite_id FROM favorite WHERE favorite_id = (SELECT favorite_id FROM favorite_collection ' +
    `WHERE collection_id = ${req.params.id}) AND username = '${req.username}'`)
  if (!result.length) {
    return res.status(404).send({
      error: 'Collection_id error'
    })
  }

  result = await db.query(`DELETE FROM collection WHERE collection_id = ${req.params.id}`)
  if (!result.affectedRows) {
    return res.status(404).send({
      error: 'Collection_id error'
    })
  }

  await db.query(`DELETE FROM favorite_collection WHERE collection_id = ${req.params.id}`)

  return res.status(200).send()
}

async function updateName(req: any, res: Response) {
  const { name, favorite_id } = req.body

  const result = await db.query(`UPDATE favorite SET name = '${name}' WHERE favorite_id = ${favorite_id} AND username = '${req.username}'`)

  if (!result.affectedRows) {
    return res.status(404).send({
      error: 'Favorite_id error'
    })
  }

  return res.status(201).send()
}

async function updateRemark(req: any, res: Response) {
  const { remark, favorite_id } = req.body

  const result = await db.query(`UPDATE favorite SET remark = '${remark}' WHERE favorite_id = ${favorite_id} AND username = '${req.username}'`)

  if (!result.affectedRows) {
    return res.status(404).send({
      error: 'Favorite_id error'
    })
  }

  return res.status(201).send()
}

async function updatePrivate(req: any, res: Response) {
  const { is_private, favorite_id } = req.body

  const result = await db.query(`UPDATE favorite SET is_private = ${is_private} WHERE favorite_id = ${favorite_id} AND username = '${req.username}'`)

  if (!result.affectedRows) {
    return res.status(404).send({
      error: 'Favorite_id error'
    })
  }

  return res.status(201).send()
}

async function getFavorites(req: any, res: Response) {
  const { username, favorite_id, is_all, type, limit, offset } = req.query

  const result: Array<any> = []

  let typeOption = ''
  if (type !== null && Number(type) !== 0) {
    typeOption = `type = ${type} AND`
  }

  if (favorite_id) {
    const collection = await db.query(`SELECT collection_id as id, type, content_id FROM collection WHERE ${typeOption} collection_id IN ` +
      `(select t.collection_id from (SELECT collection_id FROM favorite_collection WHERE favorite_id = ${favorite_id} LIMIT ${offset}, ${limit}) as t)`)

    for (const i of collection) {
      // Todo: 待办 collection getTitle
      if (type !== null) {

        result.push({
          collection_id: i.id,
          content_id: i.content_id
        })
      } else {
        // if (Number(type) === 0)
        // result = await db.query(`SELECT favorite_id FROM favorite WHERE favorite_id = ${favorite_id} AND username = '${req.username}'`)
        // if (!result.length) {
        //   return res.status(404).send({
        //     error: 'Content_id error'
        //   })
        // }

        result.push({
          collection_id: i.id,
          type: i.type,
          content_id: i.content_id
        })
      }
    }

    return res.status(200).send({
      collections: result
    })
  }

  const user = await db.query(`SELECT username FROM user WHERE username = '${username}'`)
  if (!user.length) {
    return res.status(404).send({
      error: 'Username error'
    })
  }

  let selectOption = 'favorite_id as id, name'

  if (username === req.username) {
    selectOption = selectOption + ', is_private'
  }

  if (Number(is_all) === 1) {
    selectOption = selectOption + ', remark'
  }

  const favorite = await db.query(`SELECT ${selectOption} FROM favorite WHERE username = '${username}' LIMIT ${offset}, ${limit}`)
  for (const i of favorite) {
    const count = await db.query(`SELECT count(*) FROM favorite_collection WHERE favorite_id = ${i.id}`)

    const collection = await db.query(`SELECT collection_id, type, content_id FROM collection WHERE ${typeOption} collection_id IN ` +
      `(select t.collection_id from (SELECT collection_id FROM favorite_collection WHERE favorite_id = ${i.id} LIMIT 10) as t)`)

    // Todo: 待办 collection getTitle
    if (type !== null) {

      // result.push({
      //   id: i.id,
      //   content_id: i.content_id
      // })
    } else {
      // if (Number(type) === 0)
      // result = await db.query(`SELECT favorite_id FROM favorite WHERE favorite_id = ${favorite_id} AND username = '${req.username}'`)
      // if (!result.length) {
      //   return res.status(404).send({
      //     error: 'Content_id error'
      //   })
      // }

      // result.push({
      //   id: i.id,
      //   type: i.type,
      //   content_id: i.content_id
      // })
    }

    const item = {
      favorite_id: i.id,
      name: i.name,
      count: count[0]['count(*)'],
      collections: collection
    }

    if (username === req.username) {
      // @ts-ignore
      item['is_private'] = Number(i.is_private.toString('hex'))
    }

    if (Number(is_all) === 1) {
      // @ts-ignore
      item['remark'] = i.remark
    }

    result.push(item)
  }

  return res.status(200).send({
    favorites: result
  })
}

async function createFavorite(req: any, res: Response) {
  const { name, is_private, remark } = req.body

  await db.query('INSERT INTO favorite (name, time, username, is_private, remark) ' +
    `VALUES ('${name}', '${nowTime()}', '${req.username}', ${is_private}, '${remark}')`)

  return res.status(201).send()
}

async function deleteFavorite(req: any, res: Response) {
  const result = await db.query(`DELETE FROM favorite WHERE favorite_id = ${req.params.id} AND username = '${req.username}'`)

  if (!result.affectedRows) {
    return res.status(404).send({
      error: 'Favorite_id error'
    })
  }

  return res.status(200).send()
}

module.exports = {
  createCollection,
  deleteCollection,
  updateName,
  updateRemark,
  updatePrivate,
  getFavorites,
  createFavorite,
  deleteFavorite
}
