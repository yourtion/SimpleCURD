'use strict';

/**
 * @file 开发环境 - Dev
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const tmpFile = require('os').tmpdir();

module.exports = {
  loggerDebug: true,
  loggerPath: tmpFile,
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 2,
    keyPrefix: 'scurd:',
    showFriendlyErrorStack: true,
  },
  mysql: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'scurd',
  },
};
