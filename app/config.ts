const Joi = require('joi');

require('dotenv').config();

const envSchema = Joi.object({
    HOST: Joi.string().default('127.0.0.1'),
    PORT: Joi.number().default(3000),
    DB_SERVER: Joi.string().default('127.0.0.1'),
    DB_PORT: Joi.number().default(1433),
    DB_DATABASE: Joi.string().default('BLOG'),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required()
}).unknown().required();
const {error, value: env} = Joi.validate(process.env, envSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    host: env.HOST,
    port: env.PORT,
    db: {
        server: env.DB_SERVER,
        port: env.DB_PORT,
        database: env.DB_DATABASE,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        options: {
            trustedconnection: true,
            enableArithAbort: true,
            instancename: 'SQLEXPRESS',
            encrypt: false
        }
    }
}
