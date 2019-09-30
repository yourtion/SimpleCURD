'use strict';

/**
 * @file
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const mysql = require('mysql');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(require('mysql/lib/Connection').prototype);
Bluebird.promisifyAll(require('mysql/lib/Pool').prototype);

const config = require('../../config');
const log4js = require('./log4js');
const logger = log4js.getLogger('mysql');

const pool = mysql.createPool(config.mysql);

pool.getConnectionAsync().then((connection) => {
  logger.debug('MySQL connected');
  return connection.release();
}).catch((err) => {
  if (err.code === 'ETIMEDOUT') {
    logger.error('ETIMEDOUT');
  } else {
    logger.error(err);
  }
});

module.exports = pool;
