require('dotenv').config();

const dbConfig = {
    server: process.env.SERVER,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS',
        encrypt: false
    }
}

module.exports = dbConfig;
