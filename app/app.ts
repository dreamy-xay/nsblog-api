// lib/app.ts
import express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app.route');

// Create a new express application instance
const app: express.Application = express();

app.all('*', function (req, res, next) {
    // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*')
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type')
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
    if (req.method.toLowerCase() === 'options') {
        res.send(200)// 让options尝试请求快速结束
    } else { next() }
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
