const dbConfig = {
    user: 'blog',
    password: 'sqlserver',
    server: '127.0.0.1',
    database: 'jxgl',
    port: 1433,
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS',
        encrypt: false
    },
}

module.exports = dbConfig;
