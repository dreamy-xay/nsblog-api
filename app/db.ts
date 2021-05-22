const db = require('mssql');
const config = require('./config')

async function query(sql: String) {
    const pool = await db.connect(config.db)
    const result = await pool.request().query(sql)
    return result.recordset
}

module.exports = {
    query
};
