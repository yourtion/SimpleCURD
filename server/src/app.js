'use strict';

/**
 * @file app 入口文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */
global.$ = {};
global._ = require('lodash');
const express = require('express-coroutine')(require('express'));
const bodyParser = require('body-parser');
const app = express();
const router = new express.Router();

const { log4js, errors, config } = require('./global');
const { middlewares } = require('./lib');
const logger = log4js.getLogger();

const apiService = require('./api');
const api = apiService.api;

// 静态文件
app.use(express.static('static'));
app.use('/sdk', express.static('sdk'));

// Session
router.use(middlewares.session);
// Log4j express 路由
router.use(log4js.connectLogger(log4js.getLogger('express'), {
  level: 'auto',
  format: '`:method` :url :status ( :content-length byte at :response-time ms )',
}));

app.use('/api', router);

// 路由处理
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function (req, res, next) {
  res.error = (err, code) => {
    res.json({
      success: false,
      error_code: code || err.code || -1,
      message: err.message || err.toString(),
      msg: err.msg || err.message || err.toString(),
    });
  };
  res.success = (data) => {
    res.json({
      success: true,
      result: data || {},
    });
  };
  res.page = (data) => {
    res.success({
      page_data: {
        page: req.$pages.page,
        page_count: req.$pages.limit,
        count: data.count || 0,
      },
      list: data.list || [],
    });
  };
  next();
});

require('./routers')(router, api);
apiService.bindRouter(router);

router.use((err, req, res, next) => {
  if (config.env === 'production' && !err.show) {
    const path = (req.route && req.route.path) || req.url;
    logger.error(path, 'params', req.$params);
    res.error(errors.internalError());
  } else {
    res.error(err);
  }
  next();
});

module.exports = app;
