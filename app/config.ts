const Joi = require('joi');

require('dotenv').config();

const envSchema = Joi.object({
    HOST: Joi.string().default('127.0.0.1'),
    PORT: Joi.number().default(3000),
    SESSION_SECRET: Joi.string().default('secret_session'),
    JWT_SECRET: Joi.string().default('secret_jwt'),
    DB_SERVER: Joi.string().default('127.0.0.1'),
    DB_PORT: Joi.number().default(3306),
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
    sessionSecret: env.SESSION_SECRET,
    jwtSecret: env.JWT_SECRET,
    db: {
        host: env.DB_SERVER,
        port: env.DB_PORT,
        database: env.DB_DATABASE,
        user: env.DB_USER,
        password: env.DB_PASSWORD
    }
}
