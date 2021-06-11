import Express = require('express');

const BodyParser = require('body-parser')
const Session = require('express-session')
const Cors = require('cors')
const Path = require('path')
const routes = require('./app.route')
const config = require('./config')

const app: Express.Application = Express();

app.use(Cors({origin: '*', optionsSuccessStatus: 200,}));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));

app.use(Session({
    resave: false,
    rolling: true,
    saveUninitialized: true,
    secret: config.sessionSecret,
    name: 'SESSION',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2,
    }
}));

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
        basePath: '/api',
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
