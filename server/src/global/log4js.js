'use strict';

/**
 * @file 日志类
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const log4js = require('log4js');
const config = require('../../config');

const logTypes = [ 'system', 'express', 'mysql', 'redis' ];

const defaultLevel = process.env.NODE_ENV === 'production' ? 'info' : 'all';
const payLevel = process.env.NODE_ENV === 'production' ? 'debug' : 'all';
const debug = config.loggerDebug;
const expressDebug = config.expressDebug;

const fileLogger = {};
const debugLogger = {};
const categories = {
  default: {
    appenders: debug ? [ 'system', 'system-debug' ] : [ 'system' ],
    level: defaultLevel,
  },
};
for (const type of logTypes) {
  fileLogger[type] = {
    type: 'dateFile',
    filename: `${ config.loggerPath || '.' }/logs/${ type }/${ type }.log`,
    pattern: '-yyyy-MM-dd',
  };
  debugLogger[type] = fileLogger[type];
  debugLogger[`${ type }-debug`] = { type: 'console' };
  const appender = debug ? [ `${ type }-debug`, `${ type }` ] : [ type ];
  if (type === 'express' && process.env.NODE_ENV === 'production') {
    categories[type] = { appenders: appender, level: expressDebug ? 'all' : 'error' };
  } else if (type === 'pay') {
    categories[type] = { appenders: appender, level: payLevel };
  } else {
    categories[type] = { appenders: appender, level: defaultLevel };
  }
}

log4js.configure({
  appenders: debug ? debugLogger : fileLogger,
  categories,
  pm2: process.env.NODE_ENV === 'production',
});

module.exports = log4js;
