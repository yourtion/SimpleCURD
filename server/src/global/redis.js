'use strict';

/**
 * @file Redis 初始化
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const Redis = require('ioredis');
const log4js = require('./log4js');
const config = require('../../config');
const logger = log4js.getLogger('redis');

Redis.Promise.onPossiblyUnhandledRejection((error) => {
  logger.error(error);
});

const redis = new Redis(config.redis);

redis.on('connect', () => {
  logger.debug('Redis connected');
});

module.exports = redis;
