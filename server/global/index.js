'use strict';

/**
 * @file global export
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const base = require('./base');

module.exports = Object.assign({}, base, {
  API: require('erest').default,
  helper: require('./helper'),
  TYPES: require('./helper').types,
  co: require('express-coroutine').coroutine,
  coroutine: require('express-coroutine').coroutine,
  squel: require('@blueshit/squel').useFlavour('mysql'),
  log4js: require('./log4js'),
  mysql: require('./mysql'),
  redis: require('./redis'),
  _: require('lodash'),
});
