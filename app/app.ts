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
app.use(Cors({origin: '*'}));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));

app.use(Express.static(Path.join(__dirname, '../public')));

app.use('/api/private/v1', routes);
app.use((req, res) => {
    return res.status(404).send({message: "API not found"})
});

app.listen(config.port, () => {
    console.log(`  Server started on port ${config.port}.`);
});
