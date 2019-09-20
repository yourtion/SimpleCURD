'use strict';

/**
 * @file 中间件
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { config, errors, redis, log4js } = require('../global');
const logger = log4js.getLogger();

exports.session = session({
  store: new RedisStore({
    client: redis,
    prefix: config.sessionPrefix,
  }),
  secret: config.sessionSecret,
  resave: false,
  httpOnly: false,
  name: config.cookieName || config.sessionPrefix,
  cookie: {
    maxAge: 3600000 * 12,
  },
  maxAge: config.cookieMaxAge,
  saveUninitialized: false,
});

exports.cros = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , Cookie');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
  next();
};

exports.parsePages = function (req, res, next) {
  const param = req.$params || req.query;
  const page = param.page && Number(param.page) || 1;
  const pageCount = param.page_count && Number(param.page_count) || 30;
  const order = param.order;
  const asc = param.asc;
  const limit = param.limit || pageCount;
  const offset = param.offset || (page - 1) * pageCount;
  req.$pages = { page, limit, offset, order, asc };
  Object.assign(req.$params, req.$pages);
  logger.trace('parsePages: ', req.$pages);
  next();
};

/**
 * 检查管理员权限
 * @param {String} role 权限
 *
 * @returns {Function} 中间件
 */
exports.checkAdminRole = (role) => {
  return (req, res, next) => {
    req.$admin = req.session.user;
    if (!req.$admin) throw errors.loginError();
    if (req.$admin.role === 'super' || role === undefined) return next();
    if (Array.isArray(role) && role.indexOf(req.$admin.role) !== -1) return next();
    if (req.$admin.role === role) return next();
    throw errors.permissionsError();
  };
};
