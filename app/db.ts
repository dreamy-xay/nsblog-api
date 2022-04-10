const Mysql = require("mysql")
const config = require('./config')

const connection = Mysql.createPool({
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port
})

async function query(sql: string) {
  console.log(sql)
  return new Promise(resolve => {
    connection.query(sql, (err: any, res: any) => {
      // console.log(err)
      // console.log(res)
      if (err)
        resolve(err)
      else
        resolve(res)
    })
  })
}

module.exports = {
  query
}
