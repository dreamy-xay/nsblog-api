const Sequelize = require('sequelize')
const config = require('./config')

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql'
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
}).catch((error: any) => {
    console.error('Unable to connect to the database:', error)
})

module.exports = sequelize
