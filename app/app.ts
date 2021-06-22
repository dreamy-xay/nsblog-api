import Express = require('express');

const BodyParser = require('body-parser')
const Path = require('path')
const Cors = require('cors')
const Logger = require('morgan')
const ExpressWinston = require('express-winston')
const winstonInstance = require('./winston')
const config = require('./config')
const routes = require('./app.route')

const app: Express.Application = Express();

if (config.env === 'development') {
    app.use(Logger('dev'));
    // ExpressWinston.requestWhitelist.push('body');
    // ExpressWinston.responseWhitelist.push('body');
    // app.use(ExpressWinston.logger({
    //     winstonInstance,
    //     meta: true, // optional: log meta data about request (defaults to true)
    //     msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    //     colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    // }));
}
app.use(Cors({origin: '*', optionsSuccessStatus: 200,}));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));

app.use(Express.static(Path.join(__dirname, '../public')));
const ExpressSwagger = require('express-swagger-generator')(app)
ExpressSwagger({
    swaggerDefinition: {
        info: {
            description: 'This is Beautiful-Blog server',
            title: 'Beautiful-Blog API',
            version: '1.0.1',
            termsOfService: 'http://swagger.io/terms/',
            contact: {
                email: '1559248726@qq.com'
            },
            license: {
                name: 'Apache 2.0',
                url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
            }
        },
        host: `${config.host}:${config.port}`,
        basePath: '/api/private/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        },
        externalDocs: {
            description: 'Find out more about Swagger',
            url: 'http://swagger.io'
        }
    },
    route: {
        url: '/swagger',
        docs: '/swagger.json' //swagger文件 api
    },
    basedir: __dirname, //app absolute path
    files: [
        '../server/**/*.route.ts',
        '../server/**/*.model.ts'
    ] //Path to the API handle folder
})

app.use('/api/private/v1', routes);
app.use((req, res) => {
    return res.status(404).send({message: "API not found"})
});

app.listen(config.port, () => {
    console.log(`  Server started on port ${config.port}.`);
    console.log(`  http://localhost:${config.port}/swagger#/`)
});
