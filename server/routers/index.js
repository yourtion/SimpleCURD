/**
 * @file 路由加载文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const fs = require('fs');
const path = require('path');
const { log4js } = require('../global');
const logger = log4js.getLogger();

module.exports = (router, api) => {

  router.get('/', (req, res) => {
    res.success('Hello, API Framework');
  });

  router.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Cookie');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
    res.sendStatus(200);
  });

  api.get('/index')
    .group('Index')
    .title('测试路由')
    .register((req, res) => {
      res.success('Hello, API Framework Index');
    });

  const dirPath = path.resolve(__dirname, './');
  const list = fs.readdirSync(dirPath);
  for (const file of list) {
    if (file !== 'index.js' && file.indexOf('.js') !== -1) {
      logger.debug('Load: %s', file);
      require('./' + file)(api);
    }
  }

};
